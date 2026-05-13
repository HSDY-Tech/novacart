"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, getCategories } from "@/data/products";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const sp = useSearchParams();
  const [query, setQuery] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(sp.get("category") ?? "All");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid"|"list">("grid");
  const [page, setPage] = useState(1);
  const cats = ["All", ...getCategories().map(c => c.name)];

  useEffect(() => { setPage(1); }, [query, cat, sort]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let r = products.filter(p => {
      const matchCat = cat === "All" || p.category === cat;
      const matchQ = !q || [p.title, p.category, p.brand, p.description, ...p.tags].join(" ").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    if (sort === "price-asc") r = [...r].sort((a,b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a,b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a,b) => b.rating - a.rating);
    else r = [...r].sort((a,b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return r;
  }, [query, cat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Catalog</p>
        <h1 className="mt-1 text-3xl font-display font-bold">All Products</h1>
      </div>

      {/* Filters bar */}
      <div className="mb-6 rounded-2xl border bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="pl-10" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-11 rounded-full border px-4 text-sm font-medium outline-none focus:border-accent focus:ring-4 focus:ring-accent/10">
            <option value="featured">Featured</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <div className="flex gap-1.5">
            <Button variant={view==="grid"?"accent":"outline"} size="icon" onClick={() => setView("grid")}><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant={view==="list"?"accent":"outline"} size="icon" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground self-center" />
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", cat === c ? "border-accent bg-accent text-white" : "border-input hover:border-accent hover:text-accent")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} products {cat !== "All" && `in ${cat}`}</p>

      {paged.length > 0 ? (
        <div className={cn(view === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4")}>
          {paged.map(p => <ProductCard key={p.id} product={p} view={view} />)}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-soft">
          <p className="text-lg font-semibold">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          <Button className="mt-4" onClick={() => { setQuery(""); setCat("All"); }}>Clear filters</Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
            <Button key={n} variant={page===n?"accent":"outline"} size="icon" onClick={() => setPage(n)}>{n}</Button>
          ))}
        </div>
      )}
    </div>
  );
}
