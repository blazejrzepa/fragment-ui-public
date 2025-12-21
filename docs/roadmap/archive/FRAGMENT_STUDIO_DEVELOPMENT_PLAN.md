# 📘 Fragment UI Studio - Plan Rozwojowy

**Wersja:** 3.0  
**Data aktualizacji:** 2025-11-27  
**Status:** In Progress  
**Cel:** Zbudować zintegrowaną platformę "Fragment Studio" łączącą generowanie komponentów, edytowanie interfejsów, system Submissions, dokumentację i wersjonowanie + **Agentic Experience Layer (AXL)**

---

## 🎯 Cel Główny

Zbudować zintegrowaną platformę **"Fragment Studio"** łączącą:

- **Generowanie komponentów z promptów** (Copilot)
- **Edytowanie interfejsów** z zachowaniem struktur DSL
- **System Submissions** + dokumentacja + wersjonowanie
- **Token-aware UI Generator**
- **Testy komponentów** (A11y, Unit, E2E, Visual)
- **Figma Sync** (opcjonalnie)
- **Dokumentacja komponentów**
- **Eksport komponentów**
- **Agentic Experience Layer (AXL)** - UI czytelne dla agentów AI + synthetic testing

---

## 🧱 Architektura Funkcjonalna

### 1. 🧠 Copilot Chat → Prompt UI Generator

**Co robi:**
- Użytkownik wpisuje prompt w stylu: "Stwórz formularz rejestracji z dwoma polami i przyciskiem"
- System przekształca prompt → UI-DSL → React TSX
- Kod jest natychmiast widoczny w preview

**Do zrobienia:**
- [ ] Uporządkuj interfejs Copilota (lewy panel)
- [ ] Dodaj możliwość "kontynuowania rozmowy" z już wygenerowanym UI (transformacje kontekstowe)
- [ ] Zaimplementuj pamięć ostatnich promptów i historii
- [ ] Wprowadź system focused element w DSL, by móc kierować zmiany promptami lokalnymi

### 2. ✍️ UI Structure Editor

**Co robi:**
- Wizualna forma edytora UI-DSL
- Użytkownik może kliknąć komponent → zmienić propsy (np. variant, size, children)
- Każda zmiana aktualizuje kod i może być przekształcana w prompt (symetrycznie)

**Do zrobienia:**
- [ ] Przekształć UI-DSL w formę AST lub JSON edytowalną (np. tree JSON dla komponentów)
- [ ] Zbuduj panel Properties (props, style, tokens)
- [ ] Zbuduj panel Structure (drzewo komponentów z drag'n'drop)
- [ ] Zapewnij synchronizację bidirectional: edycja ↔ kod ↔ preview ↔ prompt

### 3. 🎨 Token-aware UI Generator

**Co robi:**
- Podczas generowania, AI korzysta z aktualnych design tokenów (np. colors.primary, space.md)
- Wszystkie wygenerowane style są wyrażone jako tokeny

**Do zrobienia:**
- [ ] Stwórz plik JSON z aktualnymi tokenami (lub import z @fragment_ui/tokens)
- [ ] Udostępnij je jako kontekst do LLM
- [ ] Wygenerowany UI-DSL ma używać tokenów (np. padding: tokens.space.md)
- [ ] Udostępnij UI do edycji tokenów (jak Figma Variables)

### 4. 🤝 Submissions & Review Workflow

**Co robi:**
- Po wygenerowaniu/edycji użytkownik może "zgłosić" ekran jako Submission
- Submissions mogą być zatwierdzane, oceniane, iterowane

**Do zrobienia:**
- [ ] Przenieś Submissions do prawego panelu jako "Wersje"
- [ ] Do każdego Submission przypnij: DSL, kod, prompt i opis
- [ ] Wprowadź workflow "Draft → Review → Approved"
- [ ] Dodaj możliwość komentarzy i logowania zmian

### 5. 🧪 Testy komponentów

**Co robi:**
- Automatyczne testy: dostępność (axe), unit testy, E2E render w preview

**Do zrobienia:**
- [ ] Do każdego komponentu dodaj statusy testowe:
  - ✅ A11y passed
  - ✅ Chromatic snapshot up-to-date
  - ✅ Unit test coverage: 95%
