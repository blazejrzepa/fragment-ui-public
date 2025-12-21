# Copilot Implementation Plan: Blocks & Templates (Fragment UI Public DS)

**Goal:** Ship a public, installable Design System that is genuinely useful out-of-the-box by providing:
- a strong **component library** (already exists - 63+ components),
- a curated **Blocks library** (20–30 composable compositions),
- a set of **Screen Templates** (6–10 full pages),
- two **Example Apps** (SaaS Admin + E-commerce Admin),
- clean **Docs & Registry** for external users.

**Non-goal:** Making Studio/Playground production-ready. Studio stays **internal/experimental** and must not be required to use the public DS.

---

## 0) Principles (do not break)

1. **Public DS-first:** external users install packages and get value without Studio.
2. **No duplication of primitives:** use `@fragment_ui/ui` primitives everywhere.
3. **Composable blocks:** blocks are "lego", templates are "assembled lego".
4. **Stable API surface:** blocks/templates should have small, predictable props (avoid overengineering).
5. **Dependency boundaries:** public packages must not import from `apps/*` or internal packages.

---

## 1) Repo Structure & Packaging

### 1.1 Create a public `blocks` package

Ensure `packages/blocks/` is structured as:

```
packages/blocks/
src/
  blocks/          # Individual composable blocks (20-30)
  templates/       # Full screen templates (6-10)
  data/            # Mock data helpers (optional)
index.ts
package.json
tsconfig.json
README.md
```

**Rules:**
- `packages/blocks` is **public** (publishable).
- It imports only from `@fragment_ui/ui` + safe external libs (e.g. `@tanstack/react-table` if needed).
- It must compile to `dist/` and export via `package.json -> exports`.

### 1.2 Mark internal tooling as private

Ensure Studio / Playground packages are `private: true` or excluded from publish.

---

## 2) "Upstream harvest": Pull ready-made blocks (avoid reinventing)

### 2.1 Create a temporary harvest app (sandbox)

Create:
```
apps/harvest-shadcn/
```

**Purpose:** run shadcn blocks installer and treat output as "upstream reference".

### 2.2 Install official shadcn blocks (as source reference)

Run inside `apps/harvest-shadcn`:
- `npx shadcn add sidebar-01`
- `npx shadcn add dashboard-01`
- `npx shadcn add login-01`
- `npx shadcn add signup-01`
- `npx shadcn add otp-01`
- Optional: calendar related blocks

**Important:** We do NOT publish this app. It is just a harvest workspace.

### 2.3 Promote harvested code into `packages/blocks`

For each harvested file:
- Copy into `packages/blocks/src/blocks/*` or `templates/*`
- Replace imports:
  - `@/components/ui/*` → `@fragment_ui/ui`
- Remove app-specific routing logic (`next/link` usage can remain only in templates/apps, not in blocks)
- Normalize classnames to your tokens (keep tailwind but avoid hardcoded colors)

---

## 3) Blocks Library (20–30 blocks) — Implementation Checklist

### 3.1 Block categories & required blocks (P0 set)

Implement these first (core adoption set):

#### Navigation / Shell
1. `AppShell` (sidebar + header + content)
2. `TopNav` (header only)
3. `BreadcrumbHeader` (title + breadcrumbs + actions)

#### Dashboard / Analytics
4. `KpiStrip` (row of KPI cards)
5. `ChartCard` (header + chart area + legend slot)
6. `InsightListCard` (insights list)
7. `ActivityFeed` (timeline/list)

#### Data Table (Enterprise)
8. `DataTable` (TanStack table wrapper)
9. `DataTableToolbar` (search + filters + column view + export)
10. `BulkActionsBar` (selected rows actions)
11. `EmptyState` (table empty)
12. `PaginationFooter`

#### Forms / Settings
13. `SettingsSection` (section headline + description + content)
14. `ProfileForm` (fields + save)
15. `BillingForm` (plan + invoice + payment)
16. `InlineValidationSummary`

#### Auth
17. `LoginFormBlock`
18. `SignupFormBlock`
19. `OtpVerifyBlock`
20. `PasswordResetBlock`

### 3.2 P1 blocks (add after P0)

#### Commerce / Admin
21. `ProductCard`
22. `ProductGrid`
23. `CartSummary`
24. `CheckoutStepper`

