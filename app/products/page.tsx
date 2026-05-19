import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmartProductImage from "@/components/SmartProductImage";
import { getProducts } from "@/lib/printful";
import { LAUNCH_PRODUCTS } from "@/lib/products";
import { formatCurrency } from "@/lib/storefront";

export default async function ProductsPage() {
  noStore();

  let printfulProducts = [] as Awaited<ReturnType<typeof getProducts>>;

  try {
    printfulProducts = await getProducts();
  } catch {
    printfulProducts = [];
  }

  const useLaunchFallback = printfulProducts.length === 0;

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow">Launch Storefront</span>
          <h1 className="section-heading">All Products</h1>
          <p className="mt-5 body-copy">
            The launch collection - Coastal and World Tour tees in five colorways
            each. Live Printful products will replace these preview cards
            automatically once the storefront sync is connected.
          </p>
        </div>

        {useLaunchFallback ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LAUNCH_PRODUCTS.map((product) => {
              const hero = product.colors[0];

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden border border-bone/10 bg-smoke p-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-ember"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-obsidian">
                      <SmartProductImage
                        src={hero.image}
                        alt={`${product.name} - ${hero.name}`}
                        colorName={hero.name}
                        colorHex={hero.hex}
                        design={product.design}
                        productName={product.name}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.86)_100%)]" />
                      <div className="absolute inset-0 bg-ember/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="absolute left-3 top-3 bg-ember px-3 py-1 font-body text-[10px] uppercase tracking-[0.32em] text-bone">
                        {product.badge}
                      </span>
                    </div>

                    <div className="pt-5">
                      <h2 className="font-display text-[34px] uppercase leading-none tracking-[0.08em] text-bone">
                        {product.name}
                      </h2>
                      <div className="mt-3 flex items-center gap-2">
                        {product.colors.map((color) => (
                          <span
                            key={color.name}
                            aria-label={color.name}
                            style={{ backgroundColor: color.hex }}
                            className="h-4 w-4 rounded-full border border-bone/30"
                          />
                        ))}
                      </div>
                      <p className="mt-3 font-body text-sm uppercase tracking-[0.28em] text-bone/80">
                        {formatCurrency(product.price)}
                      </p>
                      <span className="luxury-button mt-5 border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold">
                        View Product
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {printfulProducts.map((product) => {
              const startingPrice = product.variants.length
                ? Math.min(...product.variants.map((variant) => variant.price))
                : 0;

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden border border-bone/10 bg-smoke p-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-ember"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-obsidian">
                      <Image
                        src={product.thumbnail_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized={product.thumbnail_url.startsWith("http")}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.86)_100%)]" />
                      <div className="absolute inset-0 bg-ember/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="pt-5">
                      <h2 className="font-display text-[34px] uppercase leading-none tracking-[0.08em] text-bone">
                        {product.name}
                      </h2>
                      <p className="mt-3 font-body text-sm uppercase tracking-[0.28em] text-bone/80">
                        From {formatCurrency(startingPrice)}
                      </p>
                      <span className="luxury-button mt-5 border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold">
                        View Product
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
