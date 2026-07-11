export type SupplySize = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";

export const SUPPLY_SIZES: SupplySize[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL"
];

export const UPCHARGE_SIZES: SupplySize[] = ["2XL", "3XL"];
export const UPCHARGE_PER_UNIT = 2;

export type SupplyPriceTier = {
  minQty: number;
  unit: number;
};

export type SupplyProductColor = {
  name: string;
  hex: string;
};

export type SupplyProduct = {
  id: string;
  name: string;
  category: "tee" | "long-sleeve" | "crewneck" | "hoodie";
  description: string;
  tiers: SupplyPriceTier[];
  colors: SupplyProductColor[];
};

export const SUPPLY_PRODUCTS: SupplyProduct[] = [
  {
    id: "rg-blank-tee",
    name: "RG Blank Tee",
    category: "tee",
    description:
      "6.1oz combed ring-spun cotton. Boxy unisex fit. Reinforced shoulder taping.",
    tiers: [
      { minQty: 12, unit: 9.5 },
      { minQty: 24, unit: 8.25 },
      { minQty: 72, unit: 7.25 },
      { minQty: 144, unit: 6.4 }
    ],
    colors: [
      { name: "Bone", hex: "#F0EBE3" },
      { name: "Obsidian", hex: "#0A0A0A" },
      { name: "Sand", hex: "#C7B79A" },
      { name: "Olive", hex: "#3B4A2F" },
      { name: "Ember", hex: "#B23A1B" }
    ]
  },
  {
    id: "rg-blank-long-sleeve",
    name: "RG Blank Long Sleeve",
    category: "long-sleeve",
    description:
      "6.5oz heavyweight cotton long sleeve. Ribbed cuffs. Streetwear cut.",
    tiers: [
      { minQty: 12, unit: 13.5 },
      { minQty: 24, unit: 12.0 },
      { minQty: 72, unit: 10.75 },
      { minQty: 144, unit: 9.5 }
    ],
    colors: [
      { name: "Bone", hex: "#F0EBE3" },
      { name: "Obsidian", hex: "#0A0A0A" },
      { name: "Sand", hex: "#C7B79A" },
      { name: "Olive", hex: "#3B4A2F" }
    ]
  },
  {
    id: "rg-blank-crewneck",
    name: "RG Blank Crewneck",
    category: "crewneck",
    description:
      "9oz fleece-lined crewneck. Set-in sleeves. Refined uniform silhouette.",
    tiers: [
      { minQty: 12, unit: 22.0 },
      { minQty: 24, unit: 19.5 },
      { minQty: 72, unit: 17.25 },
      { minQty: 144, unit: 15.5 }
    ],
    colors: [
      { name: "Bone", hex: "#F0EBE3" },
      { name: "Obsidian", hex: "#0A0A0A" },
      { name: "Ash", hex: "#7A7A7A" },
      { name: "Olive", hex: "#3B4A2F" }
    ]
  },
  {
    id: "rg-blank-hoodie",
    name: "RG Blank Hoodie",
    category: "hoodie",
    description:
      "9.5oz brushed-fleece pullover hoodie. Kangaroo pocket. Double-lined hood.",
    tiers: [
      { minQty: 12, unit: 26.5 },
      { minQty: 24, unit: 23.75 },
      { minQty: 72, unit: 21.0 },
      { minQty: 144, unit: 18.75 }
    ],
    colors: [
      { name: "Bone", hex: "#F0EBE3" },
      { name: "Obsidian", hex: "#0A0A0A" },
      { name: "Ash", hex: "#7A7A7A" },
      { name: "Olive", hex: "#3B4A2F" },
      { name: "Ember", hex: "#B23A1B" }
    ]
  }
];

export type SupplyPrintOption =
  | "blank"
  | "one_color"
  | "two_color"
  | "full_color";

export const PRINT_PRICING: Record<
  SupplyPrintOption,
  { label: string; perUnit: number }
> = {
  blank: { label: "Blank (no print)", perUnit: 0 },
  one_color: { label: "One-color print", perUnit: 2.5 },
  two_color: { label: "Two-color print", perUnit: 4.0 },
  full_color: { label: "Full-color print", perUnit: 6.5 }
};

