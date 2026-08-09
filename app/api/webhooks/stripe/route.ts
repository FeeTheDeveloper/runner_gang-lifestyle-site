import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import {
  recordLaunchOrder,
  recordSupplyOrder,
  sendLaunchOrderConfirmationEmail,
  sendSupplyOrderConfirmationEmail
} from "@/lib/orders";

export const runtime = "nodejs";

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

    console.log("Stripe payment succeeded", {
      paymentIntentId: paymentIntent.id,
      customerEmail: paymentIntent.metadata.customerEmail || null,
      itemCount: paymentIntent.metadata.itemCount || "unknown",
      channel: paymentIntent.metadata.channel || "unknown",
      connectedAccountId: paymentIntent.metadata.connectedAccountId || null
    });

    try {
      await recordLaunchOrder(paymentIntent);
    } catch (error) {
      console.error("Critical launch order persistence failure; Stripe should retry", error);
      return NextResponse.json(
        { error: "Unable to persist paid launch order." },
        { status: 500 }
      );
    }

    try {
      await sendLaunchOrderConfirmationEmail(paymentIntent);
    } catch (error) {
      console.error("Launch order persisted, but confirmation email failed", error);
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
      console.error("Critical supply order persistence failure; Stripe should retry", error);
      return NextResponse.json(
        { error: "Unable to persist paid supply order." },
        { status: 500 }
      );
    }

    try {
      await sendSupplyOrderConfirmationEmail(session);
    } catch (error) {
      console.error("Supply order persisted, but confirmation email failed", error);
    }
  }

  return NextResponse.json({ received: true });
}
