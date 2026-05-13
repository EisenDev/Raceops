# Tech Stacks

## Recommended Stack
For **TechOps: Hidden Cache Run**, we prioritize developer velocity, type safety, and a seamless mobile experience.

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Language** | TypeScript | Ensures type safety across the full stack, reducing runtime errors during the event. |
| **Framework** | Next.js (App Router) | Unified React framework for frontend and API routes. Excellent performance and SEO-like speed for mobile. |
| **Database** | PostgreSQL | Robust, relational data handling for complex scoring and claim logic. |
| **ORM** | Prisma | **Recommendation:** Prisma. Using v7.8.0. Note: v7 requires `prisma.config.ts` for database connections; `url` is no longer supported in `schema.prisma`. |
| **Styling** | Tailwind CSS | Rapid UI development with a mobile-first utility-first approach. Easy to maintain "Atelier" minimalist styles. |
| **Auth** | NextAuth.js / Iron Session | Simple, event-based authentication. We don't need OAuth; simple username/password or team codes are sufficient. |
| **Validation** | Zod | Schema validation for API inputs and environment variables. |
| **Deployment** | Vercel / Railway | Fast deployment with built-in support for Next.js and PostgreSQL. |

## Why TypeScript + React?
React allows for highly interactive, state-driven UIs (like the mission checklist). TypeScript ensures that the complex relationships between players, cards, and scores are managed without breaking the logic during late-stage development.

## Database Choice: PostgreSQL
While the game is simple, the relationship between `CardClaims`, `Bounties`, and `NullifyCards` is inherently relational. PostgreSQL handles these transactions reliably, ensuring no double-claiming or scoring glitches.

## ORM Recommendation: Prisma
We recommend **Prisma** for this project because:
1. **Developer Experience:** The Prisma Schema Language is extremely readable for documentation-first projects.
2. **Type Safety:** It generates a client that perfectly matches the database state.
3. **Migrations:** Easy-to-manage migrations for quick schema adjustments.

## Styling Recommendation
**Tailwind CSS** is chosen for its speed and ability to enforce a consistent design system (colors, spacing) which is critical for the "Atelier" look.

## Local Development Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up a local PostgreSQL instance (or use Docker).
4. Configure `.env` with `DATABASE_URL`.
5. Run `npx prisma db push` to sync schema.
6. Run `npm run dev`.

## Future Scalability
While designed for 45 people, this stack can easily handle hundreds. The bottleneck would be physical venue space, not the digital system.
