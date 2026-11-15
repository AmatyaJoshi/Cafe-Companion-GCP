"""
Cafe Companion - AI Backend Service
Powered by FastAPI and Google Gemini AI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import json
import random
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI App
app = FastAPI(
    title="Cafe Companion AI API",
    description="Intelligent Conversational Ordering, Better Waits, Cafe Mode Proximity Matching & Room Telemetry",
    version="1.0.0"
)

# Enable CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try importing Google GenAI SDK
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
try:
    from google import genai
    from google.genai import types
    if GEMINI_API_KEY:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Notice: Google GenAI client not initialized ({e}). Using dynamic smart fallback heuristics.")

# --- Data Stores (Mock Database for quickstart) ---

MENU_ITEMS = [
    {
        "id": "item-1",
        "name": "Ethiopian Yirgacheffe Pour-Over",
        "category": "Coffee",
        "price": 5.75,
        "prep_complexity_seconds": 240,
        "description": "Floral jasmine, bergamot, and sweet citrus notes. Light roast single origin.",
        "dietary": ["Vegan", "Gluten-Free", "Zero Sugar"],
        "allergens": [],
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
        "story_title": "Today's Roast: Washed Yirgacheffe",
        "story_barista": "Barista Maya"
    },
    {
        "id": "item-2",
        "name": "Iced Vanilla Oat Latte",
        "category": "Coffee",
        "price": 6.25,
        "prep_complexity_seconds": 90,
        "description": "Rich double espresso with silky organic oat milk and house-made vanilla bean syrup.",
        "dietary": ["Vegan", "Dairy-Free"],
        "allergens": ["Oats"],
        "image": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
        "story_title": "Double Ristretto Pull",
        "story_barista": "Barista Sam"
    },
    {
        "id": "item-3",
        "name": "Ceremonial Kyoto Matcha Latte",
        "category": "Tea",
        "price": 6.50,
        "prep_complexity_seconds": 120,
        "description": "Stone-ground first harvest Uji matcha, lightly sweetened with wildflower honey.",
        "dietary": ["Vegetarian", "Antioxidant Rich"],
        "allergens": [],
        "image": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
        "story_title": "Whisking Uji Ceremonial Grade",
        "story_barista": "Barista Leo"
    },
    {
        "id": "item-4",
        "name": "Cold Brew Nitro Tap",
        "category": "Coffee",
        "price": 5.50,
        "prep_complexity_seconds": 30,
        "description": "24-hour slow steeped Colombian bean cold brew infused with micro-nitrogen bubbles.",
        "dietary": ["Vegan", "Keto", "Sugar-Free"],
        "allergens": [],
        "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
        "story_title": "Fresh Nitro Tap Pour",
        "story_barista": "Barista Maya"
    },
    {
        "id": "item-5",
        "name": "Cardamom Pistachio Croissant",
        "category": "Bakery",
        "price": 4.95,
        "prep_complexity_seconds": 60,
        "description": "Laminated flaky French pastry baked fresh daily, filled with cardamom pistachio frangipane.",
        "dietary": ["Vegetarian"],
        "allergens": ["Gluten", "Tree Nuts (Pistachio)", "Dairy", "Eggs"],
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        "story_title": "Fresh Oven Drop (7:00 AM Batch)",
        "story_barista": "Baker Chloe"
    },
    {
        "id": "item-6",
        "name": "Wild Mushroom & Truffle Sourdough Melt",
        "category": "Food",
        "price": 9.50,
        "prep_complexity_seconds": 360,
        "description": "Roasted chanterelles and cremini, gruyere, white truffle aioli on grilled country loaf.",
        "dietary": ["Vegetarian"],
        "allergens": ["Gluten", "Dairy"],
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
        "story_video_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
        "story_title": "Artisanal Melt Press",
        "story_barista": "Chef Daniel"
    }
]

# In-memory store for Cafe Mode patrons
CAFE_MODE_PATRONS = [
    {
        "id": "patron-1",
        "name": "Elena Rostova",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "role": "AI Engineer & Founder",
        "current_project": "Building an autonomous agent workflow engine",
        "interests": ["Generative AI", "Distributed Systems", "Rock Climbing", "Specialty Coffee"],
        "status_badge": "Open to 15m Coffee Chat ☕",
        "table": "Table 04 (Mezzanine)",
        "looking_for": "Looking for seed co-founders & feedback on agentic UI"
    },
    {
        "id": "patron-2",
        "name": "Marcus Chen",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "role": "Product Designer",
        "current_project": "Redesigning local community micro-apps",
        "interests": ["Figma Systems", "Urbanism", "Synthesizers", "Matcha"],
        "status_badge": "Designing in Flow 🎨 (Say hi for feedback)",
        "table": "Table 09 (Window Bar)",
        "looking_for": "Collaborating with full-stack engineers"
    },
    {
        "id": "patron-3",
        "name": "Sophia Bennett",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
        "role": "Indie Author & Essayist",
        "current_project": "Writing speculative sci-fi novellas",
        "interests": ["Sci-Fi", "Philosophy of Tech", "Pour-Overs", "Board Games"],
        "status_badge": "Writing Mode ✍️ (Wave if you love books)",
        "table": "Table 12 (Corner Booth)",
        "looking_for": "Readers who love Ted Chiang & Ursula Le Guin"
    },
    {
        "id": "patron-4",
        "name": "David Kim",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        "role": "Growth Marketer & Angel",
        "current_project": "Advising B2B SaaS pre-seed companies",
        "interests": ["SaaS Metrics", "Podcasts", "Marathons", "Cold Brews"],
        "status_badge": "Free for Coffee Chats ☕",
        "table": "Table 02 (Patio)",
        "looking_for": "Meeting early-stage founders building in health & developer tools"
    }
]

# In-memory orders and room telemetry
ORDERS_DB = []
ROOM_FEEDBACKS = [
    {"id": "fb-1", "category": "TEMPERATURE", "sentiment_tag": "TOO_COLD", "comment": "The AC near table 4 is blowing directly down", "timestamp": "10 mins ago"},
    {"id": "fb-2", "category": "WIFI", "sentiment_tag": "GREAT", "comment": "500 Mbps fiber speed is incredible for coding", "timestamp": "15 mins ago"},
    {"id": "fb-3", "category": "MUSIC", "sentiment_tag": "PERFECT", "comment": "Lo-Fi playlist creates the best focus vibe", "timestamp": "25 mins ago"}
]


# --- Request & Response Models ---

class OrderRequest(BaseModel):
    user_input: str
    dietary_preferences: Optional[List[str]] = Field(default_factory=list)
    customer_name: Optional[str] = "Guest"

class OrderItemCustomization(BaseModel):
    milk: Optional[str] = "Standard"
    sweetness: Optional[str] = "Normal"
    temperature: Optional[str] = "Hot"
    size: Optional[str] = "Regular"
    notes: Optional[str] = ""

class ExtractedOrderItem(BaseModel):
    item_id: str
    name: str
    quantity: int = 1
    price: float
    customizations: OrderItemCustomization = Field(default_factory=OrderItemCustomization)

class OrderResponse(BaseModel):
    items: List[ExtractedOrderItem]
    total_price: float
    estimated_wait_seconds: int
    ai_response_message: str
    needs_clarification: bool = False
    clarification_question: Optional[str] = None
    dietary_warnings: List[str] = Field(default_factory=list)

class IcebreakerRequest(BaseModel):
    user_a_name: str
    user_a_role: str
    user_a_project: str
    user_a_interests: List[str]
    user_b_name: str
    user_b_role: str
    user_b_project: str
    user_b_interests: List[str]

class IcebreakerResponse(BaseModel):
    icebreaker_text: str
    common_topics: List[str]
    suggested_micro_action: str

class RoomFeedbackRequest(BaseModel):
    category: str  # TEMPERATURE, MUSIC, WIFI, VIBE, CLEANLINESS
    sentiment_tag: str  # TOO_COLD, TOO_LOUD, PERFECT, DIRTY_TABLE, etc.
    comment: Optional[str] = None
    table_number: Optional[str] = None

class BaristaCopilotInsight(BaseModel):
    urgency: str
    category: str
    message: str
    suggested_action: str

class RoomTelemetryResponse(BaseModel):
    overall_sentiment_score: float  # -1.0 to 1.0
    vibe_summary: str
    active_patron_count: int
    immediate_alerts: List[BaristaCopilotInsight]

class TasteRecommendRequest(BaseModel):
    weather: Optional[str] = "Rainy & Cold"
    temperature_c: Optional[float] = 16.0
    mood: Optional[str] = "Need Deep Focus"
    dietary: Optional[List[str]] = Field(default_factory=list)


# --- Core Logic & Endpoints ---

@app.get("/")
def root():
    return {
        "service": "Cafe Companion AI Backend",
        "status": "online",
        "gemini_active": gemini_client is not None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/menu")
def get_menu():
    return {"menu": MENU_ITEMS}

@app.get("/api/patrons")
def get_patrons():
    return {"patrons": CAFE_MODE_PATRONS}

@app.get("/api/queue/predict")
def predict_queue(item_ids: Optional[str] = None, active_baristas: int = 2):
    """
    Computes precise preparation queue wait time based on item complexities,
    barista throughput, and active ticket buffer.
    """
    selected_items = []
    if item_ids:
        ids_list = [i.strip() for i in item_ids.split(",") if i.strip()]
        for m in MENU_ITEMS:
            if m["id"] in ids_list:
                selected_items.append(m)
    
    total_complexity = sum(item["prep_complexity_seconds"] for item in selected_items) if selected_items else 180
    active_baristas = max(1, active_baristas)
    
    # Active orders buffer
    active_tickets_buffer = len(ORDERS_DB) * 45
    wait_seconds = int((total_complexity / active_baristas) + active_tickets_buffer)
    wait_minutes = round(wait_seconds / 60, 1)

    # Crowd density status
    if len(ORDERS_DB) < 3:
        crowd_status = "Quiet & Cozy"
        crowd_level = "LOW"
    elif len(ORDERS_DB) < 8:
        crowd_status = "Bustling & Energetic"
        crowd_level = "MEDIUM"
    else:
        crowd_status = "Peak Rush"
        crowd_level = "HIGH"

    return {
        "estimated_wait_seconds": wait_seconds,
        "estimated_wait_minutes": wait_minutes,
        "active_baristas": active_baristas,
        "active_orders_in_queue": len(ORDERS_DB),
        "crowd_status": crowd_status,
        "crowd_level": crowd_level,
        "best_time_to_visit": "11:15 AM (Next low occupancy window)"
    }

@app.post("/api/ai/order", response_model=OrderResponse)
def smart_conversational_order(req: OrderRequest):
    """
    Uses Gemini AI Function Calling to parse conversational speech or chat
    into a structured itemized order with dietary alerts.
    """
    menu_catalog_str = json.dumps([{
        "id": m["id"], "name": m["name"], "price": m["price"],
        "category": m["category"], "dietary": m["dietary"], "allergens": m["allergens"]
    } for m in MENU_ITEMS])

    # If Gemini client is active, run through Gemini 2.0 Flash
    if gemini_client:
        try:
            prompt = f"""
            You are the Cafe Companion Smart Barista.
            Parse the customer's conversational order request into a structured cart based on this cafe menu:
            Menu: {menu_catalog_str}

            Customer Diet/Allergies: {req.dietary_preferences}
            Customer Input: "{req.user_input}"

            Instructions:
            - Match item names and IDs accurately.
            - Extract milk choices (e.g. oat, whole, almond), temperature (hot/iced), sweetness (0%, 50%, normal), and size.
            - Check customer allergies against the allergens list for each matched item.
            - If details are critically missing, mark needs_clarification=true and ask a friendly barista question.
            - Be concise, welcoming, and hospitable in ai_response_message.
            """

            response = gemini_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema={
                        "type": "OBJECT",
                        "properties": {
                            "items": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "item_id": {"type": "STRING"},
                                        "name": {"type": "STRING"},
                                        "quantity": {"type": "INTEGER"},
                                        "customizations": {
                                            "type": "OBJECT",
                                            "properties": {
                                                "milk": {"type": "STRING"},
                                                "sweetness": {"type": "STRING"},
                                                "temperature": {"type": "STRING"},
                                                "size": {"type": "STRING"},
                                                "notes": {"type": "STRING"}
                                            }
                                        }
                                    },
                                    "required": ["item_id", "name", "quantity"]
                                }
                            },
                            "ai_response_message": {"type": "STRING"},
                            "needs_clarification": {"type": "BOOLEAN"},
                            "clarification_question": {"type": "STRING"},
                            "dietary_warnings": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            }
                        },
                        "required": ["items", "ai_response_message", "needs_clarification"]
                    }
                )
            )
            parsed = json.loads(response.text)
            
            # Enrich prices
            extracted_items = []
            total = 0.0
            total_complexity = 0
            menu_map = {m["id"]: m for m in MENU_ITEMS}

            for itm in parsed.get("items", []):
                m_info = menu_map.get(itm["item_id"]) or next((m for m in MENU_ITEMS if m["name"].lower() in itm["name"].lower()), MENU_ITEMS[0])
                qty = itm.get("quantity", 1)
                price = m_info["price"] * qty
                total += price
                total_complexity += m_info["prep_complexity_seconds"] * qty
                cust_data = itm.get("customizations", {})
                extracted_items.append(ExtractedOrderItem(
                    item_id=m_info["id"],
                    name=m_info["name"],
                    quantity=qty,
                    price=price,
                    customizations=OrderItemCustomization(
                        milk=cust_data.get("milk", "Oat" if "oat" in req.user_input.lower() else "Standard"),
                        sweetness=cust_data.get("sweetness", "Normal"),
                        temperature=cust_data.get("temperature", "Iced" if "iced" in req.user_input.lower() else "Hot"),
                        size=cust_data.get("size", "Large" if "large" in req.user_input.lower() else "Regular"),
                        notes=cust_data.get("notes", "")
                    )
                ))

            wait_time = max(90, int(total_complexity / 2) + len(ORDERS_DB) * 30)

            return OrderResponse(
                items=extracted_items,
                total_price=round(total, 2),
                estimated_wait_seconds=wait_time,
                ai_response_message=parsed.get("ai_response_message", "I have added that to your order!"),
                needs_clarification=parsed.get("needs_clarification", False),
                clarification_question=parsed.get("clarification_question"),
                dietary_warnings=parsed.get("dietary_warnings", [])
            )
        except Exception as err:
            print(f"Gemini API invocation error: {err}. Falling back to internal smart parser.")

    # Intelligent Heuristic Fallback
    input_lower = req.user_input.lower()
    matched_items = []
    total = 0.0
    total_complexity = 0
    dietary_warnings = []

    for item in MENU_ITEMS:
        # Match keywords
        item_words = item["name"].lower().split()
        if any(w in input_lower for w in item_words if len(w) > 3) or item["category"].lower() in input_lower:
            custom_milk = "Oat Milk" if "oat" in input_lower else ("Almond Milk" if "almond" in input_lower else "Whole Milk")
            custom_temp = "Iced" if "iced" in input_lower or "cold" in input_lower else "Hot"
            custom_size = "Large" if "large" in input_lower else "Regular"
            
            # Check allergens
            if req.dietary_preferences:
                for pref in req.dietary_preferences:
                    if "gluten" in pref.lower() and any("gluten" in a.lower() for a in item["allergens"]):
                        dietary_warnings.append(f"Notice: {item['name']} contains Gluten.")
                    if "nut" in pref.lower() and any("nut" in a.lower() for a in item["allergens"]):
                        dietary_warnings.append(f"Notice: {item['name']} contains Tree Nuts.")

            matched_items.append(ExtractedOrderItem(
                item_id=item["id"],
                name=item["name"],
                quantity=1,
                price=item["price"],
                customizations=OrderItemCustomization(
                    milk=custom_milk,
                    sweetness="50% Less Sweet" if "less sweet" in input_lower else "Normal",
                    temperature=custom_temp,
                    size=custom_size,
                    notes="Prepared with care"
                )
            ))
            total += item["price"]
            total_complexity += item["prep_complexity_seconds"]

    if not matched_items:
        # Default recommend popular item
        fallback = MENU_ITEMS[1]  # Iced Vanilla Oat Latte
        matched_items.append(ExtractedOrderItem(
            item_id=fallback["id"],
            name=fallback["name"],
            quantity=1,
            price=fallback["price"],
            customizations=OrderItemCustomization(
                milk="Organic Oat Milk",
                sweetness="Normal",
                temperature="Iced",
                size="Regular",
                notes=""
            )
        ))
        total += fallback["price"]
        total_complexity += fallback["prep_complexity_seconds"]

    wait_time = max(90, int(total_complexity / 2) + len(ORDERS_DB) * 30)

    return OrderResponse(
        items=matched_items,
        total_price=round(total, 2),
        estimated_wait_seconds=wait_time,
        ai_response_message=f"I've got you down for {' and '.join(m.name for m in matched_items)}. Prepared freshly just the way you like it!",
        needs_clarification=False,
        clarification_question=None,
        dietary_warnings=dietary_warnings
    )

@app.post("/api/ai/icebreaker", response_model=IcebreakerResponse)
def generate_icebreaker(req: IcebreakerRequest):
    """
    Generates a personalized, non-awkward icebreaker and mutual spark topic
    between two patrons in 'Cafe Mode'.
    """
    common_interests = list(set(req.user_a_interests).intersection(set(req.user_b_interests)))
    if not common_interests:
        common_interests = [req.user_a_interests[0], req.user_b_interests[0]]

    if gemini_client:
        try:
            prompt = f"""
            Two people are working at the same coffee shop and mutually opted into 'Cafe Mode':
            Person 1: {req.user_a_name} ({req.user_a_role}), currently building "{req.user_a_project}". Loves: {req.user_a_interests}.
            Person 2: {req.user_b_name} ({req.user_b_role}), currently building "{req.user_b_project}". Loves: {req.user_b_interests}.

            Generate a charming, respectful, 1-sentence micro-icebreaker that connects their shared passions.
            Avoid overly romantic or corporate language. Keep it casual, friendly, and cafe-appropriate.
            """
            response = gemini_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt
            )
            return IcebreakerResponse(
                icebreaker_text=response.text.strip(),
                common_topics=common_interests,
                suggested_micro_action=f"Wave to {req.user_b_name} or send a warm flat white to their table!"
            )
        except Exception as e:
            print(f"Gemini Icebreaker Error: {e}")

    # Fallback Smart Icebreaker Generator
    icebreaker = (
        f"You both share a passion for {', '.join(common_interests)}! "
        f"Ask {req.user_b_name} about their current work on '{req.user_b_project}'—great minds brew alike."
    )
    return IcebreakerResponse(
        icebreaker_text=icebreaker,
        common_topics=common_interests,
        suggested_micro_action=f"Wave to {req.user_b_name} or tap 'Send a Coffee' to share a conversation table."
    )

@app.post("/api/feedback")
def submit_ambient_feedback(req: RoomFeedbackRequest):
    """
    Receives 1-tap ambient room feedback (Temperature, Music, Wi-Fi, Cleanliness).
    """
    new_entry = {
        "id": f"fb-{len(ROOM_FEEDBACKS) + 1}",
        "category": req.category,
        "sentiment_tag": req.sentiment_tag,
        "comment": req.comment or f"Reported {req.sentiment_tag.replace('_', ' ').title()}",
        "table_number": req.table_number or "Bar Counter",
        "timestamp": "Just now"
    }
    ROOM_FEEDBACKS.insert(0, new_entry)
    return {"status": "success", "feedback": new_entry}

@app.get("/api/ai/room-sentiment", response_model=RoomTelemetryResponse)
def get_room_sentiment():
    """
    Analyzes recent telemetry and feedback, generating actionable alerts for the Barista Copilot.
    """
    recent_feedbacks = ROOM_FEEDBACKS[:10]
    
    # Calculate sentiment score
    negative_tags = ["TOO_COLD", "TOO_HOT", "TOO_LOUD", "SLOW_WIFI", "DIRTY_TABLE"]
    positive_tags = ["PERFECT", "GREAT", "COZY", "FAST_WIFI", "LOVELY_MUSIC"]
    
    neg_count = sum(1 for f in recent_feedbacks if f["sentiment_tag"] in negative_tags)
    pos_count = sum(1 for f in recent_feedbacks if f["sentiment_tag"] in positive_tags)
    
    total = max(1, neg_count + pos_count)
    score = round((pos_count - neg_count) / total, 2)

    alerts = []
    # Dynamic alert checks
    if any(f["sentiment_tag"] == "TOO_COLD" for f in recent_feedbacks):
        alerts.append(BaristaCopilotInsight(
            urgency="HIGH",
            category="TEMPERATURE",
            message="Multiple guests near Table 4 reported excessive AC chill.",
            suggested_action="Adjust mezzanine thermostat from 19°C to 22°C."
        ))
    
    if any(f["sentiment_tag"] == "TOO_LOUD" for f in recent_feedbacks):
        alerts.append(BaristaCopilotInsight(
            urgency="MEDIUM",
            category="MUSIC",
            message="Current soundtrack volume is competing with laptop focus sessions.",
            suggested_action="Lower main floor amplifier by 3dB and queue Lo-Fi Ambient."
        ))

    if not alerts:
        alerts.append(BaristaCopilotInsight(
            urgency="LOW",
            category="VIBE",
            message="Room atmosphere is balanced. Outlets and Wi-Fi performing smoothly.",
            suggested_action="Prepare for 11:30 AM lunch rush pastry restocking."
        ))

    vibe_summary = "Warm, productive co-working atmosphere with steady caffeine flow."
    if score < 0:
        vibe_summary = "Slight ambient friction: Temperature and sound adjustments recommended."

    return RoomTelemetryResponse(
        overall_sentiment_score=score,
        vibe_summary=vibe_summary,
        active_patron_count=len(CAFE_MODE_PATRONS) + 14,
        immediate_alerts=alerts
    )

@app.post("/api/ai/recommend")
def get_personalized_recommendation(req: TasteRecommendRequest):
    """
    Recommends food & drinks based on ambient weather, time of day, and patron mood.
    """
    recommendations = []
    if "cold" in (req.weather or "").lower() or (req.temperature_c and req.temperature_c < 18):
        recommendations.append({
            "item": MENU_ITEMS[0], # Pour-over
            "reason": "Cold rainy weather outside calls for a piping hot, fragrant Ethiopian Yirgacheffe."
        })
        recommendations.append({
            "item": MENU_ITEMS[4], # Cardamom Pistachio Croissant
            "reason": "Freshly warm pastry to pair with your hot cup."
        })
    else:
        recommendations.append({
            "item": MENU_ITEMS[3], # Nitro cold brew
            "reason": "Refreshing nitro cold brew with smooth caffeine lift for maximum midday energy."
        })
        recommendations.append({
            "item": MENU_ITEMS[1], # Iced Vanilla Oat Latte
            "reason": "Silky, sweet iced comfort drink."
        })

    return {
        "context": {
            "weather": req.weather,
            "temperature_c": req.temperature_c,
            "mood": req.mood
        },
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
