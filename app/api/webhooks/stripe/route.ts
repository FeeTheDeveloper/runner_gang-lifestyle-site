import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createOrder } from "@/lib/printful";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

type SerializedItem = {
  variant_id: string | number;
  quantity: number;
  name: string;
  price: number;
};

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration." },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const shipping = paymentIntent.shipping;
    const address = shipping?.address;

    if (!shipping?.name || !address?.line1 || !address.city || !address.postal_code || !address.country) {
      console.error("Stripe payment intent is missing shipping details", paymentIntent.id);

      return NextResponse.json(
        { error: "Shipping details were not available for fulfillment." },
        { status: 400 }
      );
    }

    try {
      const items = JSON.parse(paymentIntent.metadata.items ?? "[]") as SerializedItem[];

      const order = await createOrder({
        recipient: {
          name: shipping.name,
          email: paymentIntent.metadata.customerEmail || undefined,
          address1: address.line1,
          city: address.city,
          state_code: address.state ?? "",
          country_code: address.country,
          zip: address.postal_code
        },
        items: items.map((item) => ({
          variant_id: Number(item.variant_id),
          quantity: item.quantity
        })),
        confirm: true
      });

      console.log("Printful order confirmed", {
        paymentIntentId: paymentIntent.id,
        printfulOrder: order?.result?.id ?? order?.id ?? "submitted"
      });
    } catch (error) {
      console.error("Failed to submit Printful order", error);
      return NextResponse.json(
        { error: "Stripe payment succeeded, but Printful submission failed." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

