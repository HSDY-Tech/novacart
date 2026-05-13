// ─────────────────────────────────────────────────────────────────────────────
// Core AI provider abstraction — supports conversation history
// ─────────────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatResponse = { message: string; productIds: string[] };
export type ProviderConfig = {
  apiKey?: string; model?: string; temperature?: number;
  maxTokens?: number; baseUrl?: string; retries?: number; retryDelay?: number;
};
export type AIProviderOptions = {
  temperature?: number; maxTokens?: number; retries?: number; retryDelay?: number;
};

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
  chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse>;
  testConnection(): Promise<boolean>;
}

export class AIProviderFactory {
  private static providers = new Map<string, AIProvider>();
  static register(n: string, p: AIProvider) { this.providers.set(n.toLowerCase(), p); }
  static getProvider(n?: string) { return n ? this.providers.get(n.toLowerCase()) ?? null : this.getConfiguredProvider(); }
  static getConfiguredProvider(): AIProvider | null {
    const pref = (process.env.AI_PROVIDER ?? "groq").toLowerCase();
    for (const [, p] of this.providers) if (p.name.toLowerCase() === pref && p.isConfigured()) return p;
    for (const [, p] of this.providers) if (p.isConfigured()) return p;
    return null;
  }
  static listProviders() { return Array.from(this.providers.keys()); }
  static listConfiguredProviders() {
    return Array.from(this.providers.entries()).filter(([, p]) => p.isConfigured()).map(([n]) => n);
  }
}

export async function retryWithBackoff<T>(fn: () => Promise<T>, opts: { retries?: number; retryDelay?: number } = {}): Promise<T> {
  const max = opts.retries ?? 2;
  const delay = opts.retryDelay ?? 800;
  for (let i = 0; i < max; i++) {
    try { return await fn(); } catch (e) {
      if (i === max - 1) throw e;
      await new Promise(r => setTimeout(r, delay * 2 ** i));
    }
  }
  throw new Error("Max retries exceeded");
}

export function parseJSONResponse(raw: string): ChatResponse {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      message: typeof parsed.message === "string" ? parsed.message : cleaned,
      productIds: Array.isArray(parsed.productIds)
        ? parsed.productIds.filter((x: unknown) => typeof x === "string")
        : []
    };
  } catch {
    // If JSON parse fails, return the raw text with no products
    return { message: raw.trim() || "Sorry, I had trouble processing that.", productIds: [] };
  }
}

// ─── Product catalog snapshot for injection into prompts ─────────────────────
import { products } from "@/data/products";

export function buildCatalogSnippet(): string {
  return products.map(p =>
    `id:${p.id} | "${p.title}" | ${p.category} | $${p.price}${p.originalPrice ? ` (was $${p.originalPrice})` : ""} | ★${p.rating} | ${p.tags.slice(0,4).join(", ")}`
  ).join("\n");
}

// ─── THE MASTER SYSTEM PROMPT ─────────────────────────────────────────────────
export function buildSystemPrompt(): string {
  return `You are Nova, a friendly and persuasive AI shopping assistant for NovaCart — a premium tech store.

## PERSONALITY
Warm, helpful, knowledgeable. Like a great human salesperson who genuinely wants to find the right product. Never robotic, never pushy.

## STRICT CONVERSATION RULES
1. Keep replies SHORT — 2-4 sentences max. Never write walls of text.
2. For greetings (Hi, Hello, Hey, what's up) → respond warmly and ask what they need. DO NOT show products.
3. For vague questions → ask a clarifying question to understand their need.
4. For product requests → recommend 1-3 products MAX with specific name, price, and one key benefit.
5. ALWAYS remember the conversation history — refer back to earlier messages naturally.
6. If user asks to "buy", "purchase", or "add to cart" → guide them to click the product card, you cannot do it directly.
7. For non-store questions → answer briefly and steer back to shopping helpfully.
8. Never list ALL products. Be selective and confident in your recommendations.

## OUR PRODUCT CATALOG
${buildCatalogSnippet()}

## RESPONSE FORMAT
You MUST always respond with valid JSON only — no extra text, no markdown:
{"message": "your conversational reply here", "productIds": ["p-xxx"]}

- "productIds": include ONLY when user asks for specific products. Empty array [] for greetings, general chat, or non-product answers.

## EXAMPLES
User "Hi" → {"message": "Hey! 👋 Welcome to NovaCart. I'm Nova, your personal shopping assistant. What are you looking for today?", "productIds": []}
User "show me headphones" → {"message": "We've got great options! The Wireless Gaming Headphones ($129, ★4.7) are our bestseller with 20-hour battery. Or if you prefer earbuds, the Noise-Canceling Earbuds Air ($159) have amazing ANC. Which style suits you?", "productIds": ["p-101", "p-107"]}
User "which is cheaper?" → {"message": "The Budget Studio Headphones are our most affordable at just $59 — great sound quality for the price. The Gaming Headphones at $129 are mid-range. Both are solid choices depending on your budget!", "productIds": ["p-115", "p-101"]}
User "can you buy it for me?" → {"message": "I can't place orders directly, but it's really easy! Just click on the product card below and hit 'Add to Cart' — checkout takes about 2 minutes. Want me to help you pick the right one first?", "productIds": []}
User "tell me about the laptop" → {"message": "The SlimBook Air 14 is our flagship laptop — super thin at 18-hour battery life, 16GB RAM and a stunning 2.8K display, all for $1,199. It's perfect for students, professionals, and creatives. Want to see it?", "productIds": ["p-110"]}`;
}
