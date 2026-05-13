"use client";
import Link from "next/link";
import { Bell, Heart, Package, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatCurrency } from "@/utils/format";

type Tab = "orders" | "wishlist" | "profile" | "settings";
const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings }
];
const ORDERS = [
  { id: "NC-2051", date: "May 28, 2026", status: "Delivered", total: 347, items: "Gaming Headphones, USB-C Hub" },
  { id: "NC-1988", date: "April 14, 2026", status: "Processing", total: 159, items: "Noise-Canceling Earbuds" }
];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [mounted, setMounted] = useState(false);
  const wishlist = useWishlistStore(s => s.items);
  useEffect(() => setMounted(true), []);

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <div className="h-fit rounded-2xl border bg-white p-3 shadow-soft">
        <div className="mb-4 p-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-violet-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <p className="mt-2 font-semibold">Alex Morgan</p>
          <p className="text-xs text-muted-foreground">alex@novacart.ai</p>
        </div>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-left transition ${tab === id ? "bg-accent text-white" : "text-muted-foreground hover:bg-secondary"}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {tab === "orders" && (
          <div>
            <h1 className="mb-5 text-xl font-display font-bold">My Orders</h1>
            <div className="space-y-3">
              {ORDERS.map(o => (
                <div key={o.id} className="flex flex-col gap-2 rounded-2xl border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Order {o.id}</p>
                    <p className="text-sm text-muted-foreground">{o.date} · {o.items}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold">{formatCurrency(o.total)}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${o.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            <h1 className="mb-5 text-xl font-display font-bold">Wishlist ({mounted ? wishlist.length : 0})</h1>
            {mounted && wishlist.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-10 text-center shadow-soft">
                <Heart className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-semibold">No wishlist items yet</p>
                <Button asChild variant="accent" className="mt-4"><Link href="/products">Browse Products</Link></Button>
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h1 className="mb-5 text-xl font-display font-bold">Profile</h1>
            <div className="rounded-2xl border bg-white p-6 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>First Name</Label><Input defaultValue="Alex" /></div>
                <div className="space-y-1.5"><Label>Last Name</Label><Input defaultValue="Morgan" /></div>
                <div className="col-span-2 space-y-1.5"><Label>Email</Label><Input defaultValue="alex@novacart.ai" /></div>
                <div className="col-span-2 space-y-1.5"><Label>Phone</Label><Input placeholder="+1 (555) 000-0000" /></div>
              </div>
              <Button variant="accent" className="mt-5">Save Changes (Demo)</Button>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h1 className="mb-5 text-xl font-display font-bold">Settings</h1>
            <div className="space-y-3">
              {["Email notifications", "Order status updates", "AI recommendation emails", "Marketing offers"].map(s => (
                <div key={s} className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium">{s}</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
