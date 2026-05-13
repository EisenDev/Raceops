# Implementation Log

### 2026-05-13 - Phase 5: TechOps Cache Run
- **Summary:** Implemented the full scavenger hunt logic: Card generation, team scanning, and automated scoring.
- **Decisions Made:** 
    - Created a **Card Generator** with pre-defined tech themes (Frontend, Backend, etc.) to ensure a high-signal experience.
    - Implemented a **Normalization Layer** for scanning that handles both raw codes and the `RACEOPS:` QR prefix.
    - Enforced a **Smart Cap** logic: Positive points are capped at 200 total per team. If a card would push the team over 200, it applies partial points. If the team is already at 200, the scan is rejected so the card remains active for others.
    - Bug cards (-5 pts) always apply as long as the total remains above 0.
    - Added a **Card Inventory** with search and "Void" capabilities to help admins manage physical logistics.
    - Connected TechOps totals to the **Leaderboard aggregation** (totalScore) via database transactions.
- **Files Created/Modified:**
    - `src/lib/actions/techops.ts` (Generator and Scanning logic)
    - `src/components/modules/techops/` (Generator, Scanner, and Inventory UI)
    - `src/app/techops/page.tsx` (Integrated dashboard)
    - `prisma/schema.prisma` (Added `techOpsScore` to Team)
- **Testing Performed:** `npm run lint` and `npm run build` passed. Verified card generation collisions and duplicate scan blocking.
- **Next Steps:** Phase 6: Bounty System.

### 2026-05-13 - Phase 4: Edit Request Workflow
- **Summary:** Implemented a secure and auditable workflow for score corrections.
...