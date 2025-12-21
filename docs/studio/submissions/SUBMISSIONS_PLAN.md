# 📦 Plan Działania – Component Submission Workflow

**Version:** 2.0  
**Status:** Implementation Complete (Phase 3)  
**Last Updated:** 2025-01-XX

---

## 🎯 Cel

Automatyczny, skalowalny proces przetwarzania zgłoszonych komponentów z użyciem testów jakości, statusów i ścieżki review w obrębie Fragment UI Studio.

---

## ✅ Status Implementacji

### Etap 1: Struktura i API komponentów ✅ ZAKOŃCZONY

**Zaimplementowane:**
- ✅ Submission model z pełnym typowaniem (`apps/demo/app/submissions/types.ts`)
- ✅ API endpoints dla CRUD operations (`/api/submissions`)
- ✅ Artifact hash dla deduplication (SHA-256)
- ✅ Linki do Revision entity (`revisionId`)
- ✅ Experiment tracking (`experimentId`, `variantKey`)
- ✅ Metadata storage (DSL, TSX, stories, prompt)

**Struktura Submission:**
```typescript
interface Submission {
  id: string;                    // UUID v4
  type: "component" | "block" | "screen";
  dsl: UiDsl;                    // UI-DSL structure
  tsx: string;                    // Generated TSX code
  stories?: string;               // Storybook stories
  status: SubmissionStatus;       // draft | submitted | approved | rejected
  author: string;
  prompt?: string;                // Original AI prompt
  
  // Origin Type - tracks how submission was created
  originType?: "product" | "design" | "copilot" | "audit" | "r&d";
  
  // Quality Checks
  checks?: SubmissionChecks;      // Detailed check results
  result?: SubmissionResult;      // Aggregated score (0-100)
  
  // Review
  reviewComments?: ReviewComment[]; // Inline comments
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  
  // Links
  revisionId?: string;
  experimentId?: string;
  variantKey?: string;
  artifactHash?: string;
}
```

**Origin Types:**
- `product`: Product → System (reusable component from product team)
- `design`: Design-driven contribution (designer introduces new pattern)
- `copilot`: AI/Copilot-assisted (generated via Copilot prompt)
- `audit`: Refactoring audit / tech debt (standardization of existing components)
- `r&d`: Experimental / R&D (experimental component without long-term support guarantee)

**Auto-detection:**
- Jeśli `prompt` istnieje → `"copilot"`
- Jeśli `experimentId` istnieje → `"r&d"`
- W przeciwnym razie → `"product"` (default)

---

### Etap 2: Prechecks (automatyczne testy) ✅ ZAKOŃCZONY

**Zaimplementowane checks:**

#### 1. Lint Checks ✅
- ✅ ESLint z custom Design System rules
- ✅ `no-raw-elements`: Wymusza użycie Fragment UI components
- ✅ `design-system-imports-only`: Tylko importy z `@fragment_ui/ui`
- ✅ `no-inline-hardcoded-colors`: Wymusza użycie design tokens
- ✅ Zwraca błędy z numerami linii i regułami

**Plik:** `apps/demo/app/submissions/verify.ts`

#### 2. A11y (Accessibility) ✅
- ✅ Integracja z axe-core (przygotowana)
- ✅ Wykrywanie critical violations
- ✅ Zwraca violations z impact level i opisem

**Plik:** `apps/demo/app/submissions/verify.ts`

#### 3. Bundle Policy ✅
- ✅ Analiza rozmiaru bundla
- ✅ Wykrywanie forbidden dependencies
- ✅ Sprawdzanie CSS imports w ESM
- ✅ Zwraca size i gzipped size

**Plik:** `apps/demo/src/lib/governance/rules/bundle-rule.ts`

#### 4. Test Presence ✅
- ✅ Sprawdzanie obecności Storybook stories
- ✅ Sprawdzanie obecności unit tests
- ✅ Wykrywanie missing tests

**Plik:** `apps/demo/app/submissions/checks.ts`

#### 5. ACL (Access Control List) ✅
- ✅ Weryfikacja `data-action-id` i `data-action-kind` na wszystkich CTAs
- ✅ Sprawdzanie zgodności z Action Contracts w DSL
- ✅ Wymagane dla agent compatibility

**Plik:** `apps/demo/app/submissions/checks.ts`

#### 6. Synthetic Check ✅
- ✅ Deterministic evaluation of DSL structure
- ✅ Weryfikacja decision patterns (compare-3, recommendation)
- ✅ Sprawdzanie wymaganych pól i struktur
- ✅ Score calculation (0-100)

**Plik:** `apps/demo/app/submissions/checks.ts`

#### 7. Governance Checks ✅
- ✅ Policy bundles (core-ds, enterprise)
- ✅ Rule engine execution
- ✅ Hard gates w Submissions (blocks approval on errors)
- ✅ Token violations (hardcoded colors)
- ✅ Design system compliance

