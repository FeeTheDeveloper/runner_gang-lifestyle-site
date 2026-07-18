import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import LaunchProductDetail from "@/components/LaunchProductDetail";
import Navbar from "@/components/Navbar";
import { getLaunchProduct } from "@/lib/products";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const product = getLaunchProduct(params.id);

  if (product) {
    return {
      title: product.name,
      description: product.description
    };
  }

  return {
    title: "Product",
    description: "Runner Gang Lifestyle product details."
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const launchProduct = getLaunchProduct(params.id);

  if (!launchProduct) {
    notFound();
  }

  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        <LaunchProductDetail product={launchProduct} />
      </section>
      <Footer />
    </main>
  );
}
