import type { Product, ProductCategory } from "@/types/product";

export const products: Product[] = [
  {
    id: "p-101", slug: "wireless-gaming-headphones", title: "Wireless Gaming Headphones",
    category: "Audio", brand: "NovaSound", price: 129, originalPrice: 179,
    rating: 4.7, reviews: 842, stock: 20, tags: ["gaming","wireless","rgb","headphones"],
    description: "Premium wireless gaming headphones with low-latency audio and RGB lighting.",
    longDescription: "Built for competitive gamers, these headphones deliver low-latency wireless audio, AI noise-isolating mic, and memory foam comfort for marathon sessions.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80"],
    specs: { Battery: "20 hours", Connectivity: "Bluetooth 5.3 / 2.4GHz dongle", Microphone: "AI noise isolation", Weight: "285g" },
    features: ["Low-latency wireless","RGB light ring","Memory foam cushions"], isFeatured: true, isTrending: true
  },
  {
    id: "p-102", slug: "aurora-rgb-keyboard", title: "Aurora RGB Mechanical Keyboard",
    category: "Gaming", brand: "KeyForge", price: 149, originalPrice: 199,
    rating: 4.8, reviews: 631, stock: 32, tags: ["keyboard","gaming","rgb","mechanical"],
    description: "Hot-swappable mechanical keyboard with per-key RGB and premium aluminum frame.",
    longDescription: "A compact 75% mechanical keyboard designed for fast typing and gaming. Hot-swappable switches make customization simple.",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80"],
    specs: { Layout: "75%", Switches: "Hot-swappable tactile", Lighting: "Per-key RGB", Body: "CNC aluminum", Connection: "USB-C / Bluetooth" },
    features: ["Hot-swappable PCB","Mac & Windows modes","Double-shot keycaps"], isFeatured: true, isTrending: true
  },
  {
    id: "p-103", slug: "novaphone-x-pro", title: "NovaPhone X Pro 5G",
    category: "Smartphones", brand: "NovaMobile", price: 899, originalPrice: 999,
    rating: 4.9, reviews: 1204, stock: 14, tags: ["smartphone","5g","camera","premium"],
    description: "Flagship 5G smartphone with pro camera system and all-day battery.",
    longDescription: "NovaPhone X Pro combines a bright OLED display, advanced camera pipeline, fast charging, and a premium ceramic body.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
    specs: { Display: "6.7\" OLED 120Hz", Storage: "256GB", Camera: "Triple 50MP", Battery: "4800mAh", Charging: "65W wired / 30W wireless" },
    features: ["AI night photography","Ceramic shield","5G dual SIM"], isFeatured: true, isTrending: true
  },
  {
    id: "p-104", slug: "smart-fitness-watch-s4", title: "Smart Fitness Watch S4",
    category: "Wearables", brand: "PulseOS", price: 199, originalPrice: 249,
    rating: 4.6, reviews: 978, stock: 45, tags: ["watch","fitness","wearable","health"],
    description: "Advanced fitness watch with health tracking, GPS, and 7-day battery.",
    longDescription: "Track workouts, sleep, heart rate, and daily routines with this lightweight smartwatch built for active users.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"],
    specs: { Battery: "7 days", Sensors: "Heart rate, SpO2, GPS", Water: "5 ATM", Display: "AMOLED always-on" },
    features: ["Sleep coaching","Workout detection","Quick-reply notifications"], isFeatured: true
  },
  {
    id: "p-105", slug: "ergolift-laptop-stand", title: "ErgoLift Laptop Stand",
    category: "Home Office", brand: "DeskFlow", price: 69, rating: 4.5, reviews: 403, stock: 60,
    tags: ["stand","office","ergonomic","laptop"],
    description: "Minimal aluminum laptop stand for ergonomic desk setups.",
    longDescription: "Improve your posture with a foldable aluminum stand compatible with laptops up to 16 inches.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"],
    specs: { Material: "Anodized aluminum", Compatibility: "11–16 inch", Foldable: "Yes", Weight: "620g" },
    features: ["Foldable design","Anti-slip pads","Improved airflow"], isTrending: true
  },
  {
    id: "p-106", slug: "usb-c-hub-8in1", title: "USB-C Pro Hub 8-in-1",
    category: "Accessories", brand: "Portify", price: 89, originalPrice: 119,
    rating: 4.7, reviews: 544, stock: 53, tags: ["usb-c","hub","adapter","laptop"],
    description: "Compact 8-in-1 USB-C hub with HDMI, SD, Ethernet and 100W PD.",
    longDescription: "A premium USB-C hub for modern laptops, perfect for travel, office, and multi-display workflows.",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80"],
    specs: { Ports: "HDMI, USB-A×2, USB-C, SD, MicroSD, Ethernet", Power: "100W pass-through", Video: "4K 60Hz" },
    features: ["4K HDMI output","Gigabit Ethernet","Fast SD card reader"], isFeatured: true
  },
  {
    id: "p-107", slug: "noise-canceling-earbuds-air", title: "Noise-Canceling Earbuds Air",
    category: "Audio", brand: "NovaSound", price: 159, originalPrice: 219,
    rating: 4.8, reviews: 1580, stock: 28, tags: ["earbuds","wireless","noise-canceling","audio"],
    description: "True wireless earbuds with adaptive ANC and spatial audio.",
    longDescription: "Designed for travel and deep-focus work with adaptive ANC, transparency mode, and rich spatial sound.",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1606741965429-8d76ff50bb2f?auto=format&fit=crop&w=900&q=80"],
    specs: { Battery: "30h with case", ANC: "Adaptive hybrid", Charging: "USB-C + wireless", Water: "IPX4" },
    features: ["Adaptive ANC","Spatial audio","Clear-call mics"], isFeatured: true, isTrending: true
  },
  {
    id: "p-108", slug: "ultrawide-4k-monitor", title: "UltraWide 4K Monitor 32\"",
    category: "Home Office", brand: "ViewCraft", price: 499, originalPrice: 649,
    rating: 4.7, reviews: 367, stock: 18, tags: ["monitor","4k","office","display"],
    description: "Color-accurate 32-inch 4K monitor for creators, gamers, and hybrid work.",
    longDescription: "A vibrant 4K display with USB-C docking, high refresh rate, and factory color calibration.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"],
    specs: { Size: "32\"", Resolution: "3840×2160", Refresh: "144Hz", Ports: "USB-C, HDMI 2.1, DP", Color: "98% DCI-P3" },
    features: ["USB-C docking","Factory calibrated","Low blue light"], isTrending: true
  },
  {
    id: "p-109", slug: "creator-mirrorless-camera", title: "Creator Mirrorless Camera Kit",
    category: "Cameras", brand: "FrameLab", price: 729, originalPrice: 849,
    rating: 4.6, reviews: 291, stock: 9, tags: ["camera","mirrorless","creator","video"],
    description: "Compact mirrorless camera kit for creators, streamers, and travelers.",
    longDescription: "Capture high-quality photos and 4K video with a lightweight creator camera and versatile kit lens.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"],
    specs: { Sensor: "24MP APS-C", Video: "4K 60fps", Lens: "18-55mm kit", Screen: "Flip-out touch" },
    features: ["Eye autofocus","Flip screen","USB-C live streaming"], isFeatured: true
  },
  {
    id: "p-110", slug: "slimbook-air-14", title: "SlimBook Air 14 Laptop",
    category: "Laptops", brand: "NovaCompute", price: 1199, originalPrice: 1399,
    rating: 4.8, reviews: 522, stock: 11, tags: ["laptop","ultrabook","office","portable"],
    description: "Thin 14-inch laptop with powerful performance and all-day battery.",
    longDescription: "A premium lightweight laptop for students, professionals, and creators needing speed, portability, and great battery.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
    specs: { Processor: "12-core chip", Memory: "16GB", Storage: "512GB SSD", Display: "14\" 2.8K", Battery: "18 hours" },
    features: ["Fan-silent","Fast SSD","Aluminum chassis"], isFeatured: true, isTrending: true
  },
  {
    id: "p-111", slug: "wireless-charging-dock", title: "3-in-1 Wireless Charging Dock",
    category: "Accessories", brand: "ChargeBase", price: 79, originalPrice: 99,
    rating: 4.4, reviews: 246, stock: 39, tags: ["charger","wireless","dock","phone"],
    description: "Minimal 3-in-1 wireless charging dock for phone, watch, and earbuds.",
    longDescription: "A compact nightstand charger with fast magnetic alignment and intelligent temperature control.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"],
    specs: { Output: "15W phone / 5W watch / 5W buds", Cable: "USB-C included", Finish: "Soft-touch matte" },
    features: ["3-in-1 charging","Magnetic alignment","Compact footprint"]
  },
  {
    id: "p-112", slug: "portable-bluetooth-speaker", title: "Portable Bluetooth Speaker Mini",
    category: "Audio", brand: "NovaSound", price: 89, originalPrice: 119,
    rating: 4.5, reviews: 734, stock: 40, tags: ["speaker","bluetooth","portable","audio"],
    description: "Compact Bluetooth speaker with punchy bass and waterproof build.",
    longDescription: "Take music anywhere with a durable portable speaker featuring rich bass and long battery life.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"],
    specs: { Battery: "16 hours", Water: "IPX7", Connectivity: "Bluetooth 5.2", Weight: "410g" },
    features: ["Waterproof","Party pair mode","USB-C charging"], isTrending: true
  },
  {
    id: "p-113", slug: "cloud-gaming-controller", title: "Cloud Gaming Controller",
    category: "Gaming", brand: "GameDock", price: 79, rating: 4.5, reviews: 418, stock: 26,
    tags: ["controller","gaming","mobile","cloud"],
    description: "Bluetooth controller for cloud gaming, mobile gaming, and PC.",
    longDescription: "Console-grade controls in a wireless controller built for phones, tablets, and cloud gaming services.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80"],
    specs: { Battery: "24 hours", Compatibility: "iOS, Android, Windows", Triggers: "Hall-effect analog" },
    features: ["Low-latency BT","Phone clip","Programmable buttons"]
  },
  {
    id: "p-114", slug: "smart-security-cam", title: "Smart Home Security Cam",
    category: "Cameras", brand: "SecureNest", price: 119, originalPrice: 149,
    rating: 4.4, reviews: 352, stock: 34, tags: ["camera","security","smart-home","wifi"],
    description: "Indoor/outdoor smart security camera with AI motion alerts.",
    longDescription: "Monitor your home with 2K video, AI motion detection, and weather-resistant construction.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80"],
    specs: { Resolution: "2K", Night: "Color night vision", Weather: "IP65", Storage: "Local microSD / cloud" },
    features: ["AI motion alerts","Two-way talk","Privacy zones"]
  },
  {
    id: "p-115", slug: "budget-studio-headphones", title: "Budget Studio Headphones",
    category: "Audio", brand: "MixLite", price: 59, originalPrice: 79,
    rating: 4.3, reviews: 684, stock: 70, tags: ["budget","headphones","studio","wired"],
    description: "Affordable studio headphones with balanced sound for work and music.",
    longDescription: "A reliable budget headphone for students, editors, and office users needing clean sound.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
    specs: { Type: "Over-ear wired", Driver: "40mm", Cable: "Detachable 3.5mm", Weight: "240g" },
    features: ["Balanced sound","Comfortable headband","Detachable cable"], isTrending: true
  },
  {
    id: "p-116", slug: "novaphone-se-5g", title: "NovaPhone SE 5G",
    category: "Smartphones", brand: "NovaMobile", price: 449, originalPrice: 529,
    rating: 4.5, reviews: 711, stock: 25, tags: ["smartphone","5g","budget","camera"],
    description: "Affordable 5G smartphone with clean design and dependable camera.",
    longDescription: "NovaPhone SE brings fast 5G connectivity, smooth performance, and a bright display at accessible price.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80"],
    specs: { Display: "6.1\" OLED", Storage: "128GB", Camera: "Dual 32MP", Battery: "4200mAh", Charging: "30W" },
    features: ["Budget 5G","OLED display","AI portrait mode"], isTrending: true
  },
  {
    id: "p-117", slug: "travel-power-bank-20k", title: "Travel Power Bank 20K",
    category: "Accessories", brand: "ChargeBase", price: 49, originalPrice: 69,
    rating: 4.6, reviews: 902, stock: 80, tags: ["power-bank","charger","travel","usb-c"],
    description: "20,000mAh travel power bank with USB-C fast charging.",
    longDescription: "A compact high-capacity battery pack for phones, tablets, and long travel days.",
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f7aa?auto=format&fit=crop&w=900&q=80",
    images: ["https://images.unsplash.com/photo-1609592806596-b43bada2f7aa?auto=format&fit=crop&w=900&q=80"],
    specs: { Capacity: "20,000mAh", Output: "30W USB-C PD", Ports: "USB-C + USB-A", Safety: "Overcharge protection" },
    features: ["Airline-friendly","Fast USB-C PD","Dual charging"]
  }
];

