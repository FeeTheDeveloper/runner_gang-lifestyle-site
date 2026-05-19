"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { LaunchProduct, ProductColor } from "@/lib/products";
import { formatCurrency } from "@/lib/storefront";
import SmartProductImage from "./SmartProductImage";

type LaunchProductPanelProps = {
  product: LaunchProduct;
  onColorChange?: (color: ProductColor) => void;
};

const SIZE_GUIDE: Array<{ size: string; range: string }> = [
  { size: "XS", range: "0–2" },
  { size: "S", range: "4–6" },
  { size: "M", range: "8–10" },
  { size: "L", range: "12–14" },
  { size: "XL", range: "16–18" },
  { size: "2XL", range: "20–22" },
  { size: "3XL", range: "24–26" }
];

export default function LaunchProductPanel({
  product,
  onColorChange
}: LaunchProductPanelProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[2] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const selectedColor = product.colors[colorIndex];
  const { addItem, openCart } = useCart();

  function selectColor(index: number) {
    setColorIndex(index);
    onColorChange?.(product.colors[index]);
  }

  function handleAddToCart() {
    addItem({
      variant_id: `${product.id}-${selectedColor.name}-${selectedSize}`,
      product_id: product.id,
      name: `${product.name} — ${selectedColor.name} / ${selectedSize}`,
      size: selectedSize,
      color: selectedColor.name,
      price: product.price,
      quantity,
      image: selectedColor.image
    });
    openCart();
  }

  return (
    <div className="border border-bone/10 bg-smoke p-6 sm:p-8">
      <p className="font-body text-xs uppercase tracking-[0.36em] text-gold">
        Launch Drop
      </p>
      <p className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.12em] text-bone">
        {formatCurrency(product.price)}
      </p>

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <label className="block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
            Color
          </label>
          <span className="font-body text-[11px] uppercase tracking-[0.24em] text-bone">
            {selectedColor.name}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3" role="radiogroup" aria-label="Color">
          {product.colors.map((color, index) => {
            const active = index === colorIndex;
            return (
              <button
                key={color.name}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={color.name}
                onClick={() => selectColor(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectColor(index);
                  }
                }}
                style={{ backgroundColor: color.hex }}
                className={`h-10 w-10 rounded-full border-2 transition-all ${
                  active
                    ? "border-gold ring-2 ring-gold ring-offset-2 ring-offset-smoke animate-swatch-pulse"
                    : "border-bone/30 hover:border-bone"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <label className="mb-3 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
          Size
        </label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {product.sizes.map((size) => {
            const active = size === selectedSize;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`border px-3 py-3 font-body text-xs uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-gold text-ember"
                    : "border-bone/15 bg-obsidian text-bone hover:border-gold/40"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <label className="mb-3 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
          Quantity
        </label>
        <div className="flex w-fit items-center border border-bone/10 bg-obsidian">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="px-4 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone hover:text-gold"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="min-w-12 text-center font-body text-sm text-bone">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="px-4 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone hover:text-gold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="luxury-button mt-10 w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
      >
        Add to Cart
      </button>

      <div className="mt-6 border-t border-bone/10 pt-6">
        <button
          type="button"
          onClick={() => setSizeGuideOpen((open) => !open)}
          aria-expanded={sizeGuideOpen}
          className="flex w-full items-center justify-between font-body text-[11px] uppercase tracking-[0.3em] text-bone hover:text-gold"
        >
          <span>Size Guide</span>
          <span aria-hidden>{sizeGuideOpen ? "−" : "+"}</span>
        </button>
        <AnimatePresence initial={false}>
          {sizeGuideOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <ul className="mt-4 grid grid-cols-2 gap-2 font-body text-xs text-bone/85 sm:grid-cols-3">
                {SIZE_GUIDE.map((entry) => (
                  <li
                    key={entry.size}
                    className="flex items-center justify-between border border-bone/10 bg-obsidian/60 px-3 py-2"
                  >
                    <span className="font-body text-[11px] uppercase tracking-[0.24em] text-gold">
                      {entry.size}
                    </span>
                    <span>{entry.range}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="mt-6 font-body text-xs uppercase tracking-[0.24em] text-ash">
        Free shipping on orders over $75
      </p>

      <span className="sr-only" aria-live="polite">
        Selected {selectedColor.name} {selectedSize}
      </span>

      {/* Hidden image preload for selected color, swaps page hero via callback */}
      <div className="hidden">
        <SmartProductImage
          src={selectedColor.image}
          alt=""
          colorName={selectedColor.name}
          colorHex={selectedColor.hex}
          design={product.design}
          productName={product.name}
        />
      </div>
    </div>
  );
}
