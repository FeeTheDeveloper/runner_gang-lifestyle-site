# Stripe Setup

1. Create a Stripe account at `https://dashboard.stripe.com`.
2. Enable Embedded Checkout-style payment collection in Dashboard settings, then use Stripe test keys first.
3. Add your webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`.
4. Subscribe the webhook to `payment_intent.succeeded` and `checkout.session.completed`.
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` inside `.env.local`.
6. If you use Stripe Connect, add the destination account ID to `STRIPE_CONNECTED_ACCOUNT_ID`.
7. Add `NEXT_PUBLIC_BASE_URL` (or `NEXT_PUBLIC_SITE_URL`) to match your live domain URL.
8. Enable Link in Stripe Dashboard. The checkout modal is wired to display Link automatically when available.
9. To enable Apple Pay/Google Pay buttons in the checkout modal, verify your domain in Stripe (`Settings -> Payment methods -> Wallets`).
10. For in-person POS, enable Stripe Terminal in the Dashboard and connect supported Stripe Terminal reader hardware.
11. All transactions are visible in the Stripe Dashboard together with the checkout metadata payload, and Stripe Connect destination charges are reported to the connected account when `STRIPE_CONNECTED_ACCOUNT_ID` is set.
12. For testing, use Stripe test keys (`sk_test_...` and `pk_test_...`) and card `4242 4242 4242 4242` with any future expiration date and any CVC.

## Customer account + order tracking setup (Supabase + Resend)

1. Add Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Add transactional email environment variable:
   - `RESEND_API_KEY`
3. Ensure your `STRIPE_SECRET_KEY` is a valid single key value (do not concatenate multiple keys in one env var).
4. Create an `orders` table in Supabase:

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null,
  channel text not null,
  customer_email text not null,
  amount_total numeric not null,
  currency text not null default 'usd',
  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text unique,
  line_items jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists orders_customer_email_idx on public.orders (customer_email);
```

5. Keep Stripe webhook endpoint subscribed to:
   - `payment_intent.succeeded`
   - `checkout.session.completed`
6. After webhook delivery, the app will:
   - store paid orders in Supabase (`orders` table)
   - send launch-store confirmation emails through Resend
   - make orders visible at `/account` after customer magic-link login
