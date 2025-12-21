# Raport: Analiza błędów renderowania komponentów DS w Playground

## Data: 2025-01-27

## 1. Obecna sytuacja

### 1.1 Problem główny
Komponenty Design System (DS) oparte na Radix UI (np. `Accordion`, `Dialog`, `Tabs`) nie renderują się poprawnie w Playground. Występuje błąd React #31:
```
Error: Minified React error #31; visit https://reactjs.org/docs/error-decoder.html?invariant=31&args[]=object%20with%20keys%20%7B%24%24typeof%2C%20type%2C%20key%2C%20ref%2C%20props%7D
```

### 1.2 Przyczyna błędu
- Komponenty Radix UI (np. `AccordionPrimitive.Root`) są **obiektami**, nie funkcjami
- `React.createElement()` oczekuje funkcji lub klasy, nie obiektu
- Gdy esbuild używa `jsx: "transform"`, generuje `React.createElement(Accordion, ...)`, co powoduje błąd

### 1.3 Próby rozwiązania
1. **Zmiana na `jsx: "automatic"`** - używa `react/jsx-runtime`, ale wymaga custom implementacji
2. **Custom API endpoint `/api/jsx-runtime`** - dostarcza custom `jsx` function
3. **Wrapper dla `React.createElement`** - próba przechwycenia i obsługi obiektów

## 2. Analiza obecnego kodu

### 2.1 Konfiguracja esbuild
```typescript
jsx: "automatic",
jsxImportSource: "react",
```
- Esbuild używa `jsx: "automatic"`, co powinno generować kod używający `react/jsx-runtime`
- Ale w logach widzimy `React.createElement(Accordion, ...)`, co sugeruje, że esbuild nadal używa `React.createElement`

### 2.2 Post-processing w `bundleCode()`
```typescript
// Linia 454-462
const hasCreateElement = bundledCode.includes('React.createElement');
console.warn(`🔍 [bundleCode] Checking for React.createElement: ${hasCreateElement}, code length: ${bundledCode.length}`);
if (hasCreateElement) {
  bundledCode = await addCreateElementWrapper(bundledCode);
}
```

### 2.3 Wrapper `addCreateElementWrapper()`
```typescript
// Linia 205-266
// Tworzy wrapper dla React.createElement, który:
// 1. Importuje jsx z react/jsx-runtime
// 2. Zastępuje React.createElement funkcją, która sprawdza czy type jest obiektem
// 3. Jeśli tak, używa jsx z react/jsx-runtime
```

## 3. Zidentyfikowane problemy

### 3.1 Problem #1: Logi nie są widoczne
**Symptom:**
- W logach przeglądarki nie ma:
  - `📦 [bundleCode] Code bundled, length: ...`
  - `🔍 [bundleCode] Checking for React.createElement: ...`
  - `🔧 [bundleCode] Replacing React.createElement`

**Możliwe przyczyny:**
1. Logi są w iframe, ale nie są przekazywane do głównej konsoli
2. Cache jest używany i kod nie dociera do miejsca z logami
3. `console.warn` w workerze nie jest widoczny w konsoli przeglądarki

**Dowód:**
- W logach widzimy "Bundled code preview: ... React.createElement(Accordion, ...)" (z `renderComponent`, linia 572)
- Ale nie widzimy logów z `bundleCode()` (linie 405, 458-459)

### 3.2 Problem #2: Cache może być używany
**Symptom:**
- Kod może być cachowany z wcześniejszej wersji (przed dodaniem wrappera)
- Cache jest sprawdzany w linii 277, ale wrapper jest dodawany dopiero w linii 298-305 (dla cached code) lub 460-462 (dla nowego kodu)

**Możliwe przyczyny:**
1. Cache został utworzony przed dodaniem wrappera
2. `cacheVersion` jest ustawiony na "v2-wrapper", ale cache może być z wcześniejszej wersji
3. Wrapper jest dodawany dla cached code, ale może nie działać poprawnie

**Dowód:**
- W logach nie widzimy "Using cached bundle for code hash:" ani "🔧 [bundleCode] Cached code needs wrapper, adding it..."

