"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnMount() {
  const { clearCart, closeCheckout, closeCart } = useCart();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    clearCart();
    closeCheckout();
    closeCart();
  }, []);

  return null;
}
