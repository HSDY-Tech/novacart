"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Minimize2, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState, useCallback } from "react";
import { SUGGESTED_PROMPTS } from "@/ai/prompts";
import { getProductById } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";


// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
  productIds?: string[];
  ts: Date;
  error?: boolean;
};

type ApiMessage = { role: Role; content: string };

// Order collection types
type OrderStep = "idle" | "name" | "email" | "phone" | "address" | "confirm";

type OrderData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  productPrice: number;
};

// ─── Toast notification system ────────────────────────────────────────────────
let toastTimeout: NodeJS.Timeout | null = null;

const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
  // Remove existing toast
  const existingToast = document.getElementById("nova-toast");
  if (existingToast) existingToast.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  // Create toast element
  const toast = document.createElement("div");
  toast.id = "nova-toast";
  toast.className = `fixed top-20 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-top-2 ${
    type === "success" ? "bg-emerald-500 text-white" : type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
  }`;
  
  const icon = type === "success" ? "✓" : type === "error" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span class="text-lg font-bold">${icon}</span><span class="text-sm font-medium">${message}</span>`;
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 3000);
};

// ─── Welcome message ──────────────────────────────────────────────────────────
const mkWelcome = (): Message => ({
  id: "welcome",
  role: "assistant",
  content: "Hey there! 👋 I'm Alex, your NovaCart shopping assistant. How can I help you today?",
  ts: new Date(),
  productIds: []
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => crypto.randomUUID();
const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Add to cart function
const addToCart = (product: Product) => {
  import("@/store/cart-store").then(({ useCartStore }) => {
    useCartStore.getState().addItem(product);
    showToast(`✓ Added ${product.title} to cart! 🛒`, "success");
  });
};

// ─── Component ────────────────────────────────────────────────────────────────
export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([mkWelcome()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  
  // Order collection state
  const [isCollectingOrder, setIsCollectingOrder] = useState(false);
  const [orderStep, setOrderStep] = useState<OrderStep>("idle");
  const [orderData, setOrderData] = useState<OrderData>({
    name: "", email: "", phone: "", address: "",
    productId: "", productName: "", productPrice: 0
  });

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Handle order collection responses
  const handleOrderResponse = useCallback(async (userMessage: string): Promise<string | null> => {
    const step = orderStep;
    
    switch (step) {
      case "name":
        setOrderData(prev => ({ ...prev, name: userMessage }));
        setOrderStep("email");
        return `Thanks ${userMessage}! What's your email address for order confirmation?`;
        
      case "email":
        if (!userMessage.includes("@") || !userMessage.includes(".")) {
          return "Please enter a valid email address (e.g., name@example.com)";
        }
        setOrderData(prev => ({ ...prev, email: userMessage }));
        setOrderStep("phone");
        return "Perfect! What's your phone number for delivery updates?";
        
      case "phone":
        const digits = userMessage.replace(/[^0-9]/g, "");
        if (digits.length < 10) {
          return "Please enter a valid 10-digit phone number";
        }
        setOrderData(prev => ({ ...prev, phone: userMessage }));
        setOrderStep("address");
        return "Last step — what's your delivery address (street, city, zip code)?";
        
      case "address":
        setOrderData(prev => ({ ...prev, address: userMessage }));
        setOrderStep("confirm");
        const data = { ...orderData, address: userMessage };
        return `✅ **ORDER SUMMARY**
        
Product: ${data.productName}
Price: $${data.productPrice}
Customer: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Address: ${userMessage}
Total: $${data.productPrice}

Reply **"confirm"** to place your order, or **"cancel"** to abort.`;
        
      case "confirm":
        if (userMessage.toLowerCase() === "confirm") {
          const orderNumber = `NOVA-${Math.floor(Math.random() * 900000) + 100000}`;
          showToast(`🎉 Order confirmed! ${orderNumber}`, "success");
          
          const product = getProductById(orderData.productId);
          if (product) {
            addToCart(product);
          }
          
          setIsCollectingOrder(false);
          setOrderStep("idle");
          const confirmedData = { ...orderData };
          setOrderData({ name: "", email: "", phone: "", address: "", productId: "", productName: "", productPrice: 0 });
          
          return `🎉 **ORDER PLACED SUCCESSFULLY!**

**Order #:** ${orderNumber}
**Product:** ${confirmedData.productName}
**Total:** $${confirmedData.productPrice}
**Delivery Address:** ${confirmedData.address}

We'll deliver within 3-5 business days. A confirmation email has been sent to ${confirmedData.email}.

Thank you for shopping with NovaCart! 🚀

Would you like to continue shopping?`;
        } else if (userMessage.toLowerCase() === "cancel") {
          setIsCollectingOrder(false);
          setOrderStep("idle");
          return "Order cancelled. Type 'checkout' when you're ready to try again.";
        }
        return 'Please reply "confirm" to place your order or "cancel" to abort.';
        
      default:
        return null;
    }
  }, [orderStep, orderData]);

  // ── Build API payload from message history ──────────────────────────────────
  const buildHistory = useCallback((msgs: Message[]): ApiMessage[] => {
    return msgs
      .filter(m => m.id !== "welcome" && !m.error)
      .map(m => ({ role: m.role, content: m.content }));
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;

    setInput("");

    // Check if we're collecting order info
    if (isCollectingOrder) {
      const orderResponse = await handleOrderResponse(q);
      if (orderResponse) {
        setMessages(prev => [...prev, {
          id: uid(), role: "assistant", content: orderResponse,
          productIds: [], ts: new Date()
        }]);
      }
      return;
    }

    // Check for checkout intent
    const checkoutKeywords = ['checkout', 'buy now', 'purchase', 'place order', 'order this', 'buy this'];
    if (checkoutKeywords.some(kw => q.toLowerCase().includes(kw))) {
      // Find the last product mentioned in messages
      const lastProductIds = [...messages].reverse().flatMap(m => m.productIds || []);
      const lastProduct = lastProductIds.length ? getProductById(lastProductIds[0]) : null;
      
      if (lastProduct) {
        setIsCollectingOrder(true);
        setOrderStep("name");
        setOrderData({
          ...orderData,
          productId: lastProduct.id,
          productName: lastProduct.title,
          productPrice: lastProduct.price
        });
        
        const response = `Awesome! Let's place your order for **${lastProduct.title}**. What's your full name?`;
        setMessages(prev => [...prev, {
          id: uid(), role: "assistant", content: response,
          productIds: [], ts: new Date()
        }]);
        return;
      } else {
        setMessages(prev => [...prev, {
          id: uid(), role: "assistant",
          content: "Please ask about a product first, then I can help you checkout! For example: 'Show me Wireless Gaming Headphones'",
          productIds: [], ts: new Date()
        }]);
        return;
      }
    }

    // Add user message to state
    const userMsg: Message = { id: uid(), role: "user", content: q, ts: new Date() };
    setMessages(prev => {
      const next = [...prev, userMsg];
      triggerAPI(next);
      return next;
    });
  }, [loading, isCollectingOrder, messages, handleOrderResponse, orderData]);

  // ── Trigger API with current message list ────────────────────────────────────
  const triggerAPI = useCallback(async (currentMessages: Message[]) => {
    setLoading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const history = buildHistory(currentMessages);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json() as { message?: string; productIds?: string[] };
      const msg = (data.message ?? "").trim();
      const ids = Array.isArray(data.productIds) ? data.productIds : [];

      if (!msg) throw new Error("Empty response");

      setMessages(prev => [...prev, {
        id: uid(), role: "assistant",
        content: msg,
        productIds: ids.filter(id => getProductById(id)),
        ts: new Date()
      }]);
    } catch (e: unknown) {
      if ((e as { name?: string }).name === "AbortError") return;
      console.error("Chat error:", e);
      setMessages(prev => [...prev, {
        id: uid(), role: "assistant", error: true,
        content: "Sorry, I had a connection issue. Please try again!",
        productIds: [], ts: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  }, [buildHistory]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); void sendMessage(input); };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(input); }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setLoading(false);
    setIsCollectingOrder(false);
    setOrderStep("idle");
    setMessages([mkWelcome()]);
    setInput("");
    showToast("✨ New conversation started", "info");
  };

  const handleSuggestion = (prompt: string) => { void sendMessage(prompt); };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Add CSS animation styles */}
      <style jsx global>{`
        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideInFromTop 0.3s ease-out; }
      `}</style>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)]"
            style={{ width: "min(420px, calc(100vw - 2rem))", height: "min(600px, 85vh)" }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">Alex — NovaCart AI</p>
                  <p className="text-xs text-white/70 leading-tight">Shopping Assistant · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="New conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} onAddToCart={() => {
                  const prods = (msg.productIds ?? []).map(id => getProductById(id)).filter(Boolean);
                  if (prods.length) addToCart(prods[0] as Product);
                }} />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Order progress indicator */}
            {isCollectingOrder && (
              <div className="shrink-0 border-t border-border/50 bg-amber-50 px-4 py-2">
                <p className="text-xs font-medium text-amber-700">
                  📝 Order in progress — {orderStep === "name" ? "Step 1/5: Name" :
                     orderStep === "email" ? "Step 2/5: Email" :
                     orderStep === "phone" ? "Step 3/5: Phone" :
                     orderStep === "address" ? "Step 4/5: Address" : "Step 5/5: Confirm"}
                </p>
              </div>
            )}

            {/* Quick prompts */}
            {messages.length <= 1 && !loading && !isCollectingOrder && (
              <div className="shrink-0 border-t border-border/50 bg-white px-4 py-2.5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => handleSuggestion(p)}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleSuggestion("checkout")}
                  className="mt-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  💳 Checkout (Place Order)
                </button>
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 border-t border-border/50 bg-white p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isCollectingOrder ? "Type your response..." : "Ask Alex about products..."}
                  disabled={loading}
                  className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                Powered by Groq · Gemini · Alex AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-glow"
        aria-label="Open AI shopping assistant"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <Minimize2 className="h-5 w-5" /> : <Sparkles className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse2 rounded-full bg-emerald-400 ring-2 ring-white" />
        )}
      </motion.button>
    </>
  );
}

