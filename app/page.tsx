import BrandStatement from "@/components/BrandStatement";
import Collections from "@/components/Collections";
import CultureSection from "@/components/CultureSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LifestyleBanner from "@/components/LifestyleBanner";
import MarqueeStrip from "@/components/MarqueeStrip";
import Navbar from "@/components/Navbar";
import TshirtShowcase from "@/components/TshirtShowcase";

export default function HomePage() {
  return (
    <main className="site-shell">
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Collections />
      <TshirtShowcase />
      <BrandStatement />
      <CultureSection />
      <LifestyleBanner />
      <FAQ />
      <Footer />
    </main>
  );
}

