import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { stripeClient } from "@/lib/stripe";
import { formatCurrency } from "@/lib/storefront";

type OrderConfirmedPageProps = {
  searchParams?: {
    payment_intent?: string;
  };
};

type StoredLineItem = {
  name: string;
  quantity: number;
  price: number;
};

export default async function OrderConfirmedPage({
  searchParams
}: OrderConfirmedPageProps) {
  noStore();

  const paymentIntentId = searchParams?.payment_intent;
  let lineItems: StoredLineItem[] = [];
  let totalAmount: number | null = null;

  if (paymentIntentId && stripeClient) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
      totalAmount = (paymentIntent.amount_received || paymentIntent.amount) / 100;
      lineItems = JSON.parse(paymentIntent.metadata.items ?? "[]") as StoredLineItem[];
    } catch (error) {
      console.error("Failed to retrieve confirmed payment intent", error);
    }
  }

  return (
    <main className="site-shell">
      <ClearCartOnMount />
      <Navbar />
      <section className="section-shell flex min-h-[70vh] items-center justify-center pt-32">
        <div className="w-full max-w-3xl border border-gold/20 bg-smoke/70 p-8 text-center shadow-gold sm:p-12">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center border border-ember/30 bg-obsidian text-ember">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-6 font-body text-xs uppercase tracking-[0.36em] text-gold">
            Payment Received
          </p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-none tracking-[0.14em] text-bone sm:text-7xl">
            Order Confirmed
          </h1>
          <p className="mt-5 body-copy mx-auto max-w-2xl">
            Your Stripe payment has been captured successfully. Our team will
            process your order and send fulfillment updates to the email used at
            checkout.
          </p>

          {lineItems.length > 0 ? (
            <div className="mx-auto mt-10 max-w-2xl border border-bone/10 bg-obsidian/70 p-6 text-left">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                Order Summary
              </p>
              <div className="mt-5 space-y-3">
                {lineItems.map((item) => (
                  <div
                    key={`${item.name}-${item.quantity}`}
                    className="flex items-center justify-between gap-4 border-b border-bone/10 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-display text-3xl uppercase leading-none tracking-[0.08em] text-bone">
                        {item.name}
                      </p>
                      <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ash">
                        Quantity {item.quantity}
                      </p>
                    </div>
                    <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              {totalAmount ? (
                <div className="mt-6 flex items-center justify-between border-t border-gold/20 pt-4">
                  <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                    Total Captured
                  </p>
                  <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <Link
            href="/products"
            className="luxury-button mt-10 border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
