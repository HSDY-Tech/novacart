"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import { formatCurrency, percentageOff } from "@/utils/format";
import { cn } from "@/lib/utils";

export function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid"|"list" }) {
  const addItem = useCartStore(s => s.addItem);
  const toggle = useWishlistStore(s => s.toggle);
  const isWished = useWishlistStore(s => s.has(product.id));
  const [added, setAdded] = useState(false);
  const discount = percentageOff(product.price, product.originalPrice);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (view === "list") {
    return (
      <div className="group flex gap-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-soft transition hover:shadow-card">
        <Link href={`/products/${product.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
          <Image src={product.image} alt={product.title} fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="accent">{product.category}</Badge>
              {discount && <Badge variant="success">-{discount}%</Badge>}
              {product.isTrending && <Badge>Trending</Badge>}
            </div>
            <Link href={`/products/${product.slug}`}><h3 className="mt-1.5 font-semibold hover:text-accent">{product.title}</h3></Link>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{product.description}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => toggle(product)}><Heart className={cn("h-4 w-4", isWished && "fill-red-500 text-red-500")} /></Button>
              <Button variant="accent" size="sm" onClick={handleAdd}><ShoppingBag className="h-3.5 w-3.5" />{added ? "Added!" : "Add"}</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isTrending && <Badge>Trending</Badge>}
          {discount && <Badge variant="success">-{discount}%</Badge>}
        </div>
        <button onClick={() => toggle(product)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur transition hover:bg-white">
          <Heart className={cn("h-4 w-4", isWished && "fill-red-500 text-red-500")} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="accent" className="w-fit">{product.category}</Badge>
        <Link href={`/products/${product.slug}`}><h3 className="mt-2 line-clamp-2 font-semibold leading-snug hover:text-accent">{product.title}</h3></Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{product.rating} ({product.reviews})
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
            {product.originalPrice && <p className="text-xs text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</p>}
          </div>
          <Button variant="accent" size="sm" onClick={handleAdd} disabled={product.stock === 0}>
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stock === 0 ? "Out of stock" : added ? "Added!" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
