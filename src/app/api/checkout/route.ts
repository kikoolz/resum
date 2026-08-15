import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES, ALL_PRICE_IDS, isLifetimePriceId } from "@/lib/stripe";
import { getSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { priceId?: string };
    const { priceId } = body;

    if (!priceId || !ALL_PRICE_IDS.includes(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const db = await getDb();

    // Check if user already has a Stripe customer ID
    const existingSub = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, session.user.id),
    });

    let customerId = existingSub?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      // Create subscription record
      await db.insert(userSubscriptions).values({
        userId: session.user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: "",
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(),
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (isLifetimePriceId(priceId)) {
      // One-time payment for lifetime access
      const checkoutSession = await getStripe().checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/billing`,
        metadata: {
          userId: session.user.id,
          type: "lifetime",
          priceId: priceId,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Subscription checkout (pro monthly or yearly)
    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/billing`,
      metadata: { userId: session.user.id },
      subscription_data: {
        metadata: { userId: session.user.id },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[Checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
