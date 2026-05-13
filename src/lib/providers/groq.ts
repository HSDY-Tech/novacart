/**
 * Groq Provider — primary AI (fastest, free tier)
 * Uses llama-3.3-70b-versatile for high-quality conversational responses
 */
import type { AIProvider, ChatMessage, ChatResponse, ProviderConfig, AIProviderOptions } from "@/lib/ai-provider";
import { retryWithBackoff, parseJSONResponse, buildSystemPrompt } from "@/lib/ai-provider";

export class GroqProvider implements AIProvider {
  name = "groq";
  private apiKey: string;
  private model: string;

  constructor(cfg: ProviderConfig = {}) {
    this.apiKey = cfg.apiKey ?? process.env.GROQ_API_KEY ?? "";
    // Use the best free model - versatile is much better for chat than instant
    this.model = cfg.model ?? "llama-3.3-70b-versatile";
  }

  isConfigured() { return !!this.apiKey; }

  async chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse> {
    if (!this.isConfigured()) throw new Error("Groq not configured — set GROQ_API_KEY");

    return retryWithBackoff(async () => {
      const { OpenAI } = await import("openai");
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: "https://api.groq.com/openai/v1"
      });

      const res = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          // Pass full conversation history for context
          ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
        ],
        temperature: opts?.temperature ?? 0.7,
        max_tokens: opts?.maxTokens ?? 300,
        response_format: { type: "json_object" }
      });

      const content = res.choices[0]?.message?.content ?? "{}";
      return parseJSONResponse(content);
    }, { retries: opts?.retries ?? 2, retryDelay: opts?.retryDelay ?? 500 });
  }

  async testConnection() {
    try {
      if (!this.isConfigured()) return false;
      const { OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: this.apiKey, baseURL: "https://api.groq.com/openai/v1" });
      await client.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5
      });
      return true;
    } catch { return false; }
  }
}
