import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getProducts } from "@/lib/printful";
import { formatCurrency } from "@/lib/storefront";

export default async function Collections() {
  noStore();

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  let unavailableMessage: string | null = null;

  try {
    products = await getProducts();
  } catch (error) {
    unavailableMessage =
      error instanceof Error
        ? error.message
        : "Live Printful products are not available yet.";
  }

  const featuredProducts = products.slice(0, 3);

  return (
    <section id="collections" className="relative">
      <div className="absolute inset-x-0 top-10 h-48 bg-[radial-gradient(circle_at_center,rgba(196,92,26,0.12),transparent_70%)]" />
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">New Drops</span>
            <h2 className="section-heading">The Collection</h2>
            <p className="mt-5 body-copy max-w-xl">
              Live Printful products sync into this storefront and flow straight into
              Stripe checkout and Printful fulfillment.
            </p>
          </div>
          <Link
            href="/products"
            className="luxury-button w-fit border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
          >
            View All Products
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const startingPrice = product.variants.length
                ? Math.min(...product.variants.map((variant) => variant.price))
                : null;

              return (
                <article
                  key={product.id}
                  className="group relative overflow-hidden border border-bone/10 bg-smoke p-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-ember"
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
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.85)_100%)]" />
                      <div className="absolute inset-0 bg-ember/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-x-4 bottom-4">
                        <span className="luxury-button w-full border-gold/40 bg-obsidian/90 text-bone">
                          Shop Now
                        </span>
                      </div>
                    </div>

                    <div className="pt-5">
                      <h3 className="font-display text-[34px] uppercase leading-none tracking-[0.08em] text-bone">
                        {product.name}
                      </h3>
                      <p className="mt-3 font-body text-sm uppercase tracking-[0.28em] text-bone/80">
                        {startingPrice ? `From ${formatCurrency(startingPrice)}` : "See variants"}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-gold/20 bg-smoke/70 p-8 sm:p-10">
            <p className="font-display text-4xl uppercase tracking-[0.12em] text-bone">
              Printful storefront is ready
            </p>
            <p className="mt-4 body-copy max-w-2xl">
              Connect your Printful API key to load live products here. The UI,
              checkout flow, and webhook-based fulfillment pipeline are already in
              place.
            </p>
            {unavailableMessage ? (
              <p className="mt-4 font-body text-xs uppercase tracking-[0.2em] text-ash">
                {unavailableMessage}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

