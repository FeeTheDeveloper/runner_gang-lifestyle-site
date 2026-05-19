import BrandMark from "@/components/BrandMark";
import { Instagram } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Collections", href: "/products" },
  { label: "About", href: "/#about" },
  { label: "Culture", href: "/#culture" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" }
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M14.5 3c.58 1.67 1.83 2.93 3.5 3.5V9a7.1 7.1 0 0 1-3.5-.9v6.77A5.87 5.87 0 1 1 8.63 9v2.78a3.08 3.08 0 1 0 3.08 3.08V3h2.79Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 4h4.8l4.02 5.37L17.6 4H20l-6.1 7.11L20 20h-4.8l-4.2-5.6L6.2 20H3.8l6.24-7.27L4 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gold/30 bg-obsidian">
      <div className="section-shell py-16 text-center">
        <div className="mx-auto max-w-[520px]">
          <BrandMark className="h-auto w-full" sizes="520px" />
        </div>
        <p className="mt-4 font-accent text-xl italic text-ember sm:text-2xl">
          Modern Clothing. Urban Luxury.
        </p>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm uppercase tracking-[0.28em] text-bone/80 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex items-center justify-center gap-4 text-bone/85">
          <a
            href="#"
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 hover:border-gold/40 hover:text-gold"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 hover:border-gold/40 hover:text-gold"
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          <a
            href="#"
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 hover:border-gold/40 hover:text-gold"
            aria-label="Twitter X"
          >
            <XIcon />
          </a>
        </div>

        <p className="mt-8 font-body text-xs uppercase tracking-[0.24em] text-ash">
          &copy; 2026 Runner Gang Lifestyle. All Rights Reserved. Modern Clothing.
        </p>
      </div>
    </footer>
  );
}

