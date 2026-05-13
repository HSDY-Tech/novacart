import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/product";

type WishlistState = {
  items: Product[];
  toggle(p: Product): void;
  remove(id: string): void;
  has(id: string): boolean;
};

export const useWishlistStore = create<WishlistState>()(persist((set, get) => ({
  items: [],
  toggle: (p) => set(s => ({ items: s.items.some(i => i.id === p.id) ? s.items.filter(i => i.id !== p.id) : [...s.items, p] })),
  remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  has: (id) => get().items.some(i => i.id === id)
}), { name: "novacart-wishlist", storage: createJSONStorage(() => localStorage) }));
