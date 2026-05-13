# Deployment Guide (RaceOps)

## 1. Environment Configuration
Set these variables in your production environment:
- `DATABASE_URL`: PostgreSQL connection string.
- `IRON_SESSION_PASSWORD`: A secure 32+ character string.
- `ADMIN_SECRET`: Additional layer for admin protection (optional).

## 2. Initialization
After deployment, run these commands to prepare the system:
```bash
# Sync schema
npx prisma db push

# Seed default admin and teams
npx prisma db seed
```

## 3. Event Day Prep
- Ensure the admin password has been changed from `adminpass`.
- Verify the public scoreboard `/score` is visible on the venue network.
- Perform a test scan of a generated TechOps card.
