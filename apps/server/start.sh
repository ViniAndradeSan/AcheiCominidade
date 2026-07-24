#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /usr/src/app/apps/server
bun run prisma migrate deploy

echo "Seeding database..."
bun run prisma/seed.ts

echo "Starting server..."
exec bun dist/main.js