### 3.3 Problem #3: Esbuild generuje `React.createElement` mimo `jsx: "automatic"`
**Symptom:**
- W logach widzimy "Bundled code preview: ... React.createElement(Accordion, ...)"
- To sugeruje, że esbuild nadal używa `React.createElement` zamiast `jsx` z `react/jsx-runtime`

**Możliwe przyczyny:**
1. Esbuild może używać `React.createElement` dla kompatybilności
2. `jsxImportSource: "react"` może nie działać poprawnie
3. External `react/jsx-runtime` może powodować, że esbuild używa `React.createElement` jako fallback

**Dowód:**
- W logach widzimy `React.createElement(Accordion, ...)` w bundled code
- To oznacza, że esbuild nie używa `jsx` z `react/jsx-runtime`

### 3.4 Problem #4: Wrapper może nie działać poprawnie
**Symptom:**
- Wrapper jest dodawany, ale błąd React #31 nadal występuje
- Wrapper próbuje użyć `jsx` z `react/jsx-runtime`, ale może nie być dostępny w iframe

**Możliwe przyczyny:**
1. `react/jsx-runtime` może nie być dostępny w iframe (import map może nie działać)
2. Wrapper może być dodawany, ale nie jest wykonywany przed użyciem `React.createElement`
3. Wrapper może być dodawany w złym miejscu (po użyciu `React.createElement`)

**Dowód:**
- Błąd React #31 nadal występuje po dodaniu wrappera
- W logach nie widzimy potwierdzenia, że wrapper jest dodawany

## 4. Rekomendacje

### 4.1 Natychmiastowe działania

#### 4.1.1 Dodać więcej logów
- Dodać `console.warn` w kluczowych miejscach, aby zobaczyć, co się dzieje
- Sprawdzić, czy `bundleCode()` jest wywoływany
- Sprawdzić, czy wrapper jest dodawany

#### 4.1.2 Wyczyścić cache
- Zwiększyć `cacheVersion` do "v3-wrapper" lub wyczyścić cache całkowicie
- Upewnić się, że nowy kod jest bundlowany, a nie używany z cache

#### 4.1.3 Sprawdzić konfigurację esbuild
- Sprawdzić, czy `jsx: "automatic"` rzeczywiście generuje kod używający `jsx` z `react/jsx-runtime`
- Jeśli nie, rozważyć użycie `jsx: "transform"` z custom `jsxFactory`

### 4.2 Długoterminowe rozwiązanie

#### 4.2.1 Opcja A: Użyć `jsx: "transform"` z custom `jsxFactory`
```typescript
jsx: "transform",
jsxFactory: "jsx", // użyj custom jsx function
jsxFragment: "Fragment",
```
- Utworzyć custom `jsx` function, która obsługuje obiekty
- Wstrzyknąć tę funkcję do iframe przed bundlowaniem

#### 4.2.2 Opcja B: Użyć `jsx: "automatic"` z custom `react/jsx-runtime`
- Upewnić się, że custom `/api/jsx-runtime` jest dostępny w iframe
- Sprawdzić, czy import map działa poprawnie
- Upewnić się, że custom `jsx` function jest używana

#### 4.2.3 Opcja C: Przetransformować kod przed bundlowaniem
- Przed bundlowaniem zamienić `Accordion` (obiekt) na funkcję wrapper
- Użyć `React.createElement` z funkcją wrapper zamiast obiektu

## 5. Plan działania

### Krok 1: Diagnostyka
1. Dodać więcej logów w `bundleCode()` i `addCreateElementWrapper()`
2. Sprawdzić, czy cache jest używany
3. Sprawdzić, czy wrapper jest dodawany
4. Sprawdzić, czy wrapper jest wykonywany

### Krok 2: Naprawa cache
1. Zwiększyć `cacheVersion` do "v3-wrapper"
2. Wyczyścić cache całkowicie (opcjonalnie)
3. Upewnić się, że nowy kod jest bundlowany

### Krok 3: Naprawa wrappera
1. Sprawdzić, czy `react/jsx-runtime` jest dostępny w iframe
2. Sprawdzić, czy import map działa poprawnie
3. Upewnić się, że wrapper jest dodawany przed użyciem `React.createElement`

