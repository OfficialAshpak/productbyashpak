/* ============================================================
   NOVA — Product & review data
   In a real deployment this would come from an API / price-feed.
   ============================================================ */

const PRODUCTS = [
  {
    id: "NV-014",
    name: "Aurora Pro Earbuds",
    category: "audio",
    price: 129.00,
    oldPrice: 169.00,
    rating: 4.8,
    reviews: 2140,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    blurb: "Adaptive ANC with a 38-hour case battery.",
    link: "#"
  },
  {
    id: "NV-027",
    name: "Halo Smart Ring",
    category: "wearables",
    price: 249.00,
    oldPrice: null,
    rating: 4.6,
    reviews: 871,
    badge: "Limited Deal",
    img: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80",
    blurb: "Sleep, recovery, and HRV tracking in 2.9g.",
    link: "#"
  },
  {
    id: "NV-031",
    name: "Pulse Mini Speaker",
    category: "audio",
    price: 79.00,
    oldPrice: 99.00,
    rating: 4.5,
    reviews: 1532,
    badge: "Limited Deal",
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    blurb: "360° sound from a speaker the size of a fist.",
    link: "#"
  },
  {
    id: "NV-042",
    name: "Orbit Smart Bulb 4-Pack",
    category: "smarthome",
    price: 59.00,
    oldPrice: 84.00,
    rating: 4.4,
    reviews: 3022,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80",
    blurb: "16M colors, matter-compatible, no hub required.",
    link: "#"
  },
  {
    id: "NV-058",
    name: "Vantage Fitness Watch",
    category: "wearables",
    price: 199.00,
    oldPrice: 229.00,
    rating: 4.7,
    reviews: 4310,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    blurb: "7-day battery with full GPS and SpO2 sensing.",
    link: "#"
  },
  {
    id: "NV-063",
    name: "Stratus Desk Lamp",
    category: "smarthome",
    price: 45.00,
    oldPrice: null,
    rating: 4.3,
    reviews: 612,
    badge: null,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    blurb: "Circadian-tuned light that fades with your evening.",
    link: "#"
  },
  {
    id: "NV-071",
    name: "Glide Wireless Charger",
    category: "accessories",
    price: 34.00,
    oldPrice: 49.00,
    rating: 4.6,
    reviews: 2877,
    badge: "Limited Deal",
    img: "https://images.unsplash.com/photo-1591290619762-c5b542d83bb1?w=600&q=80",
    blurb: "15W MagSafe-compatible charging, foldable stand.",
    link: "#"
  },
  {
    id: "NV-084",
    name: "Echo Ridge Headphones",
    category: "audio",
    price: 219.00,
    oldPrice: 259.00,
    rating: 4.9,
    reviews: 1988,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    blurb: "Studio-tuned drivers with 40-hour ANC playback.",
    link: "#"
  },
  {
    id: "NV-092",
    name: "Nimbus Air Purifier",
    category: "smarthome",
    price: 149.00,
    oldPrice: null,
    rating: 4.5,
    reviews: 943,
    badge: null,
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
    blurb: "HEPA-13 filtration, app-tracked air quality history.",
    link: "#"
  },
  {
    id: "NV-103",
    name: "Tether Cable Kit",
    category: "accessories",
    price: 24.00,
    oldPrice: 32.00,
    rating: 4.2,
    reviews: 1264,
    badge: null,
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
    blurb: "Braided 100W USB-C set, three lengths included.",
    link: "#"
  },
  {
    id: "NV-118",
    name: "Drift Sleep Tracker",
    category: "wearables",
    price: 89.00,
    oldPrice: 109.00,
    rating: 4.4,
    reviews: 558,
    badge: "Limited Deal",
    img: "https://images.unsplash.com/photo-1617043786394-ae546d5acbe9?w=600&q=80",
    blurb: "Clip-on band sensor, no charging cradle needed.",
    link: "#"
  },
  {
    id: "NV-126",
    name: "Cascade Smart Plug 3-Pack",
    category: "smarthome",
    price: 29.00,
    oldPrice: 39.00,
    rating: 4.3,
    reviews: 2105,
    badge: null,
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
    blurb: "Energy tracking per outlet, voice assistant ready.",
    link: "#"
  }
];

const TESTIMONIALS = [
  {
    name: "Priya M.",
    role: "Verified buyer · Aurora Pro Earbuds",
    quote: "The case battery claim actually held up after three weeks of daily commuting. First review site that's matched real use for me.",
    rating: 5
  },
  {
    name: "Daniel K.",
    role: "Verified buyer · Vantage Fitness Watch",
    quote: "Bought based on the rubric scores, not marketing copy. GPS lock time was exactly as described — under 4 seconds outdoors.",
    rating: 5
  },
  {
    name: "Sasha R.",
    role: "Verified buyer · Orbit Smart Bulb 4-Pack",
    quote: "Setup without a separate hub was the deciding factor and it worked exactly like the listing said. Saved me a return.",
    rating: 4
  },
  {
    name: "Tomás L.",
    role: "Verified buyer · Echo Ridge Headphones",
    quote: "Price tracker caught a $40 drop two days after I bookmarked the page. Bought at the lower price without lifting a finger.",
    rating: 5
  },
  {
    name: "Aaliyah B.",
    role: "Verified buyer · Halo Smart Ring",
    quote: "Appreciated that the review mentioned sizing runs small. Ordered a half size up and it fit perfectly on the first try.",
    rating: 4
  }
];
