import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Shield, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts, getTrendingProducts, getCategories } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts(4);
  const trending = getTrendingProducts(4);
  const cats = getCategories().slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(99_102_241/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(139_92_246/0.2),transparent_60%)]" />
        <div className="container relative grid min-h-[85vh] items-center gap-12 py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <Badge variant="accent" className="mb-5 bg-accent/20 text-accent border-accent/30">
              <Sparkles className="h-3 w-3" /> AI-Powered Shopping
            </Badge>
            <h1 className="text-5xl font-display font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Shop Smarter<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">with AI</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Discover premium tech products with an AI shopping assistant that understands what you need. Just ask — we'll find it.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" variant="accent" className="shadow-glow">
                <Link href="/products">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-6 text-sm text-slate-400">
              {[["500+", "Products"], ["4.8★", "Avg Rating"], ["24/7", "AI Support"]].map(([v, l]) => (
                <div key={l}><p className="text-xl font-bold text-white">{v}</p><p>{l}</p></div>
              ))}
            </div>
          </div>

          {/* AI Chat Preview */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl shadow-[0_32px_80px_-16px_rgb(99_102_241/0.4)]">
              <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
                    <Bot className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">NovaCart AI</p>
                    <p className="text-xs text-emerald-400">● Online now</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white">
                    Find me wireless headphones under $200
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-slate-200">
                    I found 3 great options! The NovaSound Wireless Gaming Headphones at $129 are highly rated ★4.7 and trending right now 🎧
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2.5">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      <Image src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=100&q=80" alt="Headphones" fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Wireless Gaming Headphones</p>
                      <p className="text-xs text-indigo-400 font-bold">$129 <span className="text-slate-500 line-through">$179</span></p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
                  <p className="flex-1 text-xs text-slate-500">Ask about products...</p>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent"><ArrowRight className="h-3 w-3 text-white" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b bg-white">
        <div className="container grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
          {[
            { icon: Zap, label: "Fast Delivery", desc: "Same-day available" },
            { icon: Shield, label: "Secure Checkout", desc: "SSL encrypted" },
            { icon: Star, label: "Top Rated", desc: "4.8★ average" },
            { icon: Bot, label: "AI Assistant", desc: "24/7 smart help" }
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Handpicked</p>
            <h2 className="mt-1 text-3xl font-display font-bold">Featured Products</h2>
          </div>
          <Button asChild variant="outline"><Link href="/products">View All <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Browse</p>
          <h2 className="mt-1 mb-8 text-3xl font-display font-bold">Shop by Category</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {cats.map(cat => (
              <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-card text-center">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-secondary">
                  {cat.featuredImage && <Image src={cat.featuredImage} alt={cat.name} fill sizes="48px" className="object-cover opacity-80 transition group-hover:opacity-100 group-hover:scale-110" />}
                </div>
                <span className="text-xs font-semibold">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Hot Right Now</p>
            <h2 className="mt-1 text-3xl font-display font-bold">Trending Products</h2>
          </div>
          <Button asChild variant="outline"><Link href="/products">See All <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-violet-600 px-8 py-12 text-white">
          <div className="absolute right-8 top-8 opacity-10"><Sparkles className="h-32 w-32" /></div>
          <div className="relative max-w-lg">
            <h2 className="text-3xl font-display font-bold">Meet Your AI Shopping Assistant</h2>
            <p className="mt-3 text-white/80">Click the sparkle button in the corner to start chatting. Ask about products, compare options, get recommendations — all powered by AI.</p>
            <div className="mt-6 flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"><Bot className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold">Try: "Find me a gaming keyboard under $150"</p><p className="text-xs text-white/60">The AI will search the catalog and respond instantly</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
