export type CheckoutEligibleItem = {
  variant_id: string | number;
  catalogSource?: "printful" | "launch";
};

export function isPrintfulVariantId(variantId: string | number) {
  return /^\d+$/.test(String(variantId).trim());
}

export function isCheckoutEligibleItem(item: CheckoutEligibleItem) {
  if (item.catalogSource) {
    return item.catalogSource === "printful";
  }

  return isPrintfulVariantId(item.variant_id);
}
