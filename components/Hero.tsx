"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.18
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function Hero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <Image
          src="/hero-bg.jpg"
          alt="Runner Gang Lifestyle hero artwork"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 blur-[4px]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.42)_44%,rgba(10,10,10,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,131,58,0.16),transparent_32%),linear-gradient(90deg,rgba(10,10,10,0.82)_0%,rgba(10,10,10,0.28)_50%,rgba(10,10,10,0.78)_100%)]" />

      <div className="section-shell relative z-10 flex min-h-screen items-center justify-center pt-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <motion.span
            variants={itemVariants}
            className="mb-5 font-body text-xs uppercase tracking-[0.5em] text-gold sm:text-sm"
          >
            Urban Luxury / Est. 2026
          </motion.span>

          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-[640px] overflow-hidden border border-gold/20 bg-obsidian/40 shadow-gold sm:max-w-[700px]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            <Image
              src="/hero-bg.jpg"
              alt="Runner Gang Lifestyle brand poster"
              width={1075}
              height={1078}
              priority
              sizes="(max-width: 768px) 88vw, 700px"
              className="h-auto w-full object-cover"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-2xl font-accent text-[22px] italic text-ember sm:text-[26px]"
          >
            Born in the streets. Refined for the culture.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/products"
              className="luxury-button border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
            >
              Shop the Collection
            </Link>
            <Link
              href="/#about"
              className="luxury-button border-bone/70 bg-transparent text-bone hover:border-gold hover:text-gold"
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <Link
              href="/#collections"
              className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2 font-display text-sm uppercase tracking-[0.32em] text-bone shadow-ember hover:bg-sunset"
            >
              <span aria-hidden>🔥</span>
              <span>Launch Drop — 10 Colorways Now Live</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

