# A/B Testing z PostHog Experiments - Specyfikacja

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX  
**Priority:** P0 - Strategic

---

## 📋 Cel

Umożliwić prawdziwe testy A/B dla wygenerowanych ekranów (Submissions), gdzie:

- Studio tworzy warianty UI (Submissions)
- Experiment mapuje warianty (control/test/...) → submissionId
- Strona publiczna (runtime) wybiera wariant przez PostHog feature flag
- Metryki konwersji są mierzone jako eventy w PostHog
- Da się wybrać zwycięzcę i "promote" go do DS (block) w kolejnym kroku

**Done =** da się uruchomić URL eksperymentu, realni użytkownicy widzą różne warianty, a w PostHog widać wyniki eksperymentu (exposure + conversion).

---

## 🏗️ Architektura

### Warstwa 1: Studio (Authoring)

1. Użytkownik generuje warianty (A/B/C/...) → zapis jako Submissions
2. Studio tworzy "Experiment Draft" (konfiguracja eksperymentu i powiązanie z Submissionami)
3. Studio umożliwia "Promote winner → Block" po zakończeniu eksperymentu

### Warstwa 2: Hostowanie wariantów (Delivery)

**Opcja A (najprostsza - rekomendowana na start):**
- Studio ma publiczne endpointy: `/exp/{experimentSlug}`
- Te strony renderują wariant na podstawie flagi PostHog

**Opcja B (enterprise - później):**
- Osobna mini-apka `apps/renderer` (Next.js)
- Bierze "manifest wariantów" z Studio API i serwuje jako landing/preview/test page

### Warstwa 3: Eksperymenty i analityka (PostHog)

- Jeden eksperyment = jedna flaga (feature flag key), z wariantami i procentami ruchu
- Metryki = eventy (np. `cta_clicked`, `form_submitted`, `purchase`, itd.)
- Exposure automatyczny przez `getFeatureFlag()` → `$feature_flag_called`

---

## 📊 Model Danych

### Experiment

```typescript
interface Experiment {
  id: string;
  projectId: string;
  slug: string; // do URL: /exp/{slug}
  name: string;
  posthogFlagKey: string; // np. "exp_landing_black_friday_2025_11"
  variantMap: Record<string, string>; // variantKey -> submissionId
  // np. { control: "sub_1", test: "sub_2", test2: "sub_3" }
  trafficAllocation?: Record<string, number>; // np. { control: 50, test: 50 }
  primaryMetric: {
    event: string; // np. "cta_clicked"
  };
  guardrails?: Array<{
    event: string;
    name: string;
  }>; // np. [{ event: "bounce", name: "Bounce Rate" }]
  status: "draft" | "running" | "stopped" | "completed";
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  endedAt?: string;
}
```

**Zasady:**
- `control` musi zawsze istnieć
- `slug` musi być unikalny
- `posthogFlagKey` musi być unikalny

### Submission (rozszerzenie istniejącego)

Dodajemy opcjonalne pola:
```typescript
interface Submission {
  // ... istniejące pola
  experimentId?: string; // jeśli submission jest częścią eksperymentu
  variantKey?: string; // "control" | "test" | "test2" | ...
  artifactHash?: string; // hash DSL/TSX, do deduplikacji
}
```

---

## 🔄 Flow End-to-End

### 1. Generowanie wariantów
```
Użytkownik Studio: "Generate variants"
  ↓
Copilot generuje 3 warianty → zapis jako 3 Submissions
  ↓
Submissions: { id: "sub_1", variantKey: "control", ... }
            { id: "sub_2", variantKey: "test", ... }
            { id: "sub_3", variantKey: "test2", ... }
```

### 2. Tworzenie eksperymentu
```
Użytkownik Studio: "Create Experiment"
  ↓
Experiment Wizard:
  - Wybór posthogFlagKey: "exp_landing_2025_11"
  - Mapowanie: control → sub_1, test → sub_2, test2 → sub_3
  - Primary metric: "cta_clicked"
  - Slug: "landing-2025-11"
  ↓
Zapis Experiment do storage
  ↓
Public URL: /exp/landing-2025-11
```

### 3. Runtime: wybór wariantu + exposure + metryki

**Na wejściu użytkownika na `/exp/{slug}`:**

