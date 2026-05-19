"use client";

import Image from "next/image";
import { useState } from "react";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

type SmartProductImageProps = {
  src: string;
  alt: string;
  colorName: string;
  colorHex: string;
  design: string;
  productName: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function SmartProductImage({
  src,
  alt,
  colorName,
  colorHex,
  design,
  productName,
  sizes,
  priority,
  className
}: SmartProductImageProps) {
  const [failed, setFailed] = useState(false);
  const isLocalProductImage = src.startsWith("/products/");

  if (failed || !src) {
    return (
      <ProductImagePlaceholder
        colorName={colorName}
        colorHex={colorHex}
        design={design}
        productName={productName}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
      unoptimized={isLocalProductImage}
    />
  );
}
