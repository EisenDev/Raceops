# Deployment Guide (RaceOps)

## 1. Environment Configuration
Set these variables in your production environment (Vercel or DigitalOcean):
- `DATABASE_URL`: Transaction pooler URL (e.g. from Supabase).
- `DIRECT_URL`: Session pooler URL (required for migrations).
- `IRON_SESSION_PASSWORD`: A secure 32+ character string.

## 2. Docker & DigitalOcean Flow
The project is containerized for efficient deployment on a $6 DigitalOcean Droplet (1GB RAM).

### Workflow:
1. **GitHub Build**: Every push to `main` triggers a GitHub Action.
2. **GHCR**: The action builds a production Docker image and pushes it to **GitHub Container Registry (GHCR)**.
3. **Droplet Pull**: The server pulls only the final "chunks" (layers), meaning the server doesn't need to perform the heavy "build" step. This saves memory.

### Deploying on DigitalOcean:
1. SSH into your Droplet.
2. Install Docker and Docker Compose.
3. Copy `docker-compose.yml` to the server.
4. Create a `.env` file on the server with your credentials.
5. Run:
   ```bash
   docker compose pull
   docker compose up -d
   ```

## 3. Database Initialization (Cloud)
If using Supabase, you should run these once from your local machine to set up the cloud DB:
```bash
# Sync schema
DATABASE_URL="your_cloud_db_url" DIRECT_URL="your_cloud_direct_url" npx prisma db push

# Seed data
DATABASE_URL="your_cloud_db_url" npx prisma db seed
```

## 4. Event Day Prep
- Ensure the admin password has been changed from `adminpass`.
- Verify the public scoreboard `/scoreboard` is visible.
- Ensure the Docker container is set to `restart: always`.
