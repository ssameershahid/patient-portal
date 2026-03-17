#!/bin/bash
set -e

export PORT="${PORT:-3000}"
export HOSTNAME="0.0.0.0"

echo "Starting patient-portal on port $PORT..."
exec node artifacts/patient-portal/.next/standalone/artifacts/patient-portal/server.js
