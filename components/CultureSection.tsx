"use client";

import { motion } from "framer-motion";
import { Crown, Footprints, PenTool } from "lucide-react";

const cultureCards = [
  {
    title: "The Runners",
    description: "Those who move with purpose daily.",
    icon: Footprints
  },
  {
    title: "The Creators",
    description: "Artists, builders, visionaries.",
    icon: PenTool
  },
  {
    title: "The Leaders",
    description: "Those who set the pace for others.",
    icon: Crown
  }
];

export default function CultureSection() {
  return (
    <section id="culture" className="relative overflow-hidden bg-[#090909]">
      <div className="absolute inset-x-0 top-0 h-px bg-ember-strike" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(196,92,26,0.18),transparent_65%)]" />

      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="eyebrow">Community</span>
          <h2 className="section-heading">The Gang</h2>
          <p className="mt-4 font-accent text-2xl italic text-ember sm:text-3xl">
            More than a brand. A lifestyle.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cultureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.12
                }}
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 24px 56px rgba(196, 92, 26, 0.15), 0 0 0 1px rgba(196, 92, 26, 0.45)"
                }}
                className="border border-bone/10 bg-smoke/90 p-8"
              >
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center border border-gold/30 bg-obsidian text-gold">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-[34px] uppercase leading-none tracking-[0.1em] text-bone">
                  {card.title}
                </h3>
                <p className="mt-5 body-copy">{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

