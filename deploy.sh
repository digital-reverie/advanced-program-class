#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
command -v docker >/dev/null || { echo 'Docker is required.' >&2; exit 1; }
docker info >/dev/null
docker compose version >/dev/null
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo 'Created .env with local defaults. Edit it to set your server port and origin.'
fi
docker compose config --quiet
# Build and validate before replacing the running service.
docker compose build --pull app
if ! docker compose up -d --no-build --wait --wait-timeout 120 app; then
  docker compose logs --tail=80 app >&2
  echo 'Deployment failed its health check. Inspect logs before retrying.' >&2
  exit 1
fi
docker compose ps
echo 'Deployment is healthy. Use docker compose logs -f app to follow logs.'
