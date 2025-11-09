#!/usr/bin/env bash

# Build script for Dedalus deployment without Docker.
# Installs backend deps, builds the frontend, and starts the FastAPI app.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$ROOT_DIR/.venv"

echo "==> Installing backend dependencies"
python3 -m venv "$VENV_DIR"
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r "$ROOT_DIR/backend/requirements.txt"

if [ -f "$ROOT_DIR/frontend/package.json" ]; then
  echo "==> Installing frontend dependencies"
  pushd "$ROOT_DIR/frontend" >/dev/null
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install --frozen-lockfile || pnpm install
    pnpm build || pnpm run build
  elif command -v npm >/dev/null 2>&1; then
    npm install
    npm run build
  else
    echo "⚠️  Neither pnpm nor npm found; skipping frontend build" >&2
  fi
  popd >/dev/null
fi

echo "==> Starting FastAPI backend"
cd "$ROOT_DIR/backend"
exec uvicorn main:app --host "0.0.0.0" --port "${PORT:-8080}"