#### Feedback / States
25. `NotificationBanner`
26. `ToastPatternsShowcase` (docs-only demo)
27. `LoadingSkeletonPanel`
28. `ErrorState`

### 3.3 Block interface standards (keep API small)

Each block should:
- accept only a few props,
- expose composition points via `slots` or `children`,
- avoid passing React components as props unless needed.

**Example block API guideline:**
- Good: `KpiStrip({ items })`
- Good: `AppShell({ nav, headerRight, children })`
- Avoid: `DataTable({ columns, data, rowRenderer, headerRenderer, ...20 props })`

---

## 4) Templates (6–10 full screens) — Implementation Checklist

Templates live here:
```
packages/blocks/src/templates/
```

### 4.1 P0 templates (ship these)

1. `DashboardTemplate` (analytics overview)
2. `UsersListTemplate` (table + filters + detail drawer placeholder)
3. `UserDetailTemplate` (profile + activity + permissions)
4. `SettingsTemplate` (profile + security + billing sections)
5. `AuthLoginTemplate`
6. `BillingTemplate` (plans + invoices)

### 4.2 P1 templates (nice-to-have, high impact)

7. `OnboardingTemplate` (empty states + checklist)
8. `ErrorPagesTemplate` (403/404/500)
9. `EcommerceAdminTemplate` (orders + products + analytics)
10. `PricingTemplate` (B2B SaaS pricing)

### 4.3 Template rules

- Templates may use Next.js primitives in docs/examples, but the **template code inside package** should remain framework-light.
- Prefer `href` strings and `onClick` callbacks rather than importing `next/link`.
- Templates must be **easy to copy** into apps.

---

## 5) Data Table (Enterprise) — Fast path without reinventing

### 5.1 Choose one baseline

Use one of:
- shadcn Data Table (TanStack) pattern (recommended baseline).
- tablecn patterns for advanced toolbar/filters.

**Implementation approach:**
- Make `DataTable` a thin wrapper around TanStack Table
- Provide a `DataTableToolbar` block with:
  - text search,
  - filter chips (basic),
  - column visibility toggle,
  - export button (noop)
- Provide "server-side readiness" but don't implement full SSR data fetching in DS.

### 5.2 Minimal feature set (P0)

- sorting
- pagination
- column visibility
- row selection + bulk actions
- empty state

### 5.3 Governance compatibility

Ensure:
- keyboard accessible table controls
- focus states and labels
- no raw colors (use tokens)

---

## 6) Example Apps (external proof of usability)

Create:
```
examples/saas-admin/
examples/ecommerce-admin/
```

### 6.1 `examples/saas-admin` pages

- `/dashboard`
- `/users`
- `/users/[id]` (static id or mock data)
- `/settings`

Uses templates from `@fragment_ui/blocks`.

### 6.2 `examples/ecommerce-admin` pages

- `/overview`
- `/orders`
- `/products`
- `/catalog/[id]`

Uses commerce blocks + table blocks.

### 6.3 Example app requirements

- `pnpm i` + `pnpm dev` works
- uses only public packages (ui/tokens/blocks)
- includes concise README "how to run & customize"

---

## 7) Documentation (apps/www) — Required pages

### 7.1 Navigation additions

Add "Blocks" and "Templates" sections:
- `/blocks` index
- `/templates` index

### 7.2 Each block page must include

- What it is / why to use
- Install/use snippet
- Props summary
- Two examples (basic + realistic)
- A11y notes (if relevant)

### 7.3 Each template page must include

- Intended use case
- Required blocks
- Customization instructions
- Data wiring points (where to connect API)

---

## 8) Registry & Install Experience

### 8.1 Registry path

If using shadcn-style registry:
- host a public `registry.json`
- include `blocks` and `templates` entrypoints
- ensure docs include copy/paste install steps

### 8.2 Quickstart in root README

Add a 10-minute path:
1) install packages
2) add tokens styles
3) copy DashboardTemplate
4) run example app

---

## 9) Quality Gates (Public DS readiness)

### 9.1 Minimum test policy for blocks/templates

For P0 blocks:
- unit test basic render
- snapshot test for stable layout
- add at least one a11y check (axe) for top blocks

### 9.2 Lint & token compliance

- enforce no raw hex colors
- enforce semantic class usage (via your Token Guard)

### 9.3 Component/Block status labels

