"use client";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(product.images[0] ?? product.image);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary shadow-card">
        <Image src={active} alt={product.title} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {product.images.map(img => (
            <button key={img} onClick={() => setActive(img)} className={cn("relative aspect-square overflow-hidden rounded-xl border-2 bg-secondary transition", active === img ? "border-accent" : "border-transparent")}>
              <Image src={img} alt={product.title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
