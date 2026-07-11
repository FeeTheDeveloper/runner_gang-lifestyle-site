import BrandMark from "@/components/BrandMark";
import { Instagram, Mail } from "lucide-react";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import Link from "next/link";

const footerLinks = [
  { label: "Collections", href: "/products" },
  { label: "RG Supply", href: "/supply" },
  { label: "About", href: "/#about" },
  { label: "Culture", href: "/#culture" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" }
];

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
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 hover:border-gold/40 hover:text-gold"
            aria-label="Email Runner Gang Lifestyle"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-bone/10 bg-smoke/70 hover:border-gold/40 hover:text-gold"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-body text-sm uppercase tracking-[0.24em] text-bone/85 hover:text-gold"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm uppercase tracking-[0.24em] text-bone/85 hover:text-gold"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <p className="mt-8 font-body text-xs uppercase tracking-[0.24em] text-ash">
          &copy; 2026 Runner Gang Lifestyle. All Rights Reserved. Modern Clothing.
        </p>
      </div>
    </footer>
  );
}
