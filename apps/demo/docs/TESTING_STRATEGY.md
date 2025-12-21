# AI Playground - Strategia Testowania

## Przegląd

Ten dokument opisuje kompleksową strategię testowania AI Playground, aby zapewnić wysoką jakość generowanego kodu i uniknąć błędów w runtime.

## ✅ Szybkie Wskazówki - Jak Testować AI Playground

### 1. Testowanie Podstawowe

**Testuj z prostymi promptami:**
```
✅ "Zbuduj formularz rejestracyjny z polami: email, hasło"
✅ "Stwórz formularz kontaktowy"
✅ "List View z tabelą i paginacją"
```

**Unikaj złożonych promptów na początku:**
```
❌ "Stwórz całą aplikację e-commerce z 10 ekranami"
❌ "Formularz z 50 polami"
```

### 2. Sprawdzanie Konsoli

**Zawsze sprawdzaj konsolę przeglądarki:**
- Otwórz DevTools (F12)
- Przejdź do zakładki "Console"
- Sprawdź czy nie ma błędów React (czerwone komunikaty)
- Sprawdź czy nie ma ostrzeżeń (żółte komunikaty)

**Częste błędy:**
- `Warning: Each child in a list should have a unique "key" prop` - brak kluczy w listach
- `Error: Cannot update a component while rendering` - setState podczas renderowania
- `Error: Missing required prop` - brakujące wymagane props

### 3. Testowanie Komponentów

**Sprawdź czy wszystkie komponenty mają wymagane props:**

| Komponent | Wymagane Props |
|-----------|----------------|
| `Pagination` | `currentPage`, `totalPages`, `onPageChange` |
| `Select` | `value`, `onValueChange` (lub użyj sub-komponentów) |
| `Input` | `value`, `onChange` (opcjonalne, ale zalecane) |
| `Button` | Brak wymaganych (ale `onClick` dla akcji) |

### 4. Testowanie Walidacji

**Sprawdź czy walidacja działa:**
1. Wygeneruj formularz z wymaganymi polami
2. Spróbuj wysłać pusty formularz
3. Sprawdź czy pojawiają się komunikaty błędów
4. Wypełnij pola poprawnie
5. Sprawdź czy formularz się wysyła

### 5. Testowanie Różnych Typów Promptów

**Formularze:**
- Formularz rejestracyjny
- Formularz kontaktowy
- Formularz logowania
- Formularz z różnymi typami pól (text, email, tel, checkbox, select)

**Aplikacje/Ekrany:**
- List View (tabela + paginacja)
- Dashboard
- Detail View
- Landing Page

### 6. Checklist Przed Użyciem

- [ ] Sprawdź konsolę - brak błędów
- [ ] Wszystkie komponenty się renderują
- [ ] Interakcje działają (kliknięcia, zmiana wartości)
- [ ] Walidacja działa poprawnie
- [ ] Stylowanie wygląda dobrze
- [ ] Kod jest czytelny i poprawny składniowo

---

## Problemy do rozwiązania

1. **Brakujące wymagane props** - komponenty jak `Pagination` są generowane bez wymaganych props
2. **Brak walidacji wygenerowanego kodu** - kod jest generowany bez sprawdzenia poprawności
3. **Brak testów jednostkowych** - generator nie ma testów
4. **Brak testów integracyjnych** - cały flow nie jest testowany
5. **Brak testów E2E** - brak testów end-to-end dla playground

## Strategia Testowania

### 1. Testy Jednostkowe (Unit Tests)

#### 1.1. Testy Generatora UI-DSL (`packages/ui-dsl/src/generator.test.ts`)

**Testy do zaimplementowania:**

