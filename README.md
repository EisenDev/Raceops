# RaceOps (Internal Command Center)

Precision scoring and facilitation system for **Infosoft Amazing Race 2026**.

## Visual Direction
RaceOps uses a **Dark Premium** interface designed for high-signal operations.
- **Theme:** Atelier Dark (Charcoal/Black with Gold/Bronze accents).
- **Background:** `#0A0A0A`
- **Cards:** `#141414` (Subtle borders and soft gold glows).
- **Typography:** Refined hierarchy using **Plus Jakarta Sans** and **Geist Mono**.

## Architecture
- **Framework:** Next.js (App Router)
- **Database:** Prisma + PostgreSQL
- **UI:** Tailwind CSS (Custom Design System)
- **Auth:** iron-session

## Primary Modules
1. **Dashboard:** Command center overview with real-time telemetry.
2. **Mission Control (Games):** Multi-mode scoring for team challenges.
3. **Personnel Registry (Teams):** Unit and member management.
4. **Audit Workflow (Edit Requests):** Secure facilitator correction queue.
5. **TechOps Run:** Strategic cache retrieval and point injection.
6. **Kernel Debugger (Code Runner):** Technical validation console for Station 11.
7. **Public Scoreboard:** Presentation-ready broadcast view for event projectors.

## Deployment
See `docs/DEPLOYMENT_GUIDE.md` for production setup.