### Krok 4: Alternatywne rozwiązanie
1. Jeśli wrapper nie działa, rozważyć użycie `jsx: "transform"` z custom `jsxFactory`
2. Lub przetransformować kod przed bundlowaniem

## 6. Szczegółowa analiza kodu

### 6.1 Konfiguracja esbuild w `worker.ts`
```typescript
// Linia 374-401
jsx: "automatic",
jsxImportSource: "react",
external: [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",  // External - używa import map
  "@fragment_ui/ui",
  "@fragment_ui/blocks",
  "zod",
],
```
- Esbuild używa `jsx: "automatic"`, co powinno generować kod używający `jsx` z `react/jsx-runtime`
- `react/jsx-runtime` jest external, więc esbuild nie bundluje go, tylko używa import map
- Import map w `iframe.html` mapuje `react/jsx-runtime` do `/api/jsx-runtime`

### 6.2 Custom `/api/jsx-runtime` endpoint
```typescript
// apps/demo/app/api/jsx-runtime/route.ts, linia 23-42
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    if (type.$$typeof) {
      return type;  // Już jest React element
    }
    // PROBLEM: Używa React.createElement, który nie obsługuje obiektów!
    return React.createElement(type, props, key);
  }
  return React.createElement(type, props, key);
}
```
**Problem:** Custom `jsx` function używa `React.createElement` dla obiektów, ale `React.createElement` nie obsługuje obiektów (tylko funkcje i stringi). To powoduje błąd React #31.

### 6.3 Wrapper `addCreateElementWrapper()`
```typescript
// Linia 205-266
// Wrapper próbuje użyć jsx z react/jsx-runtime dla obiektów
if (typeof type === 'object' && type !== null && typeof type !== 'function') {
  return jsx(type, finalProps, null);  // Używa jsx z react/jsx-runtime
}
```
**Problem:** Wrapper używa `jsx` z `react/jsx-runtime`, ale custom endpoint zwraca kod, który używa `React.createElement` dla obiektów, więc to nie rozwiązuje problemu.

### 6.4 Dlaczego esbuild generuje `React.createElement`?
Esbuild z `jsx: "automatic"` powinien generować kod używający `jsx` z `react/jsx-runtime`, ale:
1. Jeśli `react/jsx-runtime` jest external, esbuild może używać `React.createElement` jako fallback
2. Jeśli kod źródłowy używa `React.createElement` bezpośrednio, esbuild nie transformuje go
3. Jeśli `@fragment_ui/ui` bundle zawiera `React.createElement`, esbuild nie transformuje go (bo jest external)

## 7. Główny problem

**Root cause:** Custom `/api/jsx-runtime` endpoint zwraca kod, który używa `React.createElement` dla obiektów, ale `React.createElement` nie obsługuje obiektów (tylko funkcje i stringi). To powoduje błąd React #31.

**Dlaczego to nie działa:**
1. Radix UI komponenty (np. `AccordionPrimitive.Root`) są obiektami, nie funkcjami
2. `React.createElement(AccordionPrimitive.Root, ...)` powoduje błąd React #31
3. Custom `jsx` function w `/api/jsx-runtime` używa `React.createElement` dla obiektów, więc nie rozwiązuje problemu

## 8. Rozwiązanie

### 8.1 Naprawa custom `/api/jsx-runtime` endpoint

Musimy zmienić custom `jsx` function, aby obsługiwała obiekty poprawnie. Radix UI komponenty są obiektami z właściwością `$$typeof`, ale nie są React elementami. Musimy użyć innego podejścia:

**Opcja 1: Użyć `React.createElement` z funkcją wrapper**
```typescript
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    // Jeśli obiekt ma $$typeof, to jest już React element
    if (type.$$typeof) {
      return type;
    }
    // Dla obiektów Radix UI, musimy użyć funkcji wrapper
    // Radix UI komponenty są obiektami, które React może renderować
    // Ale React.createElement nie obsługuje ich bezpośrednio
    // Musimy sprawdzić, czy obiekt ma właściwość render lub użyć innego podejścia
    // Niestety, React.createElement nie obsługuje obiektów, więc musimy użyć innego rozwiązania
    // Najlepsze rozwiązanie: użyć React.createElement z funkcją wrapper, która zwraca obiekt
    const Wrapper = () => type;
    return React.createElement(Wrapper, props, key);
  }
  return React.createElement(type, props, key);
}
```