**Plik:** `apps/demo/src/lib/governance/`

**API Endpoint:**
```typescript
POST /api/submissions/[id]/run-checks
// Automatycznie uruchamia wszystkie checks
// Zwraca SubmissionChecks z wynikami
```

---

### Etap 3: Governance Review UI ✅ ZAKOŃCZONY

**Zaimplementowane:**

#### Submissions Dashboard ✅
- ✅ Lista wszystkich submissions (`/submissions`)
- ✅ Filtry: Status, Type, Sort by (`SubmissionFilters`)
- ✅ Karty z preview, statusem, wynikami checks (`SubmissionCard`)
- ✅ Stylowanie zgodne z Governance tab

**Plik:** `apps/demo/app/submissions/page.tsx`

#### Submission Detail Page ✅
- ✅ Preview komponentu (React Live Renderer)
- ✅ Zakładki: Preview, Code, DSL, Verification, Review
- ✅ Wyświetlanie wyników checks
- ✅ Score visualization (0-100)
- ✅ Szczegółowe wyniki dla każdego check type

**Plik:** `apps/demo/app/submissions/[id]/page.tsx`

#### Review Interface ✅
- ✅ Inline comments na kodzie/DSL
- ✅ Text selection dla komentarzy
- ✅ Approve button z opcjonalnym komentarzem
- ✅ Request Changes button z komentarzem
- ✅ Diff visualization (jeśli dostępny parent revision)
- ✅ Resolve comments functionality
- ✅ Status badges (approved/rejected)

**Plik:** `apps/demo/src/components/submissions/review-interface.tsx`

**API Endpoints:**
```typescript
POST /api/submissions/[id]/approve
POST /api/submissions/[id]/request-changes
POST /api/submissions/[id]/comments
POST /api/submissions/[id]/comments/[commentId]/resolve
```

---

### Etap 4: Status i publikacja ✅ ZAKOŃCZONY

**State Machine:**
```
draft → submitted → approved → (promote) → published
  ↓         ↓
rejected ← changes_requested
```

**Statusy:**
- `draft`: Utworzony w Studio, nie wysłany
- `submitted`: Wysłany do review
- `approved`: Zatwierdzony przez reviewera
- `rejected`: Odrzucony (z powodem)

**Promote to PR ✅**
- ✅ Automatyczne tworzenie GitHub PR
- ✅ Dodanie komponentu do registry
- ✅ Generowanie changelog entry
- ✅ PR description z verification report

**Plik:** `apps/demo/app/submissions/promote.ts`

**API Endpoint:**
```typescript
POST /api/submissions/[id]/promote
// Tworzy PR z komponentem
// Zwraca PR URL i number
```

---

### Etap 5: Integracja z telemetrią i feedbackiem ⏳ PLANOWANE

**Status:** Nie zaimplementowane (Phase 4)

**Planowane:**
- ⏳ Zbieranie danych o wykorzystaniu komponentu
- ⏳ Feedback z poziomu dokumentacji
- ⏳ System komponentów rekomendowanych
- ⏳ Analytics dashboard

---

## 🔄 Workflow (Aktualny)

### 1. Tworzenie Submission

**W Studio:**
1. Użytkownik tworzy komponent w Copilot
2. Kliknie "Submit" w Studio
3. System tworzy Submission z statusem `"draft"`

**API:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "user@example.com",
  "runChecks": true  // Automatycznie uruchamia checks
}
```

### 2. Automatyczne Checks

**Jeśli `runChecks: true`:**
1. Status zmienia się na `"submitted"` (lub `"CHECKING"` legacy)
2. Uruchamiane są wszystkie checks:
   - Lint (ESLint)
   - A11y (axe-core)
   - Bundle (size analysis)
   - Tests (presence check)
   - ACL (data-action attributes)
   - Synthetic (DSL validation)
   - Governance (policy rules)
3. Wyniki zapisywane w `submission.checks`
4. Score obliczany (0-100) w `submission.result`

**API:**
```typescript
POST /api/submissions/[id]/run-checks
// Automatycznie uruchamia wszystkie checks
```

### 3. Review Process

**Reviewer:**
1. Otwiera submission w `/submissions/[id]`
2. Przejrza wyniki checks w zakładce "Verification"
3. Przejrza kod w zakładce "Code" lub "DSL"
4. Może dodać inline comments (zaznacz tekst → dodaj komentarz)
5. Decyzja:
   - **Approve**: Status → `"approved"`
   - **Request Changes**: Status → `"rejected"` z komentarzem

**API:**
```typescript
POST /api/submissions/[id]/approve
{ "comment": "Looks good!" }

