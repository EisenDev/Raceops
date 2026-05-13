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
