# 📦 Component Submission Workflow – Dokumentacja

**Version:** 2.0  
**Status:** Implementation Complete (Phase 3)  
**Last Updated:** 2025-01-XX

---

## 🎯 Cel

Wdrożenie automatycznego, skalowalnego procesu przetwarzania zgłoszonych komponentów z użyciem testów jakości, statusów i ścieżki review w obrębie Fragment UI Studio.

---

## 🔧 Etap 1: Struktura i API komponentów ✅

### Zaimplementowane

Każdy zgłoszony komponent posiada:

1. **Submission Model** (`apps/demo/app/submissions/types.ts`)
   - Pełna struktura danych z typowaniem
   - Support dla legacy statusów (backward compatibility)
   - Artifact hash dla deduplication

2. **API Endpoints** (`apps/demo/app/api/submissions/`)
   - `POST /api/submissions` - Tworzenie submission
   - `GET /api/submissions` - Lista wszystkich submissions
   - `GET /api/submissions/[id]` - Szczegóły submission
   - `POST /api/submissions/[id]/run-checks` - Uruchomienie checks
   - `POST /api/submissions/[id]/approve` - Zatwierdzenie
   - `POST /api/submissions/[id]/request-changes` - Żądanie zmian
   - `POST /api/submissions/[id]/promote` - Promocja do PR
   - `POST /api/submissions/[id]/comments` - Dodanie komentarza
   - `POST /api/submissions/[id]/comments/[commentId]/resolve` - Rozwiązanie komentarza

3. **Metadata Storage**
   - DSL structure (UI-DSL)
   - TSX code (generated)
   - Stories (Storybook, optional)
   - Prompt (AI generation prompt, optional)
   - Artifact hash (SHA-256)

---

## 🤖 Etap 2: Prechecks (automatyczne testy) ✅

### Zaimplementowany Pipeline

#### 1. Lint Checks ✅
**Narzędzie:** ESLint z custom Design System rules

**Rules:**
- `no-raw-elements`: Wymusza użycie Fragment UI components zamiast raw HTML
- `design-system-imports-only`: Tylko importy z `@fragment_ui/ui` lub `@fragment_ui/blocks`
- `no-inline-hardcoded-colors`: Wymusza użycie design tokens zamiast hardcoded colors

**Output:**
```json
{
  "errors": 2,
  "warnings": 5,
  "issues": [
    {
      "line": 15,
      "column": 10,
      "message": "Use Button component instead of <button>",
      "rule": "no-raw-elements"
    }
  ],
  "passed": false
}
```

**Plik:** `apps/demo/app/submissions/verify.ts`

---

#### 2. A11y (Accessibility) ✅
**Narzędzie:** axe-core (przygotowane do integracji)

**Requirements:**
- P0: No critical violations
- P1: No warnings (optional)

**Output:**
```json
{
  "violations": 3,
  "issues": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Elements must have sufficient color contrast",
      "help": "Ensure all text has a contrast ratio of at least 4.5:1",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.7/color-contrast"
    }
  ],
  "passed": false
}
```

**Plik:** `apps/demo/app/submissions/verify.ts`

---

#### 3. Bundle Policy ✅
**Narzędzie:** Custom bundle analyzer

**Checks:**
- Rozmiar bundla (bytes, gzipped)
- Forbidden dependencies
- CSS imports w ESM

**Output:**
```json
{
  "violations": 1,
  "issues": [
    {
      "rule": "forbidden-dependency",
      "message": "Import of 'lodash' is forbidden. Use 'lodash-es' instead.",
      "severity": "error",
      "location": { "line": 5 }
    }
  ],
  "passed": false,
  "size": 45234,
  "gzipped": 12345
}
```

**Plik:** `apps/demo/src/lib/governance/rules/bundle-rule.ts`

---

#### 4. Test Presence ✅
**Narzędzie:** Custom checker

**Requirements:**
- Minimum: Story + Unit test dla nowych komponentów
- Coverage threshold (optional)

**Output:**
```json
{
  "violations": 2,
  "issues": [
    {
      "type": "story",
      "component": "Button",
      "message": "Missing Storybook story"
    },
    {
      "type": "unit",
      "component": "Button",
      "message": "Missing unit test"
    }
  ],
  "passed": false,
  "hasStory": false,
  "hasUnit": false
}
```

**Plik:** `apps/demo/app/submissions/checks.ts`

---

#### 5. ACL (Access Control List) ✅
**Narzędzie:** Custom checker

**Requirements:**
- Wszystkie CTAs muszą mieć `data-action-id` i `data-action-kind`
- Zgodność z Action Contracts w DSL

