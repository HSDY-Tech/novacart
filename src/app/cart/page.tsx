"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCartTotals, useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState("");
  const items = useCartStore(s => s.items);
  const remove = useCartStore(s => s.removeItem);
  const update = useCartStore(s => s.updateQty);
  const totals = getCartTotals(items, coupon);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container py-16 text-center text-muted-foreground">Loading cart…</div>;

  if (items.length === 0) return (
    <div className="container py-24 text-center">
      <ShoppingCart className="mx-auto h-14 w-14 text-muted-foreground/40 mb-4" />
      <h1 className="text-2xl font-bold">Your cart is empty</h1>
      <p className="mt-2 text-muted-foreground">Add some products to get started</p>
      <Button asChild variant="accent" className="mt-6"><Link href="/products">Browse Products</Link></Button>
    </div>
  );

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-6 text-2xl font-display font-bold">Shopping Cart ({items.length})</h1>
        <div className="space-y-4">
          {items.map(({ product: p, quantity }) => (
            <div key={p.id} className="flex gap-4 rounded-2xl border bg-white p-4 shadow-soft">
              <Link href={`/products/${p.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <Image src={p.image} alt={p.title} fill sizes="80px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/products/${p.slug}`} className="text-sm font-semibold hover:text-accent">{p.title}</Link>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.brand}</p>
                  </div>
                  <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border">
                    <button className="px-2.5 py-1.5" onClick={() => update(p.id, quantity-1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button className="px-2.5 py-1.5" onClick={() => update(p.id, quantity+1)}><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-bold">{formatCurrency(p.price * quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          {totals.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-emerald-600">-{formatCurrency(totals.discount)}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>{formatCurrency(totals.tax)}</span></div>
        </div>
        <div className="my-4 border-t" />
        <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
        <div className="mt-4 space-y-2">
          <Input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code (try NOVA10)" />
          <p className="text-xs text-muted-foreground">Apply coupon NOVA10 for 10% off</p>
        </div>
        <Button asChild variant="accent" className="mt-4 w-full"><Link href="/checkout">Proceed to Checkout</Link></Button>
      </div>
    </div>
  );
}
