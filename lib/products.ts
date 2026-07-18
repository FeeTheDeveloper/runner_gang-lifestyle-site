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
    id: "rgl-signature-tee",
    name: "Runner Gang Signature Tee",
    description:
      "The Runner Gang Signature t-shirt featuring the classic script logo. Premium white tee available in four print colorways. Unisex fit. EST. 2025. $24.99 plus shipping and handling.",
    price: 24.99,
    category: "tee",
    design: "signature",
    thumbnail: "/rg1_bw.png",
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "/rg1_bw.png" },
      { name: "Blue", hex: "#1D3FE8", image: "/rg1_blw.png" },
      { name: "Green", hex: "#22C55E", image: "/rg1_gw.png" },
      { name: "Red", hex: "#EF2424", image: "/rg1_rw.png" }
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW DROP",
    featured: true
  }
];

export function getLaunchProduct(id: string): LaunchProduct | undefined {
  return LAUNCH_PRODUCTS.find((product) => product.id === id);
}
