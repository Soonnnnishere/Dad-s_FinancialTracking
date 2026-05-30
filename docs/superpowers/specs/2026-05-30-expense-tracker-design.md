# Dad's Expense Tracker — Design Spec

**Status:** Draft for review
**Date:** 2026-05-30
**Owner:** Elvis

## 1. Purpose

A personal web app for a single user (dad) to track daily income and expenses, viewable as daily, monthly, and yearly summaries. Optimized for fast mobile entry, with category-based reports and monthly budgets. Data syncs across phone and laptop via cloud storage.

## 2. Users & Scope

- **Single user:** dad. No multi-user / family sharing in v1.
- **Devices:** mobile-first responsive web app (phone primary, laptop secondary).
- **Auth:** Google sign-in (one tap).
- **Currency:** MYR (configurable in settings, single currency only).

## 3. Functional Requirements

### 3.1 Transaction entry

- **Manual entry:** form with amount, category, kind (income/expense), date (defaults today), optional note.
- **Recurring entries:** rules that auto-generate transactions on a cadence (monthly / weekly / yearly), with optional `day_of_month` and `end_on`. Materialized daily by a scheduled function.
- **Editing/deleting:** any transaction can be edited or deleted from its row.

### 3.2 Categories

- Preset categories seeded on first sign-in (e.g. Food, Transport, Bills, Salary).
- Dad can add, edit, or archive custom categories.
- Each category has: name, kind (income/expense), icon, color.
- Archived categories are hidden from pickers but remain visible in historical reports.

### 3.3 Screens

| Screen | Purpose |
|---|---|
| **Today** (home) | Quick-add button, today's totals (spent/earned/month-net tiles), today's transactions list. |
| **Transactions** | Filterable list (date range, category, kind, note search), grouped by day with running balance. CSV/PDF export of current filter. |
| **Reports** | Period toggle (day/month/year/custom). Income vs Expense bar, category donut, table with vs-budget delta. |
| **Budgets** | Per-category monthly budget (expense categories only). Progress bars, "Copy last month" action. |
| **Settings** | Categories, recurring rules, preferences (currency, default view), account, export-all. |

Navigation: bottom tab bar on mobile, left sidebar on desktop. Quick-add reachable from any screen via floating action button (mobile) or header button (desktop).

### 3.4 Reporting

- **Category breakdown:** donut chart per period.
- **Budget vs actual:** monthly budget per category, with overrun highlights.
- **Export:** CSV and PDF of filtered transactions; "export all" zip in settings.

### 3.5 Out of scope for v1 (wishlist)

- Receipt photo → OCR auto-fill
- Multi-currency
- Multi-user / family sharing
- Bank CSV import
- Push notifications

## 4. Architecture

```
[ Phone / Laptop browser ]
            │
            │  HTTPS
            ▼
[ Next.js app on Vercel ]
  - App Router (React Server Components)
  - Tailwind + shadcn/ui
  - Recharts for charts
  - jsPDF for PDF export
            │
            │  Supabase JS client (RLS-protected queries)
            ▼
[ Supabase project ]
  - Postgres (transactions, categories, budgets, recurring_rules, preferences)
  - Auth (Google OAuth provider)
  - Row-Level Security: every row scoped to auth.uid()
  - Scheduled Edge Function (daily): materialize recurring rules into transactions
```

### 4.1 Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components.
- **Backend / DB / Auth:** Supabase (Postgres, Auth with Google OAuth, RLS).
- **Charts:** Recharts.
- **PDF:** jsPDF.
- **Hosting:** Vercel (frontend) + Supabase (backend), both on free tier.

### 4.2 Key architectural choices

- **Mobile-first PWA-ready layout.** v1 ships as responsive web. The styles, manifest scaffolding, and bundle structure leave room to add a service worker + `manifest.json` later for installable/offline behavior without rework.
- **Server Components for reads, client components for forms.** Reports render server-side (less JS shipped). The quick-add form is client-side for snappy typing.
- **RLS is the security boundary.** Every row has `user_id`; every policy is `user_id = auth.uid()`. The app URL is safe to expose publicly — only signed-in dad can see his data.
- **Recurring entries via scheduled Supabase function.** Runs daily, idempotent (unique key on `(recurring_id, occurred_on)`). Never misses or duplicates entries regardless of whether dad opens the app.

## 5. Data Model

All tables include `user_id uuid` and an RLS policy `user_id = auth.uid()`.

```sql
-- 1. categories
id            uuid pk
user_id       uuid
name          text
kind          text                  -- 'income' | 'expense'
icon          text                  -- emoji or lucide name
color         text                  -- hex, for chart slices
is_archived   bool default false
created_at    timestamptz

-- 2. transactions
id            uuid pk
user_id       uuid
category_id   uuid fk → categories
kind          text                  -- 'income' | 'expense' (denormalized)
amount        numeric(12,2)         -- always positive; sign comes from kind
currency      text default 'MYR'
occurred_on   date                  -- date dad assigns, not created_at
note          text
recurring_id  uuid null fk → recurring_rules  -- set if auto-generated
created_at    timestamptz

-- 3. budgets
id            uuid pk
user_id       uuid
category_id   uuid fk → categories
month         date                  -- always day=1, e.g. 2026-05-01
amount        numeric(12,2)
unique (user_id, category_id, month)

-- 4. recurring_rules
id            uuid pk
user_id       uuid
category_id   uuid fk → categories
kind          text
amount        numeric(12,2)
cadence       text                  -- 'monthly' | 'weekly' | 'yearly'
day_of_month  int null              -- 1–31, used for 'monthly' and 'yearly'
day_of_week   int null              -- 0–6 (Sun–Sat), used for 'weekly'
month_of_year int null              -- 1–12, used for 'yearly'
start_on      date
end_on        date null
note          text
last_run_on   date null             -- updated by scheduled function
is_active     bool default true

-- 5. preferences  (one row per user)
user_id       uuid pk
currency      text default 'MYR'
default_view  text default 'today'
created_at    timestamptz
```

