# Test Manualny: ESLint Rule `no-uncontracted-actions`

## 📋 Cel

Przetestować, czy reguła ESLint `no-uncontracted-actions` poprawnie wykrywa Button/CTA komponenty bez atrybutów `data-action-*` (Action Contracts).

## 🔧 Jak przetestować

### Krok 1: Utwórz plik testowy

Plik testowy został utworzony w: `apps/demo/src/components/test-eslint-rule.tsx`

Zawiera:
- ❌ Button bez `data-action-id` - powinien zgłosić błąd
- ❌ Button z `data-action-id` ale bez `data-action-kind` - powinien zgłosić błąd
- ✅ Button z pełnym Action Contract - powinien być OK
- ✅ HTML button (nie z @fragment_ui/ui) - powinien być OK

### Krok 2: Uruchom ESLint

```bash
cd apps/demo
pnpm lint src/components/test-eslint-rule.tsx
```

### Krok 3: Sprawdź wyniki

ESLint powinien zgłosić błędy dla:
1. `<Button>Click Me</Button>` - brak `data-action-id`
2. `<Button data-action-id="action-1">Click Me 2</Button>` - brak `data-action-kind`

## ✅ Oczekiwane wyniki

```
✖ ESLint found problems

src/components/test-eslint-rule.tsx
  12:7  error  Button/CTA component must have data-action-id attribute (Action Contract required for AXL)  axl-no-uncontracted/no-uncontracted-actions
  15:7  error  Button/CTA with data-action-id must also have data-action-kind attribute                     axl-no-uncontracted/no-uncontracted-actions
```

## 🧪 Przykłady testowe

### ❌ Błąd: Button bez Action Contract

```tsx
<Button>Click Me</Button>
```

**Błąd:** `Button/CTA component must have data-action-id attribute (Action Contract required for AXL)`

### ❌ Błąd: Button bez data-action-kind

```tsx
<Button data-action-id="action-1">Click Me</Button>
```

**Błąd:** `Button/CTA with data-action-id must also have data-action-kind attribute`

### ✅ Poprawny: Button z pełnym Action Contract

```tsx
<Button 
  data-action-id="action-2"
  data-action-kind="soft"
>
  Click Me
</Button>
```

**Status:** ✅ Brak błędów

### ✅ Poprawny: HTML button (nie z @fragment_ui/ui)

```tsx
<button type="button">HTML Button</button>
```

**Status:** ✅ Brak błędów (reguła dotyczy tylko komponentów z @fragment_ui/ui)

## 🔍 Dodatkowe testy

Możesz również przetestować w różnych kontekstach:

1. **W formularzu:**
```tsx
<Form>
  <Button type="submit">Submit</Button> {/* ❌ Błąd */}
</Form>
```

2. **W komponencie z importem:**
```tsx
import { Button } from "@fragment_ui/ui";

export function MyComponent() {
  return <Button>Click</Button>; {/* ❌ Błąd */}
}
```

3. **Z pełnym Action Contract:**
```tsx
<Button 
  data-action-id="delete-account"
  data-action-kind="hard"
  data-action-risk-level="high"
  data-action-requires-confirmation="true"
>
  Delete Account
</Button>
```

**Status:** ✅ Brak błędów

## 📝 Notatki

- Reguła sprawdza tylko komponenty `Button` z `@fragment_ui/ui`
- HTML `<button>` elementy nie są sprawdzane
- Reguła wymaga zarówno `data-action-id` jak i `data-action-kind`
- Pełne Action Contract (z risk-level, requires-confirmation, etc.) jest opcjonalne, ale zalecane

