# 🧪 Przewodnik Testowania Phase 3

**Jak samodzielnie przetestować Submissions + Governance**

---

## 📋 Spis Treści

1. [Przygotowanie](#przygotowanie)
2. [Testy Automatyczne](#testy-automatyczne)
3. [Testy API (curl/Postman)](#testy-api)
4. [Testy w Przeglądarce](#testy-w-przeglądarce)
5. [Testy E2E (Playwright)](#testy-e2e)

---

## 🚀 Przygotowanie

### 1. Upewnij się, że serwery działają

```bash
# Sprawdź czy serwery działają
lsof -ti:3002  # Demo app (Studio)
lsof -ti:3000  # WWW app (opcjonalnie)

# Jeśli nie działają, uruchom:
cd /Users/blazejrzepa/Dev/fragment-ui
pnpm dev
```

### 2. Otwórz terminal w katalogu projektu

```bash
cd /Users/blazejrzepa/Dev/fragment-ui/apps/demo
```

---

## 🧪 Testy Automatyczne

### Testy Unit (Vitest)

```bash
# Wszystkie testy
pnpm test

# Konkretny plik testowy
pnpm test app/submissions/__tests__/verify.test.ts
pnpm test src/lib/governance/__tests__/rule-engine.test.ts

# Testy w trybie watch (automatyczne przy zmianach)
pnpm test:watch

# Testy z pokazaniem pokrycia
pnpm test --coverage
```

### Testy E2E (Playwright)

```bash
# Wszystkie testy E2E
pnpm test:e2e

# Testy z UI (interaktywny)
pnpm test:e2e:ui

# Konkretny test
pnpm test:e2e e2e/submissions.spec.ts
```

---

## 🔌 Testy API

### Szybki Test (Gotowy Skrypt)

```bash
# Uruchom gotowy skrypt testowy
cd /Users/blazejrzepa/Dev/fragment-ui/apps/demo
./test-phase3.sh
```

### Testy Manualne (curl)

#### 1. Utwórz Submission

```bash
curl -X POST http://localhost:3002/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "component",
    "dsl": {
      "type": "page",
      "id": "test-page",
      "sections": []
    },
    "tsx": "export default function TestComponent() { return <div>Test</div>; }",
    "author": "test-user"
  }' | jq
```

**Oczekiwany wynik:**
```json
{
  "id": "uuid-here",
  "type": "component",
  "status": "DRAFT",
  "author": "test-user",
  ...
}
```

**Zapisz ID submission:**
```bash
SUBMISSION_ID="uuid-z-powyższego-wyniku"
```

#### 2. Uruchom Quality Checks

```bash
curl -X POST "http://localhost:3002/api/submissions/$SUBMISSION_ID/run-checks" \
  -H "Content-Type: application/json" | jq
```

**Oczekiwany wynik:**
```json
{
  "id": "uuid",
  "status": "approved" | "rejected",
  "checks": {
    "a11y": { "violations": 0, "passed": true },
    "lint": { "errors": 0, "warnings": 0, "passed": true },
    "bundle": { "violations": 0, "passed": true },
    "tests": { "violations": 0, "passed": true }
  }
}
```

#### 3. Pobierz Submission

```bash
curl "http://localhost:3002/api/submissions/$SUBMISSION_ID" | jq
```

#### 4. Lista Submissions

```bash
curl "http://localhost:3002/api/submissions" | jq 'length'
```

#### 5. Approve Submission

```bash
curl -X POST "http://localhost:3002/api/submissions/$SUBMISSION_ID/approve" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Looks good!"}' | jq
```

#### 6. Request Changes

```bash
curl -X POST "http://localhost:3002/api/submissions/$SUBMISSION_ID/request-changes" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Please fix the lint errors"}' | jq
```

---

## 🌐 Testy w Przeglądarce

### Test 1: Studio - Generowanie i Governance Warnings

1. **Otwórz Studio:**
   ```
   http://localhost:3002/studio
   ```

2. **Wygeneruj komponent z problemami:**
   - W Copilot wpisz: `"create a button with red background and hardcoded color"`
   - Poczekaj na wygenerowanie

3. **Sprawdź Governance Tab:**
   - Kliknij zakładkę "Governance" w prawym panelu
   - Powinny pojawić się ostrzeżenia:
     - ⚠️ Hardcoded colors (Token violations)
     - ⚠️ Raw HTML (jeśli użyto `<div>` zamiast komponentów)

4. **Sprawdź, że warnings nie blokują:**
   - Komponent powinien się wyrenderować mimo warnings
   - Warnings są tylko informacyjne (soft warnings)

### Test 2: Submissions - Tworzenie i Review

1. **Wygeneruj komponent w Studio:**
   - W Copilot: `"create a simple button component"`
   - Poczekaj na wygenerowanie

2. **Utwórz Submission (jeśli masz przycisk Submit):**
   - Kliknij "Submit" w top bar (jeśli dostępny)
   - Lub użyj API (patrz sekcja "Testy API")

3. **Otwórz Submissions Page:**
   ```
   http://localhost:3002/submissions
   ```

4. **Sprawdź listę submissions:**
   - Powinna pokazać wszystkie submissions
   - Filtry: status, type, sort

5. **Otwórz szczegóły submission:**
   - Kliknij na submission
   - Powinien otworzyć się detail page

### Test 3: Review Interface

1. **Otwórz submission detail:**
   ```
   http://localhost:3002/submissions/{id}
   ```

2. **Testuj Review Features:**
   
   **a) View Code/DSL:**
   - Kliknij zakładki "TSX Code" i "UI-DSL"
   - Sprawdź czy kod się wyświetla

   **b) Add Inline Comment:**
   - Zaznacz tekst w kodzie
   - Powinien pojawić się input do dodania komentarza
   - Dodaj komentarz i zapisz

   **c) Approve:**
   - Kliknij "Approve"
   - Wpisz opcjonalny komentarz
   - Potwierdź
   - Status powinien zmienić się na "approved"

   **d) Request Changes:**
   - Kliknij "Request Changes"
   - Wpisz komentarz z prośbą o zmiany
   - Potwierdź
   - Status powinien zmienić się na "rejected"

   **e) Diff Visualization (jeśli dostępny):**
   - Jeśli submission ma `revisionId` i parent revision
   - Powinien pojawić się tab "Diff"
   - Pokazuje side-by-side porównanie kodu