**Opcja 2: Użyć bezpośrednio obiektu (jeśli React 18 obsługuje to)**
```typescript
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    if (type.$$typeof) {
      return type;
    }
    // React 18 może obsługiwać obiekty bezpośrednio w niektórych przypadkach
    // Ale to nie jest standardowe zachowanie
    // Najlepsze rozwiązanie: sprawdzić, czy obiekt ma właściwość render
    if (typeof type.render === 'function') {
      return type.render(props);
    }
    // Jeśli nie, spróbuj użyć React.createElement z funkcją wrapper
    const Wrapper = () => type;
    return React.createElement(Wrapper, props, key);
  }
  return React.createElement(type, props, key);
}
```

**Opcja 3: Użyć React.createElement z funkcją wrapper (najlepsze rozwiązanie)**
```typescript
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    if (type.$$typeof) {
      return type;
    }
    // Dla obiektów Radix UI, użyj funkcji wrapper
    // Funkcja wrapper zwraca obiekt, który React może renderować
    const Wrapper = (wrapperProps) => {
      // Sprawdź, czy obiekt ma właściwość render
      if (typeof type.render === 'function') {
        return type.render(wrapperProps);
      }
      // Jeśli nie, zwróć obiekt bezpośrednio (React 18 może to obsłużyć)
      return type;
    };
    return React.createElement(Wrapper, props, key);
  }
  return React.createElement(type, props, key);
}
```

### 8.2 Alternatywne rozwiązanie: Zmienić esbuild na `jsx: "transform"`

Zamiast używać `jsx: "automatic"`, możemy użyć `jsx: "transform"` z custom `jsxFactory`:

```typescript
jsx: "transform",
jsxFactory: "jsx",  // Użyj custom jsx function
jsxFragment: "Fragment",
```

Następnie wstrzyknąć custom `jsx` function do iframe przed bundlowaniem.

## 9. Rekomendowane rozwiązanie

**Najlepsze rozwiązanie:** Naprawić custom `/api/jsx-runtime` endpoint, aby używał funkcji wrapper dla obiektów:

```typescript
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    if (type.$$typeof) {
      return type;
    }
    // Dla obiektów Radix UI, użyj funkcji wrapper
    // Radix UI komponenty są obiektami, które React może renderować
    // Ale React.createElement nie obsługuje ich bezpośrednio
    // Musimy użyć funkcji wrapper, która zwraca obiekt
    const Wrapper = (wrapperProps) => {
      // Sprawdź, czy obiekt ma właściwość render
      if (typeof type.render === 'function') {
        return type.render(wrapperProps);
      }
      // Jeśli nie, zwróć obiekt bezpośrednio
      // React 18 może obsłużyć obiekty w niektórych przypadkach
      return type;
    };
    return React.createElement(Wrapper, props, key);
  }
  return React.createElement(type, props, key);
}
```

**Ale to nadal może nie działać**, bo `React.createElement(Wrapper, ...)` zwróci element z `Wrapper` jako typem, a nie obiektem.

**Najlepsze rozwiązanie:** Sprawdzić, jak Radix UI komponenty są używane w kodzie źródłowym. Jeśli są używane jako `<Accordion.Root>`, to znaczy, że są renderowane jako obiekty, ale React musi je obsłużyć w jakiś sposób.

**Prawdziwe rozwiązanie:** Radix UI komponenty są obiektami z właściwością `$$typeof`, ale nie są React elementami. Musimy użyć innego podejścia - sprawdzić, czy obiekt ma właściwość `render` lub użyć `React.createElement` z funkcją wrapper, która zwraca obiekt bezpośrednio.

## 10. Kluczowe odkrycie: Problem w `/api/bundle`

### 10.1 Analiza `/api/bundle` route

