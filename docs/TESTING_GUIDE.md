# Testing Guide (RaceOps)

## Core Flow Verification
1. **Seeding:** Run `npx prisma db seed` and verify `admin@admin.com` exists in the database.
2. **Login:** Test valid login with seeded admin. Test invalid login and verify the "Username or password is incorrect" message appears on the form.
3. **Public Access:** Verify `/score` is accessible without an active session.
4. **Role Protection:** Log in as a facilitator and attempt to access `/users` or `/settings`. Verify redirect to `/dashboard`.
5. **Empty States:** Ensure that with no games or scores in the DB, the pages show the `EmptyState` component instead of empty tables or fake data.
6. **Responsiveness:** Verify the split-panel login layout stacks correctly on mobile.
7. **Code Runner:** 
    - Verify `/code-runner` is protected.
    - Test a correct answer for a seeded challenge and verify `200 OK`.
    - Test a wrong answer and verify generic `500 ERROR`.
    - Verify that no points are displayed in the UI.
    - Test a duplicate completion for the same team and verify `409 CONFLICT`.


## Code Runner Dataset Update (May 2026)
- The challenge dataset has been overhauled to contain exactly 10 full-code challenges (2 per language).
- **Languages Supported**: Python, PHP Native, Laravel-labeled (Standalone PHP), JavaScript, Vue-labeled (Standalone JS).
- **Runnable Constraint**: All correct codes are fully standalone and runnable without framework boilerplate. Laravel and Vue challenges are inspired by the frameworks but do not require them to run (tested via `php` and `node` commands).
- **Validation**: Strict `NORMALIZED_EXACT_MATCH` is used. Buggy versions fail realistically without exposing the exact bug in the UI.
- **Independence**: The Code Runner remains an isolated utility at Station 11. It has no connection to the scoreboard or game points.