// ─── Message bubble sub-component ─────────────────────────────────────────────
function MessageBubble({ msg, onAddToCart }: { msg: Message; onAddToCart: () => void }) {
  const isUser = msg.role === "user";
  const prods = (msg.productIds ?? [])
    .map(id => getProductById(id))
    .filter((p): p is Product => !!p);

  return (
    <div className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className={cn("flex max-w-[82%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {/* Text bubble */}
        <div className={cn(
          "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
            : cn("rounded-bl-sm border border-border/50 bg-white text-foreground", msg.error && "border-red-200 bg-red-50 text-red-700")
        )}>
          <p className="whitespace-pre-wrap break-words">
            {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={i}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        </div>

        {/* Product cards with Add to Cart button */}
        {prods.length > 0 && (
          <div className="w-full space-y-2">
            {prods.map(p => (
              <ProductCardItem key={p.id} product={p} />
            ))}
            <button
              onClick={onAddToCart}
              className="w-full rounded-lg bg-indigo-600 py-2 text-center text-xs font-medium text-white transition hover:bg-indigo-700"
            >
              🛒 Add to Cart
            </button>
          </div>
        )}

        {/* Timestamp */}
        <p className="px-1 text-[10px] text-muted-foreground">{fmt(msg.ts)}</p>
      </div>
    </div>
  );
}

// ─── Product card component ───────────────────────────────────────────────────
function ProductCardItem({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white p-2.5 shadow-soft transition hover:border-indigo-300 hover:shadow-card"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <Image src={product.image} alt={product.title} fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{product.title}</p>
        <p className="text-xs text-muted-foreground">{product.category} · ★{product.rating}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-indigo-600">{formatCurrency(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</p>
          )}
        </div>
      </div>
      <div className="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600">
        View →
      </div>
    </Link>
  );
}