#!/bin/bash

# Exit on error
set -e

echo "Dropping database second_brain..."
psql -U postgres -c "DROP DATABASE second_brain;"
echo "Database dropped successfully!" 