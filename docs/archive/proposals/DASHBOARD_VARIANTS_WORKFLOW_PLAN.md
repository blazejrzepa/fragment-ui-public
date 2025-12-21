# 🎯 Plan Optymalizacji: Dashboard → Variants → A/B Testing Workflow

**Data:** 2025-01-XX  
**Cel:** Umożliwić pełny workflow: Stworzenie profesjonalnego dashboardu → Edycja → Generowanie wariantów → A/B Testing

---

## 📊 Analiza Obecnego Stanu

### ✅ Co już działa:

1. **Dashboard Generation (Phase 2 - Complete)**
   - ✅ Dashboard scaffold: `apps/demo/src/lib/scaffolds/dashboard.ts`
   - ✅ DSL generator z intent detection: `apps/demo/src/lib/dsl-generator.ts`
   - ✅ Complex screens generation: Layout types, sections → blocks mapping
   - ✅ API: `/api/dsl/generate` - generuje DSL z promptu

2. **Conversational Editing (Phase 2 - Complete)**
   - ✅ Patch workflow: `/api/dsl/patch` - edycja przez natural language
   - ✅ Chat mode detection: `apps/demo/src/lib/chat/chat-orchestrator.ts`
   - ✅ Patch intent parser: `apps/demo/src/lib/chat/patch-intent-parser.ts`
   - ✅ Inspector integration: generuje patches z UI

3. **Variants Generation (Partial)**
   - ✅ Variants API: `/api/variants/create` - generuje warianty z DSL
   - ✅ Variant generator: `apps/demo/src/lib/variant-generator.ts`
   - ✅ Variants page: `apps/demo/app/variants/page.tsx`
   - ⚠️ **Brakuje:** Integracja z Copilot UI w Studio
   - ⚠️ **Brakuje:** Zapisywanie wariantów jako Submissions

4. **A/B Testing (Not Implemented)**
   - ❌ Experiments API - nie istnieje
   - ❌ PostHog integration - nie istnieje
   - ❌ Experiment Wizard UI - nie istnieje
   - ❌ Public experiment routes - nie istnieje

---

## 🎯 Scenariusz Użytkownika (Target Workflow)

### Krok 1: Stworzenie Dashboardu przez Copilot
**Użytkownik:** "Stwórz profesjonalny dashboard dla SaaS CRM z metrykami, tabelą klientów i wykresami"

**Wymagania:**
- ✅ Generowanie z promptu działa
- ⚠️ **Potrzebne:** Lepsze dashboard templates (więcej sekcji, bardziej profesjonalne)
- ⚠️ **Potrzebne:** Lepsze datasource integration (real data, not placeholders)

### Krok 2: Edycja Dashboardu przez Copilot
**Użytkownik:** "Dodaj sekcję z ostatnimi aktywnościami", "Zmień kolor wykresu na niebieski"

**Wymagania:**
- ✅ Patch workflow działa
- ⚠️ **Potrzebne:** Lepsze context awareness (rozumie strukturę dashboardu)
- ⚠️ **Potrzebne:** Preview updates w czasie rzeczywistym

### Krok 3: Generowanie Wariantów
**Użytkownik:** "Wygeneruj 3 warianty tego dashboardu z różnymi układami"

**Wymagania:**
- ✅ Variants API działa
- ⚠️ **Potrzebne:** UI w Studio do generowania wariantów z aktualnego dashboardu
- ⚠️ **Potrzebne:** Porównywanie wariantów side-by-side
- ⚠️ **Potrzebne:** Zapisywanie wariantów jako Submissions

### Krok 4: Wysyłanie Wariantów do Testowania
**Użytkownik:** "Wyślij te 3 warianty do A/B testowania"

**Wymagania:**
- ❌ **Brakuje:** Experiments API
- ❌ **Brakuje:** PostHog integration
- ❌ **Brakuje:** Experiment Wizard UI
- ❌ **Brakuje:** Public routes dla eksperymentów

---

## 📋 Plan Działania (Priorytetyzowany)

### PRIORYTET 1: Ulepszenie Dashboard Generation (1 tydzień) 🎯 **START HERE**

**Czas:** 24-32h  
**Priorytet:** P0 (Foundation dla całego workflow)

#### Task 1.1: Enhanced Dashboard Templates (8-12h)
**Cel:** Stworzyć bardziej profesjonalne, rozbudowane dashboard templates

