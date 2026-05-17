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
