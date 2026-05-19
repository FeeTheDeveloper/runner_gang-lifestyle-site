import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getProducts } from "@/lib/printful";
import { formatCurrency } from "@/lib/storefront";

export default async function ProductsPage() {
  noStore();

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  let unavailableMessage: string | null = null;

  try {
    products = await getProducts();
  } catch (error) {
    unavailableMessage =
      error instanceof Error
        ? error.message
        : "Printful products could not be loaded right now.";
  }

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow">Live Storefront</span>
          <h1 className="section-heading">All Products</h1>
          <p className="mt-5 body-copy">
            Every product on this page is synced from Printful and routed through
            Stripe for checkout before auto-submitting to Printful for fulfillment.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
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
        ) : (
          <div className="mt-14 border border-gold/20 bg-smoke/70 p-8 sm:p-10">
            <p className="font-display text-4xl uppercase tracking-[0.12em] text-bone">
              Products will appear here after Printful is connected
            </p>
            <p className="mt-4 body-copy max-w-2xl">
              The storefront pages, cart system, Stripe checkout, and Printful
              fulfillment webhook are all in place. Add your live API credentials to
              start syncing products.
            </p>
            {unavailableMessage ? (
              <p className="mt-4 font-body text-xs uppercase tracking-[0.2em] text-ash">
                {unavailableMessage}
              </p>
            ) : null}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

