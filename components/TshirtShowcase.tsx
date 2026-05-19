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

  const coastal = LAUNCH_PRODUCTS[0];
  const world = LAUNCH_PRODUCTS[1];
  const coastalBlack = coastal.colors.find((c) => c.name === "Black") ?? coastal.colors[0];
  const worldBlack = world.colors.find((c) => c.name === "Black") ?? world.colors[0];

  return (
    <section ref={ref} className="relative bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(196,92,26,0.10),transparent_55%)]" />
      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative hidden h-[640px] md:block">
            <motion.div
              style={{ y: leftY }}
              className="absolute left-0 top-0 w-[58%] overflow-hidden border border-bone/10 bg-smoke shadow-gold"
            >
              <div className="relative aspect-[3/4]">
                <SmartProductImage
                  src={coastalBlack.image}
                  alt="Runner Gang Coastal Tee — Black"
                  colorName={coastalBlack.name}
                  colorHex={coastalBlack.hex}
                  design={coastal.design}
                  productName={coastal.name}
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              style={{ y: rightY }}
              className="absolute right-0 bottom-0 w-[58%] overflow-hidden border border-bone/10 bg-smoke shadow-ember"
            >
              <div className="relative aspect-[3/4]">
                <SmartProductImage
                  src={worldBlack.image}
                  alt="Runner Gang World Tour Tee — Black"
                  colorName={worldBlack.name}
                  colorHex={worldBlack.hex}
                  design={world.design}
                  productName={world.name}
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 md:hidden">
            <div className="relative aspect-[3/4] overflow-hidden border border-bone/10 bg-smoke">
              <SmartProductImage
                src={coastalBlack.image}
                alt="Runner Gang Coastal Tee — Black"
                colorName={coastalBlack.name}
                colorHex={coastalBlack.hex}
                design={coastal.design}
                productName={coastal.name}
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden border border-bone/10 bg-smoke">
              <SmartProductImage
                src={worldBlack.image}
                alt="Runner Gang World Tour Tee — Black"
                colorName={worldBlack.name}
                colorHex={worldBlack.hex}
                design={world.design}
                productName={world.name}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <span className="eyebrow">The Launch Collection</span>
            <h2 className="font-display text-5xl uppercase leading-[0.95] tracking-[0.10em] text-bone sm:text-6xl">
              Two designs. Five colorways. One culture.
            </h2>
            <p className="mt-6 body-copy max-w-xl">
              The Runner Gang launch collection drops in Coastal and World Tour
              editions. Each shirt carries the RGL identity — born in the
              streets, worn across the world.
            </p>

            <div className="mt-8">
              <p className="mb-4 font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                Colorways
              </p>
              <ul className="flex flex-wrap items-end gap-5">
                {coastal.colors.map((color) => (
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
                href="/products"
                className="luxury-button border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
              >
                Shop the Launch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