```typescript
describe('generateCodeFromUIDSL', () => {
  it('should generate valid form code with all required props', () => {
    // Test podstawowego formularza
  });
  
  it('should include all required props for Pagination component', () => {
    // Test czy Pagination ma currentPage, totalPages, onPageChange
  });
  
  it('should include all required props for Select component', () => {
    // Test czy Select ma wszystkie wymagane sub-komponenty
  });
  
  it('should generate valid TypeScript code', () => {
    // Test czy kod kompiluje się bez błędów
  });
  
  it('should handle missing optional props gracefully', () => {
    // Test czy brakujące opcjonalne props nie powodują błędów
  });
});
```

#### 1.2. Testy Parser UI-DSL (`packages/ui-dsl/src/parser.test.ts`)

```typescript
describe('parsePromptToUIDSL', () => {
  it('should parse registration form prompt correctly', () => {
    // Test parsowania promptu formularza rejestracyjnego
  });
  
  it('should extract all fields from prompt', () => {
    // Test ekstrakcji pól z promptu
  });
  
  it('should detect validation rules from prompt', () => {
    // Test wykrywania reguł walidacji
  });
});
```

### 2. Testy Integracyjne (Integration Tests)

#### 2.1. Testy API Route (`apps/demo/app/api/generate/route.test.ts`)

```typescript
describe('POST /api/generate', () => {
  it('should generate valid code for form prompt', async () => {
    // Test generowania kodu dla formularza
  });
  
  it('should return code that can be transpiled', async () => {
    // Test czy wygenerowany kod może być transpilowany
  });
  
  it('should handle errors gracefully', async () => {
    // Test obsługi błędów
  });
});
```

#### 2.2. Testy React Live Renderer (`apps/demo/src/components/react-live-renderer.test.tsx`)

```typescript
describe('ReactLiveRenderer', () => {
  it('should render valid component code', () => {
    // Test renderowania poprawnego kodu
  });
  
  it('should display errors for invalid code', () => {
    // Test wyświetlania błędów
  });
  
  it('should handle missing props gracefully', () => {
    // Test obsługi brakujących props
  });
});
```

### 3. Walidacja Wygenerowanego Kodu

#### 3.1. Walidacja Props Komponentów

**Plik:** `packages/ui-dsl/src/validator.ts`

```typescript
import registry from "@fragment_ui/registry/registry.json";

interface ComponentProps {
  required: string[];
  optional: string[];
}

/**
 * Waliduje czy wygenerowany kod zawiera wszystkie wymagane props
 */
export function validateComponentProps(
  componentName: string,
  props: Record<string, any>
): { valid: boolean; missing: string[] } {
  const componentInfo = registry.components.find(
    c => c.name === componentName
  );
  
  if (!componentInfo) {
    return { valid: true, missing: [] }; // Nieznany komponent - pomijamy
  }
  
  const requiredProps = componentInfo.props
    ?.filter(p => p.required)
    .map(p => p.name) || [];
  
  const missing = requiredProps.filter(
    prop => !(prop in props)
  );
  
  return {
    valid: missing.length === 0,
    missing
  };
}
```

#### 3.2. Walidacja Wygenerowanego Kodu

**Plik:** `packages/ui-dsl/src/code-validator.ts`

