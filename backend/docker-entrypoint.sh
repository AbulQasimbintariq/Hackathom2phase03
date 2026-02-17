#!/usr/bin/env bash
set -e

# Simple TCP wait for Postgres host extracted from DATABASE_URL
# Fallback to waiting on "db:5432" which is set by docker-compose
DB_URL=${DATABASE_URL:-"postgresql://postgres:postgres@db:5432/tasks_db"}

# parse host and port from DB_URL
# crude parsing but works for expected formats
DB_HOST=$(echo "$DB_URL" | awk -F'[@:/]' '{print $(NF-2)}')
DB_PORT=$(echo "$DB_URL" | awk -F'[@:/]' '{print $(NF-1)}')
if [ -z "$DB_HOST" ]; then
  DB_HOST=db
fi
if [ -z "$DB_PORT" ]; then
  DB_PORT=5432
fi

echo "Waiting for DB at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "DB is up — running migrations"
alembic -c alembic.ini upgrade head

echo "Starting server"
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
