# Stage 1: Build the React TypeScript Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend with Embedded Frontend
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PORT=8080

COPY backend-ai/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy static frontend build output
COPY --from=frontend-builder /app/frontend/dist ./static

# Copy Python AI Backend source
COPY backend-ai/ ./

EXPOSE 8080

# Cloud Run injects $PORT (default 8080)
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
