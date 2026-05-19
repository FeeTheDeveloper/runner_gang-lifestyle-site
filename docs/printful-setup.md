# Printful Setup

1. Create a Printful account at `https://www.printful.com`.
2. Connect your store using a Manual Order Platform or direct API workflow.
3. Add products to Printful and configure each variant, including sizes, colors, artwork, and retail pricing.
4. Generate an API token in `Settings -> API`.
5. Copy the token into `PRINTFUL_API_KEY` inside `.env.local`.
6. Product data on the storefront syncs through the `getProducts()` and `getProduct()` server-side API calls.
7. Stripe webhook success events submit orders to Printful automatically for fulfillment and shipping.
8. Printful handles printing, packing, shipping, and tracking email delivery after the order is accepted.
