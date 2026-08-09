"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { LaunchProduct, ProductColor } from "@/lib/products";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import { formatCurrency } from "@/lib/storefront";

type LaunchProductPanelProps = {
  product: LaunchProduct;
  onColorChange?: (color: ProductColor) => void;
};

const SIZE_GUIDE: Array<{ size: string; range: string }> = [
  { size: "XS", range: "0-2" },
  { size: "S", range: "4-6" },
  { size: "M", range: "8-10" },
  { size: "L", range: "12-14" },
  { size: "XL", range: "16-18" },
  { size: "2XL", range: "20-22" },
  { size: "3XL", range: "24-26" }
];

export default function LaunchProductPanel({
  product,
  onColorChange
}: LaunchProductPanelProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[2] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addItem, openCheckout } = useCart();

  const selectedColor = product.colors[colorIndex];
  const orderSummary = `${product.name} - ${selectedColor.name} / ${selectedSize} x${quantity}`;

  function handleCheckout() {
    const variantId = `${product.id}::${selectedColor.name}::${selectedSize}`;
    const sku = selectedColor.skuBase
      ? `${selectedColor.skuBase}-${selectedSize}`
      : variantId;

    addItem({
      variant_id: variantId,
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      color: selectedColor.name,
      sku,
      unitPrice: product.price,
      quantity,
      image: selectedColor.image || product.thumbnail,
      catalogSource: "launch"
    });

    openCheckout();
  }

  function selectColor(index: number) {
    setColorIndex(index);
    onColorChange?.(product.colors[index]);
  }

  return (
    <div className="border border-bone/10 bg-smoke p-6 sm:p-8">
      <p className="font-body text-xs uppercase tracking-[0.36em] text-gold">
        Launch Inquiry
      </p>
      <p className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.12em] text-bone">
        {formatCurrency(product.price)}
      </p>
      <p className="mt-3 font-body text-sm uppercase tracking-[0.18em] text-ash">
        $39.99 plus shipping. Made to order in limited production batches.
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

      <div className="mt-10 grid gap-3">
        <button
          type="button"
          onClick={handleCheckout}
          className="luxury-button w-full border-ember bg-ember text-center text-bone hover:border-sunset hover:bg-sunset"
        >
          Checkout Securely
        </button>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="luxury-button w-full border-bone/30 bg-transparent text-center text-bone hover:border-gold hover:text-gold"
        >
          Message {INSTAGRAM_HANDLE}
        </a>
      </div>

      <div className="mt-6 border-t border-bone/10 pt-6">
        <button
          type="button"
          onClick={() => setSizeGuideOpen((open) => !open)}
          aria-expanded={sizeGuideOpen}
          className="flex w-full items-center justify-between font-body text-[11px] uppercase tracking-[0.3em] text-bone hover:text-gold"
        >
          <span>Size Guide</span>
          <span aria-hidden>{sizeGuideOpen ? "-" : "+"}</span>
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
        Selected request: {orderSummary}
      </p>
    </div>
  );
}
