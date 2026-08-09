import type Stripe from "stripe";
import { getResendClient } from "@/lib/resend";
import { getSupabaseServiceClient } from "@/lib/supabase-server";
import { isResendConfigured, isSupabaseServerConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase-types";

export type StoredLineItem = {
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

type StoredOrderRecord = Database["public"]["Tables"]["orders"]["Row"];

function normalizeLineItem(item: Record<string, unknown>): StoredLineItem | null {
  const productName =
    typeof item.productName === "string"
      ? item.productName
      : typeof item.name === "string"
        ? item.name
        : "Item";
  const unitPrice =
    typeof item.unitPrice === "number"
      ? item.unitPrice
      : typeof item.price === "number"
        ? item.price
        : 0;
  const quantity = typeof item.quantity === "number" ? item.quantity : 0;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return null;
  }

  return {
    productId: typeof item.productId === "string" ? item.productId : "",
    productName,
    sku: typeof item.sku === "string" ? item.sku : "",
    color: typeof item.color === "string" ? item.color : "",
    size: typeof item.size === "string" ? item.size : "",
    quantity,
    unitPrice,
    image: typeof item.image === "string" ? item.image : ""
  };
}

export function parseRetailLineItems(metadata: Stripe.Metadata): StoredLineItem[] {
  const itemCount = Number.parseInt(metadata.itemCount ?? "", 10);

  if (Number.isInteger(itemCount) && itemCount >= 0) {
    const items: StoredLineItem[] = [];

    for (let index = 0; index < itemCount; index += 1) {
      const serializedItem = metadata[`item_${index}`];
      if (!serializedItem) continue;

      try {
        const item = normalizeLineItem(JSON.parse(serializedItem) as Record<string, unknown>);
        if (item) items.push(item);
      } catch {
        continue;
      }
    }

    return items;
  }

  const legacyItemsJson = metadata.items;
  if (!legacyItemsJson) return [];

  try {
    const parsed = JSON.parse(legacyItemsJson) as Array<Record<string, unknown>>;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeLineItem).filter((item): item is StoredLineItem => item !== null);
  } catch {
    return [];
  }
}

export async function recordLaunchOrder(paymentIntent: Stripe.PaymentIntent) {
  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase is not configured for order persistence.");
  }

  const customerEmail = paymentIntent.metadata.customerEmail ?? paymentIntent.receipt_email ?? "";

  if (!customerEmail) {
    throw new Error("Cannot persist launch order without a customer email.");
  }

  const supabase = getSupabaseServiceClient();
  const orderPayload: Database["public"]["Tables"]["orders"]["Insert"] = {
      stripe_payment_intent_id: paymentIntent.id,
      status: "paid",
      channel: paymentIntent.metadata.channel ?? "launch-store",
      customer_email: customerEmail,
      amount_total: (paymentIntent.amount_received || paymentIntent.amount) / 100,
      currency: paymentIntent.currency,
      line_items: parseRetailLineItems(paymentIntent.metadata),
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
    throw new Error("Supabase is not configured for order persistence.");
  }

  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

  if (!customerEmail) {
    throw new Error("Cannot persist supply order without a customer email.");
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
    .map(
      (item) =>
        `<li>${item.productName} — ${item.color} / ${item.size} (${item.sku}) x${item.quantity}</li>`
    )
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
  const lineItems = parseRetailLineItems(paymentIntent.metadata);
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

export async function sendSupplyOrderConfirmationEmail(session: Stripe.Checkout.Session) {
  if (!isResendConfigured()) {
    return;
  }

  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

  if (!customerEmail) {
    return;
  }

  const resend = getResendClient();
  const amount = (session.amount_total ?? 0) / 100;
  const totalUnits = session.metadata?.totalUnits ?? "n/a";
  const companyName = session.metadata?.companyName ?? "";

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: customerEmail,
    subject: "Runner Gang supply order confirmation",
    html: `
      <h2>Your wholesale order is confirmed.</h2>
      <p>Thanks${companyName ? `, ${companyName}` : ""}. We received your payment.</p>
      <p><strong>Total:</strong> $${amount.toFixed(2)}</p>
      <p><strong>Units:</strong> ${totalUnits}</p>
      <p>You can log in to your customer account to track your order status.</p>
    `
  });

  if (error) {
    throw new Error(`Failed to send supply order confirmation email: ${error.message}`);
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
