# 🎯 Copilot: Safe MVP Isolation Plan (Fragment UI Studio)

**Cel nadrzędny (non-negotiable):**

Zbuduj oddzielną aplikację MVP, która:
- ✅ wykorzystuje istniejące działające paczki (`@fragment_ui/*`) zamiast ich przerabiania,
- ✅ pozwala zademonstrować flow: build dashboard → edit → generate variants → submit component → run governance checks → run A/B experiment,
- ✅ minimalizuje powierzchnię ryzyka: zero / minimal changes w głównym Studio,
- ✅ daje stabilny Playground render (bez „notorycznych” errorów).

**Zakaz:** refaktorowanie całego Studio, przebudowa DSL lub wejście w długie integracje. MVP ma być "thin layer" nad istniejącymi rzeczami.

---

## 1) Strategia repo: izolacja bez chaosu

### 1.1 Utwórz nową aplikację w monorepo

W `apps/` dodaj nowy podprojekt:

```
apps/
  studio/           (istniejące)
  demo-mvp/         (NOWE)
```

Jeśli repo używa Turborepo / pnpm workspaces:
- dodaj `apps/demo-mvp` do workspace
- skonfiguruj scripts tak, by można było uruchomić tylko MVP:
  ```bash
  pnpm --filter demo-mvp dev
  ```

### 1.2 Zasady zależności MVP

**MVP może:**
- importować paczki `@fragment_ui/*` (UI components, dsl, governance engine)
- mieć własne mocki API, fixtures i config
- mieć swoje route'y / UI niezależne

