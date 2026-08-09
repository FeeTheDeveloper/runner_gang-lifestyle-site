export type ProductColor = {
  name: string;
  hex: string;
  image: string;
  skuBase?: string;
};

export type ProductGalleryItem = {
  type: "lifestyle" | "detail" | "size-guide";
  image: string;
  alt: string;
};

export type LaunchProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  design: string;
  thumbnail: string;
  colors: ProductColor[];
  sizes: string[];
  gallery?: ProductGalleryItem[];
  badge?: string;
  featured?: boolean;
};

export const LAUNCH_PRODUCTS: LaunchProduct[] = [
  {
    id: "rg-classic-tee",
    name: "RG Classic T-Shirt",
    description:
      "The original Runner Gang signature piece featuring the classic Runner Gang script, sweeping underline, and EST. 2025 mark. Built as a clean everyday essential and made to order in limited production batches.",
    price: 39.99,
    category: "Runner Gang Classics",
    design: "classic",
    thumbnail: "/rg-classic-thumbnail.png",
    colors: [
      { name: "White / Black", hex: "#0A0A0A", image: "/rg-classic-white-black-front.png", skuBase: "RGC-WHT-BLK" },
      { name: "Black / White", hex: "#F0EBE3", image: "/rg-classic-black-white-front.png", skuBase: "RGC-BLK-WHT" },
      { name: "White / Royal Blue", hex: "#1D4ED8", image: "/rg-classic-white-blue-front.png", skuBase: "RGC-WHT-BLU" },
      { name: "White / Red", hex: "#EF2424", image: "/rg-classic-white-red-front.png", skuBase: "RGC-WHT-RED" },
      { name: "White / Neon Green", hex: "#39FF14", image: "/rg-classic-white-neon-green-front.png", skuBase: "RGC-WHT-NGR" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    gallery: [
      { type: "lifestyle", image: "/rg-classic-lifestyle-01.jpg", alt: "Runner Gang RG Classic T-Shirt lifestyle image" },
      { type: "detail", image: "/rg-classic-detail-logo.png", alt: "RG Classic Runner Gang script logo detail" },
      { type: "size-guide", image: "/rg-classic-size-guide.png", alt: "RG Classic T-Shirt size guide" }
    ],
    badge: "THE ORIGINAL",
    featured: true
  }
];

export function getLaunchProduct(id: string): LaunchProduct | undefined {
  return LAUNCH_PRODUCTS.find((product) => product.id === id);
}
