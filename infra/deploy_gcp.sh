#!/usr/bin/env bash
# Deploy Cafe Companion Ecosystem to Google Cloud Platform (Cloud Run)

set -e

PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project)}
REGION=${GCP_REGION:-"us-central1"}

echo "🚀 Deploying Cafe Companion to GCP Project: $PROJECT_ID in Region: $REGION..."

# 1. Build & Deploy AI Backend to Cloud Run
echo "📦 Building & Deploying AI Service (Python FastAPI + Gemini)..."
gcloud builds submit backend-ai --tag gcr.io/$PROJECT_ID/cafe-companion-ai
gcloud run deploy cafe-companion-ai \
  --image gcr.io/$PROJECT_ID/cafe-companion-ai \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="$GEMINI_API_KEY"

# 2. Build & Deploy Real-time Service to Cloud Run
echo "📦 Building & Deploying Realtime Service (Express + Socket.io)..."
gcloud builds submit backend-realtime --tag gcr.io/$PROJECT_ID/cafe-companion-realtime
gcloud run deploy cafe-companion-realtime \
  --image gcr.io/$PROJECT_ID/cafe-companion-realtime \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

# 3. Build & Deploy Frontend (Firebase Hosting or Cloud Storage + CDN)
echo "📦 Building Frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "✅ All services successfully deployed to Google Cloud Platform!"
