export type CheckoutEligibleItem = {
  variant_id: string | number;
  catalogSource?: "launch";
};

export function isCheckoutEligibleItem(item: CheckoutEligibleItem) {
  return String(item.variant_id).trim().length > 0;
}