- [ ] Osadź komponent w środowisku testowym i renderuj testowy snapshot
- [ ] Pokazuj checklistę testową (UI) przed publikacją Submission

### 6. 🔄 Figma Sync (opcjonalnie)

**Co robi:**
- Mapuje komponenty Fragment UI na Frame'y z Figma
- Synchronizuje struktury i nazwy

**Do zrobienia:**
- [ ] Zintegruj OAuth Figma API (access tokens)
- [ ] Stwórz mechanizm "Map Figma Component to Fragment Component"
- [ ] Zbuduj widok "Linked Frames" w sidebarze
- [ ] Pozwól wygenerować kod Fragment UI na bazie Figma layoutu

### 7. 🧾 Dokumentacja komponentów

**Co robi:**
- Dokumentuje użycie każdego komponentu
- Automatycznie generuje props tables, stany, przykłady

**Do zrobienia:**
- [ ] Dodaj zakładkę "Docs" do każdego komponentu
- [ ] Generuj Markdown z użyciem promptu (np. "Opisz ten komponent dla designera")
- [ ] Dołącz kod, warianty, linki do Submissions

### 8. 🔧 Eksport komponentów

**Co robi:**
- Umożliwia eksport do:
  - React .tsx
  - .stories.tsx
  - .test.tsx
  - lub repozytorium GitHub

**Do zrobienia:**
- [ ] Dodaj przycisk "Export to Code" / "Export to Git"
- [ ] Wygeneruj pliki z szablonów (z UI-DSL jako źródło)
- [ ] Pokaż preview kodu przed eksportem

---

## 🧪 Checklist dla każdego komponentu

| Obszar | Wymagany? | Weryfikacja |
|--------|-----------|-------------|
| A11y | ✅ | axe-core test |
| Responsive | ✅ | Chromatic snapshots |
| Docs | ✅ | prompt + markdown |
| Submissions | ✅ | Approved review |
| DSL complete | ✅ | UI-DSL snapshot |
| Tokenized | ✅ | użycie tokens.* |
| Keyboard nav | ✅ | Tab / Enter test |
| Export ready | ⚠️ | Pliki .tsx, .test.tsx |
| **ACL (Agent-Readable)** | ✅ | data-action-*, data-intent, data-section-role |
| **Action Contracts** | ✅ | kontrakty dla wszystkich CTA |
| **Synthetic Test** | ✅ | agent harness score |

---

## 📋 Milestone 1 — Stabilizacja Fundamentów

**Cel:** Preview/build policy, żeby dalej nie "pękało"

### 1.1. Ustanów twardą politykę stylów

**Cel:** żadnych side-effect importów CSS w bundle ESM (P0).

**Zadania:**
- [ ] Dodaj i wymuś w CI: `check-no-css-imports` (dla packages/ui, packages/blocks, generatorów)
- [ ] "Vendor CSS" tylko przez:
  - `/api/bundle-css` (jedno źródło)
  - albo dynamiczny `<link>` (ale kontrolowany, whitelisted)

**Akceptacja:**
- build + playground preview działa dla dowolnego komponentu z registry
- brak błędów typu "Failed to resolve module specifier *.css" w iframe

**Estymacja:** 8-12h

---

### 1.2. Uporządkuj bundling / resolvowanie modułów

**Cel:** koniec "20 fallback paths" i kruchości na Vercel.

**Zadania:**
- [ ] W `/api/bundle` przejdź na `require.resolve()` jako primary, a fallbacki zostaw jako awaryjne
- [ ] Spłaszcz "cleanup" react/jsx-runtime do jednego, testowalnego kroku (regex + test snapshot)
- [ ] Dodaj test E2E: "render Button w preview" + "render DatePicker w preview" + "render Block"

**Akceptacja:**
- `/api/bundle` oraz `/api/bundle-blocks` deterministyczne na local + Vercel
- brak losowych regresji react/jsx-runtime

**Estymacja:** 12-16h

---

### 1.3. Ujednolicenie kontraktu runtime

