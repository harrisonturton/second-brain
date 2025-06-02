#!/bin/bash

# Exit on error
set -e

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

echo "Dropping database $DB_NAME on port $DB_PORT..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "DROP DATABASE IF EXISTS $DB_NAME;"
echo "Database dropped successfully!" 