"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LaunchProduct } from "@/lib/products";
import { formatCurrency } from "@/lib/storefront";
import SmartProductImage from "./SmartProductImage";

type DesignFilter = "all" | "coastal" | "world";

type CollectionsClientProps = {
  products: ReadonlyArray<LaunchProduct>;
};

const FILTERS: Array<{ label: string; value: DesignFilter }> = [
  { label: "ALL", value: "all" },
  { label: "COASTAL", value: "coastal" },
  { label: "WORLD TOUR", value: "world" }
];

export default function CollectionsClient({ products }: CollectionsClientProps) {
  const [filter, setFilter] = useState<DesignFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") {
      return products;
    }

    return products.filter((product) => product.design === filter);
  }, [filter, products]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <span className="mr-2 font-body text-[11px] uppercase tracking-[0.3em] text-gold">
          Filter
        </span>
        {FILTERS.map((option) => {
          const active = option.value === filter;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={`luxury-button px-5 py-2 text-[11px] tracking-[0.3em] ${
                active
                  ? "border-ember bg-ember text-bone"
                  : "border-bone/30 bg-smoke text-bone hover:border-gold"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function ProductCard({ product }: { product: LaunchProduct }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = product.colors[activeColorIndex];

  return (
    <article className="group relative flex flex-col overflow-hidden border border-bone/10 bg-smoke p-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-ember">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-obsidian"
      >
        <SmartProductImage
          src={activeColor.image}
          alt={`${product.name} - ${activeColor.name}`}
          colorName={activeColor.name}
          colorHex={activeColor.hex}
          design={product.design}
          productName={product.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.85)_100%)]" />
        <div className="absolute inset-0 bg-ember/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {product.badge ? (
          <span className="absolute left-3 top-3 bg-ember px-3 py-1 font-body text-[10px] uppercase tracking-[0.32em] text-bone">
            {product.badge}
          </span>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="luxury-button w-full border-gold/40 bg-obsidian/90 text-bone">
            View Product
          </span>
        </div>
      </Link>

      <div className="pt-5">
        <h3 className="font-display text-[28px] uppercase leading-none tracking-[0.08em] text-bone">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2" role="radiogroup" aria-label="Color">
          {product.colors.map((color, index) => {
            const active = index === activeColorIndex;

            return (
              <button
                key={color.name}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Show ${color.name}`}
                onClick={() => setActiveColorIndex(index)}
                onMouseEnter={() => setActiveColorIndex(index)}
                onFocus={() => setActiveColorIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveColorIndex(index);
                  }
                }}
                style={{ backgroundColor: color.hex }}
                className={`h-5 w-5 rounded-full border transition-all ${
                  active
                    ? "border-gold ring-2 ring-gold ring-offset-2 ring-offset-smoke animate-swatch-pulse"
                    : "border-bone/30 hover:border-bone"
                }`}
              />
            );
          })}
        </div>

        <p className="mt-3 font-body text-sm uppercase tracking-[0.24em] text-bone/80">
          {formatCurrency(product.price)}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="luxury-button mt-4 w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}