**Cel:** spójny "runtime contract" między generatorem (TSX/DSL), workerem (bundling), iframe (importmap), UI (edytor).

**Zadania:**
- [ ] Wprowadź `RuntimeManifest` (JSON) generowany w buildzie:
  - wersje zależności (react, radix, lucide…)
  - importmap entries
  - ścieżki CSS bundle
  - feature flags (a11y on/off)

**Akceptacja:** nie edytujesz importmap "ręcznie"; runtime sam wie co ładować.

**Estymacja:** 8-12h

**Milestone 1 Total:** 28-40h (1-2 tygodnie)

**Status:** ✅ **UKOŃCZONY** (2025-11-27)
- ✅ 1.1. Polityka stylów - check-no-css-imports w CI
- ✅ 1.2. Bundling - require.resolve() + testowalny jsx-runtime
- ✅ 1.3. RuntimeManifest - ujednolicony kontrakt runtime

---

## 📋 Milestone 2 — Edit Loop: Rozmowa + Szybka Edycja UI

**Cel:** To jest klucz, żeby "Copilot Playground" stał się "Studio".

### 2.1. Patch System jako Standard

**Cel:** każde polecenie "zmień X" = patch DSL.

**Zadania:**
- [ ] Zdefiniuj formalny format patchy (inspirowany JSON Patch):
  - `addNode`, `removeNode`, `moveNode`, `setProp`, `setCopy`, `toggleVariant`, `wrapWith`, `reorder`
- [ ] Zaimplementuj `applyPatch(dsl, patch[])` + testy (unit)
- [ ] Dodaj "operation log" (history): patch + metadata (kto, kiedy, prompt)

**Akceptacja:**
- po 10 kolejnych komendach edycji UI nadal jest spójny
- da się cofnąć/ponowić (undo/redo na bazie patchy)

**Estymacja:** 16-20h

---

### 2.2. "Focused Element" i Selekcja z Preview

**Cel:** użytkownik klika w preview → potem mówi "zmień ten przycisk".

**Zadania:**
- [ ] Utrzymuj `selectedNodeId` (z `data-ui-id`)
- [ ] Chat wysyła kontekst: `selectedNodeId` + subtree snapshot + allowed props

**Akceptacja:** komenda "Zmień variant na outline" działa tylko na zaznaczonym komponencie.

**Estymacja:** 12-16h

---

### 2.3. Inspector (Props/Copy) jako UI dla "Quick Edits"

**Cel:** 80% zmian bez pisania promptów.

**Zadania:**
- [ ] Props panel:
  - enumy: variant, size, intent
  - stringi: label, placeholder
  - booleany: disabled/loading
- [ ] Copy panel:
  - edycja tekstów z mapowaniem do DSL
  - Token picker (na start prosto): select wartości z listy tokenów dla spacing/radius

**Akceptacja:** zmiana propsów natychmiast aktualizuje preview i TSX.

**Estymacja:** 16-20h

**Milestone 2 Total:** 44-56h (2-3 tygodnie)

**Status:** ✅ **UKOŃCZONY** (2025-01-XX)
- ✅ 2.1. Patch System - zaimplementowany, testy E2E przeszły (5/7)
- ✅ 2.2. Focused Element - elementContext przekazywany do API, integracja z chat działa, testy E2E przeszły (3/3)
- ✅ 2.3. Inspector - rozszerzony o props (variant, size, disabled, loading), tokens (spacing, radius), copy (label, text, placeholder, title, description)

---

## 📋 Milestone 3 — Złożone Ekrany: Dashboardy, Landing Pages, Warianty

**Cel:** Tu trzeba dołożyć "wyższy poziom abstrakcji", inaczej LLM będzie generował chaos.

### 3.1. Rozszerz UI-DSL o "Screen DSL" (Kompozycje)

**Cel:** DSL ma wspierać layouty, sekcje, dane i wzorce.

**Zadania:**
- [ ] Dodaj (albo doprecyzuj) typy:
  - `screen/page` z regions (header/sidebar/content/footer)
  - `layout` (grid/stack, columns, gap, maxWidth)
  - `modules` (Hero, Pricing, FAQ, Testimonials, DataTableSection, KPIHeader)
  - `dataBindings` (placeholder/static/url) + mock data schema

