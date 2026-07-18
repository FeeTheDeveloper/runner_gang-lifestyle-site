import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

type SerializedItem = {
  variant_id: string | number;
  quantity: number;
  name: string;
  price: number;
  catalogSource?: "launch";
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
    let items: SerializedItem[] = [];

    try {
      items = JSON.parse(paymentIntent.metadata.items ?? "[]") as SerializedItem[];
    } catch {
      items = [];
    }

    console.log("Stripe payment succeeded", {
      paymentIntentId: paymentIntent.id,
      customerEmail: paymentIntent.metadata.customerEmail || null,
      itemCount: items.length
    });
  }

  return NextResponse.json({ received: true });
}