### Test 4: Quality Checks

1. **Utwórz submission z problemami:**
   ```bash
   curl -X POST http://localhost:3002/api/submissions \
     -H "Content-Type: application/json" \
     -d '{
       "type": "component",
       "dsl": {"type": "page", "id": "test", "sections": []},
       "tsx": "export default function Bad() { return <button style={{color: \"#ff0000\"}}>Bad</button>; }",
       "author": "test"
     }' | jq -r '.id'
   ```

2. **Uruchom checks:**
   ```bash
   SUBMISSION_ID="id-z-powyższego"
   curl -X POST "http://localhost:3002/api/submissions/$SUBMISSION_ID/run-checks" | jq
   ```

3. **Sprawdź wyniki:**
   - Status powinien być `rejected` (z powodu hardcoded colors)
   - `checks.tokens.violations` > 0
   - `checks.lint.errors` może być > 0

---

## 🎭 Testy E2E (Playwright)

### Uruchomienie

```bash
# Wszystkie testy E2E
pnpm test:e2e

# Z UI (interaktywny, zalecany)
pnpm test:e2e:ui

# Konkretny test
pnpm test:e2e e2e/submissions.spec.ts
pnpm test:e2e e2e/submit-with-checks.spec.ts
```

### Co testują testy E2E:

- ✅ Wyświetlanie listy submissions
- ✅ Szczegóły submission
- ✅ Przycisk Verify
- ✅ Przycisk Promote
- ✅ Submit workflow z checks

---

## 📝 Checklist Testowy

### ✅ Submissions Workflow

- [ ] Utworzenie submission przez API
- [ ] Utworzenie submission przez UI (jeśli dostępne)
- [ ] Uruchomienie quality checks
- [ ] Sprawdzenie wyników checks (a11y, lint, bundle, tests)
- [ ] Status submission zmienia się po checks
- [ ] Lista submissions wyświetla wszystkie
- [ ] Filtrowanie submissions (status, type)

### ✅ Review Interface

- [ ] Wyświetlanie TSX Code
- [ ] Wyświetlanie UI-DSL
- [ ] Dodawanie inline comments
- [ ] Approve submission
- [ ] Request changes
- [ ] Diff visualization (jeśli dostępny)

### ✅ Governance

- [ ] Governance warnings w Studio (soft warnings)
- [ ] Warnings nie blokują generowania
- [ ] Policy bundles działają (Core DS, Enterprise)
- [ ] Rule engine wykrywa violations
- [ ] Submissions hard gates (blokują approval przy errors)

### ✅ Quality Checks

- [ ] A11y checks (axe-core)
- [ ] Lint checks (ESLint)
- [ ] Bundle checks (size, forbidden deps)
- [ ] Test presence checks
- [ ] Token checks (hardcoded colors)

---

## 🐛 Debugowanie

### Sprawdź logi serwera

```bash
# W terminalu gdzie działa `pnpm dev`
# Powinny być logi:
# [Submissions API] ...
# [Governance] ...
# [Rule Engine] ...
```

### Sprawdź w DevTools

1. Otwórz DevTools (F12)
2. Tab "Console" - sprawdź błędy
3. Tab "Network" - sprawdź requesty API
4. Tab "Application" > LocalStorage - sprawdź cache

### Sprawdź błędy w kodzie

```bash
# Lint errors
pnpm lint

# TypeScript errors
pnpm build
```

---

## 📚 Przydatne Komendy

```bash
# Uruchom serwery
pnpm dev

# Testy unit
pnpm test

# Testy E2E
pnpm test:e2e:ui

# Lint
pnpm lint

# Build (sprawdza TypeScript)
pnpm build

# Gotowy skrypt testowy
./test-phase3.sh
```

---

## 🎯 Szybki Start

**Najszybszy sposób na przetestowanie:**

1. Uruchom serwery:
   ```bash
   pnpm dev
   ```

2. Uruchom gotowy skrypt:
   ```bash
   cd apps/demo
   ./test-phase3.sh
   ```

3. Otwórz w przeglądarce:
   - Studio: http://localhost:3002/studio
   - Submissions: http://localhost:3002/submissions

4. Przetestuj manualnie:
   - Wygeneruj komponent w Studio
   - Sprawdź Governance tab
   - Utwórz submission
   - Przejrzyj w Submissions page

---

**Gotowe! 🎉**

Jeśli masz problemy, sprawdź:
- Czy serwery działają (`lsof -ti:3002`)
- Czy nie ma błędów w konsoli przeglądarki
- Czy API zwraca poprawne odpowiedzi (`curl` testy)

