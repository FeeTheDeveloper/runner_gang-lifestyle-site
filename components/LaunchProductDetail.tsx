"use client";

import { useState } from "react";
import type { LaunchProduct, ProductColor } from "@/lib/products";
import LaunchProductPanel from "./LaunchProductPanel";
import SmartProductImage from "./SmartProductImage";

type LaunchProductDetailProps = {
  product: LaunchProduct;
};

export default function LaunchProductDetail({ product }: LaunchProductDetailProps) {
  const [activeColor, setActiveColor] = useState<ProductColor>(product.colors[0]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
      <div className="relative overflow-hidden border border-bone/10 bg-smoke">
        <div className="relative aspect-[3/4]">
          <SmartProductImage
            src={activeColor.image}
            alt={`${product.name} — ${activeColor.name}`}
            colorName={activeColor.name}
            colorHex={activeColor.hex}
            design={product.design}
            productName={product.name}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          {product.badge ? (
            <span className="absolute left-4 top-4 bg-ember px-3 py-1 font-body text-[11px] uppercase tracking-[0.32em] text-bone">
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <span className="eyebrow">Launch Collection</span>
        <h1 className="font-display text-6xl uppercase leading-[0.92] tracking-[0.12em] text-bone sm:text-7xl">
          {product.name}
        </h1>
        <p className="mt-6 body-copy max-w-2xl">{product.description}</p>
        <div className="mt-8 border border-gold/20 bg-obsidian/60 p-5">
          <p className="font-body text-xs uppercase tracking-[0.24em] text-gold">
            Available Variants
          </p>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.18em] text-bone/80">
            {product.colors.length} colorways · {product.sizes.length} sizes
          </p>
        </div>

        <div className="mt-8">
          <LaunchProductPanel product={product} onColorChange={setActiveColor} />
        </div>
      </div>
    </div>
  );
}