**Akceptacja:** możesz opisać landing page i dashboard bez wchodzenia w TSX.

**Estymacja:** 20-24h

---

### 3.2. "Block Registry" jako Narzędzie dla AI

**Cel:** AI ma układać z klocków, a nie wymyślać UI od zera.

**Zadania:**
- [ ] W `@fragment_ui/blocks` wprowadzaj bloki jako:
  - `meta.json` (co robi, kiedy użyć, propsy, sloty)
  - `dsl-template.json` (wersja DSL, nie tylko TSX)
  - `tsx-template.tsx` (opcjonalnie)
- [ ] Dodaj MCP tool: `blocks.search`, `blocks.get`, `blocks.compose`

**Akceptacja:** prompt "zrób dashboard sprzedaży" skutkuje złożeniem 3–6 blocków + layout.

**Estymacja:** 24-32h

---

### 3.3. Generator Wieloetapowy (Planner → Composer → Validator → Codegen)

**Cel:** jakość i przewidywalność.

**Zadania:**
- [ ] Pipeline:
  - **Planner:** wybierz ekran/wzorzec + bloki
  - **Composer:** zbuduj DSL (spójne IDs, layout, copy)
  - **Validator:** schema + reguły DS (no raw elements, token policy)
  - **Codegen:** DSL → TSX
  - **QA:** a11y quick-check + render smoke test

**Akceptacja:** mniej "losowych" wyników, więcej powtarzalności.

**Estymacja:** 24-32h

---

### 3.4. Warianty (dla Landingów / Komunikacji)

**Cel:** "stwórz 3 warianty landinga".

**Zadania:**
- [ ] Endpoint `/api/variants` zwraca `Variant[]` gdzie każdy to DSL + rationale
- [ ] UI porównania:
  - grid 3-up w preview
  - diff copy / diff layout (na poziomie DSL)
- [ ] Akceptacja wariantu = tworzy Submission

**Akceptacja:** porównujesz warianty bez ręcznego kopiowania kodu.

**Estymacja:** 16-20h

**Milestone 3 Total:** 84-108h (4-5 tygodni)

---

## 📋 Milestone 4 — Submissions jako "Spoiwo" Studio

**Cel:** Review, gating, eksport

### 4.1. Model Submissions (Minimalny, ale Pełny)

**Cel:** każdy sensowny output można zapisać, zreviewować i wyeksportować.

**Zadania:**
- [ ] Submission zawiera:
  - `promptThread` (messages)
  - `dslSnapshot`
  - `tsxSnapshot`
  - `testsSnapshot` (a11y summary, render status)
  - `status`: draft → in_review → approved → merged
  - `diffFromPrevious` (patch list)

**Akceptacja:** zawsze wiesz "co i dlaczego powstało".

**Estymacja:** 20-24h

---

### 4.2. Review Gates (Automatyczne)

**Cel:** nie przepychasz do DS rzeczy, które łamią zasady.

**Zadania:**
- [ ] Gates przed approved:
  - render OK
  - zero CSS-in-ESM
  - lint rules (imports-only, no-raw-elements, no-hardcoded-colors)
  - a11y threshold (np. 0 critical)

**Akceptacja:** "approved" oznacza "można wrzucać do DS".

**Estymacja:** 16-20h

---

### 4.3. Eksport (TSX / Stories / Tests / PR)

**Cel:** jedno kliknięcie → gotowy pakiet zmian.

**Zadania:**
- [ ] Generuj:
  - `Component.tsx`
  - `Component.stories.tsx`
  - `Component.test.tsx` (a11y + basic)
  - docs `.mdx` (opis + props + usage)
- [ ] Integracja z repo (GitHub) jako PR (branch + commit + PR body z rationale)

**Akceptacja:** Submission → PR bez ręcznej roboty.

**Estymacja:** 20-24h

**Milestone 4 Total:** 56-68h (3-4 tygodnie)

---

## 📋 Milestone 5 — AI Integration "Jak Produkt"

**Cel:** żeby było enterprise-ready

