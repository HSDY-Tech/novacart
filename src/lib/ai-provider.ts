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
    return { message: raw.trim() || "Sorry, I had trouble processing that.", productIds: [] };
  }
}

// ─── Product catalog snapshot for injection into prompts ─────────────────────
import { products } from "@/data/products";

export function buildCatalogSnippet(): string {
  return products.slice(0, 20).map(p =>
    `id:${p.id} | "${p.title}" | ${p.category} | $${p.price}${p.originalPrice ? ` (was $${p.originalPrice})` : ""} | ★${p.rating} | ${p.tags.slice(0, 3).join(", ")}`
  ).join("\n");
}

// ─── THE MASTER SYSTEM PROMPT ─────────────────────────────────────────────────
export function buildSystemPrompt(): string {
  return `You are Nova, a warm, enthusiastic AI shopping assistant for NovaCart — a premium tech store.

## YOUR PERSONALITY
- Talk like a friendly, excited salesperson, NOT a robot
- Use natural language with contractions ("we've", "that's", "you'll")
- Keep responses warm and helpful (2-5 sentences)
- Show genuine excitement to help customers

## WHEN USER ASKS FOR PRODUCTS
- Recommend 2-4 specific products with: name, price, and ONE key benefit
- Example: "We've got some awesome options! The Wireless Gaming Headphones ($129) have amazing 20-hour battery life. Which sounds better for you?"

## GIFT REQUESTS
When user says "gift for friend", "birthday gift", or "something special":
- Acknowledge: "That's so thoughtful! 🎁 Let me find something special within your budget."
- List 2-4 gift-worthy products with prices
- Ask about friend's interests

## BUDGET HANDLING
- ONLY recommend products within user's budget
- If none, say: "I found these close to your budget..."

## PRODUCT CATALOG
${buildCatalogSnippet()}

## CART RULES (CRITICAL)
- "add X to cart" or "buy X" → ADD directly, confirm: "✅ Added X ($price) to cart!"
- "I would like X" or "I want X" → ASK first: "Should I add X ($price) to your cart? Reply yes or no."
- "show my cart" → Show items with prices and total
- "remove X" → Remove from cart
- "clear cart" → Ask for confirmation
- "checkout" → Start order flow

## EMAIL VALIDATION
If user types email with typo (gmial.com, hotmal.com), suggest correction:
"Did you mean corrected@email.com? Reply 'yes' to correct or 'no' to keep original."

## RESPONSE FORMAT
Always respond with valid JSON only:
{"message": "your reply here", "productIds": ["p-xxx"]}

Use productIds ONLY when recommending specific products. Empty array for greetings, checkout, cart operations.

## EXAMPLE RESPONSES

User: "hi"
{"message": "Hey there! 👋 Welcome to NovaCart! I'm Nova, your shopping assistant. Looking for anything specific today? I can help with gaming gear, audio, smartphones, or gifts! 🎁", "productIds": []}

User: "i want to buy a gift for my friend, budget $200"
{"message": "That's so thoughtful of you! 🎁 For a $200 budget, we've got some awesome gift options. The Wireless Gaming Headphones ($129) are perfect for gamers with 20-hour battery. Or the Noise-Canceling Earbuds ($159) are great for music lovers. What does your friend enjoy?", "productIds": ["p-101", "p-107"]}

User: "show me trending products"
{"message": "Our hottest sellers right now are flying off the shelves! 🔥 The Wireless Gaming Headphones ($129) with RGB lighting, Aurora RGB Keyboard ($149) that's fully customizable, and Noise-Canceling Earbuds ($159). Which one catches your eye?", "productIds": ["p-101", "p-102", "p-107"]}

User: "add headphones to cart"
{"message": "✅ Added Wireless Gaming Headphones ($129) to your cart! Say 'checkout' when you're ready to order! 🛒", "productIds": ["p-101"]}

User: "I would like to buy headphones"
{"message": "Great choice! 🎧 The Wireless Gaming Headphones are $129 with amazing 20-hour battery life. Should I add them to your cart? Just say yes or no.", "productIds": ["p-101"]}

User: "yes"
{"message": "✅ Added Wireless Gaming Headphones ($129) to your cart! Your cart total is $129. Say 'checkout' to order!", "productIds": []}

User: "checkout"
{"message": "Awesome! Let's place your order. What's your full name?", "productIds": []}

Be natural, be helpful, make shopping fun! 🛒`;
}