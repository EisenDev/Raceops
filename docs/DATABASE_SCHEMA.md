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

### `Bounty`
- `id`: UUID
- `teamId`: FK (The team that is the target of this bounty)
- `code`: String (Unique, e.g., BNT-YEL-7K2)
- `points`: Int (Default 100)
- `status`: Enum (ACTIVE, CLAIMED, VOID, NULLIFIED)
- `claimedByTeamId`: FK (The team that successfully captured the bounty)
- `recordedById`: FK (The facilitator who recorded the claim)
- `recordedAt`: DateTime

### `AuditLog`
- `id`: UUID
- `actorId`: FK (User)
- `action`: String
- `module`: String
- `details`: JSON

### `CodeChallenge`
- `id`: UUID
- `teamColor`: String (HEX code to match team)
- `languageTrack`: Enum (PYTHON, PHP_NATIVE, LARAVEL, VUE, JAVASCRIPT)
- `stationNumber`: Int
- `difficulty`: Enum (MEDIUM, HARD, VERY_HARD)
- `title`: String
- `prompt`: Text
- `incompleteCode`: Text (What is shown to participants)
- `correctCode`: Text (Full solution / Answer key)
- `buggyCode`: Text (Incorrect version for testing)
- `cardCode`: String (Unique ID, e.g., PY-Y01)
- `expectedAnswer`: Text (Shorthand answer if applicable)
- `expectedOutput`: Text (Console output simulation)
- `validationRule`: Enum (EXACT_MATCH, NORMALIZED_EXACT_MATCH, etc.)
- `genericHint`: Text
- `status`: Enum (ACTIVE, VOID)

### `CodeRunnerAttempt`
- `id`: UUID
- `challengeId`: FK
- `teamId`: FK
- `submittedCode`: Text
- `statusCode`: Int (e.g., 200, 500, 422)
- `result`: String (Accepted, Rejected)
- `accepted`: Boolean
- `genericHint`: Text (The hint shown to the team)
- `submittedById`: FK (The facilitator who ran the code)
- `createdAt`: DateTime
