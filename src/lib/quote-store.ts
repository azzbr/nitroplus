import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type QuoteBasketItem = {
  slug: string;
  name: string;
  quantity: number;
  addedAt: number;
};

type QuoteBasketStore = {
  items: QuoteBasketItem[];
  addItem: (item: { slug: string; name: string; quantity?: number }) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

export const useQuoteBasket = create<QuoteBasketStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: ({ slug, name, quantity = 1 }) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === slug
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { slug, name, quantity, addedAt: Date.now() },
            ],
          };
        }),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug
              ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "nitroplus-quote-basket",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          const noopStorage: Storage = {
            length: 0,
            clear: () => undefined,
            getItem: () => null,
            key: () => null,
            removeItem: () => undefined,
            setItem: () => undefined,
          };
          return noopStorage;
        }
        return localStorage;
      }),
    }
  )
);

export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useQuoteBasket.persist.onFinishHydration(cb),
    () => useQuoteBasket.persist.hasHydrated(),
    () => false
  );
}
