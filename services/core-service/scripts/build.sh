#!/usr/bin/env bash
set -euo pipefail

go build -o bin/auth-service ./cmd/server