**Output:**
```json
{
  "violations": 1,
  "issues": [
    {
      "element": "Submit Button",
      "missing": ["data-action-id", "data-action-kind"],
      "message": "Button 'Submit Button' is missing ACL attributes: data-action-id, data-action-kind. All CTAs must have data-action-id and data-action-kind for agent compatibility."
    }
  ],
  "passed": false
}
```

**Plik:** `apps/demo/app/submissions/checks.ts`

---

#### 6. Synthetic Check ✅
**Narzędzie:** Custom DSL validator

**Checks:**
- Deterministic evaluation of DSL structure
- Decision patterns validation (compare-3, recommendation)
- Required fields verification

**Output:**
```json
{
  "score": 70,
  "failures": [
    "Decision pattern 'compare-3' requires at least 3 options, found 2"
  ],
  "passed": false
}
```

**Plik:** `apps/demo/app/submissions/checks.ts`

---

#### 7. Governance Checks ✅
**Narzędzie:** Policy Engine + Rule Engine

**Policy Bundles:**
- `core-ds`: Podstawowe reguły Design System
- `enterprise`: Zaawansowane reguły dla enterprise

**Rules:**
- `no-raw-elements`: Wymusza użycie Fragment UI components
- `design-system-imports-only`: Tylko importy z `@fragment_ui/ui`
- `no-hardcoded-colors`: Wymusza użycie design tokens
- `a11y-critical`: Wymusza accessibility compliance
- `test-presence`: Wymusza obecność testów

**Enforcement:**
- **Studio**: Soft warnings (nie blokuje)
- **Submissions**: Hard gates (blokuje approval przy errors)
- **Releases**: Final gates (blokuje publikację)

**Output:**
```json
{
  "passed": false,
  "errors": 2,
  "warnings": 5,
  "violations": [
    {
      "ruleId": "no-hardcoded-colors",
      "severity": "error",
      "message": "Hardcoded color value found: #ff0000. Use design tokens instead.",
      "location": { "file": "submission.tsx", "line": 15, "column": 20 }
    }
  ],
  "blocksApproval": true
}
```

**Plik:** `apps/demo/src/lib/governance/`

---

### Zwracanie wyników

Wyniki testów są zwracane w formacie `SubmissionChecks` i zapisywane w `submission.checks`:

```typescript
interface SubmissionChecks {
  lint: { ... };
  a11y: { ... };
  bundle: { ... };
  tests: { ... };
  acl: { ... };
  synthetic: { ... };
}
```

Dodatkowo obliczany jest `SubmissionResult` z aggregated score (0-100):

```typescript
interface SubmissionResult {
  score: number;        // 0-100
  lint: { ... };
  a11y: { ... };
  tokens: { ... };
  figma: { ... };
  suggestions: string[];
}
```

---

## 👥 Etap 3: Governance Review UI ✅

### Submissions Dashboard

**URL:** `/submissions` lub `/studio?tab=drafts`

**Features:**
- ✅ Lista wszystkich submissions w grid layout
- ✅ Filtry: Status, Type, Origin Type, Sort by
- ✅ Karty z mini preview, statusem, wynikami checks
- ✅ Badge z origin type (Product, Design, Copilot, Audit, R&D)
- ✅ Quick actions (View, Verify, Promote, Delete)
- ✅ Stylowanie zgodne z Governance tab

**Komponenty:**
- `SubmissionList` - Grid z kartami
- `SubmissionCard` - Karta z preview i wynikami (z origin type badge)
- `SubmissionFilters` - Filtry (Status, Type, Origin Type, Sort)

**Origin Type Filter:**
- All Origins (default)
- Product
- Design
- Copilot
- Audit
- R&D

---

### Submission Detail Page

**URL:** `/submissions/[id]`

**Zakładki:**
1. **Preview** - Live preview komponentu (React Live Renderer)
2. **Code** - TSX code z syntax highlighting
3. **DSL** - UI-DSL structure (JSON)
4. **Verification** - Wyniki wszystkich checks:
   - Score visualization (0-100)
   - Lint errors/warnings
   - A11y violations
   - Token violations
   - Bundle size
   - Test presence
   - ACL violations
   - Synthetic score
5. **Review** - Review interface z komentarzami

**Komponenty:**
- `SubmissionDetailPage` - Main page component
- `ReviewInterface` - Review interface z inline comments

**Origin Type Display:**
- Badge z origin type (Product, Design, Copilot, Audit, R&D)
- Wyświetlany w headerze submission detail page
- Umożliwia filtrowanie i śledzenie metryk

---

### Review Interface

