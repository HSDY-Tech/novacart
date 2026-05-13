/**
 * src/scripts/upsert-to-pinecone.ts
 * Run: npm run upsert
 * Indexes all products with OpenAI text-embedding-ada-002 into Pinecone.
 */
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { products } from "../data/products";
import type { Product } from "../types/product";

const PINECONE_KEY = process.env.PINECONE_API_KEY ?? "";
const INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "novacart-products";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
const BATCH_SIZE = 50;
const DIM = 1536;

function productText(p: Product): string {
  return [
    `Title: ${p.title}`, `Brand: ${p.brand}`, `Category: ${p.category}`,
    `Price: $${p.price}`, `Tags: ${p.tags.join(", ")}`,
    `Description: ${p.description}`, `Details: ${p.longDescription}`,
    `Features: ${p.features.join(". ")}`,
    `Specs: ${Object.entries(p.specs).map(([k,v])=>`${k}: ${v}`).join(", ")}`,
    p.isTrending ? "Trending" : "", p.isFeatured ? "Featured" : ""
  ].filter(Boolean).join("\n");
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  if (!PINECONE_KEY) { console.error("❌ Missing PINECONE_API_KEY"); process.exit(1); }
  if (!OPENAI_KEY) { console.error("❌ Missing OPENAI_API_KEY"); process.exit(1); }

  console.log("🚀 NovaCart — Pinecone upsert starting…");
  console.log(`📦 Products: ${products.length} | Index: ${INDEX_NAME}`);

  const pc = new Pinecone({ apiKey: PINECONE_KEY });
  const openai = new OpenAI({ apiKey: OPENAI_KEY });

  // Create index if needed
  const existing = await pc.listIndexes();
  const names = existing.indexes?.map(i => i.name) ?? [];

  if (!names.includes(INDEX_NAME)) {
    console.log(`\n🛠️  Creating index "${INDEX_NAME}"…`);
    await pc.createIndex({
      name: INDEX_NAME,
      dimension: DIM,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } }
    });
    console.log("⏳ Waiting for index to be ready");
    for (let i = 0; i < 30; i++) {
      await sleep(4000);
      const desc = await pc.describeIndex(INDEX_NAME);
      if (desc.status?.ready) { console.log("\n✅ Index ready!"); break; }
      process.stdout.write(".");
    }
  } else {
    console.log(`✅ Index "${INDEX_NAME}" exists`);
  }

  const idx = pc.index(INDEX_NAME);
  const batches = chunk(products, BATCH_SIZE);
  let total = 0;

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`\n📄 Batch ${b+1}/${batches.length} (${batch.length} products)`);

    try {
      const res = await openai.embeddings.create({ model: "text-embedding-ada-002", input: batch.map(productText) });
      const vectors = batch.map((p, i) => ({
        id: p.id,
        values: res.data[i].embedding,
        metadata: {
          id: p.id, slug: p.slug, title: p.title, category: p.category,
          brand: p.brand, price: p.price, originalPrice: p.originalPrice ?? null,
          rating: p.rating, reviews: p.reviews, stock: p.stock,
          description: p.description, tags: p.tags,
          isTrending: p.isTrending ?? false, isFeatured: p.isFeatured ?? false, image: p.image
        }
      }));
      await idx.upsert({ records: vectors } as Parameters<typeof idx.upsert>[0]);
      total += vectors.length;
      console.log(`   ✅ Upserted ${vectors.length} (total: ${total})`);
    } catch (e) {
      console.error(`   ❌ Batch ${b+1} failed:`, e);
    }

    if (b < batches.length - 1) await sleep(300);
  }

  console.log(`\n${"─".repeat(40)}`);
  console.log(`🎉 Done! ${total}/${products.length} products indexed in "${INDEX_NAME}"`);
}

main().catch(e => { console.error("💥", e); process.exit(1); });
