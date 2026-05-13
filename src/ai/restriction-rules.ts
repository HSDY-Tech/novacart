export const RESTRICTION_RESPONSE =
  "I can only help with products available right here on NovaCart. I'm not able to browse Amazon, eBay, Alibaba, Daraz, or other external marketplaces — but I'd love to help you find something great in our store!";

export const RESTRICTED_SITES = ["Amazon", "Alibaba", "eBay", "Daraz", "AliExpress", "Flipkart", "Shopify"] as const;

const PATTERNS = [/\bamazon\b/i, /\balibaba\b/i, /\be-?bay\b/i, /\bdaraz\b/i, /\baliexpress\b/i, /\bflipkart\b/i];

export const containsRestrictedSite = (q: string) => PATTERNS.some(p => p.test(q));