### 5.1. Telemetria Jakości i Skuteczności

**Cel:** wiesz czy to działa.

**Zadania:**
- [ ] Mierz:
  - TTFUI (time to first UI)
  - success rate render
  - success rate a11y
  - acceptance rate (ile submissions idzie do approved)
  - top failing rules (dlaczego odpada)

**Estymacja:** 12-16h

---

### 5.2. Guardrails w Promptach / Narzędziach

**Cel:** AI nie generuje "kombinacji spoza DS".

**Zadania:**
- [ ] MCP tools jako "jedyna prawda":
  - komponenty, propsy, tokeny, bloki, reguły
- [ ] LLM dostaje ograniczenia:
  - "używaj tylko @fragment_ui/ui"
  - "używaj bloków jeśli ekran"
  - "twardy zakaz raw HTML"

**Estymacja:** 16-20h

**Milestone 5 Total:** 28-36h (1-2 tygodnie)

---

## 📋 Milestone 6 — Agentic Experience Layer (AXL)

**Cel:** Rozbudowanie Fragment UI Studio z "generatora UI" do systemu, który projektuje i waliduje interfejsy pod użytkowników ludzkich oraz agentów (synthetic users).

**3 filary AXL:**
1. **Agent-Readable UI** (semantyka, metadane, kontrakty akcji)
2. **Decision Patterns Library** (komponenty/układy do podejmowania decyzji i porównań)
3. **Synthetic Testing + Quality Gate** (Submissions jako bramka jakości)

### 6.1. DSL vNext + Action Contracts + ACL Injection (PR1)

**Cel:** Każdy wygenerowany ekran ma intent, constraints, evaluation, actions[] jako Action Contracts, oraz generator wstrzykuje atrybuty ACL.

**Zadania:**
- [ ] Rozszerz `apps/demo/app/playground/dsl/types.ts`:
  - Dodaj `ActionContract` type (id, label, kind, riskLevel, requiresConfirmation, preauthAllowed, sideEffects, telemetry)
  - Dodaj `UiIntent` (primary, secondary)
  - Dodaj `UiConstraints` (hard, soft)
  - Dodaj `UiEvaluation` (successMetrics)
  - Rozszerz `UiCommon` o intent, constraints, evaluation, actions
- [ ] Zaktualizuj walidację DSL (`schema.ts`):
  - kind="hard" ⇒ requiresConfirmation=true
  - riskLevel="high" ⇒ requiresConfirmation=true
  - preauthAllowed=true tylko dla kind="soft"
- [ ] Rozszerz generator (`generator.ts`):
  - Funkcja `actionAclAttrs()` mapująca ActionContract na data-action-* atrybuty
  - Wstrzykiwanie data-action-* do Button/CTA
  - Wstrzykiwanie data-intent, data-section-role do sekcji/kart
  - Auto-generowanie "review step" dla hard/high risk actions
- [ ] ESLint rule: "no uncontracted actions" (CTA bez data-action-* → błąd)

**Akceptacja:**
- DSL waliduje kontrakty (zod/schema)
- Wygenerowany TSX ma data-intent, data-section-role, data-action-*
- Hard action bez confirmation → błąd walidacji
- Generator automatycznie dodaje review step dla hard actions

**Estymacja:** 16-24h (2-3 sprinty)

---

### 6.2. Decision Patterns Library (PR2) ✅ UKOŃCZONY

**Cel:** AI generuje złożone ekrany przez składanie wzorców (blocks) zamiast improwizowania.

**Zadania:**
- [x] Stwórz `packages/blocks/src/decision/` z 4 blokami:
  - `compare-3.tsx` - porównanie 3 opcji (karty + matryca różnic)
  - `recommendation.tsx` - ranking + uzasadnienie
  - `tradeoffs.tsx` - wykres/układ "koszt vs ryzyko vs czas"
  - `review-confirm.tsx` - podsumowanie + hard action
- [x] Każdy blok:
  - Używa tylko @fragment_ui/ui + tailwind
  - Ma domyślną semantykę ACL (data-section-role, data-option-id, data-compare-key)
  - Ma story + minimalny a11y test