**Co zrobić:**
- [ ] Rozszerzyć `apps/demo/src/lib/scaffolds/dashboard.ts` o więcej sekcji:
  - KPI cards (revenue, users, growth, churn)
  - Data tables z sortowaniem i filtrowaniem
  - Charts (line, bar, pie) z real data structure
  - Activity feed / Recent actions
  - Quick actions panel
  - Filters bar
- [ ] Dodać więcej layout options:
  - Grid layouts (2x2, 3x3, 4x4)
  - Responsive breakpoints
  - Collapsible sections
- [ ] Dodać datasource templates:
  - `fetchKPIs()` - metryki biznesowe
  - `fetchTableData()` - dane tabeli z paginacją
  - `fetchChartData()` - dane wykresów z time ranges

**Pliki:**
- `apps/demo/src/lib/scaffolds/dashboard.ts` (update)
- `apps/demo/src/lib/scaffolds/datasources.ts` (new)

**Acceptance Criteria:**
- Prompt "dashboard dla SaaS CRM" generuje profesjonalny dashboard z 6+ sekcjami
- Wszystkie sekcje mają real data structure (nie placeholders)
- Layout jest responsive i profesjonalny

---

#### Task 1.2: Improved DSL Generator dla Dashboardów (8-12h)
**Cel:** Lepsze rozumienie intencji użytkownika przy generowaniu dashboardów

**Co zrobić:**
- [ ] Rozszerzyć intent detection w `apps/demo/src/lib/dsl-generator.ts`:
  - Wykrywanie "dashboard", "analytics", "metrics", "KPI"
  - Wykrywanie typów danych: "customers", "revenue", "users", "orders"
  - Wykrywanie wymaganych sekcji z promptu
- [ ] Dodać smart section mapping:
  - "metryki" → KPI cards
  - "tabela klientów" → DataTable z customer data
  - "wykres sprzedaży" → Chart z revenue data
  - "ostatnie aktywności" → ActivityFeed
- [ ] Dodać datasource inference:
  - Automatyczne mapowanie sekcji do odpowiednich datasources
  - Generowanie placeholder API calls z właściwymi typami

**Pliki:**
- `apps/demo/src/lib/dsl-generator.ts` (update)
- `apps/demo/src/lib/dsl-generator-helpers.ts` (update)

**Acceptance Criteria:**
- Prompt z "metryki", "tabela", "wykres" generuje odpowiednie sekcje
- Datasources są automatycznie mapowane do sekcji
- Kod generowany ma właściwe typy danych

---

#### Task 1.3: Real Data Integration (8-12h)
**Cel:** Integracja z real data sources zamiast placeholderów

**Co zrobić:**
- [ ] Stworzyć `apps/demo/src/lib/datasources/`:
  - `kpi-datasource.ts` - generuje KPI data
  - `table-datasource.ts` - generuje table data z paginacją
  - `chart-datasource.ts` - generuje chart data z time ranges
  - `activity-datasource.ts` - generuje activity feed data
- [ ] Zintegrować z code generation:
  - Zastąpić placeholder API calls real datasource functions
  - Dodać proper TypeScript types
  - Dodać error handling
- [ ] Dodać mock data generators:
  - Realistic data dla różnych scenariuszy (SaaS, E-commerce, Fintech)

**Pliki:**
- `apps/demo/src/lib/datasources/kpi-datasource.ts` (new)
- `apps/demo/src/lib/datasources/table-datasource.ts` (new)
- `apps/demo/src/lib/datasources/chart-datasource.ts` (new)
- `apps/demo/src/lib/datasources/activity-datasource.ts` (new)
- `apps/demo/src/lib/dsl-codegen.ts` (update)

**Acceptance Criteria:**
- Wygenerowany dashboard używa real datasources (nie placeholders)
- Data ma właściwe typy TypeScript
- Mock data jest realistic i różnorodne

---

### PRIORYTET 2: Ulepszenie Conversational Editing (3-4 dni)

**Czas:** 16-24h  
**Priorytet:** P0 (Krytyczne dla workflow)

#### Task 2.1: Enhanced Context Awareness (8-12h)
**Cel:** Copilot lepiej rozumie strukturę dashboardu podczas edycji