POST /api/submissions/[id]/request-changes
{ 
  "comment": "Please fix a11y violations",
  "comments": [ /* inline comments */ ]
}
```

### 4. Promote to PR

**Po approve:**
1. Reviewer kliknie "Promote to PR"
2. System tworzy GitHub PR z:
   - Komponentem w odpowiednim katalogu
   - Storybook story (jeśli dostępne)
   - Registry update
   - Verification report w PR description

**API:**
```typescript
POST /api/submissions/[id]/promote
// Tworzy PR i zwraca URL
```

---

## 📊 Quality Checks Details

### SubmissionChecks Structure

```typescript
interface SubmissionChecks {
  lint: {
    errors: number;
    warnings: number;
    issues: Array<{ line, column, message, rule }>;
    passed: boolean;
  };
  a11y: {
    violations: number;
    issues: Array<{ id, impact, description, help, helpUrl }>;
    passed: boolean;
  };
  bundle: {
    violations: number;
    issues: Array<{ rule, message, severity, location }>;
    passed: boolean;
    size?: number;      // bytes
    gzipped?: number;   // bytes
  };
  tests: {
    violations: number;
    issues: Array<{ type, component, message }>;
    passed: boolean;
    hasStory?: boolean;
    hasUnit?: boolean;
  };
  acl: {
    violations: number;
    issues: Array<{ element, missing, message }>;
    passed: boolean;
  };
  synthetic: {
    score: number;      // 0-100
    failures: string[];
    passed: boolean;
  };
}
```

### Governance Integration

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

---

## 🎨 UI Components

### SubmissionList
**Plik:** `apps/demo/src/components/submissions/submission-list.tsx`

**Features:**
- Grid layout z kartami
- Mini preview każdego submission
- Status badges
- Quick actions (View, Verify, Promote, Delete)

### SubmissionCard
**Plik:** `apps/demo/src/components/submissions/submission-card.tsx`

**Features:**
- Preview komponentu (React Live Renderer)
- Status i type badges
- Score visualization
- Check results summary
- Action buttons

### SubmissionFilters
**Plik:** `apps/demo/src/components/submissions/submission-filters.tsx`

**Features:**
- Filter by Status (All, Draft, Verifying, Verified, Rejected, Promoted)
- Filter by Type (All, Component, Block, Screen)
- Sort by (Date, Score, Author)
- Stylowanie zgodne z Governance tab

### ReviewInterface
**Plik:** `apps/demo/src/components/submissions/review-interface.tsx`

**Features:**
- Inline comments na kodzie/DSL
- Text selection dla komentarzy
- Approve/Request Changes buttons
- Diff visualization
- Comment resolution
- Status badges

---

## 🔗 Integration Points

### From Studio
- ✅ User creates component w Copilot
- ✅ User clicks "Submit" button
- ✅ System creates Submission z `runChecks: true`
- ✅ Checks uruchamiane automatycznie
- ✅ Submission widoczny w `/studio?tab=drafts`

### To Releases (Planowane)
- ⏳ Approved Submission → Release Candidate
- ⏳ System creates Release from approved Submission
- ⏳ Release trafia do registry

### From Experiments (Planowane)
- ⏳ Experiment winner → Submission
- ⏳ System creates Submission from winner Revision

---

## 📝 Acceptance Criteria

### ✅ Zaimplementowane

1. ✅ Can create submission from Studio
2. ✅ Checks run automatically on creation (`runChecks: true`)
3. ✅ Can view check results in Verification tab
4. ✅ Can add review comments (inline)
5. ✅ Can approve submission
6. ✅ Can request changes with comments
7. ✅ Approved submission ready for PR promotion
8. ✅ Submission links to Revision (via `revisionId`)
9. ✅ Governance integration (policy bundles, rule engine)
10. ✅ Promote to PR functionality

### ⏳ Planowane (Phase 4)

1. ⏳ Release creation from approved submissions
2. ⏳ Experiment integration
3. ⏳ Telemetry and analytics
4. ⏳ Feedback system
5. ⏳ Component recommendations

---

## 🚀 Next Steps (Phase 4)

### Releases Integration
- [ ] Create Release from approved Submission
- [ ] Version management (semver)
- [ ] Changelog generation
- [ ] Registry update automation

### Experiments Integration
- [ ] Link Submission to Experiment
- [ ] Variant tracking
- [ ] A/B test results integration

### Analytics & Feedback
- [ ] Component usage tracking
- [ ] Feedback collection from docs
- [ ] Recommendation engine
- [ ] Analytics dashboard

---

## 📚 Related Documents

- [SUBMISSIONS_FLOW.md](./SUBMISSIONS_FLOW.md) - Detailed workflow specification
- [../architecture/STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Domain model
- [../architecture/MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md) - Module boundaries
- [../governance/POLICY_BUNDLES.md](../../www/app/docs/governance/policy-bundles/content.md) - Policy bundles documentation

---

**Last Updated:** 2025-01-XX

