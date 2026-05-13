/**
 * PATH: src/app/api/chat/route.ts
 * ACTION: REPLACE existing file
 *
 * Fix: removed RAG/OpenAI from the pipeline (OpenAI quota exceeded).
 * Pipeline is now: Groq → Gemini → OpenRouter → Local fallback
 */
import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/ai-provider";
import { AIProviderFactory } from "@/lib/ai-provider";
import { GeminiProvider }     from "@/lib/providers/gemini";
import { GroqProvider }        from "@/lib/providers/groq";
import { OpenRouterProvider }  from "@/lib/providers/openrouter";
import { generateChatbotResponse } from "@/ai/chatbot-engine";
import { containsRestrictedSite }  from "@/ai/restriction-rules";

// ─── Register providers once ──────────────────────────────────────────────────
let initialized = false;
function init() {
  if (initialized) return;
  // Priority order: Groq (fastest, free) → Gemini (free) → OpenRouter
  AIProviderFactory.register("groq",        new GroqProvider());
  AIProviderFactory.register("gemini",      new GeminiProvider());
  AIProviderFactory.register("openrouter",  new OpenRouterProvider());
  initialized = true;
}

// ─── POST /api/chat ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  init();

  // Parse body
  let body: Record<string, unknown> = {};
  try { body = await req.json(); }
  catch {
    return NextResponse.json(
      { message: "Invalid JSON body.", productIds: [] },
      { status: 400 }
    );
  }

  // Accept full message history (new) OR single userInput (legacy)
  let messages: ChatMessage[] = [];

  if (Array.isArray(body.messages) && body.messages.length > 0) {
    messages = body.messages as ChatMessage[];
  } else if (typeof body.userInput === "string" && body.userInput.trim()) {
    messages = [{ role: "user", content: body.userInput.trim() }];
  } else {
    return NextResponse.json(
      { message: "Please provide a message.", productIds: [] },
      { status: 400 }
    );
  }

  // Latest user turn (for restriction check + local fallback)
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  const latestInput = lastUserMsg?.content ?? "";

  // ── Tier 0: Instant restriction check (no API call) ───────────────────────
  if (containsRestrictedSite(latestInput)) {
    const local = generateChatbotResponse(latestInput);
    return NextResponse.json({ message: local.message, productIds: [] });
  }

  // ── Tier 1: AI providers (Groq → Gemini → OpenRouter) ─────────────────────
  const provider = AIProviderFactory.getConfiguredProvider();

  if (provider) {
    try {
      console.log(`🤖 Provider: ${provider.name} | History depth: ${messages.length}`);

      const res = await provider.chat(messages, {
        retries:     2,
        retryDelay:  500,
        temperature: 0.7,
        maxTokens:   300
      });

      // Guard against empty / malformed responses
      if (res.message && res.message.trim().length > 3) {
        return NextResponse.json(res);
      }

      console.warn(`⚠️  ${provider.name} returned empty message — falling back`);
    } catch (e) {
      console.warn(`⚠️  Provider ${provider.name} failed:`, e instanceof Error ? e.message : e);
    }
  } else {
    console.warn("⚠️  No AI provider configured. Add GROQ_API_KEY or NEXT_GEMINI_API_KEY to .env.local");
  }

  // ── Tier 2: Local conversational fallback (always works) ──────────────────
  console.log("🏠 Using local fallback");
  const local = generateChatbotResponse(latestInput);
  return NextResponse.json({ message: local.message, productIds: local.productIds });
}

// ─── GET /api/chat — health / debug ──────────────────────────────────────────
export async function GET() {
  init();
  const provider    = AIProviderFactory.getConfiguredProvider();
  const configured  = AIProviderFactory.listConfiguredProviders();

  return NextResponse.json({
    status:            "ok",
    activeProvider:    provider?.name ?? "none — using local fallback",
    configuredProviders: configured,
    allProviders:      AIProviderFactory.listProviders(),
    hint: configured.length === 0
      ? "Add GROQ_API_KEY to .env.local for AI responses"
      : `${provider?.name} is active and responding`,
    openAiNote:        "OpenAI is NOT used for chat. It is only needed for npm run upsert (Pinecone indexing).",
    timestamp:         new Date().toISOString()
  });
}
