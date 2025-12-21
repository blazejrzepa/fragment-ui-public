# Submissions Dashboard - Struktura Projektu

## 📁 Proponowana Struktura

### 1. **Strony (Pages)**

```
apps/demo/app/
├── submissions/
│   ├── page.tsx                    # ✅ Główna strona dashboard (lista)
│   ├── [id]/
│   │   └── page.tsx                # ✅ Szczegóły submission
│   ├── store.ts                    # ✅ Już istnieje
│   ├── types.ts                    # ✅ Już istnieje
│   ├── verify.ts                   # ✅ Już istnieje
│   └── promote.ts                  # ✅ Już istnieje
```

**Lokalizacja:** `apps/demo/app/submissions/page.tsx`  
**URL:** `/submissions`

**Dlaczego tutaj?**
- Zgodne z wzorcem Next.js App Router
- Analogicznie do `/a11y/page.tsx` (dashboard A11y)
- Blisko logiki biznesowej (`store.ts`, `verify.ts`, `promote.ts`)
- API endpoints już są w `/app/api/submissions/`

---

### 2. **Komponenty UI**

```
apps/demo/src/components/
├── submissions/
│   ├── submission-card.tsx          # Karta submission w liście
│   ├── submission-filters.tsx      # Filtry i sortowanie
│   ├── submission-list.tsx          # Lista submissions
│   ├── verification-results.tsx    # Wyniki weryfikacji (badge, score)
│   ├── submission-preview.tsx      # Mini preview w karcie
│   └── submission-actions.tsx      # Quick actions (Verify, Promote, Delete)
```

**Lokalizacja:** `apps/demo/src/components/submissions/`

**Dlaczego tutaj?**
- Zgodne z obecną strukturą (`src/components/playground/`, `src/components/`)
- Reużywalne komponenty
- Oddzielone od logiki biznesowej

---

### 3. **Nawigacja - Gdzie dodać linki?**

#### Opcja A: W głównym menu (`/app/page.tsx`)

**Aktualna struktura:**
```tsx
// apps/demo/app/page.tsx
<Link href="/playground">
  <Button>🚀 AI Playground</Button>
</Link>
<Link href="/playground/chat">
  <Button>💬 AI Chat Playground</Button>
</Link>
```

**Dodać:**
```tsx
<Link href="/submissions">
  <Button variant="outline" size="lg">
    📋 Submissions
  </Button>
</Link>
```

#### Opcja B: W Playground TopBar

**Aktualna struktura:**
```tsx
// apps/demo/src/components/playground/playground-top-bar.tsx
// Ma logo i toggle buttons
```

**Dodać dropdown menu:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost">More</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem asChild>
      <Link href="/submissions">Submissions</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/a11y">A11y Dashboard</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/variants">Variant Generator</Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Opcja C: Sidebar Navigation (nowy komponent)

Utworzyć globalny sidebar z nawigacją:
```
apps/demo/src/components/
└── navigation/
    └── main-nav.tsx
```

**Rekomendacja:** Opcja A + Opcja B (link w głównym menu + dropdown w Playground)

---

### 4. **Layout**

```
apps/demo/app/submissions/
├── layout.tsx                      # Opcjonalnie - jeśli potrzebny wspólny layout
└── page.tsx
```

**Layout może zawierać:**
- Wspólny header z tytułem
- Breadcrumbs
- Filtry globalne (jeśli będą używane na wielu stronach)

---

## 📋 Szczegółowa Struktura Plików

### `apps/demo/app/submissions/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { SubmissionList } from "@/components/submissions/submission-list";
import { SubmissionFilters } from "@/components/submissions/submission-filters";
import { Card, CardHeader, CardTitle, CardDescription } from "@fragment_ui/ui";
import type { Submission } from "./types";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [filters, setFilters] = useState({
    status: "all" as "all" | Submission["status"],
    type: "all" as "all" | Submission["type"],
    sortBy: "date" as "date" | "score" | "author",
  });

  // Fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  return (
    <div className="container mx-auto p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Submissions Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and review component submissions
        </p>
      </header>

      <SubmissionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <SubmissionList submissions={filteredSubmissions} />
    </div>
  );
}
```

---

### `apps/demo/app/submissions/[id]/page.tsx`

```tsx
"use client";

import { use } from "react";
import { useParams } from "next/navigation";
import { SubmissionDetails } from "@/components/submissions/submission-details";
import { SameOriginPreview } from "@/components/same-origin-preview";

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmission(id);
  }, [id]);

  if (!submission) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <SubmissionDetails submission={submission} />
      <SameOriginPreview code={submission.tsx} />
    </div>
  );
}
```

---

### `apps/demo/src/components/submissions/submission-card.tsx`

```tsx
"use client";

