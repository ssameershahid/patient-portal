#!/bin/bash
set -e

echo "=== Building patient-portal for production ==="

PROJECT_DIR="artifacts/patient-portal"

echo "Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

echo "Building Next.js app..."
pnpm -C "$PROJECT_DIR" exec next build

STANDALONE_DIR="$PROJECT_DIR/.next/standalone"

echo "Copying static assets to standalone output..."
cp -r "$PROJECT_DIR/public" "$STANDALONE_DIR/$PROJECT_DIR/public"
cp -r "$PROJECT_DIR/.next/static" "$STANDALONE_DIR/$PROJECT_DIR/.next/static"

echo "=== Build complete ==="
