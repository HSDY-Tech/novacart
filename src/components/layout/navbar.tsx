"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigationLinks, siteConfig } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore(s => s.items.reduce((a, i) => a + i.quantity, 0));
  const wishCount = useWishlistStore(s => s.items.length);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight">{siteConfig.name}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationLinks.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={cn("rounded-full px-4 py-2 text-sm font-medium transition hover:text-accent", active ? "text-accent" : "text-muted-foreground")}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          {mounted && (
            <>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">{wishCount}</span>}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">{cartCount}</span>}
                </Link>
              </Button>
            </>
          )}
          <Button asChild variant="accent" className="hidden md:flex">
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(o => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="container pb-4 md:hidden">
          <div className="rounded-2xl border bg-white p-3 shadow-card">
            {navigationLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-secondary">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline"><Link href="/cart" onClick={() => setOpen(false)}>Cart</Link></Button>
              <Button asChild variant="accent"><Link href="/products" onClick={() => setOpen(false)}>Shop</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