Add `experimental/stable` metadata for each block and template.

---

## 10) Execution Plan (Sprints)

### Sprint 1 (P0 foundation)
- Create `packages/blocks` structure + exports
- Harvest shadcn blocks into `packages/blocks`
- Implement `AppShell`, `KpiStrip`, `EmptyState`
- Add `DashboardTemplate` + docs pages

### Sprint 2 (Enterprise usability)
- Implement `DataTable` + `DataTableToolbar` + `PaginationFooter`
- Add `UsersListTemplate`, `SettingsTemplate`
- Add docs pages for table blocks/templates

### Sprint 3 (Auth + examples)
- Auth blocks/templates (login/signup/otp/reset)
- Implement `examples/saas-admin`
- Improve docs "Quickstart" experience

### Sprint 4 (Commerce + second example)
- Commerce blocks/templates
- Implement `examples/ecommerce-admin`
- Stabilize block APIs + add baseline tests

---

## 11) Deliverables checklist (Definition of Done)

A release is ready when:
- `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks` build successfully
- Docs site builds and includes Blocks/Templates navigation
- At least **20 blocks** shipped
- At least **6 templates** shipped
- At least **2 example apps** run from a clean clone
- Public packages have stable exports, versioning, and README quickstart
- Studio/Playground remains optional and not referenced in public onboarding

---

## 12) Copilot instructions (operational)

### Do
- Prefer adapting upstream blocks over writing from scratch
- Keep block APIs simple and consistent
- Move repeated compositions into blocks
- Add docs pages for every block/template introduced
- Ensure all public-packages compile and publish cleanly

### Don't
- Add Studio dependencies to public packages
- Introduce React Live / eval-based rendering in public blocks
- Expand scope into Copilot/Playground stabilization for this milestone

---

## 13) Starter Code Snippets

### 13.1 AppShell Block

```typescript
// packages/blocks/src/blocks/app-shell.tsx
"use client";

import * as React from "react";
import { Button, Separator } from "@fragment_ui/ui";

type NavItem = { label: string; href: string; icon?: React.ReactNode };

export function AppShell({
  title,
  nav,
  headerRight,
  children,
}: {
  title: string;
  nav: NavItem[];
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r md:block">
          <div className="p-4">
            <div className="text-sm font-semibold">{title}</div>
          </div>
          <Separator />
          <nav className="p-2">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="md:hidden" aria-label="Open menu">
                  ☰
                </Button>
                <div className="text-base font-semibold">{title}</div>
              </div>
              <div className="flex items-center gap-2">{headerRight}</div>
            </div>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

### 13.2 KpiStrip Block

```typescript
// packages/blocks/src/blocks/kpi-strip.tsx
import { Card, CardContent, Badge } from "@fragment_ui/ui";

export type KpiItem = {
  label: string;
  value: string;
  delta?: { value: string; intent: "positive" | "negative" | "neutral" };
  hint?: string;
};

