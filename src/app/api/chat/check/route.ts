import { NextResponse } from "next/server";

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const hasGroq = !!groqKey && groqKey.startsWith("gsk_");
  
  return NextResponse.json({
    groqConfigured: hasGroq,
    keyPrefix: groqKey ? groqKey.substring(0, 8) + "..." : "none",
    keyLength: groqKey ? groqKey.length : 0,
    message: hasGroq 
      ? "✅ Groq API key is configured! Your chatbot will use real AI." 
      : "❌ GROQ_API_KEY not found or invalid. Add it to .env.local",
    instructions: "Get your free API key from https://console.groq.com"
  });
}