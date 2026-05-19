"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqItems = [
  {
    question: "What makes Runner Gang Lifestyle different?",
    answer:
      "Runner Gang Lifestyle blends street-level energy with luxury-grade execution. Every drop is built around movement, elevated materials, and a point of view rooted in culture."
  },
  {
    question: "Where do you ship?",
    answer:
      "We currently ship across the United States, with international rollouts planned as the label grows. Shipping regions update with each release window."
  },
  {
    question: "How do I find my size?",
    answer:
      "Each release includes a dedicated size guide with garment-specific measurements. If you like a relaxed fit, size true; if you want a sharper silhouette, compare measurements before checkout."
  },
  {
    question: "Are drops limited?",
    answer:
      "Yes. Collections are intentionally released in limited runs to keep every piece focused, collectible, and tied to a moment in the culture."
  },
  {
    question: "How do I care for my garments?",
    answer:
      "Wash cold, turn garments inside out, and air dry when possible. Premium outerwear and specialty pieces should follow the care label to preserve structure, print, and finish."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-obsidian">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-5xl uppercase leading-none tracking-[0.16em] text-gold sm:text-6xl">
            Need To Know
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 max-w-4xl border border-bone/10 bg-smoke/35">
          {faqItems.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div key={item.question} className="border-b border-smoke last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
                >
                  <span className="font-body text-base uppercase tracking-[0.18em] text-bone sm:text-lg">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-10 w-10 flex-none items-center justify-center border border-gold/30 text-gold"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8">
                        <p className="body-copy max-w-3xl">{item.answer}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

