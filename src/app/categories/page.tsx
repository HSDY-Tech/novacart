import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/data/products";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  const cats = getCategories();
  return (
    <div className="container py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Browse</p>
      <h1 className="mt-1 mb-8 text-3xl font-display font-bold">All Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map(cat => (
          <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative overflow-hidden rounded-2xl border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
            {cat.featuredImage && (
              <div className="relative h-36 overflow-hidden">
                <Image src={cat.featuredImage} alt={cat.name} fill sizes="300px" className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground">{cat.count} products</p>
                </div>
                <ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
