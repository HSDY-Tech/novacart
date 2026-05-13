/**
 * Local conversational fallback — only runs when all AI providers fail.
 * Handles natural conversation without spamming product lists.
 */
import { getProductById, getTrendingProducts, getCategories } from "@/data/products";
import { searchProducts, compareProductsFromQuery } from "@/ai/product-search";
import { containsRestrictedSite, RESTRICTION_RESPONSE } from "@/ai/restriction-rules";
import { SUGGESTED_PROMPTS } from "@/ai/prompts";
import { formatCurrency } from "@/utils/format";
// import type { Product } from "@/types/product";

export type ChatIntent =
  | "greeting" | "restricted" | "compare" | "trending" | "product_request"
  | "question" | "purchase_help" | "thanks" | "capabilities" | "search" | "unknown";

export type ChatbotResponse = {
  intent: ChatIntent;
  message: string;
  productIds: string[];
  suggestions?: string[];
};

export { SUGGESTED_PROMPTS };

// ─── Intent detection ─────────────────────────────────────────────────────────
function detectIntent(q: string): ChatIntent {
  const t = q.toLowerCase().trim();
  if (!t) return "greeting";
  if (containsRestrictedSite(t)) return "restricted";
  if (/^(hi+|hello+|hey+|sup|good (morning|evening|afternoon)|howdy|greetings|yo|what'?s up)\b/.test(t)) return "greeting";
  if (/\b(thank(s| you)|thx|cheers|appreciate)\b/.test(t)) return "thanks";
  if (/\b(what can you|what do you|your capabilities|help me|how does this work|what are you)\b/.test(t)) return "capabilities";
  if (/\b(buy|purchase|order|checkout|add to cart|how to (buy|purchase|order))\b/.test(t)) return "purchase_help";
  if (/\b(compare|versus|vs\.?|difference between|which is better)\b/.test(t)) return "compare";
  if (/\b(trending|popular|hot|new arrivals|bestsell|most (sold|bought|popular))\b/.test(t)) return "trending";
  if (/\b(show|find|search|list|any|have you|do you (have|sell|stock))\b/.test(t)) return "product_request";
  if (/\b(spec|battery|warranty|stock|rating|how (much|many)|tell me about|details|info|price of)\b/.test(t)) return "question";
  // Check if a category or product keyword appears
  const hasCat = getCategories().some(c => t.includes(c.name.toLowerCase()) || t.includes(c.name.toLowerCase().replace(/s$/,"")));
  if (hasCat) return "product_request";
  return "search";
}

// ─── Budget extraction ────────────────────────────────────────────────────────
function extractMaxPrice(q: string): number | undefined {
  const m = q.match(/(?:under|below|less than|max|around|budget of?)\s*\$?(\d+)/i);
  return m ? Number(m[1]) : undefined;
}

// ─── Main response generator ──────────────────────────────────────────────────
export function generateChatbotResponse(query: string): ChatbotResponse {
  const q = query.trim();
  const intent = detectIntent(q);

  // ── Greetings ────────────────────────────────────────────────────────────────
  if (intent === "greeting") {
    const greetings = [
      "Hey there! 👋 Welcome to NovaCart. I'm Nova, your personal shopping assistant. What can I help you find today?",
      "Hello! I'm Nova, NovaCart's AI assistant. Looking for something specific, or want me to suggest some top picks?",
      "Hi! Great to see you at NovaCart 😊 I can help you find products, compare options, or answer any questions. What do you need?"
    ];
    return { intent, message: greetings[Math.floor(Math.random() * greetings.length)], productIds: [], suggestions: SUGGESTED_PROMPTS };
  }

  // ── Restricted marketplace ───────────────────────────────────────────────────
  if (intent === "restricted") {
    return { intent, message: RESTRICTION_RESPONSE, productIds: [], suggestions: SUGGESTED_PROMPTS };
  }

  // ── Thanks ───────────────────────────────────────────────────────────────────
  if (intent === "thanks") {
    return { intent, message: "Happy to help! 😊 Is there anything else I can assist you with?", productIds: [] };
  }

  // ── Capabilities ─────────────────────────────────────────────────────────────
  if (intent === "capabilities") {
    return {
      intent, productIds: [],
      message: "I can help you: find products by type or budget, compare items side by side, explain specs, and guide you through checkout. Just ask me anything — like 'show me wireless headphones under $150' or 'compare the two smartphones'. What would you like to know?",
      suggestions: SUGGESTED_PROMPTS
    };
  }

  // ── Purchase help ─────────────────────────────────────────────────────────────
  if (intent === "purchase_help") {
    return {
      intent, productIds: [],
      message: "I can't place orders directly, but it's easy! Click on any product card to view it, then hit 'Add to Cart'. Head to the cart icon at the top to checkout — the whole process takes about 2 minutes. Would you like me to help you pick the right product first?"
    };
  }

  // ── Trending ─────────────────────────────────────────────────────────────────
  if (intent === "trending") {
    const items = getTrendingProducts(3);
    const names = items.map(p => `${p.title} ($${p.price})`).join(", ");
    return {
      intent, productIds: items.map(p => p.id),
      message: `Right now our most popular items are: ${names}. Any of these catch your eye?`
    };
  }

  // ── Comparison ───────────────────────────────────────────────────────────────
  if (intent === "compare") {
    const items = compareProductsFromQuery(q);
    if (items.length >= 2) {
      const [a, b] = items;
      return {
        intent, productIds: items.map(p => p.id),
        message: `Here's a quick comparison: **${a.title}** at $${a.price} (★${a.rating}) vs **${b.title}** at $${b.price} (★${b.rating}). The ${a.price < b.price ? a.title : b.title} is more budget-friendly. Which matters more to you — price or features?`
      };
    }
  }

  // ── Product request or search ─────────────────────────────────────────────────
  const maxPrice = extractMaxPrice(q);
  const catMatch = getCategories().find(c => {
    const name = c.name.toLowerCase();
    return q.toLowerCase().includes(name) || q.toLowerCase().includes(name.replace(/s$/, ""));
  });

  const results = searchProducts(q, {
    limit: 3,
    category: catMatch?.name,
    maxPrice: maxPrice ?? (q.toLowerCase().includes("budget") || q.toLowerCase().includes("cheap") ? 150 : undefined)
  });

  // ── Specific product question ─────────────────────────────────────────────────
  if (intent === "question" && results.length) {
    const p = results[0];
    const topSpec = Object.entries(p.specs)[0];
    return {
      intent, productIds: [p.id],
      message: `The **${p.title}** is priced at ${formatCurrency(p.price)} with a ★${p.rating} rating and ${p.stock} units in stock. ${topSpec ? `Key spec: ${topSpec[0]} — ${topSpec[1]}.` : ""} Want me to compare it with something else?`
    };
  }

  // ── Found products ────────────────────────────────────────────────────────────
  if (results.length) {
    const top = results[0];
    const rest = results.slice(1);
    let msg = `Our best match is the **${top.title}** at ${formatCurrency(top.price)} — ${top.description.split(".")[0]}.`;
    if (rest.length) msg += ` I also found ${rest.map(p => `${p.title} ($${p.price})`).join(" and ")}.`;
    msg += " Want me to compare these or tell you more about any of them?";
    return { intent: "product_request", productIds: results.map(p => p.id), message: msg };
  }

  // ── No results ────────────────────────────────────────────────────────────────
  const fallback = getProductById("p-107");
  return {
    intent: "unknown", productIds: fallback ? [fallback.id] : [],
    message: "I didn't find an exact match for that. We carry Audio, Gaming, Smartphones, Laptops, Cameras, Wearables, Home Office, and Accessories. Could you tell me more about what you're looking for?",
    suggestions: SUGGESTED_PROMPTS
  };
}