W `/api/bundle/route.ts` (linie 185-261):
```typescript
jsx: "transform",
jsxFactory: "React.createElement",
jsxFragment: "React.Fragment",
// ...
{
  name: "replace-jsx-runtime",
  setup(build: PluginBuild) {
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, (args) => {
      return { path: "react", namespace: "jsx-runtime-replacement" };
    });
    build.onLoad({ filter: /.*/, namespace: "jsx-runtime-replacement" }, () => {
      return {
        contents: `
          import React from "react";
          export const jsx = React.createElement;  // PROBLEM!
          export const jsxs = React.createElement;
          export const jsxDEV = React.createElement;
          export const Fragment = React.Fragment;
        `,
        loader: "js",
      };
    });
  },
}
```

**Problem:** Plugin `replace-jsx-runtime` zwraca stub, który eksportuje `React.createElement` jako `jsx`. To oznacza, że `@fragment_ui/ui` bundle zawiera kod używający `React.createElement` zamiast prawdziwego `jsx` z `react/jsx-runtime`.

### 10.2 Dlaczego to powoduje błąd?

1. `@fragment_ui/ui` bundle jest tworzony z `jsx: "transform"` i `jsxFactory: "React.createElement"`
2. Plugin `replace-jsx-runtime` przechwytuje importy `react/jsx-runtime` i zwraca stub z `React.createElement`
3. Gdy kod użytkownika używa `<Accordion>`, esbuild w `worker.ts` bundluje kod używający `@fragment_ui/ui`
4. `@fragment_ui/ui` zawiera `React.createElement(AccordionPrimitive.Root, ...)`, gdzie `AccordionPrimitive.Root` jest obiektem
5. `React.createElement` nie obsługuje obiektów, więc występuje błąd React #31

### 10.3 Dlaczego wrapper nie działa?

Wrapper `addCreateElementWrapper()` w `worker.ts` próbuje dodać wrapper dla `React.createElement`, ale:
1. Wrapper jest dodawany do bundled code użytkownika
2. Ale `@fragment_ui/ui` bundle już zawiera `React.createElement` bez wrappera
3. Gdy kod użytkownika używa `<Accordion>`, esbuild używa `React.createElement` z `@fragment_ui/ui` bundle, który nie ma wrappera

## 11. Rozwiązanie

### 11.1 Naprawa `/api/bundle` route

Musimy zmienić plugin `replace-jsx-runtime` w `/api/bundle`, aby zwracał custom `jsx` function, która obsługuje obiekty:

```typescript
{
  name: "replace-jsx-runtime",
  setup(build: PluginBuild) {
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, (args) => {
      return { path: "react", namespace: "jsx-runtime-replacement" };
    });
    build.onLoad({ filter: /.*/, namespace: "jsx-runtime-replacement" }, () => {
      return {
        contents: `
          import React from "react";
          
          // Custom jsx function that handles both functions and objects
          function jsx(type, props, key) {
            // If type is an object (like AccordionPrimitive.Root), use it directly
            // React 18 can handle objects in some cases, but React.createElement cannot
            if (typeof type === 'object' && type !== null && typeof type !== 'function') {
              if (type.$$typeof) {
                // Already a React element
                return type;
              }
              // For Radix UI components, we need to use a wrapper function
              // But this won't work with React.createElement
              // We need to use the actual jsx from react/jsx-runtime
              // But we can't import it here because we're replacing it
              // Solution: Use React.createElement with a function wrapper
              const Wrapper = (wrapperProps) => {
                // Check if object has render method
                if (typeof type.render === 'function') {
                  return type.render(wrapperProps);
                }
                // Return object directly - React 18 may handle it
                return type;
              };
              return React.createElement(Wrapper, props, key);
            }
            return React.createElement(type, props, key);
          }
          
          export { jsx };
          export const jsxs = jsx;
          export const jsxDEV = jsx;
          export const Fragment = React.Fragment;
        `,
        loader: "js",
      };
    });
  },
}
```

**Ale to nadal nie zadziała**, bo `React.createElement(Wrapper, ...)` zwróci element z `Wrapper` jako typem, a nie obiektem.

### 11.2 Prawdziwe rozwiązanie

