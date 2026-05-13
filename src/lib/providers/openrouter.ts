import type { AIProvider, ChatMessage, ChatResponse, ProviderConfig, AIProviderOptions } from "@/lib/ai-provider";
import { retryWithBackoff, parseJSONResponse, buildSystemPrompt } from "@/lib/ai-provider";

export class OpenRouterProvider implements AIProvider {
  name = "openrouter";
  private apiKey: string;
  private model: string;

  constructor(cfg: ProviderConfig = {}) {
    this.apiKey = cfg.apiKey ?? process.env.OPENROUTER_API_KEY ?? "";
    this.model = cfg.model ?? "meta-llama/llama-3.1-8b-instruct:free";
  }

  isConfigured() { return !!this.apiKey; }

  async chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse> {
    if (!this.isConfigured()) throw new Error("OpenRouter not configured");
    return retryWithBackoff(async () => {
      const { OpenAI } = await import("openai");
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: { "HTTP-Referer": "https://novacart.ai" }
      });
      const res = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
        ],
        temperature: opts?.temperature ?? 0.7,
        max_tokens: opts?.maxTokens ?? 300,
        response_format: { type: "json_object" }
      });
      return parseJSONResponse(res.choices[0]?.message?.content ?? "{}");
    }, opts);
  }

  async testConnection() { return this.isConfigured(); }
}
