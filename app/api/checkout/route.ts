import { NextResponse } from "next/server";
import { getLaunchProduct } from "@/lib/products";
import {
  getStripeClient,
  getStripeConnectedAccountId,
  getStripeConnectPaymentIntentParams,
  getPublicStripeErrorMessage
} from "@/lib/stripe";
import { ESTIMATED_SHIPPING } from "@/lib/storefront";

export const runtime = "nodejs";

type CheckoutItem = {
  variant_id: string | number;
  productId: string;
  productName?: string;
  color: string;
  size: string;
  sku?: string;
  quantity: number;
  unitPrice?: number;
  image?: string;
  catalogSource?: "launch";
};

type AuthoritativeLineItem = {
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

const MAX_RETAIL_LINE_ITEMS = 40;
const STRIPE_METADATA_VALUE_MAX_LENGTH = 500;

type CheckoutRequestBody = {
  items: CheckoutItem[];
  customerEmail: string;
  shippingAddress?: {
    name: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
};

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    const body = (await request.json()) as CheckoutRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required to create checkout." },
        { status: 400 }
      );
    }

    if (body.items.length > MAX_RETAIL_LINE_ITEMS) {
      return NextResponse.json(
        { error: `Checkout supports up to ${MAX_RETAIL_LINE_ITEMS} line items.` },
        { status: 400 }
      );
    }

    if (!body.customerEmail || !/^\S+@\S+\.\S+$/.test(body.customerEmail)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const lineItems: AuthoritativeLineItem[] = [];

    for (const item of body.items) {
      const product = getLaunchProduct(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${item.productId || "missing product ID"}.` },
          { status: 400 }
        );
      }

      const color = product.colors.find((option) => option.name === item.color);
      if (!color) {
        return NextResponse.json(
          { error: `Invalid color for ${product.name}.` },
          { status: 400 }
        );
      }

      if (!product.sizes.includes(item.size)) {
        return NextResponse.json(
          { error: `Invalid size for ${product.name}.` },
          { status: 400 }
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Quantity for ${product.name} must be a positive integer.` },
          { status: 400 }
        );
      }

      const sku = color.skuBase
        ? `${color.skuBase}-${item.size}`
        : `${product.id}::${color.name}::${item.size}`;

      lineItems.push({
        productId: product.id,
        productName: product.name,
        sku,
        color: color.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        image: color.image || product.thumbnail
      });
    }

    const metadataItems: Record<string, string> = {};
    for (const [index, item] of lineItems.entries()) {
      const serializedItem = JSON.stringify(item);
      if (serializedItem.length > STRIPE_METADATA_VALUE_MAX_LENGTH) {
        return NextResponse.json(
          { error: `Order details for ${item.productName} exceed Stripe metadata limits.` },
          { status: 400 }
        );
      }
      metadataItems[`item_${index}`] = serializedItem;
    }

    const subtotal = lineItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    const amount = Math.round((subtotal + ESTIMATED_SHIPPING) * 100);
    const connectedAccountId = getStripeConnectedAccountId();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true
      },
      receipt_email: body.customerEmail,
      metadata: {
        channel: "launch-store",
        itemCount: String(lineItems.length),
        customerEmail: body.customerEmail,
        connectedAccountId: connectedAccountId ?? "platform",
        ...metadataItems
      },
      ...getStripeConnectPaymentIntentParams(),
      shipping: body.shippingAddress
        ? {
            name: body.shippingAddress.name,
            address: {
              line1: body.shippingAddress.address1,
              city: body.shippingAddress.city,
              state: body.shippingAddress.state,
              postal_code: body.shippingAddress.zip,
              country: body.shippingAddress.country
            }
          }
        : undefined
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error("Stripe checkout creation failed", error);

    return NextResponse.json(
      {
        error: getPublicStripeErrorMessage(
          error,
          "Unable to create checkout for this order."
        )
      },
      { status: 500 }
    );
  }
}
