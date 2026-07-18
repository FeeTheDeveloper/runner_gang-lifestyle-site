import Link from "next/link";
import { LAUNCH_PRODUCTS, type LaunchProduct } from "@/lib/products";
import CollectionsClient from "./CollectionsClient";

export default async function Collections() {
  const products: ReadonlyArray<LaunchProduct> = LAUNCH_PRODUCTS.slice(0, 6);

  return (
    <section id="collections" className="relative">
      <div className="absolute inset-x-0 top-10 h-48 bg-[radial-gradient(circle_at_center,rgba(196,92,26,0.12),transparent_70%)]" />
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">New Drops</span>
            <h2 className="section-heading">The Collection</h2>
            <p className="mt-5 body-copy max-w-xl">
              The Runner Gang Signature tee in four colorways. Pick your color
              - born in the streets, worn across the world.
            </p>
          </div>
          <Link
            href="/products"
            className="luxury-button w-fit border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
          >
            View All Products
          </Link>
        </div>

        <CollectionsClient products={products} />
      </div>
    </section>
  );
}
