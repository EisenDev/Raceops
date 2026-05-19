# Security Notes (RaceOps)

## 1. Authentication
- **Role-Based:** Uses `ADMIN` and `FACILITATOR` roles.
- **Session:** Encrypted iron-session cookies.

## 2. Default Credentials
- **Account:** `admin@admin.com`
- **Password:** `adminpass`
- **Policy:** This account is seeded for initial setup. Administrators must change this password before the event goes live.

## 3. Data Integrity
- **Immutability:** Saved scores are read-only for facilitators.
- **Approval:** Score changes require admin approval.
- **Audit Logs:** All significant actions (approvals, logins, card generation) are recorded in the `AuditLog` table.

## 4. Public Access
- The `/score` page is publicly accessible but strictly **Read-Only**.
- No sensitive data (usernames, logs, facilitator names) is exposed on the public route.

## 5. Code Runner Security
- **No Execution**: The Code Runner does not execute any submitted code. It uses pattern matching and controlled validation rules.
- **Suppressed Errors**: Detailed syntax error messages are suppressed to prevent participants from gaining exact knowledge of the expected solution through the runner's output.
- **Route Protection**: The `/code-runner` route is protected and restricted to authenticated staff only.


## Code Runner Dataset Update (May 2026)
- The challenge dataset has been overhauled to contain exactly 10 full-code challenges (2 per language).
- **Languages Supported**: Python, PHP Native, Laravel-labeled (Standalone PHP), JavaScript, Vue-labeled (Standalone JS).
- **Runnable Constraint**: All correct codes are fully standalone and runnable without framework boilerplate. Laravel and Vue challenges are inspired by the frameworks but do not require them to run (tested via `php` and `node` commands).
- **Validation**: Strict `NORMALIZED_EXACT_MATCH` is used. Buggy versions fail realistically without exposing the exact bug in the UI.
- **Independence**: The Code Runner remains an isolated utility at Station 11. It has no connection to the scoreboard or game points.
