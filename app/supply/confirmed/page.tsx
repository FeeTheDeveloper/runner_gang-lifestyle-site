import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { stripeClient } from "@/lib/stripe";
import { formatCurrency } from "@/lib/storefront";

type SupplyConfirmedPageProps = {
  searchParams?: {
    session_id?: string;
  };
};

export default async function SupplyConfirmedPage({
  searchParams
}: SupplyConfirmedPageProps) {
  noStore();

  const sessionId = searchParams?.session_id;
  let totalAmount: number | null = null;
  let totalUnits: string | null = null;
  let companyName: string | null = null;

  if (sessionId && stripeClient) {
    try {
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      totalAmount = (session.amount_total ?? 0) / 100;
      totalUnits = session.metadata?.totalUnits ?? null;
      companyName = session.metadata?.companyName || null;
    } catch (error) {
      console.error("Failed to retrieve supply checkout session", error);
    }
  }

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell flex min-h-[70vh] items-center justify-center pt-32">
        <div className="w-full max-w-3xl border border-gold/20 bg-smoke/70 p-8 text-center shadow-gold sm:p-12">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center border border-ember/30 bg-obsidian text-ember">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-6 font-body text-xs uppercase tracking-[0.36em] text-gold">
            Wholesale Order Received
          </p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-none tracking-[0.14em] text-bone sm:text-7xl">
            Order Confirmed
          </h1>
          <p className="mt-5 body-copy mx-auto max-w-2xl">
            Thank you{companyName ? `, ${companyName}` : ""}. Our supply team will
            reach out within one business day to confirm print artwork, ship
            timing, and any final production details.
          </p>

          {(totalAmount || totalUnits) && (
            <div className="mx-auto mt-10 max-w-2xl border border-bone/10 bg-obsidian/70 p-6 text-left">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                Order Summary
              </p>
              <div className="mt-5 space-y-3">
                {totalUnits ? (
                  <div className="flex items-center justify-between border-b border-bone/10 pb-3">
                    <p className="font-body text-xs uppercase tracking-[0.24em] text-ash">
                      Total Units
                    </p>
                    <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                      {totalUnits}
                    </p>
                  </div>
                ) : null}
                {totalAmount !== null ? (
                  <div className="flex items-center justify-between">
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
                      Total Captured
                    </p>
                    <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/account"
              className="luxury-button border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
            >
              Track in Account
            </Link>
            <Link
              href="/supply"
              className="luxury-button border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
            >
              Build Another Order
            </Link>
            <Link
              href="/"
              className="luxury-button border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
            >
              Back to Runner Gang
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
