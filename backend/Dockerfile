FROM python:3.11-slim

WORKDIR /app

# Install netcat for simple TCP wait and build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend .

# Entrypoint script will wait for DB and run migrations
COPY backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["/usr/local/bin/docker-entrypoint.sh"]
