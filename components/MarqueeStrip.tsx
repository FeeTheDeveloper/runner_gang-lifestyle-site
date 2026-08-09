"use client";

import { motion } from "framer-motion";

const ticker =
  "RUNNER GANG LIFESTYLE / MODERN CLOTHING / EST. 2025 / URBAN LUXURY / BORN IN THE STREETS / REFINED FOR THE CULTURE / LIMITED DROPS / ";

export default function MarqueeStrip() {
  return (
    <section className="border-y border-gold/50 bg-obsidian py-4">
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max whitespace-nowrap"
        >
          {[0, 1].map((item) => (
            <p
              key={item}
              aria-hidden={item === 1}
              className="pr-10 font-display text-[30px] uppercase leading-none tracking-[0.32em] text-ember sm:text-[34px]"
            >
              {ticker}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
