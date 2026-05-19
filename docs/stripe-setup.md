# Stripe Setup

1. Create a Stripe account at `https://dashboard.stripe.com`.
2. Enable Embedded Checkout-style payment collection in Dashboard settings, then use Stripe test keys first.
3. Add your webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`.
4. Subscribe the webhook to `payment_intent.succeeded`.
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` inside `.env.local`.
6. For in-person POS, enable Stripe Terminal in the Dashboard and connect supported Stripe Terminal reader hardware.
7. This storefront uses the same PaymentIntent metadata flow for both web checkout and Stripe-powered in-person payment capture patterns.
8. All transactions are visible in the Stripe Dashboard together with the embedded checkout metadata payload.
9. For testing, use Stripe test keys (`sk_test_...` and `pk_test_...`) and card `4242 4242 4242 4242` with any future expiration date and any CVC.

