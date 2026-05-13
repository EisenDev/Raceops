# RaceOps

Official Scoring and Facilitation System for the **Infosoft Amazing Race 2026**.

## Overview
**RaceOps** is a premium, minimalist internal tool designed to streamline the management of team-based company events. It provides facilitators with high-efficiency data entry tools and offers administrators (CEO/Controller) total oversight through an auditable correction workflow.

## Key Features
- **Flexible Scoring**: Support for both overall team totals and individual member breakdown contributions.
- **TechOps Cache Run**: A themed scavenger hunt module with automated card generation and QR/Code scanning.
- **Edit Request Workflow**: A secure, auditable process for score corrections that requires administrative approval.
- **Real-Time Leaderboard**: Live-updating rankings for both internal management and public guest viewing.
- **Role-Based Access**: Specialized interfaces for Admins (Full Control) and Facilitators (Data Entry).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: iron-session
- **Styling**: Tailwind CSS (Atelier-inspired minimalist design)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/EisenDev/Raceops.git
   cd Raceops
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Copy `.env.example` to `.env` and fill in your database credentials.
4. Initialize the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Roles & Access
- **Admin**: `admin@admin.com` / `adminpass` (Default seeded account)
- **Facilitator**: Created by Admin via the "Users / Facilitators" dashboard.
- **Guest**: Public, read-only access to `/scoreboard`.

## License
Proprietary. All rights reserved.
