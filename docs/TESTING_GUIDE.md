# Testing Guide (RaceOps)

## Core Flow Verification
1. **Seeding:** Run `npx prisma db seed` and verify `admin@admin.com` exists in the database.
2. **Login:** Test valid login with seeded admin. Test invalid login and verify the "Username or password is incorrect" message appears on the form.
3. **Public Access:** Verify `/score` is accessible without an active session.
4. **Role Protection:** Log in as a facilitator and attempt to access `/users` or `/settings`. Verify redirect to `/dashboard`.
5. **Empty States:** Ensure that with no games or scores in the DB, the pages show the `EmptyState` component instead of empty tables or fake data.
6. **Responsiveness:** Verify the split-panel login layout stacks correctly on mobile.
