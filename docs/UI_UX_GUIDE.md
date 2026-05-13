# UI/UX Guide (RaceOps)

## The "Atelier" Direction
RaceOps follows a premium, minimalist visual style. The UI should feel like a high-end product website, not a typical technical dashboard.

## Visual Standards
- **Backgrounds:** Clean whites (`#FFFFFF`) and very soft neutral greys (`#F9F9F9`).
- **Typography:** 
    - **Headings:** Elegant, large, and high-contrast black.
    - **Labels:** Small caps with wide letter-spacing (`tracking-widest`).
    - **Body:** Simple, readable sans-serif (Inter or Plus Jakarta Sans).
- **Cards:** Thin borders (`rgba(26, 26, 26, 0.05)`), soft rounded corners (`12px`), and minimal shadows.
- **Layout:** Editorial style. Prefer split-panels (Intro + Action) over centered, small containers.

## Design Tokens (Updated)
| Token | Value | Description |
| :--- | :--- | :--- |
| **Primary** | `#1A1A1A` | Main text and button color. |
| **Muted** | `#666666` | Secondary text. |
| **Accent** | `#1A1A1A` | Strongest visual focus. |
| **Surface** | `#FFFFFF` | Card and background surface. |

## Page Layout Principles
### Login Page
- Left side: Large event title and welcome text.
- Right side: Clean, high-shadow login card.
- Mobile: Stacked, heading first.

### Dashboard
- Prominent metric cards with large bold numbers.
- Clean activity feed with sidebar indicators.

## User Language
- **Use:** "Correction", "Record Points", "Approve", "Team Total".
- **Avoid:** "Authenticate", "Validate", "Payload", "Duplicate Key".
