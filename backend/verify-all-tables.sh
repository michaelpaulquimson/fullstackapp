#!/bin/bash
# Usage: ./verify-all-tables.sh
# Describes all tables in the public schema of the configured Postgres DB

set -e

# Load environment variables from .env if it exists
if [ -f .env ]; then
  export $(grep -E '^(POSTGRES_CONTAINER_NAME|POSTGRES_USER|POSTGRES_DB)=' .env | xargs)
fi

POSTGRES_CONTAINER=${POSTGRES_CONTAINER_NAME:-postgres}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}

TABLES=$(docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT tablename FROM pg_tables WHERE schemaname = 'public'")

for TABLE in $TABLES; do
  echo -e "\n--- Structure for table: $TABLE ---"
  docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\\d $TABLE"
done
