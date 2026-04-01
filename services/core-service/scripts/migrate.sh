#!/usr/bin/env bash
set -euo pipefail

: "${DB_HOST:=localhost}"
: "${DB_PORT:=5432}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=postgres}"
: "${DB_NAME:=smartstay_auth}"
: "${DB_SSL_MODE:=disable}"

export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSL_MODE}"

if ! command -v migrate >/dev/null 2>&1; then
  echo "migrate CLI is required: https://github.com/golang-migrate/migrate"
  exit 1
fi

migrate -path deployments/migrations -database "${DATABASE_URL}" up
