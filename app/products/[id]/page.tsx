import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "@/components/Footer";
import LaunchProductDetail from "@/components/LaunchProductDetail";
import Navbar from "@/components/Navbar";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import { getProduct, type PrintfulProduct } from "@/lib/printful";
import { getLaunchProduct, type LaunchProduct } from "@/lib/products";

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
    const staticProduct = getLaunchProduct(params.id);
    if (staticProduct) {
      return {
        title: staticProduct.name,
        description: staticProduct.description
      };
    }
    return {
      title: "Product",
      description: "Runner Gang Lifestyle product details."
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  noStore();

  let printfulProduct: PrintfulProduct | null = null;
  let printfulError: string | null = null;

  try {
    printfulProduct = await getProduct(params.id);
  } catch (error) {
    printfulError =
      error instanceof Error ? error.message : "This product is not available.";
  }

  const launchProduct: LaunchProduct | undefined = printfulProduct
    ? undefined
    : getLaunchProduct(params.id);

  if (!printfulProduct && !launchProduct) {
    notFound();
  }

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        {printfulProduct ? (
          <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
            <div className="relative overflow-hidden border border-bone/10 bg-smoke">
              <div className="relative aspect-[4/5]">
                <Image
                  src={printfulProduct.thumbnail_url}
                  alt={printfulProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized={printfulProduct.thumbnail_url.startsWith("http")}
                />
              </div>
            </div>

            <div>
              <span className="eyebrow">Printful Product</span>
              <h1 className="font-display text-6xl uppercase leading-[0.92] tracking-[0.12em] text-bone sm:text-7xl">
                {printfulProduct.name}
              </h1>
              <p className="mt-6 body-copy max-w-2xl">
                {printfulProduct.description}
              </p>
              <div className="mt-8 border border-gold/20 bg-obsidian/60 p-5">
                <p className="font-body text-xs uppercase tracking-[0.24em] text-gold">
                  Available Variants
                </p>
                <p className="mt-2 font-body text-sm uppercase tracking-[0.18em] text-bone/80">
                  {printfulProduct.variants.length} synced options ready for Stripe
                  checkout and Printful fulfillment.
                </p>
              </div>

              <div className="mt-8">
                <ProductPurchasePanel product={printfulProduct} />
              </div>
            </div>
          </div>
        ) : launchProduct ? (
          <LaunchProductDetail product={launchProduct} />
        ) : (
          <div className="border border-gold/20 bg-smoke/70 p-8 sm:p-10">
            <p className="font-display text-4xl uppercase tracking-[0.12em] text-bone">
              Product unavailable
            </p>
            <p className="mt-4 body-copy max-w-2xl">
              This product could not be loaded. Confirm your Printful API key and
              product sync settings, then try again.
            </p>
            {printfulError ? (
              <p className="mt-4 font-body text-xs uppercase tracking-[0.2em] text-ash">
                {printfulError}
              </p>
            ) : null}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
