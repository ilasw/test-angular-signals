#!/bin/sh
echo "Running database migrations..."
npm run migration:run
echo "Starting application..."
node dist/main