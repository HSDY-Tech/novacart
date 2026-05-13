import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, ShoppingBag, Star, Truck, Shield } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { getProductById, products } from "@/data/products";
import { getRelatedProducts } from "@/ai/product-search";
import { formatCurrency, percentageOff } from "@/utils/format";
import AddToCartSection from "./add-to-cart-section";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() { return products.map(p => ({ id: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProductById(id);
  if (!p) return { title: "Not Found" };
  return { title: p.title, description: p.description, openGraph: { images: [p.image] } };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);
  const discount = percentageOff(product.price, product.originalPrice);

  return (
    <div className="container py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="accent">{product.category}</Badge>
            {product.isTrending && <Badge>Trending</Badge>}
            {discount && <Badge variant="success">-{discount}% off</Badge>}
          </div>
          <h1 className="text-3xl font-display font-bold leading-snug sm:text-4xl">{product.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.brand}</p>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({length: 5}, (_,i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
            <span className={`font-medium ${product.stock < 10 ? "text-orange-600" : "text-emerald-600"}`}>
              {product.stock < 10 ? `Only ${product.stock} left` : "In Stock"}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice && <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>}
          </div>

          <p className="mt-4 leading-relaxed text-muted-foreground">{product.longDescription}</p>

          <AddToCartSection product={product} />

          {/* Guarantees */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[{icon: Truck, t:"Free shipping", d:"Orders over $300"},{icon: Shield, t:"Secure payment", d:"SSL encrypted"}].map(({icon:Icon,t,d}) => (
              <div key={t} className="flex items-center gap-2.5 rounded-2xl bg-secondary p-3">
                <Icon className="h-4 w-4 text-accent shrink-0" />
                <div><p className="text-xs font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Key Features</h3>
              <ul className="space-y-1.5">
                {product.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Specs */}
      {Object.keys(product.specs).length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-2xl font-display font-bold">Specifications</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(product.specs).map(([k,v]) => (
              <div key={k} className="rounded-2xl border bg-white p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                <p className="mt-1 font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-2xl font-display font-bold">You May Also Like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
