import type { Metadata } from "next";
import { Bot, Code2, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  const features = [
    { icon: Bot, title: "AI Shopping Assistant", desc: "An intelligent chatbot that understands natural language to help you find products, compare options, and get personalized recommendations." },
    { icon: Sparkles, title: "Premium UI", desc: "Clean, modern design built with Next.js 15, Tailwind CSS, and Framer Motion for a polished, production-ready experience." },
    { icon: Code2, title: "Full-Stack Ready", desc: "Architecture designed for easy backend integration with APIs, databases, payment gateways, and authentication systems." },
    { icon: Zap, title: "RAG-Powered Search", desc: "Pinecone vector database + OpenAI embeddings for semantic product search that understands what you really mean." }
  ];
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">About</p>
        <h1 className="mt-2 text-4xl font-display font-bold">Built to Showcase Modern AI Commerce</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">NovaCart is a portfolio-grade ecommerce frontend demonstrating what's possible when AI meets great design. Every interaction is intentional, every component production-ready.</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border bg-white p-6 shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon className="h-5 w-5" /></div>
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
