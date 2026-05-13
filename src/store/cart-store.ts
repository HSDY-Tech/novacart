import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartTotals } from "@/types/cart";
import type { Product } from "@/types/product";

type CartState = {
  items: CartItem[];
  addItem(p: Product, qty?: number): void;
  removeItem(id: string): void;
  updateQty(id: string, qty: number): void;
  clear(): void;
};

export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  addItem: (p, qty = 1) => set(s => {
    const ex = s.items.find(i => i.product.id === p.id);
    if (!ex) return { items: [...s.items, { product: p, quantity: Math.min(qty, p.stock) }] };
    return { items: s.items.map(i => i.product.id === p.id ? { ...i, quantity: Math.min(i.quantity + qty, p.stock) } : i) };
  }),
  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.product.id !== id) })),
  updateQty: (id, qty) => {
    if (qty <= 0) { set(s => ({ items: s.items.filter(i => i.product.id !== id) })); return; }
    set(s => ({ items: s.items.map(i => i.product.id === id ? { ...i, quantity: Math.min(qty, i.product.stock) } : i) }));
  },
  clear: () => set({ items: [] })
}), { name: "novacart-cart", storage: createJSONStorage(() => localStorage) }));

export function getCartTotals(items: CartItem[], coupon = ""): CartTotals {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = coupon.toUpperCase() === "NOVA10" ? subtotal * 0.1 : 0;
  const shipping = subtotal === 0 || subtotal >= 300 ? 0 : 14.99;
  const tax = (subtotal - discount) * 0.08;
  return { subtotal, discount, shipping, tax, total: Math.max(subtotal - discount + shipping + tax, 0) };
}