1. **Wybór wariantu (feature flag)**
   ```typescript
   variant = posthog.getFeatureFlag(experiment.posthogFlagKey)
   // np. zwraca "control" lub "test" lub "test2"
   ```

2. **Exposure (automatyczny)**
   - PostHog automatycznie wysyła `$feature_flag_called` z właściwościami (flag key i variant)
   - Metryki liczą się tylko po exposure (zdarzenia sprzed exposure są ignorowane)

3. **Render wariantu**
   ```typescript
   submission = submissionsByVariant[variant] ?? submissionsByVariant["control"]
   render(submission.tsx) // lub DSL → TSX runtime
   ```

4. **Metryka (conversion event)**
   ```typescript
   // Gdy user klika CTA:
   posthog.capture("cta_clicked", {
     experiment_key: experiment.posthogFlagKey,
     variant: variant,
     submission_id: submission.id,
     project_id: experiment.projectId,
     // ... inne kontekstowe properties
   })
   ```

### 4. Wyniki eksperymentu
```
PostHog pokazuje wyniki eksperymentu (tylko zdarzenia po exposure)
  ↓
Użytkownik Studio: "Promote winner → Block"
  ↓
Walidacje (lint/a11y/tests) + PR do packages/blocks
```

---

## 🎯 Konwencje Eventów

### Warstwa A: Globalne eventy Studio
- `studio_experiment_viewed` - raz na page view; po isReady
- `studio_variant_rendered` - gdy wariant wyrenderowany
- `studio_error_render` - błąd renderowania
- `studio_flag_variant_unavailable` - jeśli PostHog zwróci wariant spoza mapy

### Warstwa B: Eventy UX (do konwersji)
- `cta_clicked` - kliknięcie CTA
- `form_started` - rozpoczęcie formularza
- `form_submitted` - submit formularza
- `pricing_plan_selected` - wybór planu (jeśli pricing)
- `purchase_completed` - zakup (jeśli ecom)

### Warstwa C: Diagnostyka / debug
- `studio_flag_variant_unavailable` - wariant niedostępny
- `studio_submission_fetch_failed` - błąd pobierania submission
- `studio_force_variant_used` - użyto forced variant (dev mode)

### Wspólne properties (wszędzie):
```typescript
{
  experiment_key: string; // posthogFlagKey
  variant: string; // "control" | "test" | ...
  submission_id: string;
  project_id: string;
  screen_slug: string; // experiment slug
  artifact_hash?: string;
  prompt_hash?: string; // opcjonalnie - super do analizy "które prompty dowożą"
}
```

---

## 🛠️ Komponenty do Implementacji

### 1. ExperimentRunner (core runtime)

**Lokalizacja:** `apps/demo/src/components/experiments/ExperimentRunner.tsx`

**Odpowiedzialność:** Z flagKey wybiera wariant i renderuje Submission.

**Props:**
```typescript
interface ExperimentRunnerProps {
  experiment: Experiment;
  submissionsByVariant: Record<string, Submission>;
  renderMode?: "dsl" | "tsx"; // domyślnie "tsx"
  debug?: boolean;
}
```

**Algorytm:**
1. Pobierz variant przez `useExperimentVariant(experiment.posthogFlagKey, Object.keys(variantMap))`
2. Jeśli `!isReady` → pokaż skeleton / loader (bez renderu wariantu = brak flicker)
3. Wybierz submission = `submissionsByVariant[variant] ?? submissionsByVariant["control"]`
4. Wyemituj event: `studio_variant_rendered`
5. Renderuj UI:
   - Jeśli `dsl`: użyj istniejącego pipeline DSL → generator → TSX → preview
   - Jeśli `tsx`: render sandboxed (jeśli to publiczny route, prefer sandbox/iframe)

**Eventy (obowiązkowe):**
- `studio_experiment_viewed` (raz na page view; po isReady)
- `studio_variant_rendered` (gdy wariant wyrenderowany)
- `studio_flag_variant_unavailable` (jeśli PostHog zwróci wariant spoza mapy)

---

### 2. Hook: useExperimentVariant()

**Lokalizacja:** `apps/demo/src/hooks/use-experiment-variant.ts`

**Signature:**
```typescript
function useExperimentVariant(
  flagKey: string,
  variantKeys: string[],
  fallback: string = "control"
): { variant: string; isReady: boolean }
```

