import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Database, Lock, MessageSquare, Search, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUGGESTED_PROMPTS } from "@/ai/prompts";
import { RESTRICTED_SITES } from "@/ai/restriction-rules";

export const metadata: Metadata = { title: "AI Shopping Assistant" };

const steps = [
  { icon: MessageSquare, n: "01", title: "You Ask", desc: "Type any product question in natural language — the AI understands context and intent." },
  { icon: Lock, n: "02", title: "Safety Check", desc: "External marketplace requests (Amazon, eBay, etc.) are blocked instantly before any API call." },
  { icon: Database, n: "03", title: "Vector Search", desc: "Your query is embedded and matched against the Pinecone product index for semantic similarity." },
  { icon: Search, n: "04", title: "AI Response", desc: "GPT or Gemini generates a natural, personalized response with specific product recommendations." },
  { icon: Zap, n: "05", title: "Instant Results", desc: "Product cards appear inline in the chat — click to view details or add to cart immediately." }
];

export default function AIAssistantPage() {
  return (
    <div className="container py-10">
      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center mb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">AI Features</p>
          <h1 className="text-4xl font-display font-bold leading-tight">Your Personal AI Shopping Assistant</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            NovaCart AI uses a Retrieval-Augmented Generation (RAG) pipeline — Pinecone vector search + OpenAI embeddings — to understand your needs and surface exactly the right products. 
            Powered by GPT-3.5 with Gemini as fallback.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="accent"><Link href="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/30"><Bot className="h-5 w-5 text-accent" /></div>
            <div><p className="text-sm font-bold">NovaCart AI</p><p className="text-xs text-emerald-400">● Active · RAG-powered</p></div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map(p => (
                <span key={p} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">{p}</span>
              ))}
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm">Find wireless headphones under $200</div>
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-slate-200">
              Great choice! The <span className="text-accent font-semibold">NovaSound Wireless Gaming Headphones</span> at $129 (was $179) are trending right now with a ★4.7 rating. They feature 20-hour battery and AI noise isolation. 🎧
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Architecture</p>
        <h2 className="text-3xl font-display font-bold mb-8">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ icon: Icon, n, title, desc }) => (
            <div key={n} className="rounded-2xl border bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon className="h-4 w-4" /></div>
                <span className="text-2xl font-display font-bold text-muted-foreground/20">{n}</span>
              </div>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Restrictions */}
      <div className="grid gap-6 sm:grid-cols-2 mb-16">
        <div className="rounded-2xl border bg-white p-6 shadow-soft">
          <Lock className="h-8 w-8 text-red-400 mb-3" />
          <h3 className="font-bold mb-2">Marketplace Restrictions</h3>
          <p className="text-sm text-muted-foreground mb-4">These platforms are blocked instantly — no API calls made:</p>
          <div className="flex flex-wrap gap-2">
            {RESTRICTED_SITES.map(s => (
              <span key={s} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">{s}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-soft">
          <Sparkles className="h-8 w-8 text-accent mb-3" />
          <h3 className="font-bold mb-2">AI Provider Stack</h3>
          <p className="text-sm text-muted-foreground mb-4">3-tier fallback ensures the assistant always responds:</p>
          <div className="space-y-2">
            {[
              { tier: "Tier 1", label: "Pinecone RAG + OpenAI GPT-3.5", color: "bg-emerald-50 text-emerald-700" },
              { tier: "Tier 2", label: "Gemini Flash / Groq LLaMA", color: "bg-blue-50 text-blue-700" },
              { tier: "Tier 3", label: "Local regex engine (always on)", color: "bg-secondary text-muted-foreground" }
            ].map(({ tier, label, color }) => (
              <div key={tier} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${color}`}>
                <span className="font-bold">{tier}</span>
                <span>→ {label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
