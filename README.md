# ☕ Cafe Companion (GCP & Gemini AI)

> **Transforming cafes into hyper-personalized, convenient, and connected social hubs for both guests and cafe teams.**

---

## 🌟 The 5 Implemented Core Pillars

1. **🎙️ Smart Conversational Ordering (Starbucks + Gemini AI)**
   - Conversational ordering in natural language or voice simulation (`ConversationalBar.tsx`).
   - Powered by **Google Gemini AI** with structured JSON output and intelligent heuristic fallback.
   - Real-time dietary and allergy guardrails (Vegan, Gluten-Free, Nut Allergies).
   - Full Starbucks-style modifiers: milk choices (Oat, Whole, Almond), sweetness levels, temperatures, and sizes.

2. **⏱️ Better Waits & Peak Optimization**
   - Dynamic wait times calculated from drink complexity weights and active barista counts.
   - Live order countdown and visual preparation progress (`WaitTracker.tsx`).
   - "Best Time to Visit" hourly density heatmap (Quiet Focus vs. Peak Rush).
   - Crema-protection geofence simulation: pulls espresso shots when the customer is within 300 meters.

3. **🤝 Connect People ("Cafe Mode" Proximity Social)**
   - Geofenced opt-in patron deck inspired by Tinder & Bumble BFF (`CafeModeDeck.tsx`).
   - Status chips: *"Building an autonomous agent workflow engine"*, *"Open to 15m Coffee Chat ☕"*.
   - Double opt-in "Say Hi & Spark" and "Send a Coffee" micro-gifting gesture.
   - Contextual Gemini Icebreaker Generator bridges mutual passions without awkwardness.

4. **📡 Understand the Room (Ambient Sentiment & Barista Copilot)**
   - 1-tap ambient room feedback (`RoomFeedbackWidget.tsx`): AC temperature, music volume, Wi-Fi speed.
   - Barista Copilot synthesizes room sentiment into actionable alerts (*"Mezzanine AC freezing -> set to 22°C"*).
   - Proactive automated service recovery tokens for delayed orders (`BaristaKDS.tsx`).

5. **✨ Hyper-Personalized Discovery (Instagram & Spotify Inspiration)**
   - Daily roast and baker drop highlights via ephemeral Instagram-style story reels (`StoryReels.tsx`).
   - Dynamic taste recommendations mapped to weather, temperature, and mood.

---

## 🛠️ Technology Architecture

```plaintext
Cafe-Companion-GCP/
├── frontend/             # React 19 + TypeScript + Tailwind CSS (Vite PWA)
│   ├── src/
│   │   ├── components/   # Navbar, StoryReels, ConversationalBar, MenuGrid, WaitTracker, CafeModeDeck, BaristaKDS
│   │   ├── services/     # API Client with self-healing offline fallbacks
│   │   └── App.tsx       # Main integrated application
│   └── dist/             # Production build output (verified)
│
├── backend-ai/           # Python 3.12 FastAPI + Google GenAI SDK
│   ├── main.py           # Gemini 3.8 Flash / 2.0 endpoints for ordering, icebreakers, sentiment & queue
│   ├── test_ai_backend.py# 8/8 Unit & integration tests passing
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Container definition for Cloud Run
│
├── backend-realtime/     # Express + TypeScript + Socket.io Gateway
│   ├── src/server.ts     # Real-time WebSocket hubs, orders, presence & crema alerts
│   ├── tsconfig.json     # Strict TypeScript configuration
│   └── Dockerfile        # Node container for Cloud Run
│
├── infra/                # GCP Cloud Run manifests & deployment scripts
│   ├── cloudrun-ai.yaml
│   ├── cloudrun-realtime.yaml
│   └── deploy_gcp.sh
│
├── run_dev.py            # Unified single-command launcher
├── CAFE_COMPANION_PLAN.md# Full architecture & specification document
└── package.json          # Root scripts
```

---

## 🚀 Quick Start Guide

### 1. Run Everything Simultaneously
To launch the frontend, AI backend, and real-time gateway with a single command:
```bash
python run_dev.py
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **AI Backend Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Real-time Gateway:** [http://localhost:5000/health](http://localhost:5000/health)

### 2. Run Backend Tests
```bash
npm run test:backend
```

### 3. Build Production Artifacts
```bash
npm run build
```

---
*Created for the Google Cloud Platform (GCP) & Gemini AI Ecosystem.*
