import type Stripe from "stripe";
import { getResendClient } from "@/lib/resend";
import { getSupabaseServiceClient } from "@/lib/supabase-server";
import { isResendConfigured, isSupabaseServerConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase-types";

type StoredLineItem = {
  name: string;
  quantity: number;
  price: number;
};

type StoredOrderRecord = Database["public"]["Tables"]["orders"]["Row"];

function parseMetadataItems(itemsJson: string | undefined): StoredLineItem[] {
  if (!itemsJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(itemsJson) as Array<{
      name?: unknown;
      quantity?: unknown;
      price?: unknown;
    }>;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        name: typeof item.name === "string" ? item.name : "Item",
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
        price: typeof item.price === "number" ? item.price : 0
      }))
      .filter((item) => item.quantity > 0);
  } catch {
    return [];
  }
}

export async function recordLaunchOrder(paymentIntent: Stripe.PaymentIntent) {
  if (!isSupabaseServerConfigured()) {
    return;
  }

  const customerEmail = paymentIntent.metadata.customerEmail ?? paymentIntent.receipt_email ?? "";

  if (!customerEmail) {
    return;
  }

  const supabase = getSupabaseServiceClient();
  const orderPayload: Database["public"]["Tables"]["orders"]["Insert"] = {
      stripe_payment_intent_id: paymentIntent.id,
      status: "paid",
      channel: paymentIntent.metadata.channel ?? "launch-store",
      customer_email: customerEmail,
      amount_total: (paymentIntent.amount_received || paymentIntent.amount) / 100,
      currency: paymentIntent.currency,
      line_items: parseMetadataItems(paymentIntent.metadata.items),
      metadata: paymentIntent.metadata
    };
  const { error } = await supabase
    .from("orders")
    .upsert(orderPayload, { onConflict: "stripe_payment_intent_id" });

  if (error) {
    throw new Error(`Failed to store launch order in Supabase: ${error.message}`);
  }
}

export async function recordSupplyOrder(session: Stripe.Checkout.Session) {
  if (!isSupabaseServerConfigured()) {
    return;
  }

  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

  if (!customerEmail) {
    return;
  }

  const supabase = getSupabaseServiceClient();
  const orderPayload: Database["public"]["Tables"]["orders"]["Insert"] = {
      stripe_checkout_session_id: session.id,
      status: "paid",
      channel: session.metadata?.channel ?? "rg-supply",
      customer_email: customerEmail,
      amount_total: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "usd",
      line_items: [],
      metadata: session.metadata ?? {}
    };
  const { error } = await supabase
    .from("orders")
    .upsert(orderPayload, { onConflict: "stripe_checkout_session_id" });

  if (error) {
    throw new Error(`Failed to store supply order in Supabase: ${error.message}`);
  }
}

function buildLineItemsHtml(items: StoredLineItem[]) {
  if (items.length === 0) {
    return "<li>Your order was recorded successfully.</li>";
  }

  return items
    .map((item) => `<li>${item.name} x${item.quantity}</li>`)
    .join("");
}

export async function sendLaunchOrderConfirmationEmail(paymentIntent: Stripe.PaymentIntent) {
  if (!isResendConfigured()) {
    return;
  }

  const customerEmail = paymentIntent.metadata.customerEmail ?? paymentIntent.receipt_email ?? "";

  if (!customerEmail) {
    return;
  }

  const resend = getResendClient();
  const lineItems = parseMetadataItems(paymentIntent.metadata.items);
  const amount = (paymentIntent.amount_received || paymentIntent.amount) / 100;

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: customerEmail,
    subject: "Runner Gang order confirmation",
    html: `
      <h2>Thanks for your order.</h2>
      <p>Your payment was received successfully.</p>
      <p><strong>Total:</strong> $${amount.toFixed(2)}</p>
      <ul>${buildLineItemsHtml(lineItems)}</ul>
      <p>You can log in to your customer account to track your order status.</p>
    `
  });

  if (error) {
    throw new Error(`Failed to send order confirmation email: ${error.message}`);
  }
}

export async function listOrdersForCustomerEmail(customerEmail: string): Promise<StoredOrderRecord[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, channel, customer_email, amount_total, currency, stripe_payment_intent_id, stripe_checkout_session_id, line_items, metadata"
    )
    .eq("customer_email", customerEmail)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load customer orders: ${error.message}`);
  }

  return data ?? [];
}
