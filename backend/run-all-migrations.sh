#!/bin/bash
# Usage: ./run-all-migrations.sh [migrations_dir]
# Runs all new SQL migrations in the given directory (default: ./migrations)

set -e

# Load environment variables from .env if it exists
if [ -f .env ]; then
  export $(grep -E '^(POSTGRES_CONTAINER_NAME|POSTGRES_USER|POSTGRES_DB)=' .env | xargs)
fi

POSTGRES_CONTAINER=${POSTGRES_CONTAINER_NAME:-postgres}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}
MIGRATIONS_DIR=${1:-./migrations}

# Ensure migrations table exists
INIT_MIGRATIONS_SQL="CREATE TABLE IF NOT EXISTS migrations (id SERIAL PRIMARY KEY, filename VARCHAR(255) UNIQUE NOT NULL, run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
echo "$INIT_MIGRATIONS_SQL" | docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

# Find and sort all migration files
MIGRATIONS=$(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort)

for FILE in $MIGRATIONS; do
  BASENAME=$(basename "$FILE")
  # Check if migration has already run
  ALREADY_RUN=$(docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM migrations WHERE filename = '$BASENAME' LIMIT 1;")
  if [ "$ALREADY_RUN" != "1" ]; then
    echo "Running migration: $BASENAME"
    docker cp "$FILE" "$POSTGRES_CONTAINER":/tmp/migration.sql
    docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/migration.sql
    docker exec -i "$POSTGRES_CONTAINER" rm /tmp/migration.sql
    # Record migration as run
    docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "INSERT INTO migrations (filename) VALUES ('$BASENAME');"
    echo "Migration $BASENAME complete."
  else
    echo "Skipping already run migration: $BASENAME"
  fi
done
