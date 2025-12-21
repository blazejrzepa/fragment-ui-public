# Fragment UI - Plan Rozwoju (v1.1 → v1.3)

**Data utworzenia:** 2025-01-XX  
**Bazuje na:** DS_AUDIT_REPORT.md + Copilot Runbook v1.1

---

## Spis treści

1. [Przegląd](#przegląd)
2. [Zasady dla Copilota](#zasady-dla-copilota)
3. [Zadania z priorytetami](#zadania-z-priorytetami)
4. [Zależności między zadaniami](#zależności-między-zadaniami)
5. [Szacunki czasowe](#szacunki-czasowe)

---

## Przegląd

Plan obejmuje 10 zadań podzielonych na 3 fazy:
- **Faza 1 (P0):** Governance & Quality Gates (Task 1-2, 9)
- **Faza 2 (P1):** Submissions & Verification (Task 3-5)
- **Faza 3 (P2):** Advanced Features (Task 6-8, 10)

**Cel:** Przekształcenie Playground z narzędzia demo w pełnoprawny system zarządzania komponentami z workflow: Generate → Verify → Promote → Merge.

---

## Zasady dla Copilota

1. **Każdy task = oddzielny commit** z jasnym opisem (`feat:`, `chore:`, `fix:`)
2. **Zero placeholderów** — jeśli brak danych, dodaj `GAP:` w komentarzu i bezpieczny fallback
3. **Trzymaj się istniejącej struktury** z raportu audytowego
4. **Uruchamiaj lokalnie testy** po zmianach (lint, typecheck, vitest/playwright)
5. **Pokaż diff** przed commitem dla większych zmian

---

## Zadania z priorytetami

### Faza 1: Governance & Quality Gates (P0)

#### Task 1: Włącz reguły DS w ESLint (apps/demo)

**Priorytet:** P0  
**Estymacja:** S (2-4h)  
**Zależności:** Brak

**Cel:** Egzekwować "design governance" w Playground poprzez włączenie custom ESLint rules.

**Pliki do modyfikacji:**
- `apps/demo/eslint.config.mjs` — dodaj import custom rules
- `apps/demo/package.json` — dodaj skrypt `lint:ds`
- `apps/demo/src/**/*.{ts,tsx}` — napraw naruszenia (jeśli są)

**Kroki:**
1. Edytuj `apps/demo/eslint.config.mjs`:
   ```javascript
   import path from "node:path";
   import { fileURLToPath } from "url";
   
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   const DS_RULES_DIR = path.resolve(__dirname, "../../tooling/lint");
   
   export default [
     {
       ignores: ["**/*.config.*", "**/node_modules/**", "**/.next/**", "**/dist/**"],
     },
     {
       files: ["**/*.{js,jsx,ts,tsx}"],
       languageOptions: {
         ecmaVersion: "latest",
         sourceType: "module",
       },
       plugins: {
         "ds-no-raw": await import(path.join(DS_RULES_DIR, "eslint-no-raw-elements.js")),
         "ds-imports-only": await import(path.join(DS_RULES_DIR, "eslint-design-system-imports-only.js")),
         "ds-no-hardcolors": await import(path.join(DS_RULES_DIR, "eslint-no-inline-hardcoded-colors.js")),
       },
       rules: {
         "no-console": ["warn", { allow: ["warn", "error"] }],
         "ds-no-raw/no-raw-elements": "error",
         "ds-imports-only/design-system-imports-only": "error",
         "ds-no-hardcolors/no-inline-hardcoded-colors": "error",
       },
     },
   ];
   ```

2. Dodaj do `apps/demo/package.json`:
   ```json
   {
     "scripts": {
       "lint:ds": "eslint --max-warnings=0 ."
     }
   }
   ```

3. Uruchom `pnpm --filter apps/demo lint:ds` i napraw błędy

**AC:**
- ✅ `pnpm --filter apps/demo lint:ds` przechodzi bez ostrzeżeń
- ✅ Naruszenia w widokach demo faktycznie wyłapują błędy (sprawdź 1-2 pliki ręcznie)

**Commit:** `feat(demo): enable design system ESLint rules`

---

#### Task 2: CI guard — "no CSS imports in ESM"

**Priorytet:** P0  
**Estymacja:** S (1-2h)  
**Zależności:** Brak

**Cel:** Nigdy więcej `import "...css"` w bundlach ESM.

**Status:** ✅ Skrypt już istnieje (`scripts/check-no-css-imports.mjs`), trzeba dodać do CI.

**Pliki do modyfikacji:**
- `.github/workflows/ci.yml` — dodaj krok check CSS imports

**Kroki:**
1. Sprawdź czy `scripts/check-no-css-imports.mjs` działa:
   ```bash
   pnpm check:no-css-imports
   ```

2. Dodaj do `.github/workflows/ci.yml` (po "Check documentation"):
   ```yaml
   - name: Check CSS imports
     run: pnpm check:no-css-imports
   ```

**AC:**
- ✅ Workflow CI failuje, jeśli jakikolwiek `.ts/.tsx` importuje `.css`
- ✅ Skrypt działa lokalnie

**Commit:** `chore(ci): add CSS imports guard to CI pipeline`

---

#### Task 9: Bundle hardening

**Priorytet:** P0  
**Estymacja:** M (4-6h)  
**Zależności:** Brak

**Cel:** Stabilne `/api/bundle` (jsx-runtime, pinned import map).

**Pliki do modyfikacji:**
- `apps/demo/app/api/bundle/route.ts` — uprość cleanup jsx-runtime
- `apps/demo/app/playground/runtime/iframe.html` — pin wersje w import map
- `apps/demo/e2e/preview.spec.ts` — dodaj smoke test (nowy plik)

**Kroki:**
1. **Uprość cleanup jsx-runtime** w `apps/demo/app/api/bundle/route.ts`:
   ```typescript
   // Zastąp linie 291-365 jednym wyrażeniem:
   bundledCode = bundledCode.replace(/\breact\/jsx(?:-dev)?-runtime\b/g, "react");
   ```

2. **Pin wersje w import map** (`apps/demo/app/playground/runtime/iframe.html`):
   - Upewnij się, że wszystkie wersje są konkretne (bez `@latest`)
   - Dodaj komentarz z datą ostatniej aktualizacji

3. **Dodaj Playwright smoke test** (`apps/demo/e2e/preview.spec.ts`):
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Preview Runtime', () => {
     test('renders form without console errors', async ({ page }) => {
       await page.goto('/playground');
       // Wait for preview to load
       await page.waitForSelector('#root', { timeout: 10000 });
       
       // Check for console errors
       const errors: string[] = [];
       page.on('console', msg => {
         if (msg.type() === 'error') errors.push(msg.text());
       });
       
       // Render a simple form
       await page.evaluate(() => {
         // Trigger render with test code
       });
       
       await page.waitForTimeout(2000);
       expect(errors).toHaveLength(0);
     });
   });
   ```

**AC:**
- ✅ Smoke test przechodzi lokalnie
- ✅ Brak błędów modułów w preview
- ✅ Bundle nie zawiera `react/jsx-runtime` referencji

**Commit:** `fix(bundle): harden jsx-runtime cleanup and pin import map versions`

---

### Faza 2: Submissions & Verification (P1)

#### Task 3: Submissions API

**Priorytet:** P1  
**Estymacja:** M (6-8h)  
**Zależności:** Brak

**Cel:** Kandydaci (komponenty/bloki/ekrany) przechodzą przez workflow zanim trafią do DS.

**Pliki do utworzenia:**
- `apps/demo/app/submissions/types.ts`
- `apps/demo/app/submissions/store.ts`
- `apps/demo/app/api/submissions/route.ts`
- `apps/demo/app/api/submissions/[id]/verify/route.ts`
- `apps/demo/app/api/submissions/[id]/promote/route.ts`
- `apps/demo/data/submissions.json` (utworzy się automatycznie)

**Kroki:**
1. **Typy** (`apps/demo/app/submissions/types.ts`):
   ```typescript
   export type SubmissionStatus = "draft" | "verifying" | "verified" | "rejected" | "promoted";
   
   export type Submission = {
     id: string;
     type: "component" | "block" | "screen";
     dsl: any; // UiDsl
     tsx: string;
     stories?: string;
     status: SubmissionStatus;
     author: string;
     createdAt: string;
     result?: {
       lint: { errors: number; messages: string[] };
       a11y: { critical: number; summary: string };
       visual?: { passed: boolean; diffUrl?: string };
       tokens: { hardColors: number };
       score: number;
       issues: string[];
     };
   };
   ```

2. **Storage** (`apps/demo/app/submissions/store.ts`):
   ```typescript
   import { readFile, writeFile, mkdir } from "node:fs/promises";
   import { join } from "node:path";
   
   const DB_DIR = join(process.cwd(), "data");
   const DB_FILE = join(DB_DIR, "submissions.json");
   
   export async function list(): Promise<Submission[]> {
     try {
       const content = await readFile(DB_FILE, "utf8");
       return JSON.parse(content);
     } catch {
       return [];
     }
   }
   
   export async function save(all: Submission[]): Promise<void> {
     await mkdir(DB_DIR, { recursive: true });
     await writeFile(DB_FILE, JSON.stringify(all, null, 2));
   }
   
   export async function upsert(item: Submission): Promise<Submission> {
     const all = await list();
     const i = all.findIndex(x => x.id === item.id);
     if (i >= 0) {
       all[i] = item;
     } else {
       all.push(item);
     }
     await save(all);
     return item;
   }
   
   export async function findById(id: string): Promise<Submission | null> {
     const all = await list();
     return all.find(x => x.id === id) || null;
   }
   ```

3. **Endpoints** — zaimplementuj POST handlers dla:
   - `/api/submissions` — tworzenie submission
   - `/api/submissions/[id]/verify` — uruchomienie weryfikacji (Task 4)
   - `/api/submissions/[id]/promote` — promocja do PR (Task 5)

**AC:**
- ✅ Można POSTować submission i odczytać z pliku JSON
- ✅ Verify i Promote zmieniają status i zwracają payload
- ✅ Przykładowe cURL w komentarzu

**Commit:** `feat(submissions): add submission API with storage`

---

#### Task 4: Verify runner

**Priorytet:** P1  
**Estymacja:** L (8-12h)  
**Zależności:** Task 3

**Cel:** Automatyczny "gate" dla Submissions.

**Pliki do utworzenia:**
- `apps/demo/app/submissions/verify.ts`
- `apps/demo/app/api/a11y/run/route.ts` (opcjonalnie, jeśli reuse z preview)

**Kroki:**
1. **Lint runner** — użyj ESLint Node API:
   ```typescript
   import { ESLint } from "eslint";
   
   async function runLint(tsx: string): Promise<{ errors: number; messages: string[] }> {
     const eslint = new ESLint({
       useEslintrc: false,
       baseConfig: {
         // Load from apps/demo/eslint.config.mjs
       },
     });
     const results = await eslint.lintText(tsx, { filePath: "submission.tsx" });
     const messages = results[0]?.messages || [];
     return {
       errors: messages.filter(m => m.severity === 2).length,
       messages: messages.map(m => `${m.line}:${m.column} ${m.message}`),
     };
   }
   ```

2. **A11y check** — reuse istniejącego axe w preview:
   - Opcja A: Dodaj POST `/api/a11y/run` który renderuje w headless iframe
   - Opcja B: Reuse wyniku z live preview, jeśli jest dostępny

3. **Token guard** — prosty regex:
   ```typescript
   function checkTokens(tsx: string): { hardColors: number } {
     const matches = tsx.match(/#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\(|hsl\(/gi);
     return { hardColors: matches?.length || 0 };
   }
   ```

4. **Score calculation**:
   ```typescript
   const score = Math.max(0, 100 - lint.errors * 10 - a11y.critical * 15 - tokens.hardColors * 2);
   ```

**AC:**
- ✅ `verifySubmission` działa lokalnie na przykładowym TSX i zwraca sensowny score
- ✅ Endpoint `/api/submissions/:id/verify` aktualizuje rekord

**Commit:** `feat(submissions): add verification runner with lint, a11y, and token checks`

---

#### Task 5: PR-bot (Promote)

**Priorytet:** P1  
**Estymacja:** L (8-12h)  
**Zależności:** Task 3, Task 4

**Cel:** Automatycznie tworzyć PR z kandydatem do DS.

**Pliki do utworzenia:**
- `apps/demo/app/submissions/promote.ts`
- `.env.local.example` — dodaj GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH

**Kroki:**
1. **Instalacja zależności:**
   ```bash
   pnpm add @octokit/rest
   ```

2. **Implementacja** (`apps/demo/app/submissions/promote.ts`):
   ```typescript
   import { Octokit } from "@octokit/rest";
   
   export async function promoteSubmission(sub: Submission): Promise<{ prUrl: string }> {
     const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
     const [owner, repo] = (process.env.GITHUB_REPO || "owner/repo").split("/");
     const baseBranch = process.env.GITHUB_BRANCH || "main";
     
     // 1. Utwórz branch
     const branchName = `feat/submission-${sub.id}`;
     // ... create branch logic
     
     // 2. Dodaj pliki
     // - packages/ui/src/... lub packages/blocks/src/... (wg type)
     // - story: packages/ui/src/.../*.stories.tsx
     // - update packages/registry/registry.json
     // - CHANGELOG.md wpis
     
     // 3. Otwórz PR z checklistą wyników weryfikacji
     // ...
     
     return { prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}` };
   }
   ```

3. **Endpoint** (`apps/demo/app/api/submissions/[id]/promote/route.ts`):
   - Wywołaj `promoteSubmission`
   - Zaktualizuj status submission na "promoted"

**AC:**
- ✅ Po "promote" zwraca `prUrl`
- ✅ W logu PR jest raport z `result`
- ✅ `.env.local.example` zawiera wymagane zmienne

**Commit:** `feat(submissions): add PR-bot for promoting submissions`

---

### Faza 3: Advanced Features (P2)

#### Task 6: Conversational Editing (MVP)

**Priorytet:** P2  
**Estymacja:** XL (16-24h)  
**Zależności:** Brak (może używać istniejącego generatora)

**Cel:** Po wygenerowaniu — edytuj przez chat: copy, dodawanie, przesuwanie, warianty.

**Pliki do utworzenia:**
- `apps/demo/app/playground/dsl/patch.ts`
- `apps/demo/app/playground/runtime/bridge.ts`
- `apps/demo/app/playground/runtime/highlight.css`

**Pliki do modyfikacji:**
- `apps/demo/app/playground/dsl/generator.ts` — utrzymuj `data-ui-id`
- `apps/demo/app/playground/runtime/worker.ts` — dodaj selection handling

**Kroki:**
1. **Patch types** (`apps/demo/app/playground/dsl/patch.ts`):
   ```typescript
   export type NodeRef = { byId?: string } | { byTestId?: string } | { byPath?: string };
   
   export type Patch =
     | { op: "setCopy"; target: NodeRef; path: string; value: string }
     | { op: "addNode"; parent: NodeRef; index?: number; node: any }
     | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }
     | { op: "setProp"; target: NodeRef; prop: string; value: any }
     | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }
     | { op: "reorder"; parent: NodeRef; from: number; to: number };
   
   export function applyPatch(dsl: UiDsl, p: Patch): UiDsl {
     // Immutable implementation
   }
   ```

2. **Selection & Highlight**:
   - Preview: klik = selection = `data-ui-id`; `postMessage({type:"select", id})`
   - Highlight: `highlight.css` z `outline` na `[data-ui-id="..."]`

3. **Undo/Redo**: prosty stack in-memory w edytorze

**AC:**
- ✅ Komenda "zmień tytuł na X" → `setCopy` działa i widać w preview
- ✅ "dodaj przycisk secondary obok submit" → `addNode` + `reorder`
- ✅ "przenieś formularz nad tabelę" → `moveNode` spełnia
- ✅ Undo/redo działa dla >5 kroków

**Commit:** `feat(playground): add conversational editing with patch operations`

---

#### Task 7: Variant Generator (bez web-fetch)

**Priorytet:** P2  
**Estymacja:** XL (16-24h)  
**Zależności:** Task 3, Task 4 (dla "Promote to Submission")

**Cel:** Na podstawie dokumentów tworzymy 2–5 wariantów ekranu.

**Pliki do utworzenia:**
- `apps/demo/app/variants/page.tsx`
- `apps/demo/app/api/variants/route.ts`
- `apps/demo/app/variants/prompt.ts`
- `apps/demo/lib/docs/ingest.ts`

**Kroki:**
1. **Upload handler** — PDF/MD/TXT → chunks
2. **Prompt szablon** — generuj 3 warianty UI-DSL
3. **Serwer** — zwróć tablicę DSL; przepuść przez generator TSX; uruchom weryfikację
4. **UI** — pokaż galerię wariantów z przyciskiem "Promote to Submission"

**AC:**
- ✅ Upload → 3 warianty DSL → każdy renderuje się w preview
- ✅ Każdy wariant ma opis (z jakiego fragmentu dokumentu wynikają sekcje/CTA)
- ✅ "Promote" działa

**Commit:** `feat(variants): add variant generator from documents`

---

#### Task 8: A11y Telemetry (MVP)

**Priorytet:** P2  
**Estymacja:** M (4-6h)  
**Zależności:** Brak

**Cel:** Zbierać i przeglądać wyniki axe.

**Pliki do utworzenia:**
- `apps/demo/app/api/a11y-stats/route.ts`
- `apps/demo/app/a11y/page.tsx`
- `apps/demo/data/a11y.json` (utworzy się automatycznie)

**Kroki:**
1. **Endpoint POST** `/api/a11y-stats`:
   ```typescript
   // body: { submissionId?: string, viewId?: string, violations: number, critical: number, ts: number }
   // Zapisz do apps/demo/data/a11y.json
   ```

2. **Strona** `/a11y`: lista ostatnich renderów z liczbą naruszeń, filtry

3. **Integracja**: wywołuj endpoint z preview po każdym renderze

**AC:**
- ✅ Po kilku renderach w Playground pojawiają się statystyki na `/a11y`

**Commit:** `feat(telemetry): add a11y stats collection and dashboard`

---

#### Task 10: Grunt pod stylowanie po v1

**Priorytet:** P2  
**Estymacja:** M (4-6h)  
**Zależności:** Brak

**Cel:** Przygotować system na późniejsze ostylowanie z Figma.

**Pliki do modyfikacji:**
- `packages/tokens/*` — dodaj przełączniki
- `packages/ui/tailwind.config.ts` — sprawdź konfigurację
- Storybook meta — dodaj "design intent"

**Kroki:**
1. **Dodaj przełączniki**: `data-theme`, `data-density`, `data-motion`, `data-contrast`
2. **Storybook meta**: dodaj "design intent" (docstring w story)
3. **Generator check**: upewnij się, że generator nie używa żadnych kolorów/spacing poza tokenami/Tailwind

**AC:**
- ✅ Można przełączyć theme/density/motion/contrast na stronie demo
- ✅ Stories mają sekcję "Design intent"
- ✅ Generator nie używa hardcoded kolorów

**Commit:** `feat(styling): add theme/density/motion/contrast toggles and design intent`

---

## Zależności między zadaniami

```
Task 1 (ESLint) ──┐
                  │
Task 2 (CI CSS) ──┼──> Faza 1 (P0) - niezależne
                  │
Task 9 (Bundle) ──┘

Task 3 (Submissions API) ──┐
                           │
Task 4 (Verify) ───────────┼──> Faza 2 (P1) - sekwencyjne
                           │
Task 5 (PR-bot) ───────────┘

Task 6 (Editing) ──┐
                  │
Task 7 (Variants) ┼──> Faza 3 (P2) - częściowo zależne
                  │
Task 8 (A11y Telemetry) ──┘
                  │
Task 10 (Styling) ────────┘
```

**Kolejność wykonania:**
1. Faza 1: Task 1, 2, 9 (równolegle)
2. Faza 2: Task 3 → Task 4 → Task 5 (sekwencyjnie)
3. Faza 3: Task 6, 8, 10 (równolegle), Task 7 (po Task 3, 4)

---

## Szacunki czasowe

### Faza 1 (P0): 7-12h
- Task 1: 2-4h
- Task 2: 1-2h
- Task 9: 4-6h

### Faza 2 (P1): 22-32h
- Task 3: 6-8h
- Task 4: 8-12h
- Task 5: 8-12h

### Faza 3 (P2): 40-54h
- Task 6: 16-24h
- Task 7: 16-24h
- Task 8: 4-6h
- Task 10: 4-6h

**Łącznie:** ~69-98h (9-12 dni roboczych)

---

## Quick Start dla Copilota

### P1 — Włącz reguły DS
```
Cel: w apps/demo włącz 3 custom reguły ESLint z tooling/lint/*. 
Zedytuj eslint.config.mjs tak, by reguły były error. 
Dodaj skrypt lint:ds. 
Upewnij się, że lint przechodzi. 
Wprowadź tylko konieczne zmiany w plikach demo, by nie łamać reguł.
```

### P2 — CI guard CSS
```
Utwórz scripts/check-no-css-imports.mjs (Node ESM). 
Przeskanuj packages/**/*.ts(x) i jeśli znajdziesz import "...css", exit 1. 
Dodaj krok do .github/workflows/ci.yml. 
Pokaż diff.
```
**Uwaga:** Skrypt już istnieje, tylko dodaj do CI.

### P3 — Submissions API
```
Zaimplementuj POST /api/submissions, POST /api/submissions/[id]/verify, 
POST /api/submissions/[id]/promote oraz prosty storage w apps/demo/data/submissions.json. 
Typy w app/submissions/types.ts. 
Zwróć przykładowe cURL.
```

---

**Koniec planu**

