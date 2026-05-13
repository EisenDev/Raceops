# Database Schema (Pivoted)

## Overview
The schema is designed for team-based scoring with an audit trail for facilitator edits.

## Models

### `User`
- `id`: UUID
- `name`: String
- `username`: String (Unique)
- `passwordHash`: String
- `role`: Enum (ADMIN, FACILITATOR)

### `Team`
- `id`: UUID
- `name`: String
- `color`: String
- `members`: Relation to `TeamMember[]`

### `TeamMember`
- `id`: UUID
- `teamId`: FK
- `name`: String

### `Game`
- `id`: UUID
- `name`: String
- `mechanics`: Text
- `maxPoints`: Int (Default 100)
- `status`: Enum (DRAFT, ACTIVE, COMPLETED)

### `GameScore`
- `id`: UUID
- `gameId`: FK
- `teamId`: FK
- `totalPoints`: Int (Calculated or direct)
- `scoringMode`: Enum (TEAM_TOTAL, MEMBER_BREAKDOWN)
- `submittedById`: FK (User)
- `locked`: Boolean

### `MemberScore`
- `id`: UUID
- `gameScoreId`: FK
- `teamMemberId`: FK
- `points`: Int
- `note`: String

### `TechOpsCard`
- `id`: UUID
- `code`: String (Unique, e.g., UI-K7P2)
- `type`: String (Frontend, Backend, Bugged, etc.)
- `label`: String
- `clue`: Text
- `points`: Int (Stored only in DB)
- `status`: Enum (ACTIVE, USED, VOID)
- `usedByTeamId`: FK (Team)

### `EditRequest`
- `id`: UUID
- `module`: Enum (GAME_SCORE, TECHOPS, BOUNTY)
- `referenceId`: UUID (ID of the score record)
- `teamId`: FK
- `requestedById`: FK (User)
- `currentValue`: Json (Complete score snapshot)
- `requestedValue`: Json (Complete requested snapshot)
- `reason`: Text
- `status`: Enum (PENDING, APPROVED, DECLINED)
- `adminRemarks`: Text
- `reviewedById`: FK (User)

### `AuditLog`
- `id`: UUID
- `actorId`: FK (User)
- `action`: String
- `module`: String
- `details`: JSON
