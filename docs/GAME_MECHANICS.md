# Game Mechanics (RaceOps)

## Event Summary: Infosoft Amazing Race 2026
- **App Name:** RaceOps
- **Event Scope:** ~45 Employees divided into teams.
- **Total Points:** ~1,300 pts.

## Point Breakdown
| Category | Points | Description |
| :--- | :--- | :--- |
| **Regular Games** | 1,000 pts | 10 games × 100 points maximum each. |
| **TechOps Cache Run** | 200 pts | Team scavenger hunt for physical cards. |
| **Bounty System** | 100 pts | 1 high-value target per team. |

## TechOps Cache Run Scoring
- **Standard Card:** +10 pts
- **Bonus Card:** +15 pts
- **Rare Card:** +20 pts
- **Bugged Card:** -5 pts
- **Damaged/Invalid:** 0 pts
- **Max Cap:** 200 pts per team. Positive cards are rejected if the team is at the cap.
- **Minimum:** 0 pts. Bug cards cannot reduce a team total below zero.
- **Single Use:** Each card is unique and can be claimed only once per event.

## Bounty System
- **Total Possible:** 100 pts per team.
- **Assignment:** Each team is assigned one unique bounty target.
- **Claiming:** Points are awarded to the team that **claims** the bounty code, not the team that owns the target.
- **Single Claim:** A team can only earn bounty points **once** during the event.
- **Normalization:** Codes are normalized during entry to handle both raw codes and the `RACEOPS:BOUNTY:` prefix.

## Station 11: Code Runner
The Code Runner is a standalone utility used at the final station to validate team-submitted full code solutions.
- **Languages:** Python, PHP Native, Laravel, Vue, JavaScript.
- **Challenges:** Exactly 2 full-code challenges per language (Total 10).
- **Validation:** Controlled server-style responses (200 OK for accepted, 500 ERROR for generic rejection).
- **Format:** Teams type/paste their full 30-40 line code solution manually into the runner.
- **Punctuation:** The system uses normalized string matching. Detailed syntax hints are suppressed.
- **Isolation:** This system does not award points directly and is separate from the main scoring leaderboard.
- **Recording:** All attempts are logged for auditing and to prevent duplicate completions of the same challenge.

## Edit Request Workflow
To ensure data integrity, facilitators cannot edit a score after it has been saved. 
If a correction is needed:
1. Facilitator submits an **Edit Request**.
2. Facilitator provides the new value and a clear reason.
3. Admin reviews the request.
4. If approved, the system updates the total and logs the change.


## Code Runner Dataset Update (May 2026)
- The challenge dataset has been overhauled to contain exactly 10 full-code challenges (2 per language).
- **Languages Supported**: Python, PHP Native, Laravel-labeled (Standalone PHP), JavaScript, Vue-labeled (Standalone JS).
- **Runnable Constraint**: All correct codes are fully standalone and runnable without framework boilerplate. Laravel and Vue challenges are inspired by the frameworks but do not require them to run (tested via `php` and `node` commands).
- **Validation**: Strict `NORMALIZED_EXACT_MATCH` is used. Buggy versions fail realistically without exposing the exact bug in the UI.
- **Independence**: The Code Runner remains an isolated utility at Station 11. It has no connection to the scoreboard or game points.