**Modeling notes:**
- `amount` stored positive; `kind` provides sign. Trivial aggregates, no sign bugs.
- `occurred_on` is `date` (not `timestamp`) — dad thinks in days, no timezone arithmetic.
- `budgets.month` lets historical budgets stay intact when changed.
- `recurring_rules.last_run_on` makes the scheduled function idempotent.
- A Postgres trigger on `auth.users` insert seeds preset categories and the preferences row on first sign-in.

## 6. Visual Design Language

**Philosophy:** restraint over decoration. Whitespace, one accent color, no gradients or heavy shadows. The app should feel like a calm notebook, not a dashboard.

### 6.1 Palette (light + dark)

| Token | Light | Dark |
|---|---|---|
| Background | `#FAFAF9` | `#0A0A0A` |
| Surface | `#FFFFFF` | `#171717` |
| Text primary | `#0A0A0A` | `#F5F5F5` |
| Text muted | `#737373` | `#737373` |
| Border | `#E5E5E5` | `#262626` |
| Income accent | `#16A34A` | `#16A34A` |
| Expense accent | `#DC2626` | `#DC2626` |

Accent colors are used only on amounts and the FAB. Everything else stays neutral.

### 6.2 Typography

- **Inter** for UI text.
- **JetBrains Mono** for amounts (vertical alignment in lists).
- Scale: Today-tile amounts 32px, body/list 16px, labels 13px muted.

### 6.3 Spacing & layout

- 8px grid.
- Comfortable padding (16/24px) over dense packing.
- Mobile: full-width cards with 16px gutters.
- Desktop: 640px max content column, centered.

### 6.4 Components (shadcn/ui restyled)

- **Quick-add sheet:** bottom sheet on mobile, dialog on desktop. Amount input autofocused with numeric keypad on mobile. Category chips below. Date and note collapsed by default.
- **Transaction row:** date · category icon · note (left) — amount (right, mono, colored). Hairline separators only, no card chrome.
- **Charts (Recharts):** no gridlines, no boxed legends, soft 8-color curated palette.
- **FAB:** circular `+`, accent green, bottom-right fixed on mobile.

### 6.5 Motion

- Sheet slide-up: 200ms ease-out.
- List add/delete fade: 150ms.
- No bouncy springs, no skeleton shimmer.

### 6.6 Dark mode

Auto, follows OS preference. Both modes are designed intentionally — not inverted.

### 6.7 Empty states

One line of muted text + one button. Example: "No transactions yet. **+ Add your first one.**" No illustrations.

## 7. Error Handling & Edge Cases

| Scenario | Behavior |
|---|---|
| Network drop while saving | Optimistic UI; on failure the row turns muted with retry/discard. No data loss. |
| Supabase auth expired | Silent refresh via SDK; if refresh fails, redirect to sign-in with "session expired" toast. |
| Form validation (amount ≤ 0, missing category) | Inline error under the field, save button disabled. No modal alerts. |
| Duplicate recurring run | Unique constraint on `(recurring_id, occurred_on)` — silently skipped. |
| Deleting a category with transactions | Soft-delete (`is_archived = true`). Transactions retain reference; archived categories hidden from pickers but shown in reports. |
| Server error on a report query | Inline empty-state card with retry. Other sections unaffected. |

**Edge cases:**

- **Timezones:** dates stored as `date`; display uses browser local timezone, no conversion.
- **Currency formatting:** `Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' })`, one helper used everywhere.
- **Month boundaries:** "This month" = `[first_of_month, today]`. Budgets are per calendar month, not rolling 30 days.
- **Recurring `day_of_month = 31`:** clamp to last day of shorter months (Feb → 28/29).
- **First-run UX:** trigger seeds preset categories + preferences row on first sign-in. Dad lands on Today with categories ready, no setup required.

## 8. Testing Strategy

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | Pure functions: date math, currency formatting, recurring-rule clamping, budget % calculation. |
| Component | Vitest + Testing Library | Quick-add validation, transaction row interactions, filter behavior. |
| Integration | Vitest + `supabase start` | RLS policies (user A cannot read user B), recurring materialization function, soft-delete behavior. |
| E2E | Playwright (one happy path) | Sign in (mocked OAuth) → add expense → appears on Today → visible on Reports. Runs in CI on every PR. |
| Manual pre-deploy checklist | — | Install on phone home screen; dark mode; slow-3G throttle; currency edge cases (`RM 0.50`, `RM 12,345.67`). |

## 9. Hosting & Cost

- **Frontend:** Vercel free tier (Hobby plan).
- **Backend:** Supabase free tier.
- **Expected cost:** $0/month.
- **Known free-tier caveat:** Supabase free projects pause after 7 days of inactivity. Resumes on next sign-in with a ~30s cold start. Acceptable for personal use.

## 10. Open Questions

None blocking implementation. Items deferred to wishlist (Section 3.5) can be revisited after v1 ships.