**Problem:** Radix UI komponenty są obiektami, które React może renderować tylko z `jsx` z `react/jsx-runtime`, nie z `React.createElement`.

**Rozwiązanie:** Musimy upewnić się, że:
1. `/api/bundle` używa `jsx: "automatic"` zamiast `jsx: "transform"`
2. Plugin `replace-jsx-runtime` zwraca prawdziwy custom `jsx` function, który obsługuje obiekty
3. Custom `/api/jsx-runtime` endpoint zwraca prawdziwy custom `jsx` function

**Najlepsze rozwiązanie:** Zmienić `/api/bundle` na `jsx: "automatic"` i użyć custom `jsx` function, która obsługuje obiekty bezpośrednio (bez wrappera).

## 12. Podsumowanie

### Obecny stan
- ❌ Komponenty Radix UI nie renderują się poprawnie
- ❌ Błąd React #31 występuje dla wszystkich komponentów opartych na Radix UI
- ❌ `/api/bundle` używa `jsx: "transform"` z `React.createElement`, co nie obsługuje obiektów
- ❌ Plugin `replace-jsx-runtime` w `/api/bundle` zwraca `React.createElement` jako `jsx`, co nie działa dla obiektów
- ❌ Custom `/api/jsx-runtime` endpoint używa `React.createElement` dla obiektów, co nie działa
- ❌ Wrapper `addCreateElementWrapper()` nie rozwiązuje problemu, bo `@fragment_ui/ui` bundle już zawiera `React.createElement` bez wrappera

### Główny problem
**Root cause:** `/api/bundle` route używa `jsx: "transform"` z `React.createElement` i plugin `replace-jsx-runtime` zwraca `React.createElement` jako `jsx`. To powoduje, że `@fragment_ui/ui` bundle zawiera kod używający `React.createElement` zamiast prawdziwego `jsx` z `react/jsx-runtime`. Gdy kod użytkownika używa komponentów Radix UI (które są obiektami), `React.createElement` nie może ich obsłużyć, co powoduje błąd React #31.

### Następne kroki
1. **Zmienić `/api/bundle` na `jsx: "automatic"`** - użyć `jsx` z `react/jsx-runtime` zamiast `React.createElement`
2. **Naprawić plugin `replace-jsx-runtime`** - zwrócić prawdziwy custom `jsx` function, który obsługuje obiekty
3. **Naprawić custom `/api/jsx-runtime` endpoint** - użyć prawdziwego custom `jsx` function, który obsługuje obiekty bezpośrednio
4. **Zwiększyć `cacheVersion`** do "v3-wrapper" lub wyczyścić cache całkowicie
5. **Przetestować** z komponentami Radix UI (Accordion, Dialog, Tabs)

### Priorytet
🔴 **WYSOKI** - Funkcjonalność DS Components w Playground jest krytyczna dla użytkowników

## 13. Plan naprawy

### Krok 1: Naprawić custom `/api/jsx-runtime` endpoint
**Plik:** `apps/demo/app/api/jsx-runtime/route.ts`

**Zmiana:** Zmienić `jsx` function, aby obsługiwała obiekty bezpośrednio, bez użycia `React.createElement`:

```typescript
function jsx(type, props, key) {
  if (typeof type === 'object' && type !== null && typeof type !== 'function') {
    if (type.$$typeof) {
      return type;
    }
    // Dla obiektów Radix UI, musimy użyć specjalnego podejścia
    // React.createElement nie obsługuje obiektów, ale możemy użyć innego mechanizmu
    // Najlepsze rozwiązanie: sprawdzić, czy obiekt ma właściwość render
    if (typeof type.render === 'function') {
      return type.render(props);
    }
    // Jeśli nie, spróbuj użyć obiektu bezpośrednio
    // React 18 może obsłużyć obiekty w niektórych przypadkach
    // Ale to wymaga użycia prawdziwego jsx z react/jsx-runtime, nie React.createElement
    // Więc musimy zwrócić obiekt, który React może renderować
    return type;
  }
  return React.createElement(type, props, key);
}
```

**Ale to nadal może nie działać**, bo React nie może renderować obiektów bezpośrednio.

