import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

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
