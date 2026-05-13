import Link from "next/link";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/constants/site";

const cols = [
  { title: "Shop", links: [{ label: "All Products", href: "/products" }, { label: "Categories", href: "/categories" }, { label: "Deals", href: "/products" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }] },
  { title: "Account", links: [{ label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }, { label: "Dashboard", href: "/dashboard" }] }
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{siteConfig.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {cols.map(col => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-muted-foreground transition hover:text-accent">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Built for portfolio showcase.
        </div>
      </div>
    </footer>
  );
}
