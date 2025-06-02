#!/bin/bash

# Exit on error
set -e

echo "Initializing database..."

# Check if arguments are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Error: User, host, port number, and database name must be provided"
    echo "Usage: $0 <user> <host> <port_number> <database_name>"
    exit 1
fi

# Database configuration
DB_USER=$1
DB_HOST=$2
DB_PORT=$3
DB_NAME=$4

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