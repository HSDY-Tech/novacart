/**
 * PATH: src/lib/providers/gemini.ts
 * ACTION: REPLACE existing file
 *
 * Fix: changed model from "gemini-1.5-flash" → "gemini-2.0-flash"
 */
import type { AIProvider, ChatMessage, ChatResponse, ProviderConfig, AIProviderOptions } from "@/lib/ai-provider";
import { retryWithBackoff, parseJSONResponse, buildSystemPrompt } from "@/lib/ai-provider";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;
  private model: string;

  constructor(cfg: ProviderConfig = {}) {
    this.apiKey =
      cfg.apiKey ??
      process.env.NEXT_GEMINI_API_KEY ??
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ??
      "";
    // gemini-2.0-flash is the current stable free-tier model (2026)
    this.model = cfg.model ?? "gemini-2.0-flash";
  }

  isConfigured() { return !!this.apiKey; }

  async chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse> {
    if (!this.isConfigured()) throw new Error("Gemini not configured — set NEXT_GEMINI_API_KEY");

    return retryWithBackoff(async () => {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: this.model });

      const systemPrompt = buildSystemPrompt();

      // Separate history from the latest message
      const historyMsgs = messages.slice(0, -1);
      const latestMsg   = messages[messages.length - 1];

      // Build Gemini-format history, prepending a system-prompt exchange
      const geminiHistory = [
        {
          role: "user" as const,
          parts: [{ text: `[System]\n${systemPrompt}\n\nPlease acknowledge briefly.` }]
        },
        {
          role: "model" as const,
          parts: [{ text: '{"message":"Understood! I\'m Nova, ready to help.","productIds":[]}' }]
        },
        ...historyMsgs.map(m => ({
          role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
          parts: [{ text: m.content }]
        }))
      ];

      const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
          temperature:      opts?.temperature ?? 0.7,
          maxOutputTokens:  opts?.maxTokens   ?? 300,
          responseMimeType: "application/json"
        }
      });

      const result = await chat.sendMessage(latestMsg?.content ?? "");
      return parseJSONResponse(result.response.text());
    }, { retries: opts?.retries ?? 2, retryDelay: opts?.retryDelay ?? 800 });
  }

  async testConnection() { return this.isConfigured(); }
}