export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((kpi) => (
        <Card key={kpi.label} className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="mt-1 flex items-end justify-between gap-2">
              <div className="text-2xl font-semibold">{kpi.value}</div>
              {kpi.delta ? (
                <Badge variant="secondary" className="rounded-full">
                  {kpi.delta.value}
                </Badge>
              ) : null}
            </div>
            {kpi.hint ? (
              <div className="mt-2 text-xs text-muted-foreground">{kpi.hint}</div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 13.3 EmptyState Block

```typescript
// packages/blocks/src/blocks/empty-state.tsx
import { Button } from "@fragment_ui/ui";

export function EmptyState({
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  title: string;
  description?: string;
  primaryCta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border bg-muted/20 p-8 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
      <div className="mt-4 flex gap-2">
        {primaryCta ? <Button onClick={primaryCta.onClick}>{primaryCta.label}</Button> : null}
        {secondaryCta ? (
          <Button variant="secondary" onClick={secondaryCta.onClick}>
            {secondaryCta.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
```

### 13.4 DashboardTemplate

```typescript
// packages/blocks/src/templates/dashboard-template.tsx
"use client";

import { AppShell } from "../blocks/app-shell";
import { KpiStrip } from "../blocks/kpi-strip";
import { EmptyState } from "../blocks/empty-state";
import { Card, CardContent, Input, Button } from "@fragment_ui/ui";

export function DashboardTemplate() {
  return (
    <AppShell
      title="Analytics"
      nav={[
        { label: "Dashboard", href: "#dashboard" },
        { label: "Users", href: "#users" },
        { label: "Settings", href: "#settings" },
      ]}
      headerRight={
        <div className="flex items-center gap-2">
          <Input placeholder="Search…" className="w-56" />
          <Button>Export</Button>
        </div>
      }
    >
      <KpiStrip
        items={[
          { label: "Revenue", value: "$128k", delta: { value: "+12%", intent: "positive" } },
          { label: "Active users", value: "24,190", delta: { value: "+4.1%", intent: "positive" } },
          { label: "Churn", value: "2.3%", delta: { value: "-0.4%", intent: "positive" } },
          { label: "Tickets", value: "312", delta: { value: "+18", intent: "neutral" } },
        ]}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">Performance</div>
            <div className="mt-2 h-[240px] rounded-xl border bg-muted/30" />
            {/* Placeholder chart area: wire this to Recharts later */}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="text-sm font-semibold">Insights</div>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>Top segment: "SMB - EU"</li>
                <li>Best channel: "Email Retention"</li>
                <li>Riskiest cohort: "Trial → Paid"</li>
              </ul>
            </CardContent>
          </Card>

          <EmptyState
            title="No alerts"
            description="Everything looks stable. You'll see anomalies here."
            primaryCta={{ label: "Create alert", onClick: () => {} }}
          />
        </div>
      </div>

      <div className="mt-4">
        {/* Data Table block can be inserted here (TanStack Table wrapper) */}
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
          Data table placeholder (connect to TanStack Table / tablecn pattern).
        </div>
      </div>
    </AppShell>
  );
}
```

---

## 14) Current State Assessment

### Existing Blocks (from `packages/blocks/src/`)

**Landing Page Blocks:**
- ✅ `hero-section`
- ✅ `feature-grid-section`
- ✅ `stats-section`
- ✅ `testimonials-section`
- ✅ `faq-section`
- ✅ `cta-section`
- ✅ `benefits-section`
- ✅ `comparison-section`
- ✅ `footer-section`

**Dashboard Blocks:**
- ✅ `dashboard-layout`
- ✅ `dashboard-widgets`
- ✅ `widget-container`
- ✅ `kpi-dashboard`
- ✅ `analytics-dashboard`
- ✅ `data-table`

**Other Blocks:**
- ✅ `authentication-block`
- ✅ `card-grid`
- ✅ `form-container`
- ✅ `navigation-header`
- ✅ `pricing-table`
- ✅ `settings-screen`

**Total:** ~20 blocks already exist

### Missing Blocks (P0)

1. `AppShell` (sidebar + header)
2. `TopNav` (header only)
3. `BreadcrumbHeader`
4. `KpiStrip` (standalone, not just in dashboard)
5. `ChartCard`
6. `InsightListCard`
7. `DataTableToolbar`
8. `BulkActionsBar`
9. `PaginationFooter`
10. `SettingsSection`
11. `ProfileForm`
12. `BillingForm`
13. `InlineValidationSummary`
14. `LoginFormBlock` (separate from authentication-block)
15. `SignupFormBlock`
16. `OtpVerifyBlock`
17. `PasswordResetBlock`
18. `EmptyState` (standalone)

### Missing Templates

All templates need to be created:
1. `DashboardTemplate`
2. `UsersListTemplate`
3. `UserDetailTemplate`
4. `SettingsTemplate`
5. `AuthLoginTemplate`
6. `BillingTemplate`

### Missing Example Apps

Both need to be created:
1. `examples/saas-admin/`
2. `examples/ecommerce-admin/`

---

## 15) Next Steps for Copilot

1. **Review existing blocks** in `packages/blocks/src/` and identify what can be reused/adapted
2. **Create missing P0 blocks** (18 blocks listed above)
3. **Create templates directory** and implement 6 P0 templates
4. **Create example apps** structure and implement 2 example apps
5. **Update documentation** in `apps/www` to include Blocks and Templates sections
6. **Update registry** to include blocks and templates
7. **Add tests** for P0 blocks and templates
8. **Update package.json** exports for `@fragment_ui/blocks`

---

**Last Updated:** 2025-01-XX  
**Status:** Ready for implementation

