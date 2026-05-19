"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandStatement() {
  return (
    <section id="about" className="relative">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr,0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border border-bone/10 bg-smoke/40 px-6 py-10 sm:px-8 lg:px-10"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 select-none font-display text-[8rem] uppercase leading-none tracking-[0.16em] text-dusk/20 sm:text-[11rem] lg:text-[16rem]">
              RGL
            </div>
            <div className="relative z-10 max-w-2xl pt-10">
              <span className="eyebrow">Brand Statement</span>
              <p className="font-display text-[40px] uppercase leading-[0.94] tracking-[0.1em] text-bone sm:text-[48px] lg:text-[58px]">
                Runner Gang Lifestyle was built for those who move differently.
                Urban culture. Luxury standards. No compromises.
              </p>
              <p className="mt-8 font-display text-xl uppercase tracking-[0.42em] text-gold sm:text-2xl">
                Movement · Elevation · Authenticity
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative border-l-4 border-ember bg-smoke p-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/brand-portrait.svg"
                alt="Runner Gang Lifestyle editorial portrait placeholder"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mx-auto mt-10 max-w-3xl text-center font-accent text-[28px] italic text-ember sm:text-[34px]"
        >
          &quot;We don&apos;t follow trends. We set the pace.&quot;
        </motion.p>
      </div>
    </section>
  );
}

