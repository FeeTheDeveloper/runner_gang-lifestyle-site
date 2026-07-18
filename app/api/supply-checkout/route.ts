import { NextResponse } from "next/server";
import {
  getStripeClient,
  getStripeConnectedAccountId,
  getStripeConnectPaymentIntentParams
} from "@/lib/stripe";
import {
  PRINT_PRICING,
  priceSupplyOrder,
  type PricedSupplyLine,
  type SupplyOrderLine
} from "@/lib/supply";

export const runtime = "nodejs";
const STRIPE_METADATA_VALUE_MAX_LENGTH = 500;

function serializeOrderLinesForMetadata(lines: PricedSupplyLine[]) {
  const serializedLines = lines.map((line) => ({
    productId: line.product.id,
    color: line.colorName,
    sizes: line.sizes,
    print: line.printOption,
    qty: line.totalQty,
    unit: line.unitPrice
  }));

  while (serializedLines.length > 0) {
    const value = JSON.stringify(serializedLines);

    if (value.length <= STRIPE_METADATA_VALUE_MAX_LENGTH) {
      return value;
    }

    serializedLines.pop();
  }

  return "[]";
}

type SupplyCheckoutBody = {
  lines: SupplyOrderLine[];
  customerEmail: string;
  companyName?: string;
};

function getOrigin(request: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const origin = request.headers.get("origin");
  if (origin) return origin;

  return "https://runnergangls.com";
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    const body = (await request.json()) as SupplyCheckoutBody;

    if (!Array.isArray(body.lines) || body.lines.length === 0) {
      return NextResponse.json(
        { error: "At least one order line is required." },
        { status: 400 }
      );
    }

    if (!body.customerEmail || !/^\S+@\S+\.\S+$/.test(body.customerEmail)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const order = priceSupplyOrder(body.lines);

    if (order.errors.length > 0) {
      return NextResponse.json({ error: order.errors.join(" ") }, { status: 400 });
    }

    if (order.lines.length === 0) {
      return NextResponse.json(
        { error: "No valid order lines submitted." },
        { status: 400 }
      );
    }

    const origin = getOrigin(request);
    const connectedAccountId = getStripeConnectedAccountId();

    const lineItems = order.lines.map((line) => {
      const sizeBreakdown = Object.entries(line.sizes)
        .map(([size, qty]) => `${size}x${qty}`)
        .join(", ");
      const effectiveUnit = line.lineTotal / line.totalQty;

      return {
        quantity: line.totalQty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(effectiveUnit * 100),
          product_data: {
            name: `RG Supply - ${line.product.name} (${line.colorName})`,
            description: `${sizeBreakdown} | ${PRINT_PRICING[line.printOption].label} | $${line.unitPrice.toFixed(2)}/unit tier`
          }
        }
      };
    });

    if (order.shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(order.shipping * 100),
          product_data: {
            name: "Wholesale Shipping",
            description: `${order.totalUnits} units | Free shipping unlocks at 144+ units`
          }
        }
      });
    }

    const metadata = {
      channel: "rg-supply",
      companyName: body.companyName ?? "",
      totalUnits: String(order.totalUnits),
      connectedAccountId: connectedAccountId ?? "platform",
      orderLines: serializeOrderLinesForMetadata(order.lines)
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.customerEmail,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      metadata,
      payment_intent_data: {
        ...getStripeConnectPaymentIntentParams(),
        metadata
      },
      success_url: `${origin}/supply/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/supply`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Supply checkout creation failed", error);

    return NextResponse.json(
      { error: "Unable to create wholesale checkout for this order." },
      { status: 500 }
    );
  }
}