const catDesc: Record<string, string> = {
  Audio: "Headphones, earbuds, and speakers for immersive sound.",
  Gaming: "Controllers, keyboards, and performance gear for gamers.",
  Smartphones: "Flagship and budget-friendly mobile devices.",
  Wearables: "Smart watches and health-focused wearables.",
  "Home Office": "Desk setup essentials for productivity.",
  Accessories: "Chargers, hubs, docks, and daily tech add-ons.",
  Cameras: "Creator cameras and smart security cameras.",
  Laptops: "Portable computers for work, study, and creation."
};

export const getProductById = (id: string) => {
  const n = id.toLowerCase();
  return products.find(p => p.id.toLowerCase() === n || p.slug.toLowerCase() === n);
};
export const getFeaturedProducts = (limit = 8) => products.filter(p => p.isFeatured).slice(0, limit);
export const getTrendingProducts = (limit = 8) => products.filter(p => p.isTrending).slice(0, limit);
export const productsByCategory = (cat: string) => products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
export const getCategories = (): ProductCategory[] => {
  const map = new Map<string, number>();
  products.forEach(p => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return Array.from(map.entries()).map(([name, count]) => ({
    name, count,
    description: catDesc[name] ?? "Explore curated products.",
    featuredImage: products.find(p => p.category === name)?.image
  })).sort((a, b) => a.name.localeCompare(b.name));
};
