import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { validateAndFixEmail, validatePhone } from "@/lib/cart-utils";

export type OrderStep = "idle" | "name" | "email" | "email_confirm" | "phone" | "address_street" | "address_city" | "address_zip" | "promo" | "confirm";

export type PendingEmail = {
  original: string;
  suggested: string;
};

export type OrderData = {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  promoCode?: string;
};

export function useOrderFlow() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState<OrderStep>("idle");
  const [orderData, setOrderData] = useState<OrderData>({
    name: "", email: "", phone: "", address: { street: "", city: "", zip: "" }
  });
  const [pendingEmail, setPendingEmail] = useState<PendingEmail | null>(null);
  const [productForCheckout, setProductForCheckout] = useState<Product | null>(null);
  
  const startCheckout = useCallback((product?: Product) => {
    setProductForCheckout(product || null);
    setIsActive(true);
    setStep("name");
    return "Let's place your order! What's your full name?";
  }, []);
  
  const processResponse = useCallback((userMessage: string): { response: string; shouldClose?: boolean } => {
    switch (step) {
      case "name":
        if (!userMessage.trim()) {
          return { response: "Please enter your full name." };
        }
        setOrderData(prev => ({ ...prev, name: userMessage.trim() }));
        setStep("email");
        return { response: `Thanks ${userMessage.trim()}! What's your email address for order confirmation?` };
        
      case "email":
        const emailCheck = validateAndFixEmail(userMessage);
        if (!emailCheck.valid) {
          return { response: emailCheck.message || "Please enter a valid email." };
        }
        if (emailCheck.corrected) {
          setPendingEmail({ original: userMessage, suggested: emailCheck.corrected });
          setStep("email_confirm");
          return { response: emailCheck.message || `Did you mean ${emailCheck.corrected}? Reply 'yes' to correct or 'no' to keep original.` };
        }
        setOrderData(prev => ({ ...prev, email: userMessage }));
        setStep("phone");
        return { response: "Perfect! What's your phone number for delivery updates?" };
        
      case "email_confirm":
        if (userMessage.toLowerCase() === "yes" && pendingEmail) {
          setOrderData(prev => ({ ...prev, email: pendingEmail.suggested }));
        } else if (userMessage.toLowerCase() !== "no") {
          setOrderData(prev => ({ ...prev, email: userMessage }));
        }
        setPendingEmail(null);
        setStep("phone");
        return { response: "Thanks! What's your phone number for delivery updates?" };
        
      case "phone":
        const phoneCheck = validatePhone(userMessage);
        if (!phoneCheck.valid) {
          return { response: phoneCheck.message || "Please enter a valid phone number." };
        }
        setOrderData(prev => ({ ...prev, phone: phoneCheck.cleaned || userMessage }));
        setStep("address_street");
        return { response: "Great! What's your street address?" };
        
      case "address_street":
        if (!userMessage.trim()) {
          return { response: "Please enter your street address." };
        }
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address, street: userMessage.trim() }
        }));
        setStep("address_city");
        return { response: "What city?" };
        
      case "address_city":
        if (!userMessage.trim()) {
          return { response: "Please enter your city." };
        }
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address, city: userMessage.trim() }
        }));
        setStep("address_zip");
        return { response: "What's your ZIP/postal code?" };
        
      case "address_zip":
        if (!userMessage.trim()) {
          return { response: "Please enter your ZIP code." };
        }
        setOrderData(prev => ({ 
          ...prev, 
          address: { ...prev.address, zip: userMessage.trim() }
        }));
        setStep("promo");
        return { response: "Do you have a promo code? (NOVA10=10%, SAVE20=20% max $50, NOVA50=$50 off min $100, WELCOME=15%) Say 'skip' to continue." };
        
      case "promo":
        let promoCode: string | undefined;
        if (userMessage.toLowerCase() !== "skip") {
          const validCodes = ["NOVA10", "SAVE20", "NOVA50", "WELCOME"];
          const upperCode = userMessage.toUpperCase();
          if (validCodes.includes(upperCode)) {
            promoCode = upperCode;
          } else {
            return { response: `Sorry, '${userMessage}' is not valid. Try NOVA10, SAVE20, NOVA50, WELCOME, or say 'skip'.` };
          }
        }
        
        const finalData = { ...orderData, promoCode };
        
        // Calculate totals
        const items = useCartStore.getState().items;
        const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        let discount = 0;
        if (promoCode === "NOVA10") discount = subtotal * 0.1;
        else if (promoCode === "SAVE20") discount = Math.min(subtotal * 0.2, 50);
        else if (promoCode === "NOVA50" && subtotal >= 100) discount = 50;
        else if (promoCode === "WELCOME") discount = subtotal * 0.15;
        const tax = (subtotal - discount) * 0.08;
        const total = subtotal - discount + tax;
        
        const itemLines = items.map(i => `• ${i.product.title} × ${i.quantity} = $${(i.product.price * i.quantity).toFixed(2)}`).join("\n");
        
        const summary = `✅ **ORDER SUMMARY**

${itemLines}

**Subtotal:** $${subtotal.toFixed(2)}
${promoCode ? `**Discount:** -$${discount.toFixed(2)} (${promoCode})\n` : ""}**Tax (8%):** $${tax.toFixed(2)}
**Total:** $${total.toFixed(2)}

**Customer:** ${finalData.name}
**Email:** ${finalData.email}
**Phone:** ${finalData.phone}
**Address:** ${finalData.address.street}, ${finalData.address.city}, ${finalData.address.zip}

Reply **"confirm"** to place your order, or **"cancel"** to abort.`;
        
        setStep("confirm");
        return { response: summary };
        
      case "confirm":
        if (userMessage.toLowerCase() === "confirm") {
          const orderNumber = `NOVA-${Math.floor(Math.random() * 900000) + 100000}`;
          useCartStore.getState().clear();
          setIsActive(false);
          setStep("idle");
          return { 
            response: `🎉 **ORDER PLACED SUCCESSFULLY!**

**Order #:** ${orderNumber}
**Total:** $${(orderData.promoCode ? (() => {
              const subtotal = useCartStore.getState().items.reduce((s,i) => s + i.product.price * i.quantity, 0);
              let d = 0;
              if (orderData.promoCode === "NOVA10") d = subtotal * 0.1;
              else if (orderData.promoCode === "SAVE20") d = Math.min(subtotal * 0.2, 50);
              else if (orderData.promoCode === "NOVA50" && subtotal >= 100) d = 50;
              else if (orderData.promoCode === "WELCOME") d = subtotal * 0.15;
              return (subtotal - d) * 1.08;
            })() : 0).toFixed(2)}
**Delivery:** ${orderData.address.street}, ${orderData.address.city}

A confirmation email has been sent to ${orderData.email}.

Thank you for shopping with NovaCart! 🚀`,
            shouldClose: true
          };
        } else if (userMessage.toLowerCase() === "cancel") {
          setIsActive(false);
          setStep("idle");
          return { response: "Order cancelled. Your cart is unchanged. Continue shopping!" };
        }
        return { response: 'Please reply "confirm" to place your order or "cancel" to abort.' };
        
      default:
        return { response: "I'm not sure what happened. Let's start over." };
    }
  }, [step, orderData, pendingEmail]);
  
  return {
    isActive,
    step,
    startCheckout,
    processResponse,
    reset: () => {
      setIsActive(false);
      setStep("idle");
      setOrderData({ name: "", email: "", phone: "", address: { street: "", city: "", zip: "" } });
      setPendingEmail(null);
    }
  };
}