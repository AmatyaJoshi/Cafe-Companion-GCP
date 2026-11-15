import { MenuItem, CafePatron, RoomTelemetry, OrderTicket } from '../types';

const AI_API_BASE = 'http://localhost:8000';
const REALTIME_API_BASE = 'http://localhost:5000';

export const fallbackMenu: MenuItem[] = [
  {
    id: "item-1",
    name: "Ethiopian Yirgacheffe Pour-Over",
    category: "Coffee",
    price: 5.75,
    prep_complexity_seconds: 240,
    description: "Floral jasmine, bergamot, and sweet citrus notes. Light roast single origin.",
    dietary: ["Vegan", "Gluten-Free", "Zero Sugar"],
    allergens: [],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    story_title: "Today's Roast: Washed Yirgacheffe",
    story_barista: "Barista Maya"
  },
  {
    id: "item-2",
    name: "Iced Vanilla Oat Latte",
    category: "Coffee",
    price: 6.25,
    prep_complexity_seconds: 90,
    description: "Rich double espresso with silky organic oat milk and house-made vanilla bean syrup.",
    dietary: ["Vegan", "Dairy-Free"],
    allergens: ["Oats"],
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    story_title: "Double Ristretto Pull",
    story_barista: "Barista Sam"
  },
  {
    id: "item-3",
    name: "Ceremonial Kyoto Matcha Latte",
    category: "Tea",
    price: 6.50,
    prep_complexity_seconds: 120,
    description: "Stone-ground first harvest Uji matcha, lightly sweetened with wildflower honey.",
    dietary: ["Vegetarian", "Antioxidant Rich"],
    allergens: [],
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    story_title: "Whisking Uji Ceremonial Grade",
    story_barista: "Barista Leo"
  },
  {
    id: "item-4",
    name: "Cold Brew Nitro Tap",
    category: "Coffee",
    price: 5.50,
    prep_complexity_seconds: 30,
    description: "24-hour slow steeped Colombian bean cold brew infused with micro-nitrogen bubbles.",
    dietary: ["Vegan", "Keto", "Sugar-Free"],
    allergens: [],
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
    story_title: "Fresh Nitro Tap Pour",
    story_barista: "Barista Maya"
  },
  {
    id: "item-5",
    name: "Cardamom Pistachio Croissant",
    category: "Bakery",
    price: 4.95,
    prep_complexity_seconds: 60,
    description: "Laminated flaky French pastry baked fresh daily, filled with cardamom pistachio frangipane.",
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Tree Nuts (Pistachio)", "Dairy", "Eggs"],
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    story_title: "Fresh Oven Drop (7:00 AM Batch)",
    story_barista: "Baker Chloe"
  },
  {
    id: "item-6",
    name: "Wild Mushroom & Truffle Sourdough Melt",
    category: "Food",
    price: 9.50,
    prep_complexity_seconds: 360,
    description: "Roasted chanterelles and cremini, gruyere, white truffle aioli on grilled country loaf.",
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy"],
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    story_video_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    story_title: "Artisanal Melt Press",
    story_barista: "Chef Daniel"
  }
];

export const fallbackPatrons: CafePatron[] = [
  {
    id: "patron-1",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    role: "AI Engineer & Founder",
    current_project: "Building an autonomous agent workflow engine",
    interests: ["Generative AI", "Distributed Systems", "Rock Climbing", "Specialty Coffee"],
    status_badge: "Open to 15m Coffee Chat ☕",
    table: "Table 04 (Mezzanine)",
    looking_for: "Looking for seed co-founders & feedback on agentic UI"
  },
  {
    id: "patron-2",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    role: "Product Designer",
    current_project: "Redesigning local community micro-apps",
    interests: ["Figma Systems", "Urbanism", "Synthesizers", "Matcha"],
    status_badge: "Designing in Flow 🎨 (Say hi for feedback)",
    table: "Table 09 (Window Bar)",
    looking_for: "Collaborating with full-stack engineers"
  },
  {
    id: "patron-3",
    name: "Sophia Bennett",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    role: "Indie Author & Essayist",
    current_project: "Writing speculative sci-fi novellas",
    interests: ["Sci-Fi", "Philosophy of Tech", "Pour-Overs", "Board Games"],
    status_badge: "Writing Mode ✍️ (Wave if you love books)",
    table: "Table 12 (Corner Booth)",
    looking_for: "Readers who love Ted Chiang & Ursula Le Guin"
  },
  {
    id: "patron-4",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    role: "Growth Marketer & Angel",
    current_project: "Advising B2B SaaS pre-seed companies",
    interests: ["SaaS Metrics", "Podcasts", "Marathons", "Cold Brews"],
    status_badge: "Free for Coffee Chats ☕",
    table: "Table 02 (Patio)",
    looking_for: "Meeting early-stage founders building in health & developer tools"
  }
];

