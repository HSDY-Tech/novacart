import { generateChatbotResponse } from "@/ai/chatbot-engine";

export interface RAGResponse { message: string; productIds: string[]; sources: string[]; usedRAG: boolean }

interface PMeta { id: string; title: string; category: string; brand: string; price: number; originalPrice?: number|null; rating: number; stock: number; description: string; tags: string[]; isTrending?: boolean; isFeatured?: boolean }

const PINECONE_KEY = process.env.PINECONE_API_KEY ?? "";
const INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "novacart-products";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
const MIN_SCORE = 0.7;

export class RAGChatbot {
  isConfigured() { return !!(PINECONE_KEY && INDEX_NAME && OPENAI_KEY); }

  async chat(query: string): Promise<RAGResponse> {
    if (!this.isConfigured()) {
      const fb = generateChatbotResponse(query);
      return { message: fb.message, productIds: fb.productIds, sources: [], usedRAG: false };
    }
    try {
      const { OpenAI } = await import("openai");
      const { Pinecone } = await import("@pinecone-database/pinecone");
      const openai = new OpenAI({ apiKey: OPENAI_KEY });
      const pc = new Pinecone({ apiKey: PINECONE_KEY });

      // Embed query
      const embRes = await openai.embeddings.create({ model: "text-embedding-ada-002", input: query });
      const embedding = embRes.data[0].embedding;

      // Query Pinecone
      const idx = pc.index(INDEX_NAME);
      const qRes = await idx.query({ vector: embedding, topK: 5, includeMetadata: true });
      const matches = (qRes.matches ?? []).filter(m => (m.score ?? 0) >= MIN_SCORE);

      if (!matches.length) {
        const fb = generateChatbotResponse(query);
        return { message: fb.message, productIds: fb.productIds, sources: [], usedRAG: false };
      }

      const metas = matches.map(m => m.metadata as unknown as PMeta);
      const context = metas.map((m, i) =>
        `[${i+1}] ${m.title} | $${m.price} | ${m.category} | ★${m.rating} | ${m.description}`
      ).join("\n");

      // Generate with OpenAI
      const chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are NovaCart AI. Recommend products from the catalog below. Respond ONLY with JSON: {"message":"...","productIds":["p-xxx"]}\n\nCatalog:\n${context}` },
          { role: "user", content: query }
        ],
        max_tokens: 400,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const raw = chat.choices[0]?.message?.content ?? "{}";
      let parsed: { message?: string; productIds?: string[] } = {};
      try { parsed = JSON.parse(raw); } catch { /* use fallback */ }

      const allIds = metas.map(m => m.id);
      return {
        message: parsed.message ?? "Here are some great products for you!",
        productIds: Array.isArray(parsed.productIds)
          ? parsed.productIds.filter((id: string) => allIds.includes(id))
          : allIds.slice(0, 3),
        sources: metas.map(m => m.title),
        usedRAG: true
      };
    } catch (e) {
      console.error("RAG error:", e);
      const fb = generateChatbotResponse(query);
      return { message: fb.message, productIds: fb.productIds, sources: [], usedRAG: false };
    }
  }
}

let _rag: RAGChatbot | null = null;
export const getRAGChatbot = () => { if (!_rag) _rag = new RAGChatbot(); return _rag; };
