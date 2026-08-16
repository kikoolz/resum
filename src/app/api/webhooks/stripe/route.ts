import { NextRequest, NextResponse } from "next/server";
import { getStripe, isLifetimePriceId } from "@/lib/stripe";
import { getDb } from "@/db";
import { userSubscriptions, processedStripeEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { grantReferralReward } from "@/lib/referrals";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

// If a pending row is older than this, treat it as abandoned and allow re-processing
const PENDING_ABANDONMENT_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = await getDb();
  const now = Date.now();

  // --- Claim the event ------------------------------------------------
  // Try to insert a pending row. If it already exists, decide whether to
  // skip or reclaim based on status and age.
  try {
    await db.insert(processedStripeEvents).values({
      eventId: event.id,
      eventType: event.type,
      status: "pending",
      createdAt: now,
    });
  } catch (insertErr: any) {
    const isUniqueViolation =
      insertErr?.code === "SQLITE_CONSTRAINT" ||
      insertErr?.message?.includes("UNIQUE constraint failed") ||
      insertErr?.message?.includes("unique constraint");

    if (!isUniqueViolation) {
      // Transient DB error — let Stripe retry
      console.error(`[Webhook] Failed to claim event ${event.id}:`, insertErr);
      return NextResponse.json(
        { error: "Failed to record event" },
        { status: 500 },
      );
    }

    // Row exists — check its status and age
    const [existing] = await db
      .select()
      .from(processedStripeEvents)
      .where(eq(processedStripeEvents.eventId, event.id))
      .limit(1);

    if (!existing) {
      // Race: row vanished between insert failure and select — treat as duplicate
      console.log(`[Webhook] Skipping event ${event.id} (row vanished)`);
      return NextResponse.json({ received: true });
    }

    if (existing.status === "completed") {
      console.log(`[Webhook] Skipping completed event ${event.id}`);
      return NextResponse.json({ received: true });
    }

    // status = "pending" — another instance is processing or crashed
    const age = now - (existing.createdAt ?? 0);
    if (age < PENDING_ABANDONMENT_MS) {
      console.log(`[Webhook] Skipping in-progress event ${event.id} (${age}ms old)`);
      return NextResponse.json({ received: true });
    }

    // Stale pending row — reclaim it
    console.log(`[Webhook] Reclaiming stale event ${event.id} (${age}ms old)`);
    await db
      .update(processedStripeEvents)
      .set({ createdAt: now })
      .where(eq(processedStripeEvents.eventId, event.id));
  }

  // --- Process the event -----------------------------------------------
  try {
    switch (event.type) {
      // -----------------------------------------------------------------------
      // Checkout completed — subscription or lifetime purchase
      // -----------------------------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) break;

        // Lifetime purchase — one-time payment, no subscription
        if (session.metadata?.type === "lifetime") {
          const lifetimePriceId = session.metadata?.priceId;
          if (!lifetimePriceId) break;

          // Set period end to 100 years from now (lifetime)
          const farFuture = new Date();
          farFuture.setFullYear(farFuture.getFullYear() + 100);

          await db
            .update(userSubscriptions)
            .set({
              stripePriceId: lifetimePriceId,
              stripeCurrentPeriodEnd: farFuture,
              stripeCancelAtPeriodEnd: false,
            })
            .where(eq(userSubscriptions.userId, userId));

          // Grant referral reward for lifetime purchases too
          try {
            await grantReferralReward(userId);
          } catch (err) {
            console.error("[Webhook] Failed to grant referral reward:", err);
          }

          break;
        }

        // Subscription checkout
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;

        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const periodEnd = new Date(subscription.items.data[0].current_period_end * 1000);

        await db
          .update(userSubscriptions)
          .set({
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: periodEnd,
            stripeCancelAtPeriodEnd: false,
          })
          .where(eq(userSubscriptions.userId, userId));

        // Grant referral reward if this user was referred
        try {
          await grantReferralReward(userId);
        } catch (err) {
          console.error("[Webhook] Failed to grant referral reward:", err);
        }

        break;
      }

    // -----------------------------------------------------------------------
    // Subscription updated — renewal, plan change, or cancellation
      // -----------------------------------------------------------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        const periodEnd = new Date(subscription.items.data[0].current_period_end * 1000);

        await db
          .update(userSubscriptions)
          .set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: periodEnd,
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(userSubscriptions.userId, userId));

        break;
      }

      // -----------------------------------------------------------------------
      // Subscription deleted — fully canceled
      // -----------------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await db
          .update(userSubscriptions)
          .set({
            stripeCancelAtPeriodEnd: true,
            stripeCurrentPeriodEnd: new Date(),
          })
          .where(eq(userSubscriptions.userId, userId));

        break;
      }

      // -----------------------------------------------------------------------
      // Invoice paid — successful renewal
      // -----------------------------------------------------------------------
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id;

        if (!subId) break;

        const subscription = await getStripe().subscriptions.retrieve(subId);
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        const periodEnd = new Date(subscription.items.data[0].current_period_end * 1000);

        await db
          .update(userSubscriptions)
          .set({
            stripeCurrentPeriodEnd: periodEnd,
            stripeCancelAtPeriodEnd: false,
          })
          .where(eq(userSubscriptions.userId, userId));

        break;
      }

      // -----------------------------------------------------------------------
      // Invoice payment failed — dunning
      // -----------------------------------------------------------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id;

        if (!subId) break;

        const subscription = await getStripe().subscriptions.retrieve(subId);
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        // Mark as canceled at period end (grace period)
        await db
          .update(userSubscriptions)
          .set({ stripeCancelAtPeriodEnd: true })
          .where(eq(userSubscriptions.userId, userId));

        break;
      }
    }

    // Mark event as completed
    await db
      .update(processedStripeEvents)
      .set({ status: "completed", completedAt: now })
      .where(eq(processedStripeEvents.eventId, event.id));

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error handling ${event.type}:`, error);
    // Leave status as "pending" — a retry can reclaim it after PENDING_ABANDONMENT_MS
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