**Features:**
- ✅ Inline comments na kodzie/DSL (zaznacz tekst → dodaj komentarz)
- ✅ Approve button z opcjonalnym komentarzem
- ✅ Request Changes button z komentarzem
- ✅ Diff visualization (jeśli dostępny parent revision)
- ✅ Resolve comments functionality
- ✅ Status badges (approved/rejected)
- ✅ Check results summary (lint, a11y, bundle, tests)

**Workflow:**
1. Reviewer otwiera submission
2. Przejrza wyniki checks w zakładce "Verification"
3. Przejrza kod w zakładce "Code" lub "DSL"
4. Może dodać inline comments (zaznacz tekst → dodaj komentarz)
5. Decyzja:
   - **Approve**: Status → `"approved"`, dodaje `approvedBy` i `approvedAt`
   - **Request Changes**: Status → `"rejected"`, dodaje `rejectionReason` i `reviewComments`

**Komponenty:**
- `ReviewInterface` - Main review component
- `DiffVisualization` - Side-by-side diff view
- `InlineCommentInput` - Input dla inline comments
- `CommentItem` - Wyświetlanie komentarza

---

## 🏷 Etap 4: Status i publikacja ✅

### State Machine

```
draft → submitted → approved → (promote) → published
  ↓         ↓
rejected ← changes_requested
```

**Statusy:**
- `draft`: Utworzony w Studio, nie wysłany
- `submitted`: Wysłany do review (checks running)
- `approved`: Zatwierdzony przez reviewera
- `rejected`: Odrzucony (z powodem w `rejectionReason`)

**Legacy Statusy (backward compatibility):**
- `DRAFT` → `draft`
- `CHECKING` → `submitted`
- `verifying` → `submitted`
- `APPROVED` → `approved`
- `NEEDS_CHANGES` → `rejected`
- `REJECTED` → `rejected`
- `verified` → `approved`
- `promoted` → `approved`

---

### Promote to PR ✅

**Po approve:**
1. Reviewer kliknie "Promote to PR" w submission detail page
2. System tworzy GitHub PR z:
   - Komponentem w odpowiednim katalogu (`packages/ui/src/components/`)
   - Storybook story (jeśli dostępne) (`packages/ui/src/stories/`)
   - Registry update (`packages/ui/src/registry.json`)
   - Verification report w PR description

**Plik:** `apps/demo/app/submissions/promote.ts`

**API:**
```typescript
POST /api/submissions/[id]/promote

Response:
{
  "prUrl": "https://github.com/owner/repo/pull/123",
  "prNumber": 123
}
```

**Wymagane zmienne środowiskowe:**
- `GITHUB_TOKEN` - GitHub personal access token
- `GITHUB_REPO` - Format: "owner/repo"
- `GITHUB_BRANCH` - Branch name (default: "main")

---

### Registry Update

Po promote, komponent trafia do `packages/ui/src/registry.json`:

```json
{
  "components": {
    "Button": {
      "name": "Button",
      "description": "Primary action button",
      "status": "stable",  // experimental | beta | stable
      "tags": ["form", "action"],
      "path": "packages/ui/src/components/button/button.tsx",
      "stories": "packages/ui/src/stories/button.stories.tsx"
    }
  }
}
```

**Statusy komponentu:**
- `experimental`: Nowy komponent, może się zmienić
- `beta`: Stabilny, ale może mieć breaking changes
- `stable`: Produkcyjny, backward compatible

---

## 📊 Etap 5: Integracja z telemetrią i feedbackiem ⏳

### Status: Planowane (Phase 4)

**Planowane features:**
- ⏳ Zbieranie danych o wykorzystaniu komponentu
- ⏳ Feedback z poziomu dokumentacji
- ⏳ System komponentów rekomendowanych
- ⏳ Analytics dashboard

---

## 🔄 Kompletny Workflow

### 1. Tworzenie Submission w Studio

```
User w Studio:
1. Tworzy komponent w Copilot (np. "create a button with red background")
2. System generuje TSX code i DSL
3. User kliknie "Submit" button
4. System tworzy Submission:
   - Status: "draft"
   - runChecks: true (automatycznie uruchamia checks)
```

**API Call:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { "type": "component", ... },
  "tsx": "export function RedButton() { ... }",
  "author": "user@example.com",
  "prompt": "create a button with red background",
  "originType": "copilot",  // Optional: product | design | copilot | audit | r&d
  "runChecks": true
}
```

**Auto-detection originType:**
- Jeśli `prompt` istnieje → `"copilot"` (automatycznie)
- Jeśli `experimentId` istnieje → `"r&d"` (automatycznie)
- W przeciwnym razie → `"product"` (default)

---

### 2. Automatyczne Checks

```
System automatycznie:
1. Status → "submitted" (lub "CHECKING" legacy)
2. Uruchamia wszystkie checks:
   - Lint (ESLint)
   - A11y (axe-core)
   - Bundle (size analysis)
   - Tests (presence check)
   - ACL (data-action attributes)
   - Synthetic (DSL validation)
   - Governance (policy rules)
