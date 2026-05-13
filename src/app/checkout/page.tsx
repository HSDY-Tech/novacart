"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCartTotals, useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const items = useCartStore(s => s.items);
  const clear = useCartStore(s => s.clear);
  const totals = getCartTotals(items);
  useEffect(() => setMounted(true), []);

  const submit = (e: FormEvent) => { e.preventDefault(); setDone(true); clear(); };

  if (!mounted) return null;

  if (done) return (
    <div className="container py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-bold">Order Placed!</h1>
      <p className="mt-2 text-muted-foreground">This is a portfolio demo — no real order was placed.</p>
      <Button asChild variant="accent" className="mt-6"><Link href="/products">Continue Shopping</Link></Button>
    </div>
  );

  if (!items.length) return (
    <div className="container py-24 text-center">
      <h1 className="text-2xl font-bold">Nothing to checkout</h1>
      <Button asChild variant="accent" className="mt-4"><Link href="/products">Shop Now</Link></Button>
    </div>
  );

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Checkout</h1>
        <div className="rounded-2xl border bg-white p-6 shadow-soft space-y-4">
          <h2 className="font-semibold">Shipping Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>First name</Label><Input required placeholder="John" /></div>
            <div className="space-y-1.5"><Label>Last name</Label><Input required placeholder="Doe" /></div>
            <div className="col-span-2 space-y-1.5"><Label>Email</Label><Input type="email" required placeholder="john@example.com" /></div>
            <div className="col-span-2 space-y-1.5"><Label>Address</Label><Input required placeholder="123 Main St" /></div>
            <div className="space-y-1.5"><Label>City</Label><Input required placeholder="New York" /></div>
            <div className="space-y-1.5"><Label>ZIP</Label><Input required placeholder="10001" /></div>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-soft space-y-4">
          <h2 className="font-semibold">Payment</h2>
          <div className="space-y-1.5"><Label>Card Number</Label><Input required placeholder="4242 4242 4242 4242" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Expiry</Label><Input required placeholder="MM/YY" /></div>
            <div className="space-y-1.5"><Label>CVC</Label><Input required placeholder="123" /></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-accent" />Portfolio demo — no real payment processed
          </div>
        </div>
        <Button type="submit" variant="accent" size="lg" className="w-full">Place Order (Demo)</Button>
      </form>
      <div className="h-fit rounded-2xl border bg-white p-6 shadow-card">
        <h2 className="mb-4 font-bold">Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map(({product:p,quantity}) => (
            <div key={p.id} className="flex justify-between"><span className="text-muted-foreground truncate pr-2">{p.title} ×{quantity}</span><span className="shrink-0">{formatCurrency(p.price*quantity)}</span></div>
          ))}
        </div>
        <div className="my-3 border-t" />
        <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
      </div>
    </div>
  );
}