**Zasady:**
- Jeśli PostHog jeszcze nie gotowy → `isReady=false`
- Gdy gotowy → pobierz variant: `variant = posthog.getFeatureFlag(flagKey)`
- Jeśli zwróci `true/false/null/undefined` lub wariant spoza listy → fallback do `control`
- W tym momencie zalicza się exposure (bo `getFeatureFlag` jest exposure point)
- **WAŻNE:** Hook nie może powodować pętli ani podwójnych exposure. Wywołanie ma być 1x na mount per page view.

---

### 3. EventContextProvider

**Lokalizacja:** `apps/demo/src/components/experiments/ExperimentContextProvider.tsx`

**Odpowiedzialność:** Centralizuje propsy dla `capture()`.

- Bierze `experiment_key`, `variant`, `submission_id`, `project_id` i automatycznie je dokleja
- Dostarcza kontekst przez React Context

---

### 4. captureWithContext()

**Lokalizacja:** `apps/demo/src/lib/analytics/capture-with-context.ts`

**Signature:**
```typescript
function captureWithContext(
  eventName: string,
  props?: Record<string, any>
): void
```

**Zachowanie:**
- Bierze `eventName` + `props`
- Automatycznie dokleja: `experiment_key`, `variant`, `submission_id`, `project_id`, `screen_slug`
- Korzysta z kontekstu trzymanego w `ExperimentContextProvider`

---

### 5. Experiment Wizard (Studio UI)

**Lokalizacja:** `apps/demo/src/components/experiments/ExperimentWizard.tsx`

**Funkcjonalność:**
- Wybór `posthogFlagKey`
- Wybór `slug` + `name`
- Mapowanie wariantów do Submission (`control`/`test`/`test2` → submissionId)
- Wybór `primaryMetric` (event)
- Walidacje:
  - `control` musi być wybrany
  - `posthogFlagKey` niepusty
  - `slug` unikalny
- Wynik:
  - Zapis Experiment do storage
  - Pokaz "Public URL" do testu: `/exp/{slug}`
- Opcjonalnie: "Copy PostHog setup checklist" (tekst dla PM: utwórz flagę multivariate i experiment)

---

### 6. Publiczny route runtime

**Lokalizacja:** `apps/demo/app/exp/[slug]/page.tsx`

**Funkcjonalność:**
1. Pobiera Experiment po slug
2. Pobiera Submissions dla `variantMap`
3. Renderuje `ExperimentRunner` z experiment i submissions

---

### 7. Debug & QA Tools

**Debug overlay (tylko dla admin):**
- Na stronie eksperymentu: jeśli `?debug=1`
- Pokaż badge: variant, flagKey, submissionId
- Pokaż przycisk "copy context JSON"

**Force variant (tylko dev):**
- Obsłuż `?forceVariant=test`
- Jeśli `env NODE_ENV !== "production"`
- Pomiń PostHog i wyrenderuj forced variant
- Wyślij event `studio_force_variant_used`

---

## 🔧 Integracja PostHog

### Konfiguracja

**Lokalizacja:** `apps/demo/src/lib/posthog/client.ts`