export const MIN_ORDER_UNITS = 12;
export const FREE_SHIPPING_THRESHOLD = 144;
export const FLAT_SHIPPING = 25;

export type SupplyOrderLine = {
  productId: string;
  colorName: string;
  printOption: SupplyPrintOption;
  sizes: Partial<Record<SupplySize, number>>;
};

export type PricedSupplyLine = {
  product: SupplyProduct;
  colorName: string;
  colorHex: string;
  printOption: SupplyPrintOption;
  sizes: Partial<Record<SupplySize, number>>;
  totalQty: number;
  unitPrice: number;
  printPerUnit: number;
  upchargeUnits: number;
  lineTotal: number;
};

export type PricedSupplyOrder = {
  lines: PricedSupplyLine[];
  totalUnits: number;
  subtotal: number;
  shipping: number;
  total: number;
  errors: string[];
};

export function getSupplyProduct(productId: string): SupplyProduct | undefined {
  return SUPPLY_PRODUCTS.find((product) => product.id === productId);
}

function tierUnitPrice(tiers: SupplyPriceTier[], totalOrderUnits: number) {
  const applicable = tiers.filter((tier) => totalOrderUnits >= tier.minQty);

  if (applicable.length === 0) {
    return tiers[0]?.unit ?? 0;
  }

  return applicable[applicable.length - 1].unit;
}

export function priceSupplyOrder(rawLines: SupplyOrderLine[]): PricedSupplyOrder {
  const errors: string[] = [];
  const validLines: Array<{
    line: SupplyOrderLine;
    product: SupplyProduct;
    color: SupplyProductColor;
    sizes: Partial<Record<SupplySize, number>>;
    totalQty: number;
    upchargeUnits: number;
  }> = [];

  for (const line of rawLines) {
    const product = getSupplyProduct(line.productId);

    if (!product) {
      errors.push(`Unknown product: ${line.productId}.`);
      continue;
    }

    const color = product.colors.find((c) => c.name === line.colorName);

    if (!color) {
      errors.push(`Color "${line.colorName}" is not available on ${product.name}.`);
      continue;
    }

    if (!PRINT_PRICING[line.printOption]) {
      errors.push(`Unknown print option on ${product.name}.`);
      continue;
    }

    const cleanSizes: Partial<Record<SupplySize, number>> = {};
    let totalQty = 0;
    let upchargeUnits = 0;

    for (const size of SUPPLY_SIZES) {
      const requested = Number(line.sizes[size] ?? 0);

      if (!Number.isFinite(requested) || requested < 0) {
        errors.push(`Invalid quantity for ${product.name} ${size}.`);
        continue;
      }

      const qty = Math.floor(requested);
      if (qty === 0) continue;

      cleanSizes[size] = qty;
      totalQty += qty;

      if (UPCHARGE_SIZES.includes(size)) {
        upchargeUnits += qty;
      }
    }

    if (totalQty === 0) continue;

    validLines.push({
      line,
      product,
      color,
      sizes: cleanSizes,
      totalQty,
      upchargeUnits
    });
  }

  const totalUnits = validLines.reduce((sum, entry) => sum + entry.totalQty, 0);

  if (totalUnits > 0 && totalUnits < MIN_ORDER_UNITS) {
    errors.push(
      `Wholesale orders require a minimum of ${MIN_ORDER_UNITS} total units.`
    );
  }

  const lines: PricedSupplyLine[] = validLines.map((entry) => {
    const unitPrice = tierUnitPrice(entry.product.tiers, totalUnits);
    const printPerUnit = PRINT_PRICING[entry.line.printOption].perUnit;
    const upchargeTotal = entry.upchargeUnits * UPCHARGE_PER_UNIT;
    const lineTotal =
      entry.totalQty * (unitPrice + printPerUnit) + upchargeTotal;

    return {
      product: entry.product,
      colorName: entry.color.name,
      colorHex: entry.color.hex,
      printOption: entry.line.printOption,
      sizes: entry.sizes,
      totalQty: entry.totalQty,
      unitPrice,
      printPerUnit,
      upchargeUnits: entry.upchargeUnits,
      lineTotal
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping =
    totalUnits === 0 || totalUnits >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

  return {
    lines,
    totalUnits,
    subtotal,
    shipping,
    total: subtotal + shipping,
    errors
  };
}
