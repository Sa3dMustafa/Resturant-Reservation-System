#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$HOME/savora"
sudo apt-get update
sudo apt-get install -y ca-certificates curl git

# Docker
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
fi

sudo systemctl enable --now docker
mkdir -p "$APP_DIR"

echo "Copy docker-compose.yml, nginx.conf and .env into $APP_DIR"
echo "Then run: cd $APP_DIR && docker compose up -d"
echo "Open TCP 80 in the EC2 Security Group. Keep 3000/4000/5432 private."
