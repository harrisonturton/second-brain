#!/bin/bash

# Exit on error
set -e

# Database configuration
DB_NAME="second_brain"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "Initializing database..."

# Check if database exists
DB_EXISTS=$(psql -U $DB_USER -h $DB_HOST -p $DB_PORT -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ -z "$DB_EXISTS" ]; then
    echo "Creating database $DB_NAME..."
    psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME"
else
    echo "Database $DB_NAME already exists"
fi

# Apply schema
echo "Applying schema..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f "$(dirname "$0")/schema.sql"

echo "Database initialization complete!"