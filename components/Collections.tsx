import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getProducts, type PrintfulProduct } from "@/lib/printful";
import { LAUNCH_PRODUCTS, type LaunchProduct } from "@/lib/products";
import CollectionsClient from "./CollectionsClient";

const FALLBACK_HEX_BY_NAME: Record<string, string> = {
  Black: "#0A0A0A",
  White: "#F0EBE3",
  Navy: "#1B2A4A",
  Red: "#9B1C1C",
  Olive: "#3B4A2F"
};

function normalizePrintfulToLaunch(product: PrintfulProduct): LaunchProduct {
  const colorMap = new Map<string, { name: string; hex: string; image: string }>();

  for (const variant of product.variants) {
    if (!colorMap.has(variant.color)) {
      colorMap.set(variant.color, {
        name: variant.color,
        hex: FALLBACK_HEX_BY_NAME[variant.color] ?? "#1E1E1E",
        image: variant.image || product.thumbnail_url
      });
    }
  }

  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size)));
  const colors = Array.from(colorMap.values());
  const firstPrice = product.variants[0]?.price ?? 45;
  const design = product.name.toLowerCase().includes("world") ? "world" : "coastal";

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "Runner Gang Lifestyle drop.",
    price: firstPrice,
    category: "tee",
    design,
    thumbnail: product.thumbnail_url,
    colors,
    sizes,
    badge: "LIVE NOW",
    featured: true
  };
}

export default async function Collections() {
  noStore();

  let printfulProducts: PrintfulProduct[] = [];

  try {
    printfulProducts = await getProducts();
  } catch {
    printfulProducts = [];
  }

  const products: ReadonlyArray<LaunchProduct> =
    printfulProducts.length > 0
      ? printfulProducts.map(normalizePrintfulToLaunch).slice(0, 6)
      : LAUNCH_PRODUCTS;

  return (
    <section id="collections" className="relative">
      <div className="absolute inset-x-0 top-10 h-48 bg-[radial-gradient(circle_at_center,rgba(196,92,26,0.12),transparent_70%)]" />
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">New Drops</span>
            <h2 className="section-heading">The Collection</h2>
            <p className="mt-5 body-copy max-w-xl">
              Two designs. Five colorways. Pick your tee - born in the streets,
              worn across the world.
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