**Wymagania:**
- Czytaj `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- Init tylko w browserze
- Inicjalizacja musi być możliwie wcześnie (żeby ograniczać flicker)

### Krok 1: Konfiguracja w PostHog

1. Tworzysz Feature Flag (multivariate) z kluczami wariantów: `control`, `test` (lub więcej)
2. Tworzysz Experiment oparty o ten flag key
3. Ustawiasz metrykę eksperymentu (event lub action)
4. Ustawiasz exposure:
   - Domyślnie PostHog użyje `$feature_flag_called` (automatycznie przy `getFeatureFlag()`)

### Krok 2: Kod po stronie Studio/Hosta

1. Inicjalizujesz PostHog w aplikacji (frontend)
2. Na stronie eksperymentu:
   - Pobierasz variant przez `getFeatureFlag(flagKey)` i tym samym generujesz exposure
   - Renderujesz odpowiedni Submission

### Krok 3: Instrumentacja KPI

- Przy kliknięciu CTA: `posthog.capture("cta_clicked", props)`
- Przy submit: `posthog.capture("form_submitted", props)`

### Krok 4: QA i stabilność eksperymentu

- Sposób podejrzenia "jaki wariant mam teraz" (`?debug=1`)
- "Force variant" (`?forceVariant=test`) + test account filtering po stronie PostHog
- PostHog ma strategie obsługi "multi-exposure" (użytkownik widzi różne warianty np. po czyszczeniu cookies): można wykluczać takich userów (rekomendowane) albo brać "first seen variant"

---

## 🎨 Generator: CTA Instrumentation

**Wymuszenie w generatorze:**

Jeśli generator tworzy Button/CTA:
- Gdy przycisk w DSL ma `action: "primaryCTA"` to generator:
  - Dodaje `onClick={() => captureWithContext("cta_clicked", { cta_id, label })}`

**Lokalizacja:** `apps/demo/app/playground/dsl/generator.ts` (lub nowy generator dla UI-DSL v2)

---

## 🧪 Testy

### Unit test hooka

**Lokalizacja:** `apps/demo/src/hooks/__tests__/use-experiment-variant.test.ts`

**Testy:**
- Fallback do control
- Wariant spoza listy → control
- Brak PostHog ready → isReady=false

### E2E (Playwright)

**Lokalizacja:** `apps/demo/e2e/experiments.spec.ts`

**Testy:**
- Startuje `/exp/{slug}?forceVariant=control` → render control
- Startuje `/exp/{slug}?forceVariant=test` → render test
- Sprawdza brak console errors

### "No CSS imports" check

- Upewnij się, że nowe pliki nie dodają importów `.css` w ESM

---

## ✅ Checklist Wdrożeniowy

1. [ ] PostHog init (client) + env vars + sanity check
2. [ ] Typ/model Experiment + storage + CRUD minimalny
3. [ ] Route `/exp/[slug]` (loader danych + delegacja do runnera)
4. [ ] Hook `useExperimentVariant` (bez flicker; exposure 1x)
5. [ ] `ExperimentRunner` (render + eventy)
6. [ ] Analytics context + `captureWithContext`
7. [ ] Generator: CTA instrumentation (minimum: CTA click)
8. [ ] Wizard w Studio (create experiment + public URL)
9. [ ] Debug overlay + forceVariant
10. [ ] Testy unit + E2E

---

## ✅ Kryteria Akceptacji (twarde)

- [ ] `GET /exp/{slug}` renderuje wariant zgodnie z flagą PostHog
- [ ] Brak flicker (nie pokazuje control zanim pozna wariant)
- [ ] Event `studio_variant_rendered` ma poprawny variant/submission_id
- [ ] Klik CTA generuje `cta_clicked` z kontekstem eksperymentu
- [ ] E2E test przechodzi na forceVariant
- [ ] Brak nowych problemów bundlingu (CSS/jsx-runtime)

---

## 🔗 Integracja z Submissions

**Tak — to jest najbardziej naturalne połączenie:**

1. Copilot generuje warianty → zapis jako Submissions
2. Experiment wybiera Submissions jako warianty
3. Runtime wybiera wariant z PostHog → renderuje Submission
4. Wynik eksperymentu → "Promote to Block":
   - Zwycięska Submission dostaje status `ready`
   - Uruchamiasz pipeline walidacji (lint/a11y/tests)
   - Potem dopiero PR do `packages/blocks` lub `packages/ui`

**To zmienia Studio w "Fragment AI Studio" bardzo sensownie: Submissions stają się "currency" przepływu.**

---

## ⚠️ Najważniejsze Ryzyka i Jak Ich Uniknąć

### Flicker (użytkownik widzi A, po chwili B)

**Rozwiązanie:** Bootstrap flags możliwie wcześnie + loader/skeleton zanim wariant znany.

### Events bez exposure (metryki "nie działają")

**Rozwiązanie:** Upewnij się, że `getFeatureFlag()` wywołujesz w miejscu, które realnie oznacza "użytkownik zobaczył zmianę" (to jest też best practice PostHog o exposure point).

### Test accounts psują wyniki

**Rozwiązanie:** Włącz test account filtering i trzymaj "internal users" poza analityką eksperymentu.

### Multi-device / cookie reset → user widzi 2 warianty

**Rozwiązanie:** W PostHog wybierz strategię "Exclude from analysis (recommended)" albo "Use first seen variant".

---

**Last Updated:** 2025-01-XX

