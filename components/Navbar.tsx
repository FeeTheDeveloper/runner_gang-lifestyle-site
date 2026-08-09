"use client";

import BrandMark from "@/components/BrandMark";
import { useCart } from "@/context/CartContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/products" },
  { label: "RG Supply", href: "/supply" },
  { label: "Account", href: "/account" },
  { label: "About", href: "/#about" },
  { label: "Culture", href: "/#culture" },
  { label: "Contact", href: "/#contact" }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { itemCount, openCart } = useCart();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useBodyScrollLock(mobileOpen);

  return (
    <>
      <motion.header
        animate={{
          backgroundColor:
            scrolled || mobileOpen ? "rgba(10, 10, 10, 0.94)" : "rgba(10, 10, 10, 0)",
          borderColor:
            scrolled || mobileOpen ? "rgba(212, 168, 83, 0.16)" : "rgba(212, 168, 83, 0)"
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="group flex flex-col">
            <BrandMark
              className="h-auto w-[168px] sm:w-[210px]"
              priority
              sizes="(max-width: 640px) 168px, 210px"
            />
            <span className="mt-1 pl-1 font-body text-[9px] uppercase tracking-[0.58em] text-ash sm:text-[10px]">
              Modern Clothing
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm uppercase tracking-[0.28em] text-bone/80 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 text-bone hover:border-gold/40 hover:text-gold"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 justify-center bg-ember px-1.5 py-0.5 text-[10px] font-body uppercase tracking-[0.12em] text-bone">
                  {itemCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 text-bone md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[60] flex h-full w-[84vw] max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-gold/20 bg-obsidian px-6 py-6 md:hidden"
            >
              <div className="mb-12 flex items-start justify-between gap-4">
                <div className="max-w-[220px]">
                  <BrandMark className="h-auto w-full" sizes="220px" />
                  <p className="mt-2 pl-1 font-body text-[10px] uppercase tracking-[0.5em] text-ash">
                    Modern Clothing / Urban Luxury
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 text-bone"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 28 }}
                    transition={{ delay: 0.05 * index, duration: 0.28 }}
                  >
                    <Link
                      href={link.href}
                      className="block border-b border-bone/10 pb-4 font-display text-4xl uppercase tracking-[0.16em] text-bone"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openCart();
                }}
                className="luxury-button mt-8 w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
              >
                Open Cart
              </button>

              <p className="mt-6 max-w-xs font-accent text-lg italic text-ember">
                Born in the streets. Refined for the culture.
              </p>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
