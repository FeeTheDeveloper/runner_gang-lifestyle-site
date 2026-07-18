import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import {
  recordLaunchOrder,
  recordSupplyOrder,
  sendLaunchOrderConfirmationEmail
} from "@/lib/orders";

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
      itemCount: items.length,
      channel: paymentIntent.metadata.channel || "unknown",
      connectedAccountId: paymentIntent.metadata.connectedAccountId || null
    });

    try {
      await recordLaunchOrder(paymentIntent);
    } catch (error) {
      console.error("Failed to store launch order", error);
    }

    try {
      await sendLaunchOrderConfirmationEmail(paymentIntent);
    } catch (error) {
      console.error("Failed to send order email", error);
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Stripe checkout session completed", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
      channel: session.metadata?.channel || "unknown",
      connectedAccountId: session.metadata?.connectedAccountId || null
    });

    try {
      await recordSupplyOrder(session);
    } catch (error) {
      console.error("Failed to store supply order", error);
    }
  }

  return NextResponse.json({ received: true });
}
