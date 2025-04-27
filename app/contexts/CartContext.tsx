"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define cart item shape
interface CartItem {
  id: string;
  // name: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, string[]>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, decrementOnly?: boolean) => void;
  clearCart: () => void;
  selectedAttributes: Record<string, string[]>;
  setSelectedAttributes: (attrs: Record<string, string[]>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string[]>
  >({});

  // Add item (merge by id+attributes)
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const matchIdx = prev.findIndex(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.attributes || {}) ===
            JSON.stringify(item.attributes || {})
      );
      if (matchIdx !== -1) {
        // Merge quantity
        return prev.map((i, idx) =>
          idx === matchIdx ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item }];
    });
  };

  // Remove item (by id, decrement if needed)
  const removeItem = (id: string, decrementOnly = false) => {
    setItems((prev) => {
      if (decrementOnly) {
        return prev.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Clear cart
  const clearCart = () => setItems([]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    clearCart,
    selectedAttributes,
    setSelectedAttributes,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to consume cart context
export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};
