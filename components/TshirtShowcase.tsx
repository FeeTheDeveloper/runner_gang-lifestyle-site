"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { LAUNCH_PRODUCTS } from "@/lib/products";
import { formatCurrency } from "@/lib/storefront";
import SmartProductImage from "./SmartProductImage";

export default function TshirtShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-40, 100]);

  const classic = LAUNCH_PRODUCTS[0];

  return (
    <section ref={ref} className="relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(196,92,26,0.10),transparent_55%)]" />
      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="hidden grid-cols-2 gap-6 md:grid">
            {classic.colors.map((color, index) => (
              <motion.div
                key={color.name}
                style={{ y: index % 2 === 0 ? leftY : rightY }}
                className="overflow-hidden border border-bone/10 bg-smoke shadow-gold"
              >
                <div className="relative aspect-[3/4]">
                  <SmartProductImage
                    src={color.image}
                    alt={`${classic.name} — ${color.name}`}
                    colorName={color.name}
                    colorHex={color.hex}
                    design={classic.design}
                    productName={classic.name}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 md:hidden">
            {classic.colors.map((color) => (
              <div
                key={color.name}
                className="relative aspect-[3/4] overflow-hidden border border-bone/10 bg-smoke"
              >
                <SmartProductImage
                  src={color.image}
                  alt={`${classic.name} — ${color.name}`}
                  colorName={color.name}
                  colorHex={color.hex}
                  design={classic.design}
                  productName={classic.name}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div>
            <span className="eyebrow">The Original</span>
            <h2 className="font-display text-5xl uppercase leading-[0.95] tracking-[0.10em] text-bone sm:text-6xl">
              RG Classic T-Shirt
            </h2>
            <p className="mt-6 body-copy max-w-xl">
              The original Runner Gang signature piece. Built around the classic
              Runner Gang script and EST. 2025 mark, the RG Classic represents
              where the lifestyle started—clean, direct and built to move.
            </p>
            <p className="mt-4 body-copy max-w-xl">
              A versatile everyday tee designed to stand on its own or anchor a
              complete Runner Gang fit. Available in S–3XL for {formatCurrency(classic.price)}
              plus shipping. Made to order in limited production batches.
            </p>

            <div className="mt-8">
              <p className="mb-4 font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                Colorways
              </p>
              <ul className="flex flex-wrap items-end gap-5">
                {classic.colors.map((color) => (
                  <li key={color.name} className="flex flex-col items-center gap-2">
                    <span
                      style={{ backgroundColor: color.hex }}
                      className="h-9 w-9 rounded-full border border-bone/30"
                      aria-hidden
                    />
                    <span className="font-body text-[10px] uppercase tracking-[0.28em] text-bone/85">
                      {color.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Link
                href={`/products/${classic.id}`}
                className="luxury-button border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
              >
                Shop RG Classic
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
