import axios from "axios";
import { parsePrice } from "@/lib/storefront";

export interface PrintfulVariant {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  product_id: string;
  image?: string;
}

export interface PrintfulProduct {
  id: string;
  name: string;
  variants: PrintfulVariant[];
  thumbnail_url: string;
  description?: string;
}

export interface PrintfulOrder {
  recipient: {
    name: string;
    email?: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
  items: Array<{
    variant_id: number;
    quantity: number;
  }>;
  confirm: boolean;
}

type PrintfulListResponse = {
  result: Array<{
    id: number | string;
  }>;
};

const printfulClient = axios.create({
  baseURL: "https://api.printful.com",
  headers: {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY ?? ""}`,
    "Content-Type": "application/json"
  }
});

function assertPrintfulConfig() {
  if (!process.env.PRINTFUL_API_KEY) {
    throw new Error("Missing PRINTFUL_API_KEY environment variable.");
  }
}

function inferVariantDetails(name: string) {
  const normalized = name.replace(/\s+/g, " ").trim();
  const slashParts = normalized.split(" / ").map((part) => part.trim()).filter(Boolean);

  if (slashParts.length >= 2) {
    return {
      color: slashParts[0],
      size: slashParts[slashParts.length - 1]
    };
  }

  const dashParts = normalized.split(" - ").map((part) => part.trim()).filter(Boolean);

  if (dashParts.length >= 2) {
    return {
      color: dashParts[0],
      size: dashParts[dashParts.length - 1]
    };
  }

  return {
    color: "Core",
    size: "One Size"
  };
}

function normalizeVariant(rawVariant: Record<string, unknown>, product: Record<string, unknown>) {
  const inferred = inferVariantDetails(String(rawVariant.name ?? "Runner Gang Variant"));
  const imageSource =
    ((rawVariant.files as Array<Record<string, unknown>> | undefined)?.find(
      (file) =>
        typeof file.preview_url === "string" ||
        typeof file.thumbnail_url === "string" ||
        typeof file.url === "string"
    ) as Record<string, unknown> | undefined) ?? {};
  const priceSource = (rawVariant.retail_price ?? rawVariant.price) as
    | string
    | number
    | null
    | undefined;

  return {
    id: String(rawVariant.variant_id ?? rawVariant.id ?? ""),
    product_id: String(product.id ?? ""),
    name: String(rawVariant.name ?? product.name ?? "Runner Gang Variant"),
    size: String(rawVariant.size ?? inferred.size),
    color: String(rawVariant.color ?? inferred.color),
    price: parsePrice(priceSource),
    image: String(
      imageSource.preview_url ??
        imageSource.thumbnail_url ??
        imageSource.url ??
        product.thumbnail_url ??
        ""
    )
  } satisfies PrintfulVariant;
}

function normalizeProduct(rawResult: Record<string, unknown>) {
  const syncProduct = (rawResult.sync_product as Record<string, unknown> | undefined) ?? rawResult;
  const syncVariants =
    ((rawResult.sync_variants as Array<Record<string, unknown>> | undefined) ??
      (rawResult.variants as Array<Record<string, unknown>> | undefined) ??
      []) as Array<Record<string, unknown>>;

  return {
    id: String(syncProduct.id ?? rawResult.id ?? ""),
    name: String(syncProduct.name ?? rawResult.name ?? "Runner Gang Product"),
    thumbnail_url: String(syncProduct.thumbnail_url ?? rawResult.thumbnail_url ?? "/hero-bg.jpg"),
    description: String(
      syncProduct.description ??
        rawResult.description ??
        "Limited-run apparel engineered for movement, made for the culture."
    ),
    variants: syncVariants
      .map((variant) => normalizeVariant(variant, syncProduct))
      .filter((variant) => Boolean(variant.id))
  } satisfies PrintfulProduct;
}

export async function getProduct(id: string) {
  assertPrintfulConfig();

  const response = await printfulClient.get<{ result: Record<string, unknown> }>(
    `/store/products/${id}`
  );

  return normalizeProduct(response.data.result);
}

export async function getProducts() {
  assertPrintfulConfig();

  const response = await printfulClient.get<PrintfulListResponse>("/store/products");
  const productIds = response.data.result.map((product) => String(product.id));
  const products = await Promise.all(productIds.map((id) => getProduct(id)));

  return products;
}

export async function createOrder(orderData: PrintfulOrder) {
  assertPrintfulConfig();

  const response = await printfulClient.post("/orders?confirm=1", {
    ...orderData,
    confirm: true
  });

  return response.data;
}
