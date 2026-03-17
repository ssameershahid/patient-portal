#!/bin/bash
set -e

echo "=== Building patient-portal for production ==="

PROJECT_DIR="artifacts/patient-portal"

echo "Installing dependencies..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

echo "Building Next.js app..."
pnpm -C "$PROJECT_DIR" exec next build

echo "Copying static export to deployment directory..."
rm -rf "$PROJECT_DIR/dist/public"
mkdir -p "$PROJECT_DIR/dist/public"
cp -r "$PROJECT_DIR/out/"* "$PROJECT_DIR/dist/public/"

echo "=== Build complete ==="
echo "Static files are in $PROJECT_DIR/dist/public"
ls -la "$PROJECT_DIR/dist/public/" | head -20
