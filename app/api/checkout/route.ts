import { NextResponse } from "next/server";
import { isCheckoutEligibleItem } from "@/lib/checkout";
import {
  getStripeClient,
  getStripeConnectedAccountId,
  getStripeConnectPaymentIntentParams
} from "@/lib/stripe";
import { ESTIMATED_SHIPPING } from "@/lib/storefront";

export const runtime = "nodejs";

type CheckoutItem = {
  variant_id: string | number;
  quantity: number;
  name: string;
  price: number;
  catalogSource?: "launch";
};

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

    if (body.items.some((item) => !isCheckoutEligibleItem(item))) {
      return NextResponse.json(
        {
          error: "One or more items are missing required checkout details."
        },
        { status: 400 }
      );
    }

    const subtotal = body.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const amount = Math.round((subtotal + ESTIMATED_SHIPPING) * 100);
    const serializedItems = JSON.stringify(body.items);
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
        items: serializedItems,
        customerEmail: body.customerEmail,
        connectedAccountId: connectedAccountId ?? "platform"
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
      { error: "Unable to create checkout for this order." },
      { status: 500 }
    );
  }
}
