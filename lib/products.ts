export type ProductColor = {
  name: string;
  hex: string;
  image: string;
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
  badge?: string;
  featured?: boolean;
};

export const LAUNCH_PRODUCTS: LaunchProduct[] = [
  {
    id: "rgl-tee-coastal",
    name: "Runner Gang Coastal Tee",
    description:
      "All-over print tee featuring the coastal city skyline. Premium 100% cotton. Unisex fit. ESTD 2024.",
    price: 45.0,
    category: "tee",
    design: "coastal",
    thumbnail: "/products/coastal-tee-black.jpg",
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "/products/coastal-tee-black.jpg" },
      { name: "White", hex: "#F0EBE3", image: "/products/coastal-tee-white.jpg" },
      { name: "Navy", hex: "#1B2A4A", image: "/products/coastal-tee-navy.jpg" },
      { name: "Red", hex: "#9B1C1C", image: "/products/coastal-tee-red.jpg" },
      { name: "Olive", hex: "#3B4A2F", image: "/products/coastal-tee-olive.jpg" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    badge: "NEW DROP",
    featured: true
  },
  {
    id: "rgl-tee-world",
    name: "Runner Gang World Tour Tee",
    description:
      "All-over print tee featuring global city skylines. Premium 100% cotton. Unisex fit. ESTD 2024.",
    price: 45.0,
    category: "tee",
    design: "world",
    thumbnail: "/products/world-tee-black.jpg",
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "/products/world-tee-black.jpg" },
      { name: "White", hex: "#F0EBE3", image: "/products/world-tee-white.jpg" },
      { name: "Navy", hex: "#1B2A4A", image: "/products/world-tee-navy.jpg" },
      { name: "Red", hex: "#9B1C1C", image: "/products/world-tee-red.jpg" },
      { name: "Olive", hex: "#3B4A2F", image: "/products/world-tee-olive.jpg" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    badge: "NEW DROP",
    featured: true
  }
];

export function getLaunchProduct(id: string): LaunchProduct | undefined {
  return LAUNCH_PRODUCTS.find((product) => product.id === id);
}