3. Zapisuje wyniki w submission.checks
4. Oblicza score (0-100) w submission.result
```

**API Call:**
```typescript
POST /api/submissions/[id]/run-checks
// Automatycznie uruchamia wszystkie checks
// Zwraca SubmissionChecks z wynikami
```

**Przykładowe wyniki:**
```json
{
  "checks": {
    "lint": { "errors": 0, "warnings": 2, "passed": true },
    "a11y": { "violations": 0, "passed": true },
    "bundle": { "violations": 0, "size": 45234, "passed": true },
    "tests": { "violations": 0, "hasStory": true, "hasUnit": true, "passed": true },
    "acl": { "violations": 0, "passed": true },
    "synthetic": { "score": 100, "passed": true }
  },
  "result": {
    "score": 95,
    "suggestions": ["Consider adding unit tests for edge cases"]
  }
}
```

---

### 3. Review Process

```
Reviewer:
1. Otwiera /submissions lub /studio?tab=drafts
2. Widzi listę submissions z filtrami
3. Kliknie na submission → otwiera detail page
4. Przejrza wyniki checks w zakładce "Verification"
5. Przejrza kod w zakładce "Code" lub "DSL"
6. Może dodać inline comments:
   - Zaznacz tekst w kodzie
   - Pojawi się pole do komentarza
   - Wpisz komentarz i kliknij "Submit"
7. Decyzja:
   - Approve: Status → "approved"
   - Request Changes: Status → "rejected" z komentarzem
```

**API Calls:**
```typescript
// Approve
POST /api/submissions/[id]/approve
{ "comment": "Looks good! Approved." }

// Request Changes
POST /api/submissions/[id]/request-changes
{
  "comment": "Please fix hardcoded colors. Use design tokens instead.",
  "comments": [
    {
      "id": "comment-123",
      "content": "Replace #ff0000 with var(--color-status-error-base)",
      "location": {
        "type": "code",
        "line": 15,
        "selectedText": "backgroundColor: '#ff0000'"
      }
    }
  ]
}
```

---

### 4. Promote to PR

```
Po approve:
1. Reviewer kliknie "Promote to PR" w submission detail page
2. System tworzy GitHub PR:
   - Komponent w packages/ui/src/components/
   - Storybook story w packages/ui/src/stories/
   - Registry update w packages/ui/src/registry.json
   - Verification report w PR description
3. Zwraca PR URL i number
```

**API Call:**
```typescript
POST /api/submissions/[id]/promote

Response:
{
  "prUrl": "https://github.com/owner/repo/pull/123",
  "prNumber": 123
}
```

---

## 📋 Checklist dla Reviewera

### Przed Approve

- [ ] Sprawdź wyniki checks w zakładce "Verification"
  - [ ] Lint: 0 errors (warnings OK)
  - [ ] A11y: 0 critical violations
  - [ ] Bundle: Size w budget
  - [ ] Tests: Has story + unit test
  - [ ] ACL: All CTAs have data-action attributes
  - [ ] Governance: No hardcoded colors, no raw HTML
- [ ] Przejrza kod w zakładce "Code"
  - [ ] Kod jest czytelny i zgodny z konwencjami
  - [ ] Używa Fragment UI components
  - [ ] Używa design tokens (nie hardcoded colors)
- [ ] Przejrza DSL w zakładce "DSL" (jeśli dostępne)
  - [ ] DSL structure jest poprawna
  - [ ] Action Contracts są zdefiniowane
- [ ] Sprawdź preview w zakładce "Preview"
  - [ ] Komponent renderuje się poprawnie
  - [ ] Wygląda zgodnie z designem

### Po Approve

- [ ] Kliknij "Promote to PR"
- [ ] Sprawdź czy PR został utworzony
- [ ] Sprawdź czy verification report jest w PR description

---

## 🔗 Related Documents

- [SUBMISSIONS_PLAN.md](./SUBMISSIONS_PLAN.md) - Implementation plan
- [SUBMISSIONS_FLOW.md](./SUBMISSIONS_FLOW.md) - Detailed workflow specification
- [../architecture/STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Domain model
- [../architecture/MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md) - Module boundaries
- [../../www/app/docs/governance/policy-bundles/content.md](../../www/app/docs/governance/policy-bundles/content.md) - Policy bundles documentation

---

**Last Updated:** 2025-01-XX

