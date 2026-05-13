import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, CreditCard, Laptop, Rocket, Search, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Services" };

const services = [
  { icon: Smartphone, title: "Ecommerce Frontend", desc: "Next.js storefronts with product catalogs, cart, checkout, and dashboard UI." },
  { icon: Bot, title: "AI Chatbot Integration", desc: "Product-aware assistants with semantic search, recommendations, and safe restrictions." },
  { icon: Search, title: "RAG-Powered Search", desc: "Pinecone vector DB + OpenAI embeddings for intelligent product discovery." },
  { icon: CreditCard, title: "Checkout Architecture", desc: "Stripe-ready frontend checkout screens for easy payment integration." },
  { icon: Laptop, title: "UI/UX Design", desc: "Premium landing pages, dashboards, and responsive component libraries." },
  { icon: Rocket, title: "Deployment & Optimization", desc: "Vercel/Netlify deployments, image optimization, SEO metadata, and performance tuning." }
];

export default function ServicesPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">What We Build</p>
        <h1 className="mt-2 text-4xl font-display font-bold">AI-Powered Ecommerce Services</h1>
        <p className="mt-4 text-muted-foreground">Everything you need to launch a modern, intelligent online store — from product catalog to AI checkout assistant.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group rounded-2xl border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card hover:border-accent/30">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-violet-600 px-8 py-12 text-white text-center">
        <h2 className="text-3xl font-display font-bold">Ready to build your store?</h2>
        <p className="mt-3 text-white/80 max-w-lg mx-auto">This is a portfolio demo. Connect real APIs, authentication, payments, and inventory management to go live.</p>
        <Button asChild className="mt-6 bg-white text-accent hover:bg-white/90 font-bold">
          <Link href="/contact">Start a Project <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
