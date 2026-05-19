"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { ESTIMATED_SHIPPING } from "@/lib/storefront";

export type CartItem = {
  variant_id: string;
  product_id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { variant_id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; payload?: boolean };

type CartContextValue = {
  state: CartState;
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  itemCount: number;
  subtotal: number;
  shippingEstimate: number;
  totalEstimate: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (force?: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const STORAGE_KEY = "runner-gang-lifestyle-cart";

const CartContext = createContext<CartContextValue | null>(null);

const initialState: CartState = {
  items: [],
  isOpen: false
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        items: action.payload
      };
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.variant_id === action.payload.variant_id
      );

      if (!existingItem) {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.variant_id === action.payload.variant_id
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity
              }
            : item
        )
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.variant_id !== action.payload)
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.variant_id === action.payload.variant_id
              ? {
                  ...item,
                  quantity: action.payload.quantity
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: []
      };
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: typeof action.payload === "boolean" ? action.payload : !state.isOpen
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartItem[];
        dispatch({ type: "HYDRATE", payload: parsed });
      } catch (error) {
        console.error("Failed to parse saved cart", error);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [isHydrated, state.items]);

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  function addItem(item: CartItem) {
    dispatch({ type: "ADD_ITEM", payload: item });
  }

  function removeItem(variantId: string) {
    dispatch({ type: "REMOVE_ITEM", payload: variantId });
  }

  function updateQuantity(variantId: string, quantity: number) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        variant_id: variantId,
        quantity
      }
    });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function toggleCart(force?: boolean) {
    dispatch({ type: "TOGGLE_CART", payload: force });
  }

  function openCart() {
    dispatch({ type: "TOGGLE_CART", payload: true });
  }

  function closeCart() {
    dispatch({ type: "TOGGLE_CART", payload: false });
  }

  function openCheckout() {
    closeCart();
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    setIsCheckoutOpen(false);
  }

  return (
    <CartContext.Provider
      value={{
        state,
        items: state.items,
        isOpen: state.isOpen,
        isCheckoutOpen,
        itemCount,
        subtotal,
        shippingEstimate: state.items.length > 0 ? ESTIMATED_SHIPPING : 0,
        totalEstimate: state.items.length > 0 ? subtotal + ESTIMATED_SHIPPING : 0,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
