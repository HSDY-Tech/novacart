"use client";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export default function AddToCartSection({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const toggle = useWishlistStore(s => s.toggle);
  const isWished = useWishlistStore(s => s.has(product.id));

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Qty</label>
        <div className="flex items-center rounded-full border">
          <button className="px-3 py-2 text-sm disabled:opacity-40" onClick={() => setQty(q => Math.max(1,q-1))} disabled={qty<=1}>−</button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button className="px-3 py-2 text-sm disabled:opacity-40" onClick={() => setQty(q => Math.min(product.stock,q+1))} disabled={qty>=product.stock}>+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="accent" size="lg" className="flex-1" onClick={handleAdd} disabled={product.stock === 0}>
          <ShoppingBag className="h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart! ✓" : "Add to Cart"}
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => toggle(product)}>
          <Heart className={cn("h-5 w-5", isWished && "fill-red-500 text-red-500")} />
        </Button>
      </div>
    </div>
  );
}
