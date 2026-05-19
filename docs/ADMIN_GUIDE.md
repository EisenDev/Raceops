# Admin Guide (RaceOps)

## Application: RaceOps
## Event: Infosoft Amazing Race 2026

## Default Account & Setup
A default admin account is created through the database seed:
- **Username:** `admin@admin.com`
- **Password:** `adminpass`

### ⚠️ Security Warning
The default password MUST be changed via the **Settings** page immediately after your first login to ensure the integrity of the event scores.

## Creating Facilitators
1. Log in as Admin.
2. Go to **Users / Facilitators**.
3. Create accounts for your event staff.
4. Distribute usernames and passwords to the facilitators.

## Team Management
- Seeded teams include: **Yellow, Pink, Red, Green, Blue**.
- Add more teams or edit existing ones via the **Teams & Members** module.

## Game Setup
- Define the 10 Amazing Race games in the **Games** module.
- Set the maximum points (default 100) and specific mechanics for each.

## Edit Requests
- Monitor the **Edit Requests** tab for facilitator corrections.
- Admin remarks are required for declined requests.
- Approving a request automatically updates the team totals and the live scoreboard.

## TechOps Management
- Use the **TechOps** generator to create the physical card list.
- Admin can "Void" cards if physical copies are damaged.
- At the end of the race, use the **Scanner** to record team collections.
## Bounty System
- Use the **Bounty Setup** panel to generate unique capture codes for all teams.
- Each team has one unique code that other teams are trying to find.

## Station 11 Code Runner
- Station 11 features a final coding challenge validation.
- Facilitators at this station will use the **Code Runner** utility.
- **Preparation**: Use the **Code Inventory / Answer Key** (visible to Admin only) to copy the full code challenges.
- **Physical Cards**: Manually print or write these 30-40 line code blocks onto physical station cards.
- **Validation**: Facilitators select the team and language, then paste the team's full submitted code. 
- The system returns only 200 OK or generic errors. 
- **Note**: This tool does not award points directly to the leaderboard.

## Public Leaderboard
...

- Direct guests or point the event projector to `/scoreboard`.
- This page refreshes automatically to show the latest rankings.

## Closing the Event
- Once all games are done, review the final leaderboard.
- Lock the scores to prevent further changes (Planned for Phase 7).
- Export results for the awards ceremony.


## Code Runner Dataset Update (May 2026)
- The challenge dataset has been overhauled to contain exactly 10 full-code challenges (2 per language).
- **Languages Supported**: Python, PHP Native, Laravel-labeled (Standalone PHP), JavaScript, Vue-labeled (Standalone JS).
- **Runnable Constraint**: All correct codes are fully standalone and runnable without framework boilerplate. Laravel and Vue challenges are inspired by the frameworks but do not require them to run (tested via `php` and `node` commands).
- **Validation**: Strict `NORMALIZED_EXACT_MATCH` is used. Buggy versions fail realistically without exposing the exact bug in the UI.
- **Independence**: The Code Runner remains an isolated utility at Station 11. It has no connection to the scoreboard or game points.
