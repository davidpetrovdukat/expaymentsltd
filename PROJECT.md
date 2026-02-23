# 🚀 Project Blueprint: [Project Name]

## 1. 🎯 Executive Summary & PRD (Product Requirements)
- **Mission:** [One-sentence description of what the product does and the value it provides.]
- **Target Audience:** [Who are the primary users?]
- **Core User Flow:** 1. [e.g., User lands on homepage and clicks 'Sign Up']
  2. [e.g., Completes onboarding questionnaire]
  3. [e.g., Accesses the main dashboard to view analytics]

## 2. 🏗 Architecture & Tech Stack (Strict)
*No deviations from this stack are allowed without updating this document first.*
- **Core Framework:** Next.js (App Router strictly)
- **Language:** TypeScript (Strict mode enabled)
- **Styling & UI:** Tailwind CSS + [e.g., shadcn/ui or Radix Primitives]
- **Database:** [e.g., PostgreSQL]
- **ORM / Query Builder:** [e.g., Prisma or Drizzle ORM]
- **Authentication:** [e.g., NextAuth.js (Auth.js) v5 or Supabase Auth]
- **State Management:** [e.g., Zustand for global client state, URL search params for filtering]

## 3. 🗄️ Core Data Schema (Entity Relationships)
*This defines the core domain model. Agents must refer to this before creating API routes or Server Actions.*

```typescript
// Define simplified TypeScript interfaces or Prisma models here to establish context.
// EXAMPLE:
// model User {
//   id        String   @id @default(cuid())
//   email     String   @unique
//   role      Role     @default(USER)
//   orders    Order[]
// }
// model Order {
//   id        String   @id @default(cuid())
//   userId    String
//   total     Float
//   status    OrderStatus
// }
```

## 4. 📂 Enforced Directory Structure
*Agents must strictly adhere to this folder layout. Do not invent new root directories.*

```text
src/
├── app/               # Next.js App Router (Pages, Layouts, Route Handlers)
├── components/
│   ├── ui/            # Dumb/Presentational components (buttons, inputs)
│   └── features/      # Smart components tied to business logic
├── lib/               # Utility functions, DB instances, API clients
├── server/            # Server Actions and internal business logic (NO UI)
└── types/             # Global TypeScript interfaces and Zod schemas
```

## 5. 📜 Architectural Decision Records (ADRs)
*Non-negotiable rules for this specific project.*
1. **Data Fetching:** All initial data fetching MUST occur in Server Components. Pass data down as props.
2. **Mutations:** ONLY use Next.js Server Actions for data mutations. API Routes (`/api/...`) are strictly reserved for external webhooks.
3. **Form Validation:** All forms MUST use `react-hook-form` coupled with `zod` resolvers.

## 6. 🗺️ Roadmap & Task Tracker
### Phase 1: MVP Scope
- [ ] Project scaffolding and DB connection
- [ ] Authentication flow setup
- [ ] [Core Feature 1]
- [ ] [Core Feature 2]

### 🚧 Current Active Task
**Focus:** [Explicitly state what the agent is supposed to be doing right now. E.g., "Implementing the User Registration form in src/app/auth/register/page.tsx"]
**Known Blockers/Bugs:** [List any current failing tests or terminal errors here]