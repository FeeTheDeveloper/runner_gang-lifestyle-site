import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SupplyOrderBuilder from "@/components/SupplyOrderBuilder";
import {
  FREE_SHIPPING_THRESHOLD,
  MIN_ORDER_UNITS,
  SUPPLY_PRODUCTS
} from "@/lib/supply";
import { formatCurrency } from "@/lib/storefront";

export const metadata: Metadata = {
  title: "RG Supply - Wholesale Blanks",
  description:
    "RG Supply is the Runner Gang Lifestyle wholesale blanks channel. Build custom orders across tees, long sleeves, crewnecks, and hoodies with tiered wholesale pricing."
};

export default function SupplyPage() {
  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow">RG Supply</span>
          <h1 className="section-heading">Wholesale Blanks Order Builder</h1>
          <p className="mt-5 body-copy">
            Premium blanks and print-ready pieces for shops, teams, and creative
            studios. Tiered wholesale pricing kicks in at {MIN_ORDER_UNITS} units
            and unlocks free shipping at {FREE_SHIPPING_THRESHOLD}+. Build your
            order below and check out through Stripe.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SUPPLY_PRODUCTS.map((product) => {
            const entryTier = product.tiers[0];
            const topTier = product.tiers[product.tiers.length - 1];

            return (
              <article
                key={product.id}
                className="border border-bone/10 bg-smoke/60 p-6"
              >
                <p className="font-body text-xs uppercase tracking-[0.28em] text-gold">
                  {product.category.replace("-", " ")}
                </p>
                <h2 className="mt-3 font-display text-2xl uppercase leading-none tracking-[0.08em] text-bone">
                  {product.name}
                </h2>
                <p className="mt-3 body-copy text-sm">{product.description}</p>
                <p className="mt-4 font-body text-xs uppercase tracking-[0.24em] text-ash">
                  From {formatCurrency(topTier.unit)} to{" "}
                  {formatCurrency(entryTier.unit)} per unit
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16">
          <SupplyOrderBuilder />
        </div>
      </section>
      <Footer />
    </main>
  );
}
