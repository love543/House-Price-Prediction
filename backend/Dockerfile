FROM python:3.10.13-slim

WORKDIR /app

# Install minimal system deps (NO gcc → forces wheels)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (layer caching)
COPY requirements.txt .

# Upgrade pip & install deps
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy rest of the application
COPY . .

# Expose Render port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
