import { NextRequest, NextResponse } from "next/server";
import { getStripe, isLifetimePriceId } from "@/lib/stripe";
import { getDb } from "@/db";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { grantReferralReward } from "@/lib/referrals";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

// Event dedup: in-memory Set to skip Stripe webhook retries (resets on cold start, acceptable)
const processedEventIds = new Set<string>();
const MAX_EVENT_CACHE = 1000;

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

  // Dedup: skip already-processed events (Stripe retries on timeout)
  if (processedEventIds.has(event.id)) {
    console.log(`[Webhook] Skipping duplicate event ${event.id}`);
    return NextResponse.json({ received: true });
  }
  processedEventIds.add(event.id);
  // Evict oldest entries if cache is too large
  if (processedEventIds.size > MAX_EVENT_CACHE) {
    const first = processedEventIds.values().next().value!;
    processedEventIds.delete(first);
  }

  const db = await getDb();

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error handling ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
