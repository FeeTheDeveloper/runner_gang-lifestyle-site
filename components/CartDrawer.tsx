"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/storefront";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    subtotal,
    shippingEstimate,
    totalEstimate,
    closeCart,
    openCheckout,
    removeItem,
    updateQuantity
  } = useCart();
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-obsidian/75 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-xl flex-col border-l border-gold/20 bg-obsidian"
          >
            <div className="flex items-center justify-between border-b border-bone/10 px-6 py-5">
              <div>
                <p className="font-display text-4xl uppercase tracking-[0.16em] text-gold">
                  Cart
                </p>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.28em] text-ash">
                  Your current Runner Gang order
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 text-bone"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center border border-gold/20 bg-smoke text-gold">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="mt-6 font-display text-4xl uppercase tracking-[0.14em] text-bone">
                  Your cart is empty
                </p>
                <p className="mt-3 max-w-sm font-body text-sm uppercase tracking-[0.18em] text-ash">
                  Add a product from the live drops collection to start checkout.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <article
                        key={item.variant_id}
                        className="border border-bone/10 bg-smoke/80 p-4"
                      >
                        <div className="flex gap-4">
                          <div className="relative h-28 w-24 flex-none overflow-hidden bg-obsidian">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                              unoptimized={item.image.startsWith("http")}
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-display text-[28px] uppercase leading-none tracking-[0.08em] text-bone">
                                    {item.name}
                                  </p>
                                  <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ash">
                                    {item.color} / {item.size}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.variant_id)}
                                  className="font-body text-[11px] uppercase tracking-[0.3em] text-ash hover:text-gold"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center border border-bone/10 bg-obsidian">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.variant_id, item.quantity - 1)
                                  }
                                  className="inline-flex h-10 w-10 items-center justify-center text-bone hover:text-gold"
                                  aria-label={`Decrease quantity for ${item.name}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="inline-flex min-w-10 justify-center font-body text-sm text-bone">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.variant_id, item.quantity + 1)
                                  }
                                  className="inline-flex h-10 w-10 items-center justify-center text-bone hover:text-gold"
                                  aria-label={`Increase quantity for ${item.name}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="font-body text-sm uppercase tracking-[0.24em] text-bone">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold/20 bg-smoke/40 px-6 py-6">
                  <div className="space-y-3 font-body text-sm uppercase tracking-[0.24em]">
                    <div className="flex items-center justify-between text-bone/80">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-bone/80">
                      <span>Estimated Shipping</span>
                      <span>{formatCurrency(shippingEstimate)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-bone/10 pt-3 text-bone">
                      <span>Total</span>
                      <span>{formatCurrency(totalEstimate)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openCheckout}
                    className="luxury-button mt-6 w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
