import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import { getProduct } from "@/lib/printful";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);

    return {
      title: product.name,
      description: product.description
    };
  } catch {
    return {
      title: "Product",
      description: "Runner Gang Lifestyle product details."
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  noStore();

  let product: Awaited<ReturnType<typeof getProduct>> | null = null;
  let unavailableMessage: string | null = null;

  try {
    product = await getProduct(params.id);
  } catch (error) {
    unavailableMessage =
      error instanceof Error ? error.message : "This product is not available.";
  }

  if (!product && !unavailableMessage) {
    notFound();
  }

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        {product ? (
          <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
            <div className="relative overflow-hidden border border-bone/10 bg-smoke">
              <div className="relative aspect-[4/5]">
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized={product.thumbnail_url.startsWith("http")}
                />
              </div>
            </div>

            <div>
              <span className="eyebrow">Printful Product</span>
              <h1 className="font-display text-6xl uppercase leading-[0.92] tracking-[0.12em] text-bone sm:text-7xl">
                {product.name}
              </h1>
              <p className="mt-6 body-copy max-w-2xl">{product.description}</p>
              <div className="mt-8 border border-gold/20 bg-obsidian/60 p-5">
                <p className="font-body text-xs uppercase tracking-[0.24em] text-gold">
                  Available Variants
                </p>
                <p className="mt-2 font-body text-sm uppercase tracking-[0.18em] text-bone/80">
                  {product.variants.length} synced options ready for Stripe checkout
                  and Printful fulfillment.
                </p>
              </div>

              <div className="mt-8">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gold/20 bg-smoke/70 p-8 sm:p-10">
            <p className="font-display text-4xl uppercase tracking-[0.12em] text-bone">
              Product unavailable
            </p>
            <p className="mt-4 body-copy max-w-2xl">
              This product could not be loaded from Printful right now. Confirm your
              Printful API key and product sync settings, then try again.
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