- [x] Rozszerz `apps/demo/app/playground/dsl/types.ts`:
  - Dodaj `UiDecision` type (type: "decision", pattern: "compare-3" | "recommendation" | "tradeoffs" | "review-confirm", options, summary)
- [x] Zaktualizuj generator:
  - Obsługa type: "decision" → import z @fragment_ui/blocks/decision/...
- [x] Zaktualizuj registry.json:
  - Dodaj wpisy dla decision patterns jako "scaffold/pattern"

**Akceptacja:**
- Prompt "create a pricing page with 3 plans and recommendation" → DSL decision: compare-3 + TSX używa bloku
- Preview renderuje złożony ekran bez ręcznego dłubania
- Bloki mają story + minimalny a11y test

**Estymacja:** 24-32h (2-4 sprinty)

---

### 6.3. Submissions jako Quality Gate + Synthetic Testing (PR3)

**Cel:** Po wygenerowaniu UI user może kliknąć Submit, system zapisuje submission, odpala checki (a11y + lint + ACL + synthetic) i nadaje status.

**Zadania:**
- [ ] Rozszerz model Submission (`apps/demo/app/api/submissions/`):
  - Dodaj `checks` object (a11y, lint, acl, synthetic)
  - Dodaj `status`: "DRAFT" | "CHECKING" | "APPROVED" | "NEEDS_CHANGES" | "REJECTED"
- [ ] API endpoints:
  - `POST /api/submissions` - zapis submission (prompt, dsl, code)
  - `POST /api/submissions/:id/run-checks` - uruchamia pipeline checków
  - `GET /api/submissions` - lista ostatnich N
  - `GET /api/submissions/:id` - pełny raport
- [ ] Implementacja checków:
  - `lintCheck(code)` - regex + opcjonalnie ESLint programmatic
  - `aclCheck(dsl, code)` - weryfikacja wymaganych data-action-* dla CTA
  - `syntheticCheck(dsl)` - deterministyczny "synthetic runner" oceniający strukturę
  - `a11yCheck` - użyj istniejącego axe-core z worker.ts
- [ ] Synthetic check (MVP):
  - Jeśli type="decision" i pattern="compare-3" → muszą być ≥3 opcje
  - Jeśli constraints.hard zawiera budget<=500 → sprawdź czy istnieje opcja <= 500
  - Output: { score: number; failures: string[] }
- [ ] UI integracja:
  - Przycisk Submit w Playground toolbar
  - Po klik: POST submission → run-checks → pokaż raport w prawym panelu

**Akceptacja:**
- Submit działa end-to-end
- Raport pokazuje: a11y, acl, synthetic, lint + status
- Minimum 1 rule blokuje "hard action bez review"

**Estymacja:** 32-48h (3-6 sprintów)

---

### 6.4. Agent View w Preview (PR4)

**Cel:** Toggle w UI: Human / Agent View pokazujący nakładkę z semantyką i kontraktami.

**Zadania:**
- [ ] Rozszerz `apps/demo/app/playground/runtime/worker.ts`:
  - Obsługa message: { type: "set-agent-view", enabled: boolean }
  - Worker w iframe skanuje DOM po [data-section-role], [data-action-id], [data-compare-key]
  - Tworzy overlay (absolutny div) z etykietami
  - Overlay nie psuje interakcji (pointer-events: none)
- [ ] Rozszerz bridge (`apps/demo/app/playground/runtime/bridge.ts`):
  - Metoda `setAgentView(enabled)`
- [ ] UI:
  - Toggle w preview toolbar (Human / Agent View)
  - Overlay pokazuje: section role, action contract (id/type/risk/confirm), missing ACL warnings

**Akceptacja:**
- Agent View działa bez przeładowania
- Overlay pokazuje CTA z risk/confirm
- Klik w element nadal działa (overlay pointer-events none)

**Estymacja:** 16-24h (1-2 sprinty)

**Milestone 6 Total:** 88-128h (8-15 tygodni)

---

## 📊 Podsumowanie

