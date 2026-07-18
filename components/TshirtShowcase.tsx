"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { LAUNCH_PRODUCTS } from "@/lib/products";
import SmartProductImage from "./SmartProductImage";

export default function TshirtShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-40, 100]);

  const signature = LAUNCH_PRODUCTS[0];

  return (
    <section ref={ref} className="relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(196,92,26,0.10),transparent_55%)]" />
      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="hidden grid-cols-2 gap-6 md:grid">
            {signature.colors.map((color, index) => (
              <motion.div
                key={color.name}
                style={{ y: index % 2 === 0 ? leftY : rightY }}
                className="overflow-hidden border border-bone/10 bg-smoke shadow-gold"
              >
                <div className="relative aspect-[3/4]">
                  <SmartProductImage
                    src={color.image}
                    alt={`${signature.name} — ${color.name}`}
                    colorName={color.name}
                    colorHex={color.hex}
                    design={signature.design}
                    productName={signature.name}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 md:hidden">
            {signature.colors.map((color) => (
              <div
                key={color.name}
                className="relative aspect-[3/4] overflow-hidden border border-bone/10 bg-smoke"
              >
                <SmartProductImage
                  src={color.image}
                  alt={`${signature.name} — ${color.name}`}
                  colorName={color.name}
                  colorHex={color.hex}
                  design={signature.design}
                  productName={signature.name}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div>
            <span className="eyebrow">The Signature Tee</span>
            <h2 className="font-display text-5xl uppercase leading-[0.95] tracking-[0.10em] text-bone sm:text-6xl">
              One tee. Four colorways. One culture.
            </h2>
            <p className="mt-6 body-copy max-w-xl">
              The Runner Gang Signature t-shirt carries the classic script logo
              in four print colorways. Available in S, M, L, and XL for $24.99
              plus shipping and handling.
            </p>

            <div className="mt-8">
              <p className="mb-4 font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                Colorways
              </p>
              <ul className="flex flex-wrap items-end gap-5">
                {signature.colors.map((color) => (
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
                href={`/products/${signature.id}`}
                className="luxury-button border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
              >
                Shop the Signature Tee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
