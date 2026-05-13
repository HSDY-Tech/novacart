"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore(s => s.items);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!items.length) return (
    <div className="container py-24 text-center">
      <Heart className="mx-auto h-14 w-14 text-muted-foreground/40 mb-4" />
      <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
      <p className="mt-2 text-muted-foreground">Save products you love and find them here</p>
      <Button asChild variant="accent" className="mt-6"><Link href="/products">Browse Products</Link></Button>
    </div>
  );
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-display font-bold">Wishlist ({items.length})</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