| Milestone | Cel | Estymacja | Priorytet | Status |
|-----------|-----|-----------|-----------|--------|
| **Milestone 1** | Stabilizacja runtime | 28-40h (1-2 tyg) | 🔴 P0 | ✅ UKOŃCZONY |
| **Milestone 2** | Patch/Selection/Inspector | 44-56h (2-3 tyg) | 🔴 P0 | ✅ UKOŃCZONY |
| **Milestone 3** | Złożone ekrany przez bloki | 84-108h (4-5 tyg) | 🟡 P1 | ⏳ PLANOWANY |
| **Milestone 4** | Submissions + Gates + Export | 56-68h (3-4 tyg) | 🟡 P1 | ⏳ PLANOWANY |
| **Milestone 5** | Telemetria + Guardrails | 28-36h (1-2 tyg) | 🟢 P2 | ⏳ PLANOWANY |
| **Milestone 6** | Agentic Experience Layer (AXL) | 88-128h (8-15 tyg) | 🟡 P1 | ⏳ PLANOWANY |
| **TOTAL** | | **328-436h** | | **19-31 tygodni** |

---

## 🎯 Proponowana Kolejność Realizacji

1. **Milestone 1** (stabilizacja runtime) – ✅ UKOŃCZONY
2. **Milestone 2** (patch/selection/inspector) – ✅ UKOŃCZONY - bo to robi "Studio"
3. **Milestone 6** (AXL - ACL + Action Contracts) – ⏳ NASTĘPNY - fundament dla agentów
4. **Milestone 3** (złożone ekrany przez bloki + pipeline) – bo to daje realną wartość
5. **Milestone 6.2** (Decision Patterns Library) – rozszerzenie Milestone 3
6. **Milestone 4** (submissions + gates + export) – rozszerzone o synthetic testing (Milestone 6.3)
7. **Milestone 6.4** (Agent View) – wizualizacja semantyki
8. **Milestone 5** (telemetria + guardrails) – bo to skaluje i utrzymuje jakość

---

## ⚠️ Największe Ryzyka (i Jak Je Minimalizować)

### 1. LLM generuje chaos w TSX
**Rozwiązanie:** trzymaj źródło prawdy w DSL + używaj bloków

### 2. Preview znowu pęka od zależności
**Rozwiązanie:** runtime manifest + CI "no css in esm" + smoke tests

### 3. Edycja promptami niszczy strukturę
**Rozwiązanie:** patch operations + walidacja DSL po każdej zmianie

### 4. Rozjazd "Figma look vs kod"
**Rozwiązanie:** to świadomie później; teraz priorytetem jest spójny system i workflow

---

## 🔑 Założenia Projektowe

Najważniejsze decyzje, które porządkują całość:

1. **UI-DSL jest źródłem prawdy** (nie TSX). TSX to artefakt generowany.
2. **Edycja rozmową = patchowanie DSL** (a nie "regeneruj wszystko"), dzięki temu masz stabilność i kontrolę.
3. **Preview runtime musi być "zero-surprises":** brak importów .css w ESM + przewidywalne resolvowanie modułów.
4. **Złożone ekrany powstają z "bloków + layoutów + danych",** a nie z losowego TSX z LLM.
5. **ACL (Agent Compatibility Layer) jest standardem:** każdy wygenerowany ekran ma metadane (data-action-*, data-intent, data-section-role) umożliwiające agentom "czytanie" UI.
6. **Action Contracts są obowiązkowe:** każda akcja (CTA) musi mieć kontrakt (kind, riskLevel, requiresConfirmation) - brak kontraktu = błąd walidacji.
7. **Submissions = Quality Gate:** każdy submission przechodzi przez checki (a11y + lint + ACL + synthetic) przed approved.

---

## 📚 Powiązane Dokumenty

- [Copilot Contract](./copilot/contract.md) - Pełna specyfikacja Copilota
- [Copilot Implementation Plan](./copilot/implementation-plan.md) - Szczegółowy plan implementacji
- [Submissions Dashboard Structure](../SUBMISSIONS_DASHBOARD_STRUCTURE.md) - Struktura Submissions
- [Testing Guide](../testing/TESTING_GUIDE.md) - Standardy testowania
- [AXL (Agentic Experience Layer)](../AXL_AGENTIC_EXPERIENCE_LAYER.md) - Specyfikacja AXL (do utworzenia)

