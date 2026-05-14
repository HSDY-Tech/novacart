/**
 * Groq Provider — Real AI responses (fast, free)
 * Uses llama-3.3-70b-versatile for natural conversation
 */
import type { AIProvider, ChatMessage, ChatResponse, ProviderConfig, AIProviderOptions } from "@/lib/ai-provider";
import { retryWithBackoff, parseJSONResponse, buildSystemPrompt } from "@/lib/ai-provider";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class GroqProvider implements AIProvider {
  name = "groq";
  private apiKey: string;
  private model: string;

  constructor(cfg: ProviderConfig = {}) {
    this.apiKey = cfg.apiKey ?? process.env.GROQ_API_KEY ?? "";
    this.model = cfg.model ?? "llama-3.3-70b-versatile";
  }

  isConfigured() { 
    const configured = !!this.apiKey && this.apiKey.startsWith("gsk_");
    if (!configured) console.warn("⚠️ Groq: No valid API key found. Set GROQ_API_KEY in .env.local");
    return configured;
  }

  async chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse> {
    if (!this.isConfigured()) {
      throw new Error("Groq not configured — set GROQ_API_KEY in .env.local");
    }

    console.log(`🤖 Groq: Processing ${messages.length} messages with model ${this.model}`);

    return retryWithBackoff(async () => {
      const { OpenAI } = await import("openai");
      
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: "https://api.groq.com/openai/v1"
      });

      const systemPrompt = buildSystemPrompt();

      // Build messages with proper typing
      const apiMessages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt }
      ];

      // Add conversation history
      for (const m of messages) {
        apiMessages.push({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        });
      }

      const res = await client.chat.completions.create({
        model: this.model,
        messages: apiMessages,
        temperature: opts?.temperature ?? 0.8,
        max_tokens: opts?.maxTokens ?? 400,
        response_format: { type: "json_object" }
      });

      const content = res.choices[0]?.message?.content ?? "{}";
      console.log(`✅ Groq: Response received (${content.length} chars)`);
      
      const parsed = parseJSONResponse(content);
      
      if (!parsed.message || parsed.message.trim().length < 5) {
        throw new Error("Empty or invalid response from Groq");
      }
      
      return parsed;
    }, { retries: opts?.retries ?? 2, retryDelay: opts?.retryDelay ?? 500 });
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.isConfigured()) return false;
      const { OpenAI } = await import("openai");
      const client = new OpenAI({ 
        apiKey: this.apiKey, 
        baseURL: "https://api.groq.com/openai/v1" 
      });
      await client.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: "Say test" }],
        max_tokens: 10
      });
      console.log("✅ Groq connection test successful");
      return true;
    } catch (error) {
      console.error("❌ Groq connection test failed:", error);
      return false;
    }
  }
}



// /**
//  * Groq Provider — primary AI (fastest, free tier)
//  * Uses llama-3.3-70b-versatile for high-quality conversational responses
//  */
// import type { AIProvider, ChatMessage, ChatResponse, ProviderConfig, AIProviderOptions } from "@/lib/ai-provider";
// import { retryWithBackoff, parseJSONResponse, buildSystemPrompt } from "@/lib/ai-provider";

// export class GroqProvider implements AIProvider {
//   name = "groq";
//   private apiKey: string;
//   private model: string;

//   constructor(cfg: ProviderConfig = {}) {
//     this.apiKey = cfg.apiKey ?? process.env.GROQ_API_KEY ?? "";
//     // Use the best free model - versatile is much better for chat than instant
//     this.model = cfg.model ?? "llama-3.3-70b-versatile";
//   }

//   isConfigured() { return !!this.apiKey; }

//   async chat(messages: ChatMessage[], opts?: AIProviderOptions): Promise<ChatResponse> {
//     if (!this.isConfigured()) throw new Error("Groq not configured — set GROQ_API_KEY");

//     return retryWithBackoff(async () => {
//       const { OpenAI } = await import("openai");
//       const client = new OpenAI({
//         apiKey: this.apiKey,
//         baseURL: "https://api.groq.com/openai/v1"
//       });

//       const res = await client.chat.completions.create({
//         model: this.model,
//         messages: [
//           { role: "system", content: buildSystemPrompt() },
//           // Pass full conversation history for context
//           ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
//         ],
//         temperature: opts?.temperature ?? 0.7,
//         max_tokens: opts?.maxTokens ?? 300,
//         response_format: { type: "json_object" }
//       });

//       const content = res.choices[0]?.message?.content ?? "{}";
//       return parseJSONResponse(content);
//     }, { retries: opts?.retries ?? 2, retryDelay: opts?.retryDelay ?? 500 });
//   }

//   async testConnection() {
//     try {
//       if (!this.isConfigured()) return false;
//       const { OpenAI } = await import("openai");
//       const client = new OpenAI({ apiKey: this.apiKey, baseURL: "https://api.groq.com/openai/v1" });
//       await client.chat.completions.create({
//         model: this.model,
//         messages: [{ role: "user", content: "test" }],
//         max_tokens: 5
//       });
//       return true;
//     } catch { return false; }
//   }
// }
