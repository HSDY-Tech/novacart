import type { Product } from "@/types/product";

export type CartItem = { product: Product; quantity: number };
export type CartTotals = { subtotal: number; discount: number; shipping: number; tax: number; total: number };