**Co zrobić:**
- [ ] Rozszerzyć Chat Orchestrator:
  - Trackowanie struktury dashboardu (sections, components, hierarchy)
  - Context injection do patch parser (aktualna struktura DSL)
  - Smart path resolution ("dodaj sekcję" → znajdź najlepsze miejsce)
- [ ] Ulepszyć Patch Intent Parser:
  - Rozumienie "dodaj sekcję X po sekcji Y"
  - Rozumienie "zmień kolor wykresu w sekcji metrics"
  - Rozumienie "usuń tabelę klientów"
- [ ] Dodać validation:
  - Sprawdzanie czy patch nie psuje struktury
  - Sprawdzanie czy komponenty są kompatybilne

**Pliki:**
- `apps/demo/src/lib/chat/chat-orchestrator.ts` (update)
- `apps/demo/src/lib/chat/patch-intent-parser.ts` (update)
- `apps/demo/src/lib/dsl-patch.ts` (update)

**Acceptance Criteria:**
- "Dodaj sekcję z aktywnościami po metrykach" działa poprawnie
- "Zmień kolor wykresu" znajduje właściwy komponent
- Patches nie psują struktury dashboardu

---

#### Task 2.2: Real-time Preview Updates (8-12h)
**Cel:** Preview aktualizuje się natychmiast po patch

**Co zrobić:**
- [ ] Zoptymalizować preview updates:
  - Debouncing dla szybkich zmian
  - Incremental updates (tylko zmienione sekcje)
  - Loading states podczas patch application
- [ ] Dodać visual feedback:
  - Highlight zmienionych sekcji
  - Animation dla dodanych/usuniętych elementów
  - Error states z rollback

**Pliki:**
- `apps/demo/src/components/playground/playground-preview-area.tsx` (update)
- `apps/demo/src/lib/dsl-patch.ts` (update)

**Acceptance Criteria:**
- Preview aktualizuje się < 500ms po patch
- Visual feedback pokazuje co się zmieniło
- Errors są handled gracefully z rollback

---

### PRIORYTET 3: Variants UI w Studio (1 tydzień)

**Czas:** 24-32h  
**Priorytet:** P0 (Krytyczne dla workflow)

#### Task 3.1: Variants Generation UI w Studio (12-16h)
**Cel:** Dodać UI do generowania wariantów bezpośrednio z Studio

**Co zrobić:**
- [ ] Dodać "Generate Variants" button w Studio:
  - W right sidebar (Governance tab area)
  - Lub w top bar jako dropdown
- [ ] Stworzyć Variants Panel:
  - Input: liczba wariantów (1-10)
  - Select: emphasis type (layout, copy, datasource, all)
  - Button: "Generate Variants"
  - Loading state z progress
- [ ] Integracja z Variants API:
  - Wywołanie `/api/variants/create` z aktualnym DSL
  - Wyświetlanie wyników (scored variants)
  - Preview każdego wariantu

**Pliki:**
- `apps/demo/src/components/playground/variants-panel.tsx` (new)
- `apps/demo/src/components/playground/playground-copilot-inspector.tsx` (update)
- `apps/demo/app/studio/page.tsx` (update)

**Acceptance Criteria:**
- Button "Generate Variants" widoczny w Studio
- Panel pozwala wygenerować 1-10 wariantów
- Warianty są wyświetlane z preview i score

---

#### Task 3.2: Variants Comparison View (8-12h)
**Cel:** Porównywanie wariantów side-by-side

**Co zrobić:**
- [ ] Stworzyć Variants Comparison Component:
  - Side-by-side preview (2-4 warianty jednocześnie)
  - Sync scrolling
  - Highlight differences
  - Score comparison
- [ ] Dodać selection:
  - Checkbox do wyboru wariantów do porównania
  - "Compare Selected" button
  - "Select All" / "Deselect All"

**Pliki:**
- `apps/demo/src/components/playground/variants-comparison.tsx` (new)
- `apps/demo/src/components/playground/variants-panel.tsx` (update)

**Acceptance Criteria:**
- Można porównać 2-4 warianty jednocześnie
- Scrolling jest zsynchronizowany
- Różnice są highlighted

---

#### Task 3.3: Variants → Submissions Integration (4-8h)
**Cel:** Zapisywanie wariantów jako Submissions do review

