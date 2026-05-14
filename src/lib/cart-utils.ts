import { useCartStore, getCartTotals } from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";

export function formatCartForChat(): string {
  const items = useCartStore.getState().items;
  if (items.length === 0) {
    return "Your cart is empty. Add some products first!";
  }
  
  const totals = getCartTotals(items);
  let message = "🛒 **YOUR CART**\n\n";
  
  items.forEach((item, idx) => {
    message += `${idx + 1}. ${item.product.title} — ${formatCurrency(item.product.price)} x ${item.quantity} = ${formatCurrency(item.product.price * item.quantity)}\n`;
  });
  
  message += `\n**Subtotal:** ${formatCurrency(totals.subtotal)}`;
  message += `\n**Tax (8%):** ${formatCurrency(totals.tax)}`;
  message += `\n**Total:** ${formatCurrency(totals.total)}`;
  message += `\n\nSay "checkout" to order or "remove [product]" to delete items.`;
  
  return message;
}

export function extractProductFromMessage(message: string): string | null {
  // Match patterns like "add X to cart", "buy X", "I want X"
  const patterns = [
    /add (.+?) to cart/i,
    /buy (.+?)(?: to cart)?$/i,
    /purchase (.+?)$/i,
    /i (?:want|like|need) (.+?)(?: to cart)?$/i
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function extractRemoveItem(message: string): string | null {
  const match = message.match(/remove (.+?)(?: from cart)?$/i);
  return match ? match[1].trim() : null;
}

export function validateAndFixEmail(email: string): { valid: boolean; corrected?: string; message?: string } {
  const typos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'gnail.com': 'gmail.com'
  };
  
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, message: "Please enter a valid email address (e.g., name@domain.com)" };
  }
  
  const domain = parts[1].toLowerCase();
  if (typos[domain]) {
    return { valid: true, corrected: `${parts[0]}@${typos[domain]}`, message: `Did you mean ${parts[0]}@${typos[domain]}?` };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; cleaned?: string; message?: string } {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10) {
    return { valid: false, message: "Please enter at least 10 digits" };
  }
  if (digits.length > 15) {
    return { valid: false, message: "Please enter a valid phone number (max 15 digits)" };
  }
  
  return { valid: true, cleaned: digits };
}