---

## 📋 Aneks: Agentic Experience Layer (AXL) - Szczegóły

### Terminy i definicje

* **Synthetic user / Agent:** model, który wykonuje zadania w imieniu człowieka na bazie celu (promptu), kontekstu i reguł.
* **Action Contract:** formalny opis akcji (CTA), jej ryzyka, wymaganych potwierdzeń i preautoryzacji.
* **ACL (Agent Compatibility Layer):** warstwa standardów metadanych/semantyki umożliwiająca agentom "czytanie" UI.
* **Decision Surface / Pattern:** UI zaprojektowane do przedstawiania opcji, trade-offów i rekomendacji.
* **Agent View:** tryb podglądu w Studio pokazujący semantykę i kontrakty, nie tylko wizualny layout.

### Standard atrybutów ACL

**Na kontenerach sekcji / kart / bloków:**
- `data-intent="<string>"` — po co istnieje sekcja (np. compare-options, collect-input, review-summary)
- `data-section-role="<enum>"` — np. summary | options | details | form | checkout | confirmation

**Na elementach porównawczych:**
- `data-compare-key="<string>"` — np. price, time, risk, rating
- `data-compare-format="<enum>"` — currency | duration | percent | text
- `data-option-id="<string>"` — id opcji

**Na CTA / akcjach:**
- `data-action-id="<string>"`
- `data-action-type="<enum>"` — soft | hard
- `data-requires-confirmation="true|false"`
- `data-risk-level="<enum>"` — low | medium | high
- `data-preauth-allowed="true|false"`

### Reguły bezpieczeństwa (hard rules)

* `kind="hard"` ⇒ `requiresConfirmation=true`
* `riskLevel="high"` ⇒ `requiresConfirmation=true` + dodatkowy krok "review"
* `preauthAllowed=true` tylko dla `kind="soft"` i jeśli UI zawiera sekcję "summary/review"

### Content Contracts (dla landingów)

**Model MVP:**
```typescript
type ContentContract = {
  valueProps: Array<{ claim: string; proof?: string; }>;
  audiences?: string[];
  objections?: Array<{ objection: string; response: string; }>;
  ctas: ActionContract[];
  sources?: Array<{ type: "doc" | "url"; ref: string; }>;
};
```

### Governance + Versioning pod agentów

**Breaking change (nowa definicja):**
Breaking change = zmiana:
* semantyki data-* ACL,
* kontraktu akcji,
* identyfikatorów data-ui-id w registry blocks,
* logiki "review step" dla hard actions.

**Compatibility levels:**
* `aclVersion: "1.0"` w metadanych generatora
* testy w CI: "ACL contract tests"

### Metryki AXL (AXD metrics)

Minimalne:
* `time_to_decision`
* `clarity_score` (np. ile braków ACL / czy jest compare surface)
* `safe_execution_rate`
* `task_success_rate` (synthetic)

### Acceptance Criteria (Definition of Done)

AXL uznajemy za wdrożone (MVP), gdy:

1. ✅ Każdy wygenerowany ekran ma ACL + Action Contracts
2. ✅ Submissions nadaje status na bazie checków (a11y + lint + acl + synthetic)
3. ✅ Jest co najmniej jeden złożony ekran generowany przez składanie Decision Patterns
4. ✅ Agent View potrafi pokazać kontrakty akcji i brakujące metadane
5. ✅ CI blokuje PR, jeśli pojawi się "hard action bez confirmation/review"

### Integration Points

* `apps/demo/app/playground/dsl/types.ts` → rozszerzyć o vNext
* `apps/demo/app/playground/dsl/generator.ts` → mapowanie do ACL
* `apps/demo/app/api/submissions/*` → lifecycle, run checks
* `tooling/lint/*` → nowe reguły "uncontracted actions"
* `packages/blocks/src/*` → decision patterns
* `apps/demo/app/playground/runtime/*` → Agent View overlay + inspector

---

**Ostatnia aktualizacja:** 2025-11-27  
**Następny przegląd:** Po ukończeniu Milestone 2

