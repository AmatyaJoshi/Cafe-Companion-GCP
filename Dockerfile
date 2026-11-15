FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PORT=8080

COPY backend-ai/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend-ai/ ./

EXPOSE 8080

# Cloud Run injects $PORT (default 8080)
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