**MVP nie może:**
- duplikować logiki generatorów w core (chyba że snapshot „read-only")
- zmieniać typów DSL w package'ach
- mieszać „demo mode" w głównej aplikacji przez if-y

---

## 2) Minimalny zakres MVP (to ma działać zawsze)

### 2.1 Must-have flows (demo story)

MVP musi dowieźć 4 rzeczy:

#### A) Dashboard builder + render (Playground)
- start z predefiniowanego dashboard fixture
- renderowanie bez React Live jeśli jest niestabilne (patrz rozdz. 3)

#### B) Edycja elementów dashboardu
Panel Inspector umożliwia zmianę:
- text/label/title
- variant (np. "default/secondary")
- layout params (colSpan / rowSpan / arrangement)
- zapis rewizji lokalnie (local state + "Save revision")

#### C) Generate variants
Na bazie jednego dashboardu generuj 2–4 warianty:
- **Variant A** (overview-first)
- **Variant B** (action-first)
- **Variant C** (narrative/story)
- **Variant D** (dense/compact)

Wariacje mają różnić się:
- układem (kolejność, siatka)
- narracją (headline, grouping)
- priorytetami informacji

#### D) A/B test runner (symulowany)
- wybór wariantu A vs B
- uruchomienie eksperymentu
- pokazanie metryk (mock):
  - CTR na główne CTA
  - time-to-insight
  - completion rate

### 2.2 Nice-to-have (tylko „placeholder")
- **Figma Import:** na MVP tylko "Import" → tworzy Submission z mock payload
- **pełne CI governance:** na MVP tylko lokalny "Run checks" (2–3 checki)

---

## 3) Najważniejsze: stabilny render w Playground (plan naprawczy)

### 3.1 Zmień zasadę: nie generuj JSX stringiem jako główny render path

W MVP unikaj rendering path typu:
```
DSL → TSX string → React Live → eval
```

To jest najbardziej podatne na:
- brakujące importy
- scope issues
- syntax errors
- runtime exceptions

**Zamiast tego w MVP wprowadź renderer oparty o config/AST:**
```
DSL/config → ComponentRegistry → React.createElement(...)
```

### 3.1.1 Implementacja: runtime-renderer

Dodaj w `apps/demo-mvp/src/runtime/`:

**componentRegistry.ts**
- mapuje string nazwy komponentu → rzeczywisty komponent React

**renderNode.tsx**
- bierze node `{type, props, children}` i robi `createElement`

**renderDashboard.tsx**
- renderuje layout (grid/stack) + regiony

**Uwaga:** jeśli już macie DSL v2 — używaj DSL v2 jako źródła prawdy, ale renderuj go bez "string codegen".

### 3.2 Error boundaries + crash-safe preview

W preview zawsze:
- opakuj render w `ErrorBoundary`
- loguj błąd do "Preview Errors" panelu w UI (lista)

### 3.3 "Fallback Mode"

Jeśli cokolwiek fails:
- pokaż ostatni stabilny wariant
- pokaż diff zmian (co user zmienił)
- pozwól cofnąć (undo)

---

## 4) Architektura MVP (konkretne pliki)

W `apps/demo-mvp` utwórz strukturę:

```
apps/demo-mvp/src/
  app/
    routes/
      playground/
      submissions/
      governance/
      experiments/
  fixtures/
    dashboards/
      dashboard.base.json
      dashboard.variantA.json
  runtime/
    componentRegistry.ts
    renderNode.tsx
    renderDashboard.tsx
  state/
    store.ts (zustand lub jotai)
    revision.ts
  services/
    variantGenerator.ts
    governanceRunner.ts
    submissionsService.ts
    experimentService.ts
```

---

## 5) Submissions: prosty, działający workflow (bez ciężkich integracji)

### 5.1 Submission model (MVP)

W MVP Submission to plik JSON + optional TSX code blob:

`apps/demo-mvp/src/fixtures/submissions/*.json`

**Schema minimalne:**
```json
{
  "id": "sub_001",
  "name": "KpiCard",
  "originType": "copilot",
  "status": "submitted",
  "tags": ["dashboard", "metrics"],
  "artifacts": {
    "componentCode": "string",
    "docs": "string",
    "storybook": false
  }
}
```

### 5.2 Ścieżki do Submissions (popularne w enterprise)

UI musi wspierać co najmniej 3 wejścia:
1. **From Playground:** "Promote block to component"
2. **Paste Code:** "Submit from code"
3. **Figma (placeholder):** "Import from Figma" (mock)

Każda ścieżka ustawia `originType`.

---

## 6) Governance: pokaż narrację jakości (2–3 checki)

### 6.1 Minimalny zestaw checków (demo-quality)

Uruchamiaj lokalnie:

1. **A11y** (axe-core / jest-axe) – na wyrenderowanym preview
2. **Token compliance** (simple rule): sprawdzaj czy className używa `text-*` / `bg-*` zgodnie z allowlist
3. **Visual snapshot** (mock) – w MVP wystarczy generować "hash screenshot id" albo utrwalać state

**Wynik checków:**
```json
{
  "status": "warning|pass|fail",
  "checks": [
    {"name":"a11y", "status":"pass"},
    {"name":"tokens", "status":"warning", "message":"Uses raw hex color"},
    {"name":"visual", "status":"pass"}
  ]
}
```

### 6.2 Governance UX
- panel "Run checks"
- wynik w formie listy z badge'ami
- możliwość "Request changes" / "Approve" (lokalnie)

---

## 7) Variant Generator (serce demo)

### 7.1 Minimalny generator wariantów

Implementuj `variantGenerator.ts` tak, by:
- brał `dashboard.base.json`
- tworzył 2–4 warianty przez deterministyczne transformacje:
  - reorder sections
  - change grid spans
  - switch hero KPI group
  - change headings (narrative)

### 7.2 AI opcjonalnie (bez ryzyka)

Jeśli macie Copilota/LLM działającego stabilnie:
- używaj go tylko do "narrative text"
- layout transformacje rób deterministycznie (bez LLM)

---

## 8) Experiments (A/B): prosto, czytelnie, przekonująco

### 8.1 ExperimentRunner

- wybór wariantu A i B (dropdown)
- "Start experiment"
- "Simulate results" (seeded RNG dla spójności)
- dashboard "winner" + metryki

**Metryki:**
- primary CTA CTR
- time to insight
- engagement score

### 8.2 PostHog (opcjonalnie)

Jeśli integracja jest szybka:
- track view per variant
- track CTA click per variant

Ale jeśli nie — mock wystarczy.

---

## 9) Plan minimalnych zmian w core repo

W core repo (Studio) wykonuj tylko:
- dodanie `apps/demo-mvp`
- ewentualne eksporty w `@fragment_ui/ui-components` jeśli brak public exportów
- poprawki build config/workspaces

**Nie ruszaj:** patch workflow, complex scaffolds, react-live scope — chyba że MVP ich realnie potrzebuje.

---

## 10) Definition of Done (DoD) dla MVP

Copilot ma uznać zadanie za ukończone gdy:

- ✅ `pnpm --filter demo-mvp dev` odpala się bez błędów
- ✅ Playground renderuje `dashboard.base.json` i 2 warianty bez crashy
- ✅ Inspector edytuje props komponentu bez runtime error
- ✅ Submissions przyjmuje komponent (z 3 ścieżek) i pokazuje status
- ✅ Governance uruchamia 2–3 checki i pokazuje wynik
- ✅ Experiments pozwalają porównać A/B i pokażą metryki
- ✅ ErrorBoundary + "Preview Errors" działa, tzn. żadna awaria nie zabija całej appki

---

## 11) Aktualizacja planu rozwoju produktu

Copilot ma zaktualizować dokumentację roadmapy tak:

### Phase MVP-Demo (NEW)

**Build stable runtime renderer (no React Live dependency)**
- Component registry + renderNode
- Error boundaries + fallback mode
- Crash-safe preview

**Dashboard fixture + Inspector**
- Predefiniowany dashboard fixture
- Inspector panel dla edycji props
- Local revision tracking

**Variant generator (deterministic) + narrative (optional LLM)**
- 2-4 warianty z deterministycznych transformacji
- Optional LLM dla narrative text

**Submissions minimal workflow (3 entry paths)**
- From Playground
- Paste Code
- Figma Import (mock)

**Governance minimal checks**
- A11y check
- Token compliance
- Visual snapshot (mock)

**Experiments A/B runner (mock or PostHog optional)**
- Variant selection
- Mock metrics (CTR, time-to-insight, engagement)
- Optional PostHog integration

### Phase Re-integrate (LATER)

**if MVP proves stable → przenosimy moduły do core Studio**
- Runtime renderer → core Studio
- Variant generator → core Studio
- A/B experiments → core Studio

**wpinamy do Studio Core Domain Model**
- Integracja z Asset/Revision/Patch entities
- Unified submission workflow

**rozszerzamy governance o pełny pipeline CI**
- Full CI integration
- Extended checks
- Production-ready enforcement

---

## 📋 Checklist dla Copilota

### Setup
- [ ] Utwórz `apps/demo-mvp/` w monorepo
- [ ] Skonfiguruj `package.json` z zależnościami `@fragment_ui/*`
- [ ] Dodaj do `turbo.json` / workspace config
- [ ] Utwórz podstawową strukturę folderów

### Runtime Renderer
- [ ] `componentRegistry.ts` - mapowanie nazw → komponenty
- [ ] `renderNode.tsx` - React.createElement renderer
- [ ] `renderDashboard.tsx` - layout renderer
- [ ] ErrorBoundary wrapper
- [ ] Fallback mode

### Dashboard & Inspector
- [ ] `dashboard.base.json` fixture
- [ ] Playground route z rendererem
- [ ] Inspector panel (props editing)
- [ ] Revision tracking (local state)

### Variant Generator
- [ ] `variantGenerator.ts` - deterministyczne transformacje
- [ ] 2-4 warianty (A, B, C, D)
- [ ] Optional LLM dla narrative

### Submissions
- [ ] Submission model (JSON schema)
- [ ] 3 entry paths (Playground, Paste Code, Figma)
- [ ] Origin type tracking
- [ ] Status workflow

### Governance
- [ ] A11y check (axe-core)
- [ ] Token compliance check
- [ ] Visual snapshot (mock)
- [ ] Results UI

### Experiments
- [ ] Variant selection UI
- [ ] Mock metrics generation
- [ ] Results dashboard
- [ ] Optional PostHog integration

### Testing & Validation
- [ ] `pnpm --filter demo-mvp dev` działa
- [ ] Playground renderuje bez crashy
- [ ] Inspector edytuje bez errors
- [ ] Submissions workflow działa
- [ ] Governance checks działają
- [ ] Experiments działają
- [ ] ErrorBoundary działa

---

**Status:** 📋 Plan gotowy do implementacji  
**Priorytet:** P0 - Strategic (po stabilizacji Copilota)  
**Czas:** 2-3 tygodnie (80-120h)

