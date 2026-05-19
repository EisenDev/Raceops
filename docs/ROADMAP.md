# Roadmap

## Phase 0: The Pivot (Refactor Foundation)
- **Goal:** Align system with team-based scoring model.
- **Deliverables:** Updated documentation, new navigation shell, deprecated player routes.

## Phase 1: Authentication & Roles
- **Goal:** Secure access for Admin and Facilitators.
- **Deliverables:** Login page, session handling for two roles, role-based navigation.

## Phase 2: Teams & Members Management
- **Goal:** Core organizational data.
- **Deliverables:** Team list, dynamic member inputs, initial team seeding.

## Phase 3: Games Module
- **Goal:** Record standard Amazing Race games.
- **Deliverables:** Game CRUD, mechanics section, member contribution scoring UI.

## Phase 4: TechOps Cache Run
- **Goal:** Implement the themed scavenger hunt scoring.
- **Deliverables:** Card generator, QR scanning logic, tech-themed card content.

## Phase 5: Audit & Edit Workflow
- **Goal:** Ensure data integrity and controller oversight.
- **Deliverables:** Edit Request system, Admin approval UI, Audit logs.

## Phase 6: Live Scoreboard
- **Goal:** Real-time event visibility.
- **Deliverables:** Aggregated team ranking page, rank calculation, live refresh.

## Phase 7: Event Support & Cleanup
- **Goal:** CEO Handover and final polish.
- **Deliverables:** User management, password reset for CEO, final testing.

## Phase 8: Station 11 Utility
- **Goal:** Support the coding challenge station.
- **Deliverables:** Isolated Code Runner tool, language track validation, server-style response UI.


## Code Runner Dataset Update (May 2026)
- The challenge dataset has been overhauled to contain exactly 10 full-code challenges (2 per language).
- **Languages Supported**: Python, PHP Native, Laravel-labeled (Standalone PHP), JavaScript, Vue-labeled (Standalone JS).
- **Runnable Constraint**: All correct codes are fully standalone and runnable without framework boilerplate. Laravel and Vue challenges are inspired by the frameworks but do not require them to run (tested via `php` and `node` commands).
- **Validation**: Strict `NORMALIZED_EXACT_MATCH` is used. Buggy versions fail realistically without exposing the exact bug in the UI.
- **Independence**: The Code Runner remains an isolated utility at Station 11. It has no connection to the scoreboard or game points.
