import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, decrementOnly?: boolean) => void;
  clearCart: () => void;
}

const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (id, decrementOnly = false) =>
    set((state) => {
      // If we only want to decrement by one (not remove entirely)
      if (decrementOnly) {
        return {
          items: state.items.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }

      // Otherwise completely remove the item
      return {
        items: state.items.filter((item) => item.id !== id),
      };
    }),
  clearCart: () => set({ items: [] }),
}));

export default useCart;
