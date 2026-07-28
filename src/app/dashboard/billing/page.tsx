import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-server";
import { getUserPlanInfo } from "@/lib/subscription";
import { format } from "date-fns";
import BillingPageClient from "./billing-client";

export default async function BillingPage() {
  const session = await requireSession();
  const planInfo = await getUserPlanInfo(session.user.id);

  const renewalDate = planInfo.renewalDate
    ? format(planInfo.renewalDate, "MMMM d, yyyy")
    : null;

  const priceIds = {
    pro: {
      monthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY || null,
      yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || null,
    },
    lifetime: {
      payment: process.env.STRIPE_LIFETIME_PRICE_ID || null,
    },
  };

  return (
    <BillingPageClient
      currentTier={planInfo.tier}
      renewalDate={renewalDate}
      isCanceled={planInfo.isCanceled}
      priceIds={priceIds}
    />
  );
}