import { Card, CardHeader, CardContent, Badge, Button } from "@fragment_ui/ui";
import { SameOriginPreview } from "@/components/same-origin-preview";
import type { Submission } from "@/app/submissions/types";

interface SubmissionCardProps {
  submission: Submission;
  onVerify?: (id: string) => void;
  onPromote?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SubmissionCard({ submission, onVerify, onPromote, onDelete }: SubmissionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{submission.id.substring(0, 8)}</CardTitle>
            <Badge variant={getStatusVariant(submission.status)}>
              {submission.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            {submission.status === "draft" && (
              <Button onClick={() => onVerify?.(submission.id)}>
                Verify
              </Button>
            )}
            {submission.status === "verified" && (
              <Button onClick={() => onPromote?.(submission.id)}>
                Promote
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 border rounded">
          <SameOriginPreview code={submission.tsx} zoom={50} />
        </div>
        {submission.result && (
          <div className="mt-4">
            <p>Score: {submission.result.score}/100</p>
            <p>Lint Errors: {submission.result.lint.errors}</p>
            <p>A11y Critical: {submission.result.a11y.critical}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🔗 Integracja z Nawigacją

### 1. Główna strona (`apps/demo/app/page.tsx`)

```tsx
// Dodaj do sekcji z przyciskami
<div className="flex items-center gap-4">
  <StylingControls />
  <Link href="/playground">
    <Button variant="solid" size="lg">🚀 AI Playground</Button>
  </Link>
  <Link href="/playground/chat">
    <Button variant="outline" size="lg">💬 AI Chat Playground</Button>
  </Link>
  <Link href="/submissions">
    <Button variant="outline" size="lg">📋 Submissions</Button>
  </Link>
  <Link href="/variants">
    <Button variant="outline" size="lg">🎨 Variants</Button>
  </Link>
  <Link href="/a11y">
    <Button variant="outline" size="lg">♿ A11y</Button>
  </Link>
</div>
```

### 2. Playground TopBar (`apps/demo/src/components/playground/playground-top-bar.tsx`)

```tsx
// Dodaj dropdown menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem asChild>
      <Link href="/submissions">
        <FileText className="mr-2 h-4 w-4" />
        Submissions
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/a11y">
        <Accessibility className="mr-2 h-4 w-4" />
        A11y Dashboard
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/variants">
        <Layers className="mr-2 h-4 w-4" />
        Variants
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 📊 Podsumowanie Struktury

```
apps/demo/
├── app/
│   ├── submissions/
│   │   ├── page.tsx                 # ✅ Główna strona (lista)
│   │   ├── [id]/
│   │   │   └── page.tsx             # ✅ Szczegóły
│   │   ├── store.ts                 # ✅ Już istnieje
│   │   ├── types.ts                 # ✅ Już istnieje
│   │   ├── verify.ts                # ✅ Już istnieje
│   │   └── promote.ts               # ✅ Już istnieje
│   └── api/
│       └── submissions/
│           ├── route.ts             # ✅ Już istnieje
│           ├── [id]/
│           │   ├── verify/
│           │   │   └── route.ts     # ✅ Już istnieje
│           │   └── promote/
│           │       └── route.ts     # ✅ Już istnieje
│
└── src/
    └── components/
        └── submissions/
            ├── submission-card.tsx
            ├── submission-list.tsx
            ├── submission-filters.tsx
            ├── verification-results.tsx
            ├── submission-preview.tsx
            └── submission-actions.tsx
```

---

## ✅ Checklist Implementacji

- [ ] Utworzyć `apps/demo/app/submissions/page.tsx`
- [ ] Utworzyć `apps/demo/app/submissions/[id]/page.tsx`
- [ ] Utworzyć folder `apps/demo/src/components/submissions/`
- [ ] Zaimplementować `submission-card.tsx`
- [ ] Zaimplementować `submission-list.tsx`
- [ ] Zaimplementować `submission-filters.tsx`
- [ ] Zaimplementować `verification-results.tsx`
- [ ] Dodać link w `apps/demo/app/page.tsx`
- [ ] Dodać dropdown w `playground-top-bar.tsx`
- [ ] Dodać routing (Next.js automatycznie)
- [ ] Przetestować integrację z API

---

## 🎯 Priorytet Implementacji

1. **Faza 1 (MVP):**
   - `submissions/page.tsx` - podstawowa lista
   - `submission-card.tsx` - karta z preview
   - Link w głównym menu

2. **Faza 2:**
   - `submissions/[id]/page.tsx` - szczegóły
   - `submission-filters.tsx` - filtry
   - `verification-results.tsx` - wyniki

3. **Faza 3:**
   - Dropdown w Playground
   - Ulepszenia UX
   - Animacje i transitions

