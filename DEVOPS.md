# Savora DevOps Deployment

## Architecture

Developer push -> GitHub Actions -> Docker image -> GHCR -> SSH to AWS EC2 -> Docker Compose -> Nginx -> Frontend/Backend -> PostgreSQL.

Repositories are independent:
- `savora-frontend`: builds/pushes/deploys only the frontend image.
- `savora-backend`: builds/pushes/deploys only the backend image.

## EC2 first-time setup

1. Create an Ubuntu EC2 instance.
2. Security Group: allow TCP 22 from your IP and TCP 80 from the internet. Do not expose 3000, 4000, or 5432.
3. SSH to the server.
4. Install Docker and create the app directory.
5. Copy `deploy/docker-compose.yml`, `deploy/nginx.conf`, and `.env` to `~/savora`.
6. Replace `YOUR_GITHUB_OWNER` in `.env` with the GitHub owner.
7. Put real secrets in `.env`.
8. Start:
   `cd ~/savora && docker compose up -d`

## GitHub Actions secrets

Add these secrets in BOTH repositories:
- `EC2_HOST` = EC2 public IP or DNS
- `EC2_USER` = `ubuntu`
- `EC2_SSH_KEY` = private SSH key used for EC2

For private GHCR packages, the remote `docker login` uses the workflow `GITHUB_TOKEN`; if your org/repository policy blocks that, create a read-only GitHub PAT with `read:packages` and adapt the workflow.

## Automatic deployment

Frontend push to `main`:
1. Build Docker image.
2. Push `latest` + commit SHA to GHCR.
3. SSH to EC2.
4. Pull only `frontend`.
5. Recreate only the frontend container.

Backend push to `main` does the same for `backend`; the container runs `prisma migrate deploy` before starting the API.

## Important

The first deployment must have the shared `docker-compose.yml`, `nginx.conf`, and `.env` on EC2. After that, developers only need to push to `main`.
