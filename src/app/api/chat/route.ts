/**
 * API Route for NovaCart AI Chatbot
 * Priority: Groq → Gemini → OpenRouter → Local fallback
 */
import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/ai-provider";
import { AIProviderFactory } from "@/lib/ai-provider";
import { GeminiProvider } from "@/lib/providers/gemini";
import { GroqProvider } from "@/lib/providers/groq";
import { OpenRouterProvider } from "@/lib/providers/openrouter";
import { generateChatbotResponse } from "@/ai/chatbot-engine";
import { containsRestrictedSite } from "@/ai/restriction-rules";

// Register providers
let initialized = false;
function init() {
  if (initialized) return;
  AIProviderFactory.register("groq", new GroqProvider());
  AIProviderFactory.register("gemini", new GeminiProvider());
  AIProviderFactory.register("openrouter", new OpenRouterProvider());
  initialized = true;
}

export async function POST(req: NextRequest) {
  init();

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body.", productIds: [] },
      { status: 400 }
    );
  }

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

  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  const latestInput = lastUserMsg?.content ?? "";

  // Check restricted sites
  if (containsRestrictedSite(latestInput)) {
    const local = generateChatbotResponse(latestInput);
    return NextResponse.json({ message: local.message, productIds: [] });
  }

  // Try Groq first (it should work if API key is set)
  const provider = AIProviderFactory.getConfiguredProvider();
  
  console.log(`🔍 Using provider: ${provider?.name || "none"}`);

  if (provider) {
    try {
      console.log(`🤖 Attempting ${provider.name}...`);
      const res = await provider.chat(messages, {
        retries: 2,
        retryDelay: 500,
        temperature: 0.8,
        maxTokens: 400
      });

      if (res.message && res.message.trim().length > 10) {
        console.log(`✅ ${provider.name} responded successfully`);
        return NextResponse.json(res);
      }
    } catch (e) {
      console.error(`❌ ${provider.name} failed:`, e instanceof Error ? e.message : e);
    }
  }

  // Fallback to local engine
  console.log("🏠 Using local fallback");
  const local = generateChatbotResponse(latestInput);
  return NextResponse.json({ message: local.message, productIds: local.productIds });
}

export async function GET() {
  init();
  const provider = AIProviderFactory.getConfiguredProvider();
  const configured = AIProviderFactory.listConfiguredProviders();

  return NextResponse.json({
    status: "ok",
    activeProvider: provider?.name ?? "none — using local fallback",
    configuredProviders: configured,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    groqKeyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + "..." : "none",
    message: configured.length === 0 
      ? "⚠️ Add GROQ_API_KEY to .env.local for AI responses" 
      : `✅ ${provider?.name} is active`,
    timestamp: new Date().toISOString()
  });
}