export async function fetchMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${AI_API_BASE}/api/menu`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.menu;
    }
  } catch (e) {
    console.warn('Using local menu fallback:', e);
  }
  return fallbackMenu;
}

export async function fetchPatrons(): Promise<CafePatron[]> {
  try {
    const res = await fetch(`${AI_API_BASE}/api/patrons`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.patrons;
    }
  } catch (e) {
    console.warn('Using local patrons fallback:', e);
  }
  return fallbackPatrons;
}

export async function fetchRoomTelemetry(): Promise<RoomTelemetry> {
  try {
    const res = await fetch(`${AI_API_BASE}/api/ai/room-sentiment`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Using local room telemetry fallback:', e);
  }
  return {
    overall_sentiment_score: 0.85,
    vibe_summary: "Warm, productive co-working atmosphere with steady caffeine flow.",
    active_patron_count: 18,
    immediate_alerts: [
      {
        urgency: "MEDIUM",
        category: "TEMPERATURE",
        message: "Patrons near Table 4 reported slight AC draft.",
        suggested_action: "Adjust mezzanine thermostat from 19°C to 22°C."
      }
    ]
  };
}

export async function postConversationalOrder(userInput: string, dietary: string[] = []) {
  try {
    const res = await fetch(`${AI_API_BASE}/api/ai/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_input: userInput, dietary_preferences: dietary }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Using client smart order parser fallback:', e);
  }

  // Client-side smart fallback
  const inputLower = userInput.toLowerCase();
  const matched = fallbackMenu.filter(m => 
    inputLower.includes(m.name.toLowerCase().split(' ')[0]) || 
    inputLower.includes(m.category.toLowerCase())
  );
  const items = (matched.length > 0 ? matched : [fallbackMenu[1]]).map(m => ({
    item_id: m.id,
    name: m.name,
    quantity: 1,
    price: m.price,
    customizations: {
      milk: inputLower.includes('oat') ? 'Oat Milk' : 'Whole Milk',
      sweetness: inputLower.includes('less sweet') ? '50% Less Sweet' : 'Normal',
      temperature: inputLower.includes('iced') || inputLower.includes('cold') ? 'Iced' : 'Hot',
      size: inputLower.includes('large') ? 'Large' : 'Regular'
    }
  }));

  const warnings: string[] = [];
  if (dietary.includes('Gluten-Free') && items.some(i => i.name.includes('Croissant') || i.name.includes('Melt'))) {
    warnings.push('Allergy Alert: Selected bakery item contains gluten.');
  }

  return {
    items,
    total_price: items.reduce((acc, i) => acc + i.price, 0),
    estimated_wait_seconds: 180,
    ai_response_message: `I've prepared your custom order for ${items.map(i => i.name).join(' & ')} with your preferred modifiers.`,
    dietary_warnings: warnings
  };
}

export async function generateIcebreaker(userA: CafePatron, userB: CafePatron) {
  try {
    const res = await fetch(`${AI_API_BASE}/api/ai/icebreaker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_a_name: userA.name,
        user_a_role: userA.role,
        user_a_project: userA.current_project,
        user_a_interests: userA.interests,
        user_b_name: userB.name,
        user_b_role: userB.role,
        user_b_project: userB.current_project,
        user_b_interests: userB.interests
      }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Using client icebreaker generator fallback:', e);
  }

  const common = userA.interests.filter(i => userB.interests.includes(i));
  const topic = common.length > 0 ? common[0] : userB.interests[0];
  return {
    icebreaker_text: `You both share an appreciation for ${topic}! Ask ${userB.name} about their work on "${userB.current_project}".`,
    common_topics: common.length > 0 ? common : [topic],
    suggested_micro_action: `Wave to ${userB.name} at ${userB.table} or send a warm coffee!`
  };
}

export async function postFeedback(category: string, sentimentTag: string, comment?: string) {
  try {
    await fetch(`${AI_API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, sentiment_tag: sentimentTag, comment })
    });
  } catch (e) {
    console.warn('Feedback recorded locally:', e);
  }
}