```typescript
import * as Babel from "@babel/standalone";

/**
 * Waliduje czy wygenerowany kod jest poprawny składniowo
 */
export function validateGeneratedCode(code: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    // Próba transpilacji kodu
    Babel.transform(code, {
      presets: [
        ["react", { runtime: "classic" }],
        ["typescript", { isTSX: true, allExtensions: true }],
      ],
    });
  } catch (error) {
    errors.push(error.message);
  }
  
  // Sprawdzenie czy wszystkie komponenty mają wymagane props
  // (implementacja w następnym kroku)
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 4. Testy E2E (End-to-End Tests)

#### 4.1. Playwright Testy (`apps/demo/e2e/playground.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('AI Playground', () => {
  test('should generate and render registration form', async ({ page }) => {
    await page.goto('http://localhost:3002/playground');
    
    // Wpisz prompt
    await page.fill('[data-testid="ai-prompt-input"]', 
      'Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu'
    );
    
    // Kliknij Generate
    await page.click('[data-testid="generate-button"]');
    
    // Poczekaj na wygenerowanie
    await page.waitForSelector('[data-testid="generated-code"]', {
      timeout: 10000
    });
    
    // Sprawdź czy preview się renderuje
    await expect(page.locator('[data-testid="live-preview"]')).toBeVisible();
    
    // Sprawdź czy nie ma błędów w konsoli
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Poczekaj chwilę na renderowanie
    await page.waitForTimeout(2000);
    
    // Sprawdź czy nie ma błędów React
    const reactErrors = errors.filter(e => 
      e.includes('Warning:') || e.includes('Error:')
    );
    expect(reactErrors).toHaveLength(0);
  });
  
  test('should handle invalid prompts gracefully', async ({ page }) => {
    // Test obsługi nieprawidłowych promptów
  });
});
```

### 5. Lepsze Domyślne Wartości w Generatorze

#### 5.1. Domyślne Props dla Komponentów

**Plik:** `packages/ui-dsl/src/component-defaults.ts`

```typescript
import type { Field } from "./types";

/**
 * Zwraca domyślne props dla komponentu
 */
export function getDefaultProps(componentName: string, field: Field): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    Pagination: {
      currentPage: 1,
      totalPages: 10,
      onPageChange: `(page: number) => console.log("Page changed:", page)`,
    },
    Select: {
      placeholder: field.placeholder || "Select an option...",
      onValueChange: `(value: string) => handleChange("${field.name}", value)`,
    },
    // Dodaj więcej domyślnych props dla innych komponentów
  };
  
  return defaults[componentName] || {};
}
```

### 6. Checklist Testowania Przed Release

- [ ] Wszystkie testy jednostkowe przechodzą
- [ ] Wszystkie testy integracyjne przechodzą
- [ ] Wszystkie testy E2E przechodzą
- [ ] Wygenerowany kod nie ma błędów w konsoli
- [ ] Wszystkie komponenty mają wymagane props
- [ ] Kod kompiluje się bez błędów TypeScript
- [ ] Kod renderuje się bez błędów React
- [ ] Walidacja działa poprawnie
- [ ] Obsługa błędów działa poprawnie

## Implementacja Krok po Kroku

### Krok 1: Dodaj Walidację Props (Priorytet: Wysoki)

1. Utwórz `packages/ui-dsl/src/validator.ts`
2. Dodaj funkcję `validateComponentProps`
3. Użyj w generatorze przed generowaniem kodu

### Krok 2: Dodaj Testy Jednostkowe (Priorytet: Wysoki)

1. Zainstaluj `vitest` lub `jest`
2. Utwórz testy dla generatora
3. Utwórz testy dla parsera

### Krok 3: Dodaj Walidację Wygenerowanego Kodu (Priorytet: Średni)

1. Utwórz `packages/ui-dsl/src/code-validator.ts`
2. Dodaj walidację składniową
3. Dodaj walidację props

### Krok 4: Dodaj Testy E2E (Priorytet: Średni)

1. Zainstaluj Playwright
2. Utwórz testy E2E dla playground
3. Dodaj do CI/CD

### Krok 5: Popraw Generator (Priorytet: Wysoki)

1. Dodaj domyślne props dla wszystkich komponentów
2. Użyj walidacji przed generowaniem kodu
3. Dodaj lepsze komunikaty błędów

## Narzędzia

- **Testy jednostkowe:** Vitest lub Jest
- **Testy E2E:** Playwright
- **Walidacja kodu:** Babel, TypeScript compiler
- **Linting:** ESLint
- **Type checking:** TypeScript

## Przykłady Testów

Zobacz:
- `packages/ui-dsl/src/__tests__/generator.test.ts` (do utworzenia)
- `packages/ui-dsl/src/__tests__/parser.test.ts` (do utworzenia)
- `apps/demo/e2e/playground.spec.ts` (do utworzenia)

