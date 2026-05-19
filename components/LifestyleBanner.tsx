"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LifestyleBanner() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[68vh]">
        <Image
          src="/lifestyle-banner.svg"
          alt="Runner Gang Lifestyle banner placeholder"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.28)_0%,rgba(10,10,10,0.6)_52%,rgba(10,10,10,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,131,58,0.2),transparent_36%)]" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="section-shell relative z-10 flex min-h-[68vh] flex-col items-center justify-center text-center"
        >
          <h2 className="max-w-5xl font-display text-[56px] uppercase leading-[0.9] tracking-[0.12em] text-bone sm:text-[76px] lg:text-[108px]">
            Built For The Streets. Worn By The Culture.
          </h2>
          <a
            href="#contact"
            className="luxury-button mt-10 border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
          >
            Join the Gang
          </a>
        </motion.div>
      </div>
    </section>
  );
}

