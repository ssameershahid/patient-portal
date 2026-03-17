# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── patient-portal/     # Next.js 15 Patient Portal (Pulse & Function)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/patient-portal` (`@workspace/patient-portal`)

**Pulse & Function Patient Portal** — Next.js 15 App Router application for Dr Sarah Al-Temimi's functional medicine clinic.

- **Framework**: Next.js 15, React, Tailwind CSS v3, Radix UI
- **Build mode**: Static export (`output: 'export'` in `next.config.mjs`), outputs to `dist/public/`
- **Auth & Data**: Supabase (auth via browser client `@supabase/ssr`, DB queries deferred)
- **Auth architecture**: Client-side `AuthProvider` context (`lib/auth/AuthProvider.tsx`) with `useAuth()` hook and `RequireAuth` wrapper component for route protection
- **Port**: 24832 (assigned by artifact system)
- **Preview Path**: `/` (root)
- **Deployment**: Static site served from `artifacts/patient-portal/dist/public`. Build command: `next build` which produces static HTML/CSS/JS. SPA routing via `/* → /index.html` rewrite in artifact.toml.
- **Design**: Forest green / warm earth / cream palette. DM Sans headings + Inter body.
- **Supabase Secrets**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

Key directories:
- `app/(auth)/` — Login, register, verify, forgot/reset password pages (all client-side auth via browser Supabase client)
- `app/(patient)/` — Patient dashboard, appointments (list + multi-step booking), messages, documents, food diary, supplements, account, intake
- `app/(admin)/admin/` — Admin dashboard, patient list, patient detail, calendar, messages, supplements, settings
- `components/ui/` — Radix-based UI components (Button, Card, Input, Label, Textarea, Badge, Tabs, Select, Dialog, etc.)
- `components/layout/` — Sidebar, MobileHeader, AdminSidebar, AdminMobileHeader
- `lib/auth/` — AuthProvider (React context for auth state), useAuth hook, RequireAuth wrapper
- `lib/supabase/` — Browser client (`client.ts`), server client (`server.ts` — unused in static export), admin client (`admin.ts` — unused in static export)
- `lib/utils/` — Constants (appointment types, membership tiers, clinic info), helpers (date formatting)
- `lib/stripe/` — Placeholder for Stripe integration (TODO)
- `lib/email/` — Placeholder for Resend email integration (TODO)

Supabase DB tables expected: `profiles`, `appointments`, `memberships`, `intake_forms`, `food_diaries`, `food_diary_entries`, `conversations`, `messages`, `documents`, `supplement_catalogue`, `patient_supplements`

Phase 2 screens are fully built with mock/placeholder data:
- **Intake Form** (`/intake`) — Multi-section form with progress tracking, required field validation, auto-save indicators, consent checkboxes
- **Food Diary** (`/food-diary`) — 7-day tabbed food diary with meal slots, no-snack toggles, drinks/symptoms fields, day completion tracking
- **Documents** (`/documents`) — Document list with filter pills, upload dialog with drag-and-drop, type/provider badges, mock documents
- **Messages** (`/messages`) — Member state (full thread UI with bubbles, timestamps, read receipts, file attachments) and non-member upsell state
- **Supplements** (`/supplements`) — Grid of supplement cards with brand, dosage, purchase links, Deeply discount badge
- **Account** (`/account`) — Profile editing, membership display (member/non-member), billing history, notification toggles, danger zone
- **Admin Patient Detail** (`/admin/patients/[id]`) — 7-tab view: Overview, Appointments, Documents, Messages, Supplements, Notes, Forms with mock data
- **Admin Messages** (`/admin/messages`) — Two-panel layout (thread list + conversation), filter pills, quick-reply templates, status selectors
- **Admin Supplements** (`/admin/supplements`) — Product catalogue with add/edit modals, active/inactive toggles, mock catalogue data
- **Admin Settings** (`/admin/settings`) — Practice details, appointment config table, quick-reply templates, integration status cards

Phase 3 screens built:
- **Discovery Call** (`/discovery`) — PUBLIC page, no login required. Hero section with trust points, booking form with weekly calendar date/time picker, confirmation state
- **Membership Plans** (`/membership`) — Authenticated. Side-by-side tier comparison (Essential £420/mo vs Premium £810/mo), single consultation fallback, FAQ accordion
- **Terms & Conditions** (`/terms`) — PUBLIC page. Clean reading layout with full T&Cs content, back navigation, privacy policy link
- **Admin Notifications** (`/admin/notifications`) — Compose form with audience selector (all/members/specific), subject, message, delivery method checkboxes, preview, sent history with expand

Supporting additions:
- **Notification banner** on patient dashboard — dismissible alert showing latest clinic announcement from Dr Sarah
- **Admin sidebar** — added Notifications nav item with bell icon between Messages and Supplements
- **Mobile navigation** — `MobileHeader` and `AdminMobileHeader` hamburger menus with dialog semantics, scroll lock, ESC close
- **Profile photo upload** — Account page supports file picker, circular avatar preview, validation (JPG/PNG/WebP, 5MB max)
- **Route protection** — Client-side via `RequireAuth` component (redirects to `/login` if unauthenticated, checks admin role for `/admin` routes). Public routes: `/discovery`, `/terms`

All screens use mock data. Supabase wiring, Stripe, Cal.com, and email integration are deferred.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
