# Automatyczne Testowanie AI Playground

## Przegląd

System automatycznego testowania pozwala na testowanie promptów bezpośrednio z linii poleceń. Podajesz prompt, a system automatycznie:

1. Generuje kod przez API
2. Waliduje składnię kodu
3. Sprawdza czy wszystkie komponenty mają wymagane props
4. (Opcjonalnie) Testuje renderowanie w przeglądarce

## Instalacja

```bash
cd apps/demo
pnpm install
```

## Podstawowe Użycie

### Testowanie Proste (bez przeglądarki)

```bash
pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło"
```

### Testowanie z Renderowaniem w Przeglądarce

```bash
pnpm test-prompt "List View z tabelą i paginacją" --browser
```

### Testowanie z Szczegółowym Outputem

```bash
pnpm test-prompt "Stwórz formularz kontaktowy" --browser --verbose
```

## Opcje

- `--browser` - Testuje renderowanie w przeglądarce (wymaga Playwright)
- `--verbose` - Pokazuje szczegółowe informacje o testach

## Przykłady

### Testowanie Formularza

```bash
pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
```

**Oczekiwany wynik:**
```
🧪 Testing prompt: "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"

📝 Step 1: Generating code...
✅ Code generated successfully

🔍 Step 2: Validating code syntax...
✅ Code syntax is valid

🔍 Step 3: Validating component props...
✅ All components have required props

============================================================
📊 Test Results
============================================================
Prompt: "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
Status: ✅ PASSED

Checks:
  Code Generated: ✅
  Code Valid: ✅
  Props Valid: ✅
============================================================
```

### Testowanie z Przeglądarką

```bash
pnpm test-prompt "List View z tabelą i paginacją" --browser
```

**Oczekiwany wynik:**
```
🧪 Testing prompt: "List View z tabelą i paginacją"

📝 Step 1: Generating code...
✅ Code generated successfully

🔍 Step 2: Validating code syntax...
✅ Code syntax is valid

🔍 Step 3: Validating component props...
✅ All components have required props

🌐 Step 4: Testing rendering in browser...
✅ Component renders successfully

🎨 Step 5: Testing UI correctness...
✅ UI is correct
  - Elements visible: ✅
  - Interactive elements: ✅
  - Accessibility: ✅
  - Form functional: ✅

============================================================
📊 Test Results
============================================================
Prompt: "List View z tabelą i paginacją"
Status: ✅ PASSED

Checks:
  Code Generated: ✅
  Code Valid: ✅
  Props Valid: ✅
  Render Valid: ✅
  UI Valid: ✅

UI Checks:
  Elements Visible: ✅
  Interactive Elements: ✅
  Accessibility: ✅
  Form Functional: ✅
============================================================
```

## Co Jest Testowane

### 1. Generowanie Kodu
- Sprawdza czy API zwraca kod
- Sprawdza czy kod nie jest pusty

### 2. Walidacja Składni
- Kompiluje kod przez Babel
- Sprawdza czy nie ma błędów składniowych
- Sprawdza czy kod jest poprawnym TypeScript/JSX

### 3. Walidacja Props
- Sprawdza czy `Pagination` ma `currentPage`, `totalPages`, `onPageChange`
- Sprawdza czy `Select` ma wymagane props lub sub-komponenty
- Sprawdza inne komponenty z wymaganymi props

### 4. Test Renderowania (z `--browser`)
- Otwiera przeglądarkę (headless)
- Renderuje komponent
- Sprawdza konsolę przeglądarki pod kątem błędów
- Sprawdza czy komponent renderuje jakąkolwiek zawartość

### 5. Test UI Correctness (z `--browser`)
- **Elements Visible**: Sprawdza czy elementy są widoczne (nie ukryte przez CSS)
- **Interactive Elements**: Sprawdza czy przyciski, inputy, linki działają
- **Accessibility**: Sprawdza podstawową dostępność (labelki, ARIA attributes, semantic HTML)
- **Form Functional**: Sprawdza czy formularze mają inputy i przycisk submit
- **Screenshot**: Z opcją `--verbose` zapisuje screenshot do `.test-temp/screenshot.png`

## Integracja z CI/CD

Możesz użyć tego skryptu w CI/CD do automatycznego testowania:

```yaml
# .github/workflows/test-playground.yml
name: Test AI Playground

on:
  pull_request:
    paths:
      - 'apps/demo/**'
      - 'packages/ui-dsl/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm --filter fragment-demo run build
      - run: pnpm --filter fragment-demo run start &
      - run: sleep 5
      - run: pnpm --filter fragment-demo run test-prompt "Zbuduj formularz rejestracyjny" --browser
      - run: pnpm --filter fragment-demo run test-prompt "List View z tabelą" --browser
```

## Rozszerzanie Testów

Możesz dodać własne testy edytując `scripts/test-prompt.ts`:

```typescript
// Dodaj własną walidację
function customValidation(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Sprawdź czy kod używa Fragment UI
  if (!code.includes("@fragment_ui/ui")) {
    errors.push("Code should import from @fragment_ui/ui");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## Troubleshooting

### Błąd: "Playwright is not installed"

```bash
pnpm add -D playwright
pnpm exec playwright install chromium
```

### Błąd: "Failed to generate code"

Upewnij się, że serwer demo działa:
```bash
pnpm --filter fragment-demo run dev
```

Lub ustaw zmienną środowiskową:
```bash
DEMO_URL=http://localhost:3002 pnpm test-prompt "prompt"
```

### Błąd: "Syntax error"

Sprawdź czy wygenerowany kod jest poprawny. Możesz zobaczyć kod używając `--verbose`:
```bash
pnpm test-prompt "prompt" --verbose
```

## Następne Kroki

- [ ] Dodaj więcej testów dla różnych typów promptów
- [ ] Dodaj testy dla edge cases
- [ ] Dodaj testy wydajnościowe
- [ ] Dodaj testy accessibility
- [ ] Integracja z CI/CD