**Co zrobić:**
- [ ] Dodać "Submit Variants" button w Variants Panel:
  - Wybór wariantów do submit
  - Input: submission name, description
  - Button: "Submit for Review"
- [ ] Integracja z Submissions API:
  - Wywołanie `/api/submissions` dla każdego wariantu
  - Linkowanie wariantów (parent submission)
  - Status tracking

**Pliki:**
- `apps/demo/src/components/playground/variants-panel.tsx` (update)
- `apps/demo/app/api/submissions/route.ts` (update)

**Acceptance Criteria:**
- Warianty mogą być submitowane jako Submissions
- Warianty są linkowane jako grupa
- Status jest trackowany w Submissions UI

---

### PRIORYTET 4: A/B Testing Infrastructure (2 tygodnie) 🎯 **CRITICAL**

**Czas:** 60-86h  
**Priorytet:** P0 (Krytyczne dla końcowego workflow)

#### Task 4.1: Experiments API - Foundation (16-24h)
**Cel:** Stworzyć Experiments API zgodnie z Phase 3 plan

**Co zrobić:**
- [ ] Stworzyć Experiment Model:
  - `apps/demo/app/experiments/types.ts` (new)
  - Fields: id, name, description, variants (submissionIds), status, config
- [ ] Stworzyć Experiments API:
  - `POST /api/experiments` - create experiment
  - `GET /api/experiments` - list experiments
  - `GET /api/experiments/[id]` - get experiment
  - `PUT /api/experiments/[id]` - update experiment
  - `DELETE /api/experiments/[id]` - delete experiment
- [ ] Integracja z studio-core:
  - Użyj `Experiment` entity z `packages/studio-core`
  - Użyj `ExperimentRepository` interface

**Pliki:**
- `apps/demo/app/experiments/types.ts` (new)
- `apps/demo/app/api/experiments/route.ts` (new)
- `apps/demo/app/api/experiments/[id]/route.ts` (new)

**Acceptance Criteria:**
- Experiments API działa (CRUD)
- Integracja z studio-core entities
- Validation i error handling

---

#### Task 4.2: PostHog Integration (16-24h)
**Cel:** Integracja z PostHog dla A/B testing

**Co zrobić:**
- [ ] Dodać PostHog client:
  - `apps/demo/src/lib/posthog/client.ts` (new)
  - Configuration z environment variables
  - Error handling i fallbacks
- [ ] Stworzyć Experiment Runner:
  - `apps/demo/src/lib/experiments/runner.ts` (new)
  - `useExperimentVariant` hook
  - Variant assignment logic (consistent hashing)
  - Event tracking
- [ ] Dodać conversion instrumentation:
  - `apps/demo/src/lib/experiments/instrumentation.ts` (new)
  - `captureWithContext` helper
  - CTA click tracking
  - Form submission tracking

**Pliki:**
- `apps/demo/src/lib/posthog/client.ts` (new)
- `apps/demo/src/lib/experiments/runner.ts` (new)
- `apps/demo/src/hooks/use-experiment-variant.ts` (new)
- `apps/demo/src/lib/experiments/instrumentation.ts` (new)

**Acceptance Criteria:**
- PostHog client działa
- Experiment runner przypisuje warianty consistently
- Conversion events są tracked

---

#### Task 4.3: Public Experiment Routes (12-16h)
**Cel:** Publiczne routes dla eksperymentów (`/exp/[slug]`)

**Co zrobić:**
- [ ] Stworzyć public route:
  - `apps/demo/app/exp/[slug]/page.tsx` (new)
  - Load experiment by slug
  - Render variant based on assignment
  - Track view event
- [ ] Dodać Experiment Runner Component:
  - `apps/demo/src/components/experiments/experiment-runner.tsx` (new)
  - Wrapper dla variant rendering
  - Automatic event tracking
  - Error boundaries

**Pliki:**
- `apps/demo/app/exp/[slug]/page.tsx` (new)
- `apps/demo/src/components/experiments/experiment-runner.tsx` (new)

**Acceptance Criteria:**
- `/exp/[slug]` route działa
- Variant jest renderowany based on assignment
- Events są tracked automatycznie

---

#### Task 4.4: Experiment Wizard UI (16-24h)
**Cel:** UI do tworzenia eksperymentów z wariantów

