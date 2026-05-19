"use client";

import { useEffect, useState } from "react";
import type { PrintfulProduct } from "@/lib/printful";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/storefront";

type ProductPurchasePanelProps = {
  product: PrintfulProduct;
};

export default function ProductPurchasePanel({
  product
}: ProductPurchasePanelProps) {
  const variants = product.variants;
  const firstVariant = variants[0];
  const showSizeSelector = new Set(variants.map((variant) => variant.size)).size > 1;
  const showColorSelector = new Set(variants.map((variant) => variant.color)).size > 1;
  const [selectedSize, setSelectedSize] = useState(firstVariant?.size ?? "One Size");
  const [selectedColor, setSelectedColor] = useState(firstVariant?.color ?? "Core");
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCheckout } = useCart();

  const sizeOptions = Array.from(new Set(variants.map((variant) => variant.size)));
  const colorOptions = Array.from(
    new Set(
      variants
        .filter((variant) => !showSizeSelector || variant.size === selectedSize)
        .map((variant) => variant.color)
    )
  );

  useEffect(() => {
    if (colorOptions.length > 0 && !colorOptions.includes(selectedColor)) {
      setSelectedColor(colorOptions[0]);
    }
  }, [colorOptions, selectedColor]);

  const selectedVariant =
    variants.find(
      (variant) =>
        (!showSizeSelector || variant.size === selectedSize) &&
        (!showColorSelector || variant.color === selectedColor)
    ) ?? firstVariant;

  function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    addItem({
      variant_id: selectedVariant.id,
      product_id: product.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image || product.thumbnail_url,
      catalogSource: "printful"
    });

    openCheckout();
  }

  return (
    <div className="border border-bone/10 bg-smoke p-6 sm:p-8">
      <p className="font-body text-xs uppercase tracking-[0.36em] text-gold">
        Product Options
      </p>
      <p className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.12em] text-bone">
        {selectedVariant ? formatCurrency(selectedVariant.price) : "Unavailable"}
      </p>

      {showSizeSelector ? (
        <div className="mt-8">
          <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
            Size
          </label>
          <select
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            className="luxury-input"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showColorSelector ? (
        <div className="mt-8">
          <label className="mb-3 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`border px-4 py-2 font-body text-xs uppercase tracking-[0.24em] ${
                  color === selectedColor
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-bone/10 bg-obsidian text-bone hover:border-gold/40"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <label className="mb-3 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
          Quantity
        </label>
        <div className="flex w-fit items-center border border-bone/10 bg-obsidian">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="px-4 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone hover:text-gold"
          >
            -
          </button>
          <span className="min-w-12 text-center font-body text-sm text-bone">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="px-4 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone hover:text-gold"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="luxury-button mt-10 w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
      >
        Add to Cart
      </button>

      <p className="mt-4 font-body text-xs uppercase tracking-[0.18em] text-ash">
        Adding this item opens secure checkout so payment and fulfillment can start
        immediately.
      </p>
    </div>
  );
}
