# AGENTS.md

## Commands
- `npm run dev`: Start Vite dev server (`http://localhost:5174`)
- `npm run build`: Build production assets into `dist/`
- `npm run lint`: Run code linter (`oxlint`)
- `npm run preview`: Preview built production app locally

## Tech Stack & Architecture
- **Framework & Routing**: React 19 + React Router v7
- **Styling**: Tailwind CSS v4 using `@tailwindcss/vite` plugin
- **Linter**: `oxlint` (`npm run lint`), config in `.oxlintrc.json`
- **Authentication**: Supabase Auth (Email & Password) via `src/context/AuthContext.jsx`. Protected routes require active auth session.
- **Backend & Database**: Supabase (`src/lib/supabase.js`). Remote data is managed through `src/services/taskService.js`. SQL schema script is in `supabase/schema.sql`.
- **Data Mapping**: Supabase table columns use `snake_case` (`created_at`, `completed_at`, `user_id`, `subtasks`), while app state uses `camelCase` (`createdAt`, `completedAt`, `userId`, `subtasks`). Always use `mapTaskFromSupabase` and `mapTaskToSupabase` in service calls.
- **Database RLS Requirement**: `tasks` table must have Row Level Security enabled (`auth.uid() = user_id`).

## Code Conventions
- Do NOT add comments in any code unless explicitly requested by the user.
- Always run `npm run lint` after editing code.
