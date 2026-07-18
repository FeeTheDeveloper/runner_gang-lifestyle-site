import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeConnectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID?.trim();

export const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-04-22.dahlia"
    })
  : null;

export function getStripeClient() {
  if (!stripeClient) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  return stripeClient;
}

export function getStripeConnectedAccountId() {
  return stripeConnectedAccountId || null;
}

export function getStripeConnectPaymentIntentParams(): Pick<
  Stripe.PaymentIntentCreateParams,
  "on_behalf_of" | "transfer_data"
> {
  if (!stripeConnectedAccountId) {
    return {};
  }

  return {
    on_behalf_of: stripeConnectedAccountId,
    transfer_data: {
      destination: stripeConnectedAccountId
    }
  };
}
