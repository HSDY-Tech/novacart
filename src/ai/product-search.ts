import { products, productsByCategory, getCategories } from "@/data/products";
import type { Product } from "@/types/product";

const STOP = new Set(["a","an","and","are","best","can","find","for","i","is","me","of","on","please","show","the","to","with","get","some","give","want"]);

export const tokenize = (s: string) =>
  s.toLowerCase().replace(/[^\w\s-]/g," ").split(/\s+/).filter(t => t.length > 1 && !STOP.has(t));

function score(p: Product, query: string, tokens: string[]): number {
  const q = query.toLowerCase();
  const title = p.title.toLowerCase();
  const hay = [p.title,p.category,p.brand,p.description,p.tags.join(" "),p.features.join(" ")].join(" ").toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (title.includes(t)) s += 8;
    if (p.category.toLowerCase().includes(t)) s += 6;
    if (p.brand.toLowerCase().includes(t)) s += 4;
    if (p.tags.some(tag => tag.toLowerCase().includes(t))) s += 5;
    if (hay.includes(t)) s += 2;
  }
  if (/budget|cheap|affordable/.test(q) && p.price <= 150) s += 8;
  if (/premium|pro|flagship/.test(q) && p.price >= 400) s += 5;
  if (/trending|popular|hot/.test(q) && p.isTrending) s += 9;
  if (/featured/.test(q) && p.isFeatured) s += 7;
  return s + p.rating / 10;
}

export function searchProducts(query: string, opts: { limit?: number; category?: string; maxPrice?: number } = {}) {
  const tokens = tokenize(query);
  let base = opts.category ? productsByCategory(opts.category) : products;
  if (typeof opts.maxPrice === "number") { const max = opts.maxPrice; base = base.filter(p => p.price <= max); }
  if (!tokens.length) return base.slice(0, opts.limit ?? 6);
  return base
    .map(p => ({ p, s: score(p, query, tokens) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, opts.limit ?? 6)
    .map(x => x.p);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(p => p.id !== product.id)
    .map(p => ({ p, s: (p.category === product.category ? 5 : 0) + p.tags.filter(t => product.tags.includes(t)).length * 2 + p.rating / 10 }))
    .sort((a, b) => b.s - a.s).slice(0, limit).map(x => x.p);
}

export function compareProductsFromQuery(query: string): Product[] {
  const direct = searchProducts(query, { limit: 3 });
  if (direct.length >= 2) return direct;
  const q = query.toLowerCase();
  const cat = getCategories().find(c => q.includes(c.name.toLowerCase()) || q.includes(c.name.toLowerCase().replace(/s$/, "")));
  if (cat) return productsByCategory(cat.name).sort((a,b) => b.rating - a.rating).slice(0, 3);
  return products.sort((a,b) => b.rating - a.rating).slice(0, 3);
}
