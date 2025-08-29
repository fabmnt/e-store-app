'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Product } from '@/features/products/schemas/product-schema';

type ShoppingCartItem = {
  id: string;
  quantity: number;
  product: Product;
};

type ShoppingCartState = {
  items: ShoppingCartItem[];
  total: number;
};

type ShoppingCartActions = {
  addItem: (item: ShoppingCartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useShoppingCart = create<
  ShoppingCartState & ShoppingCartActions
>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      clear: () => {
        set({ items: [], total: 0 });
      },
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
          total: state.total + item.quantity * item.product.price,
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          total:
            state.total -
            (state.items.find((item) => item.id === id)?.product.price ?? 0),
        }));
      },
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
