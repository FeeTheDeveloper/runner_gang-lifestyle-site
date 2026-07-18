# Stripe Setup

1. Create a Stripe account at `https://dashboard.stripe.com`.
2. Enable Embedded Checkout-style payment collection in Dashboard settings, then use Stripe test keys first.
3. Add your webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`.
4. Subscribe the webhook to `payment_intent.succeeded`.
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` inside `.env.local`.
6. Add `NEXT_PUBLIC_BASE_URL` (or `NEXT_PUBLIC_SITE_URL`) to match your live domain URL.
7. Enable Link in Stripe Dashboard. The checkout modal is wired to display Link automatically when available.
8. To enable Apple Pay/Google Pay buttons in the checkout modal, verify your domain in Stripe (`Settings -> Payment methods -> Wallets`).
9. For in-person POS, enable Stripe Terminal in the Dashboard and connect supported Stripe Terminal reader hardware.
10. All transactions are visible in the Stripe Dashboard together with the checkout metadata payload.
11. For testing, use Stripe test keys (`sk_test_...` and `pk_test_...`) and card `4242 4242 4242 4242` with any future expiration date and any CVC.
