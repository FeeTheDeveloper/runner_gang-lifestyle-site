"use client";

import { useMemo, useState } from "react";
import {
  FREE_SHIPPING_THRESHOLD,
  MIN_ORDER_UNITS,
  PRINT_PRICING,
  SUPPLY_PRODUCTS,
  SUPPLY_SIZES,
  priceSupplyOrder,
  type SupplyOrderLine,
  type SupplyPrintOption,
  type SupplyProduct,
  type SupplySize
} from "@/lib/supply";
import { formatCurrency } from "@/lib/storefront";

type DraftLine = {
  key: string;
  productId: string;
  colorName: string;
  printOption: SupplyPrintOption;
  sizes: Partial<Record<SupplySize, number>>;
};

function makeEmptyLine(product: SupplyProduct): DraftLine {
  return {
    key: `${product.id}-${Math.round(Math.random() * 1e9)}`,
    productId: product.id,
    colorName: product.colors[0]?.name ?? "",
    printOption: "blank",
    sizes: {}
  };
}

export default function SupplyOrderBuilder() {
  const [lines, setLines] = useState<DraftLine[]>(() => [
    makeEmptyLine(SUPPLY_PRODUCTS[0])
  ]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orderLines: SupplyOrderLine[] = useMemo(
    () =>
      lines.map((line) => ({
        productId: line.productId,
        colorName: line.colorName,
        printOption: line.printOption,
        sizes: line.sizes
      })),
    [lines]
  );

  const priced = useMemo(() => priceSupplyOrder(orderLines), [orderLines]);

  const canCheckout =
    priced.errors.length === 0 &&
    priced.totalUnits >= MIN_ORDER_UNITS &&
    /^\S+@\S+\.\S+$/.test(customerEmail);

  function updateLine(key: string, patch: Partial<DraftLine>) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, ...patch } : line))
    );
  }

  function updateSize(key: string, size: SupplySize, value: number) {
    setLines((prev) =>
      prev.map((line) =>
        line.key === key
          ? {
              ...line,
              sizes: {
                ...line.sizes,
                [size]: Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
              }
            }
          : line
      )
    );
  }

  function addLine() {
    setLines((prev) => [...prev, makeEmptyLine(SUPPLY_PRODUCTS[0])]);
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)));
  }

  async function handleCheckout() {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/supply-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: orderLines,
          customerEmail,
          companyName
        })
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setErrorMessage(data.error ?? "Unable to start checkout.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-8">
        {lines.map((line) => {
          const product = SUPPLY_PRODUCTS.find((p) => p.id === line.productId);

          if (!product) {
            return null;
          }

          const lineQty = Object.values(line.sizes).reduce(
            (sum, qty) => sum + (qty ?? 0),
            0
          );

          return (
            <div
              key={line.key}
              className="border border-bone/10 bg-smoke/70 p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Order Line</p>
                  <h3 className="mt-2 font-display text-3xl uppercase leading-none tracking-[0.1em] text-bone">
                    {product.name}
                  </h3>
                  <p className="mt-2 max-w-md body-copy text-sm">
                    {product.description}
                  </p>
                </div>
                {lines.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    className="font-body text-xs uppercase tracking-[0.28em] text-ash hover:text-ember"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <label className="block">
                  <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
                    Product
                  </span>
                  <select
                    value={line.productId}
                    onChange={(event) => {
                      const nextProduct = SUPPLY_PRODUCTS.find(
                        (p) => p.id === event.target.value
                      );
                      updateLine(line.key, {
                        productId: event.target.value,
                        colorName: nextProduct?.colors[0]?.name ?? "",
                        sizes: {}
                      });
                    }}
                    className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone focus:border-gold focus:outline-none"
                  >
                    {SUPPLY_PRODUCTS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
                    Color
                  </span>
                  <select
                    value={line.colorName}
                    onChange={(event) =>
                      updateLine(line.key, { colorName: event.target.value })
                    }
                    className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone focus:border-gold focus:outline-none"
                  >
                    {product.colors.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
                    Print
                  </span>
                  <select
                    value={line.printOption}
                    onChange={(event) =>
                      updateLine(line.key, {
                        printOption: event.target.value as SupplyPrintOption
                      })
                    }
                    className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm uppercase tracking-[0.2em] text-bone focus:border-gold focus:outline-none"
                  >
                    {(Object.keys(PRINT_PRICING) as SupplyPrintOption[]).map(
                      (option) => (
                        <option key={option} value={option}>
                          {PRINT_PRICING[option].label}
                          {PRINT_PRICING[option].perUnit > 0
                            ? ` (+${formatCurrency(PRINT_PRICING[option].perUnit)}/unit)`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <div className="mt-8">
                <p className="font-body text-xs uppercase tracking-[0.28em] text-gold">
                  Size Breakdown
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
                  {SUPPLY_SIZES.map((size) => (
                    <label key={size} className="block">
                      <span className="font-display text-lg tracking-[0.1em] text-bone">
                        {size}
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={line.sizes[size] ?? ""}
                        onChange={(event) =>
                          updateSize(line.key, size, Number(event.target.value))
                        }
                        placeholder="0"
                        className="mt-1 w-full border border-bone/20 bg-obsidian px-2 py-2 text-center font-body text-sm text-bone focus:border-gold focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-3 font-body text-xs uppercase tracking-[0.24em] text-ash">
                  Line units: {lineQty}
                </p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addLine}
          className="luxury-button border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
        >
          + Add another product
        </button>
      </div>

      <div className="border border-gold/20 bg-obsidian/70 p-6 sm:p-8">
        <p className="eyebrow">Order Summary</p>

        {priced.lines.length === 0 ? (
          <p className="mt-4 body-copy text-sm">
            Add sizes to at least one product to see wholesale pricing.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {priced.lines.map((line) => (
              <div
                key={`${line.product.id}-${line.colorName}-${line.printOption}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-display text-2xl uppercase tracking-[0.08em] text-bone">
                    {line.product.name} - {line.colorName}
                  </p>
                  <p className="mt-1 font-body text-xs uppercase tracking-[0.24em] text-ash">
                    {Object.entries(line.sizes)
                      .map(([size, qty]) => `${size}x${qty}`)
                      .join(", ")}{" "}
                    | {PRINT_PRICING[line.printOption].label}
                  </p>
                  <p className="mt-1 font-body text-xs uppercase tracking-[0.24em] text-ash">
                    {line.totalQty} units @ {formatCurrency(line.unitPrice)} +{" "}
                    {formatCurrency(line.printPerUnit)} print
                    {line.upchargeUnits > 0
                      ? ` | 2XL/3XL upcharge on ${line.upchargeUnits}`
                      : ""}
                  </p>
                </div>
                <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                  {formatCurrency(line.lineTotal)}
                </p>
              </div>
            ))}

            <div className="grid gap-2 pt-4 font-body text-sm uppercase tracking-[0.24em] text-bone">
              <div className="flex items-center justify-between">
                <span className="text-gold">Total Units</span>
                <span>{priced.totalUnits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gold">Subtotal</span>
                <span>{formatCurrency(priced.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gold">Shipping</span>
                <span>
                  {priced.shipping === 0 ? "Free" : formatCurrency(priced.shipping)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gold/20 pt-3 text-base">
                <span className="text-gold">Total</span>
                <span>{formatCurrency(priced.total)}</span>
              </div>
            </div>
          </div>
        )}

        {priced.errors.length > 0 ? (
          <p className="mt-4 font-body text-xs uppercase tracking-[0.24em] text-ember">
            {priced.errors.join(" ")}
          </p>
        ) : null}

        {priced.totalUnits > 0 && priced.totalUnits < MIN_ORDER_UNITS ? (
          <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ember">
            Minimum wholesale order is {MIN_ORDER_UNITS} units.
          </p>
        ) : null}

        {priced.totalUnits > 0 && priced.totalUnits < FREE_SHIPPING_THRESHOLD ? (
          <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ash">
            Add {FREE_SHIPPING_THRESHOLD - priced.totalUnits} more units to unlock
            free shipping.
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
            Business Email
          </span>
          <input
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            placeholder="orders@yourbrand.com"
            className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm text-bone focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
            Company Name (optional)
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Runner Gang HQ"
            className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm text-bone focus:border-gold focus:outline-none"
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="font-body text-xs uppercase tracking-[0.24em] text-ember">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!canCheckout || submitting}
        className="luxury-button w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Redirecting to checkout..." : "Continue to secure checkout"}
      </button>
    </div>
  );
}
