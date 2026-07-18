# Vercel Deployment

## Required environment variables

Add these variables in the Vercel project settings for Production, Preview, and Development as needed:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CONNECTED_ACCOUNT_ID` (optional, for Stripe Connect destination reporting)
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SITE_URL` (optional alias used by supply checkout origin fallback)

## Notes

- `NEXT_PUBLIC_BASE_URL` should be the full site URL, for example `https://runnergangls.com`.
- Keep `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_SITE_URL` the same value if both are set.
- `STRIPE_PUBLISHABLE_KEY` is not used by the current app. Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` instead.

## Recommended setup flow

1. Link the repo to the correct Vercel project.
2. Add the environment variables in the Vercel dashboard or with `vercel env add`.
3. Set the production Stripe webhook endpoint to `/api/webhooks/stripe`.
4. Subscribe the webhook to `payment_intent.succeeded` and `checkout.session.completed`.
5. Deploy and verify `/`, `/products`, and at least one product checkout flow.
