"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnMount() {
  const { clearCart, closeCheckout, closeCart } = useCart();

  useEffect(() => {
    clearCart();
    closeCheckout();
    closeCart();
  }, [clearCart, closeCheckout, closeCart]);

  return null;
}
