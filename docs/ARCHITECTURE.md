# Architecture (RaceOps)

## System Overview
**RaceOps** is an internal control panel for the **Infosoft Amazing Race 2026**. It uses a role-based Next.js App Router architecture to provide a secure and efficient scoring environment.

## User Roles
1. **Admin (CEO):** Full CRUD access, facilitator management, and edit request approval.
2. **Facilitator:** Scoring entry and QR scanning. Restricted from historical edits.
3. **Guest:** Public, read-only access to the real-time leaderboard at `/scoreboard`.

## Main Modules

### 1. Scoring Engine
- **Aggregator:** Collects points from Games, TechOps, and Bounties.
- **Validation:** Ensures scores stay within defined caps (e.g., 100 per game, 200 total for TechOps).
- **Flexible Modes:** 
    - **Team Total:** Direct entry of points for the entire team.
    - **Member Breakdown:** Individual member points are summed to create the team total.
- **Aggregation:** Team Total = Σ(Games) + TechOps + Bounty. Managed via database transactions updating `Team.totalScore`.

### 2. TechOps Run Scanners
- **QR Scanners:** Facilitator tool to scan physical card collections.
- **Card Generator:** Admin tool to create and export unique card codes.

### 3. Edit Request State Machine
- **Flow:** Facilitator Request -> Admin Review -> approved/declined.
- **Audit:** Every approved request updates the score and creates a permanent log.

## Suggested Folder Structure
```text
/
├── prisma/             # Schema & Seed scripts
├── src/
│   ├── app/
│   │   ├── (auth)/     # Shared Login
│   │   ├── (admin)/    # Users, Settings, Approvals
│   │   ├── (shared)/   # Dashboard, Games, TechOps, Teams, Scores
│   │   └── scoreboard/ # Public guest scoreboard
│   ├── components/
│   │   ├── ui/         # Base components (Atelier Style)
│   │   ├── layout/     # Sidebar and Header
│   │   └── modules/    # Module-specific logic (Games, TechOps)
```