### Krok 2: Naprawić plugin `replace-jsx-runtime` w `/api/bundle`
**Plik:** `apps/demo/app/api/bundle/route.ts`

**Zmiana:** Zmienić plugin, aby zwracał prawdziwy custom `jsx` function zamiast `React.createElement`:

```typescript
{
  name: "replace-jsx-runtime",
  setup(build: PluginBuild) {
    build.onResolve({ filter: /^react\/jsx-runtime$/ }, (args) => {
      return { path: "react", namespace: "jsx-runtime-replacement" };
    });
    build.onLoad({ filter: /.*/, namespace: "jsx-runtime-replacement" }, () => {
      return {
        contents: `
          import React from "react";
          
          // Custom jsx function that handles both functions and objects
          function jsx(type, props, key) {
            // If type is an object (like AccordionPrimitive.Root), handle it specially
            if (typeof type === 'object' && type !== null && typeof type !== 'function') {
              if (type.$$typeof) {
                return type;
              }
              // For Radix UI components, we need to use a different approach
              // React.createElement doesn't work with objects, but we can use a wrapper
              // But this won't work because React.createElement(Wrapper, ...) returns element with Wrapper as type
              // We need to use the actual jsx from react/jsx-runtime, but we're replacing it
              // Solution: Import jsx from the actual react/jsx-runtime endpoint
              // But we can't do that because we're replacing it
              // Best solution: Use React.createElement with a function that returns the object
              const Wrapper = (wrapperProps) => {
                // Check if object has render method
                if (typeof type.render === 'function') {
                  return type.render(wrapperProps);
                }
                // Return object directly - this won't work with React.createElement
                // We need to use a different approach
                return type;
              };
              return React.createElement(Wrapper, props, key);
            }
            return React.createElement(type, props, key);
          }
          
          export { jsx };
          export const jsxs = jsx;
          export const jsxDEV = jsx;
          export const Fragment = React.Fragment;
        `,
        loader: "js",
      };
    });
  },
}
```

**Ale to nadal nie zadziała**, bo `React.createElement(Wrapper, ...)` zwróci element z `Wrapper` jako typem.

### Krok 3: Zmienić `/api/bundle` na `jsx: "automatic"`
**Plik:** `apps/demo/app/api/bundle/route.ts`

**Zmiana:** Zmienić z `jsx: "transform"` na `jsx: "automatic"`:

```typescript
jsx: "automatic",
jsxImportSource: "react",
```

**I usunąć plugin `replace-jsx-runtime`**, bo nie jest już potrzebny - esbuild będzie używał `jsx` z `react/jsx-runtime` bezpośrednio.

### Krok 4: Upewnić się, że custom `/api/jsx-runtime` działa poprawnie
**Plik:** `apps/demo/app/api/jsx-runtime/route.ts`

**Zmiana:** Upewnić się, że custom `jsx` function obsługuje obiekty poprawnie. Jeśli to nie działa, rozważyć użycie innego podejścia.

### Krok 5: Zwiększyć `cacheVersion` w `worker.ts`
**Plik:** `apps/demo/app/playground/runtime/worker.ts`

**Zmiana:** Zwiększyć `cacheVersion` do "v3-wrapper" lub wyczyścić cache całkowicie:

```typescript
const cacheVersion = "v3-wrapper"; // Increment when wrapper logic changes
```

### Krok 6: Przetestować
1. Przetestować z komponentami Radix UI (Accordion, Dialog, Tabs)
2. Sprawdzić, czy błąd React #31 nadal występuje
3. Dodać więcej logów, jeśli problem nadal występuje

## 14. Alternatywne rozwiązanie

Jeśli powyższe rozwiązanie nie zadziała, możemy rozważyć:

### Opcja A: Użyć `jsx: "transform"` z custom `jsxFactory`
Zmienić esbuild w `worker.ts` na `jsx: "transform"` z custom `jsxFactory`, który obsługuje obiekty.

### Opcja B: Przetransformować kod przed bundlowaniem
Przed bundlowaniem zamienić obiekty Radix UI na funkcje wrapper.

### Opcja C: Użyć innego bundlera
Rozważyć użycie innego bundlera, który lepiej obsługuje `jsx: "automatic"`.