**Co zrobić:**
- [ ] Stworzyć Experiment Wizard:
  - `apps/demo/src/components/experiments/experiment-wizard.tsx` (new)
  - Step 1: Select variants (from Submissions)
  - Step 2: Configure experiment (name, description, traffic split)
  - Step 3: Set conversion goals (CTA clicks, form submissions, etc.)
  - Step 4: Review and create
- [ ] Integracja z Variants Panel:
  - "Create Experiment" button w Variants Panel
  - Pre-fill wizard z selected variants
- [ ] Dodać Experiments List:
  - `apps/demo/src/components/experiments/experiments-list.tsx` (new)
  - Lista aktywnych eksperymentów
  - Status, traffic split, conversion rates
  - "View Results" link

**Pliki:**
- `apps/demo/src/components/experiments/experiment-wizard.tsx` (new)
- `apps/demo/src/components/experiments/experiments-list.tsx` (new)
- `apps/demo/src/components/playground/variants-panel.tsx` (update)

**Acceptance Criteria:**
- Wizard pozwala stworzyć experiment z wariantów
- Experiments list pokazuje status i metrics
- "Create Experiment" flow działa end-to-end

---

#### Task 4.5: Results & Promote Winner (8-12h)
**Cel:** Wyświetlanie wyników i promocja zwycięzcy

**Co zrobić:**
- [ ] Stworzyć Results View:
  - `apps/demo/src/components/experiments/results-view.tsx` (new)
  - Conversion rates per variant
  - Statistical significance
  - Charts (conversion over time)
- [ ] Dodać "Promote Winner" flow:
  - Button "Promote Winner" w Results View
  - Confirmation dialog
  - Integration z Submissions promote flow
  - Archive experiment

**Pliki:**
- `apps/demo/src/components/experiments/results-view.tsx` (new)
- `apps/demo/src/components/experiments/experiments-list.tsx` (update)

**Acceptance Criteria:**
- Results są wyświetlane z metrics
- "Promote Winner" działa i promuje submission
- Experiment jest archived po promocji

---

## 📅 Rekomendowany Timeline

### Tydzień 1-2: Foundation (Priority 1 + 2)
- **Tydzień 1:** Enhanced Dashboard Templates + Improved DSL Generator
- **Tydzień 2:** Real Data Integration + Enhanced Context Awareness

### Tydzień 3: Variants UI (Priority 3)
- Variants Generation UI w Studio
- Variants Comparison View
- Variants → Submissions Integration

### Tydzień 4-5: A/B Testing (Priority 4)
- **Tydzień 4:** Experiments API + PostHog Integration
- **Tydzień 5:** Public Routes + Experiment Wizard + Results

**Total:** 5 tygodni (124-174h)

---

## 🎯 Success Criteria

### End-to-End Workflow Test:

1. ✅ **Stworzenie Dashboardu:**
   - Prompt: "Stwórz profesjonalny dashboard dla SaaS CRM"
   - Generuje dashboard z 6+ sekcjami, real data
   - Preview działa poprawnie

2. ✅ **Edycja Dashboardu:**
   - Prompt: "Dodaj sekcję z ostatnimi aktywnościami"
   - Patch aplikuje się poprawnie
   - Preview aktualizuje się w czasie rzeczywistym

3. ✅ **Generowanie Wariantów:**
   - Kliknięcie "Generate Variants" w Studio
   - Generuje 3 warianty z różnymi układami
   - Porównanie side-by-side działa

4. ✅ **A/B Testing:**
   - "Create Experiment" z wybranych wariantów
   - Public route `/exp/[slug]` działa
   - Conversion events są tracked
   - Results pokazują winner
   - "Promote Winner" promuje submission

---

## 📝 Notatki Techniczne

### Dependencies:
- PostHog account i API key (environment variable)
- Submissions API (już istnieje)
- Variants API (już istnieje, trzeba zintegrować)

### Integration Points:
- Variants Panel → Experiments Wizard
- Experiments → Submissions (promote flow)
- PostHog → Experiment Runner
- Public Routes → Experiment Runner

### Testing Strategy:
- Unit tests dla datasources
- Integration tests dla Experiments API
- E2E tests dla full workflow
- Manual testing dla PostHog integration

---

**Ready to start? Begin with Priority 1: Enhanced Dashboard Generation!** 🚀

