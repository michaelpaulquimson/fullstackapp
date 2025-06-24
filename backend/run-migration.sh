#!/bin/bash
# Usage: ./run-migration.sh path/to/migration.sql
# This script copies a migration SQL file into the Postgres Docker container and runs it.

POSTGRES_CONTAINER=postgres  # Change to your Postgres container name
DB_USER=postgres             # Change to your DB user
DB_NAME=postgres             # Change to your DB name

if [ -z "$1" ]; then
  echo "Usage: $0 path/to/migration.sql"
  exit 1
fi

MIGRATION_FILE=$1

echo "Running migration: $MIGRATION_FILE on $DB_NAME as $DB_USER in container $POSTGRES_CONTAINER"
docker cp "$MIGRATION_FILE" "$POSTGRES_CONTAINER":/tmp/migration.sql
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/migration.sql
docker exec -i "$POSTGRES_CONTAINER" rm /tmp/migration.sql
echo "Migration complete."
