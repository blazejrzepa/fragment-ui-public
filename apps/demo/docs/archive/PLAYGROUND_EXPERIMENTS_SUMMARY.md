# Podsumowanie Eksperymentów i Błędów w AI Playground

## 📋 Cel

Celem było stworzenie AI Playground, który:
1. Generuje komponenty React z promptów
2. Renderuje je z pełnym stylowaniem z Fragment UI Design System
3. Umożliwia live preview i edycję kodu

---

## 🔴 Główny Problem

**Wygenerowane komponenty nie mają stylowania z Design System.**

---

## 🧪 Eksperymenty i Próby Rozwiązania

### Eksperyment 1: React Live (Początkowy)

**Status:** ✅ Działa, ale z ograniczeniami

**Implementacja:**
- Użyto `react-live` do renderowania komponentów
- Komponenty Fragment UI przekazane przez `scope`
- TypeScript usuwany ręcznie przez regex

**Problemy:**
1. ❌ **TypeScript nie jest obsługiwany natywnie**
   - Musieliśmy ręcznie usuwać wszystkie TypeScript syntax
   - Regex do usuwania typów był bardzo skomplikowany (200+ linii)
   - Ciągłe edge cases i błędy

2. ❌ **Błędy transpilacji Babel**
   - `SyntaxError: Unexpected token, expected ","`
   - Problemy z type annotations w parametrach funkcji
   - Problemy z interfaces i generics

3. ❌ **Problemy z wykrywaniem komponentów**
   - Regex nie zawsze poprawnie wykrywał główny komponent
   - Czasami wybierał helper functions zamiast komponentu

4. ❌ **Scope issues**
   - Brakujące komponenty w scope (TabList, Tab, etc.)
   - Toast jako funkcja vs komponent
   - ValidationRules nie były dostępne

**Rozwiązania częściowe:**
- ✅ Dodano `removeInterfaces()` do usuwania interface definitions
- ✅ Dodano regex do usuwania type annotations z parametrów
- ✅ Dodano aliases dla komponentów (Tab → Tabs, TabList → TabsList)
- ✅ Dodano mock Toast component
- ✅ Dodano ValidationRules do scope

**Wynik:** Działa, ale wymaga ciągłych poprawek i nie jest skalowalne.

---

### Eksperyment 2: Sandpack (CodeSandbox)

**Status:** ⚠️ Działa, ale CSS nie jest aplikowany

**Implementacja:**
- Zainstalowano `@codesandbox/sandpack-react`
- Utworzono `SandpackRenderer` i `SandpackPreview`
- Dodano API endpoint `/api/bundle` do bundlowania `@fragment_ui/ui`
- Dodano API endpoint `/api/bundle-css` do bundlowania CSS

**Zalety:**
- ✅ **Natywne wsparcie TypeScript** - zero ręcznego czyszczenia kodu
- ✅ Profesjonalne narzędzie (CodeSandbox)
- ✅ Live editing i preview
- ✅ Syntax highlighting
- ✅ Lepsze error handling
- ✅ Hot reload

**Problemy:**
1. ❌ **CSS nie jest aplikowany w preview**
   - Sandpack działa w cross-origin iframe (`codesandbox.io`)
   - CORS blokuje dostęp do iframe z parent frame
   - Nie możemy manipulować DOM iframe bezpośrednio

2. ❌ **Próby CSS injection nie działają:**
   - **Próba 1:** StyleInjector component w `index.tsx` z `useLayoutEffect`
     - ❌ CSS nie był aplikowany
   - **Próba 2:** `index.html` jako entry point z CSS w `<head>`
     - ❌ Template `react-ts` nie obsługuje `index.html` jako entry
   - **Próba 3:** Synchronous CSS injection w `App.tsx` (module level)
     - ❌ CSS nie był aplikowany
   - **Próba 4:** Wrapper component z `useLayoutEffect` w `App.tsx`
     - ❌ CSS nadal nie był aplikowany

3. ❌ **Błędy:**
   - `Module not found: Package path ./dist/index.css is not exported`
     - ✅ Naprawione: Usunięto import CSS (nowsze wersje mają built-in styles)
   - `ModuleParseError: Module parse failed: Unexpected token` (esbuild)
     - ✅ Naprawione: Zmieniono na `require("esbuild")` i dodano `runtime: "nodejs"`
   - `GET http://localhost:3002/api/bundle 500`
     - ✅ Naprawione: Poprawiono konfigurację Next.js dla esbuild

**Wynik:** Sandpack działa, ale CSS nie jest aplikowany z powodu CORS i cross-origin iframe.

---

### Eksperyment 3: StackBlitz WebContainers

**Status:** ❌ Timeout przy łączeniu z VM

**Implementacja:**
- Zainstalowano `@stackblitz/sdk`
- Dodano headers COOP/COEP w `next.config.mjs`
- Utworzono `StackBlitzRenderer` z dynamic import
- Dodano fallback do React Live

**Zalety (teoretyczne):**
- ✅ Działa w tym samym origin (brak CORS)
- ✅ CSS injection powinno działać
- ✅ Szybsze boot time (milisekundy)
- ✅ Lepsze debugowanie
- ✅ Lokalne pakiety bez publikacji na npm

**Problemy:**
1. ❌ **Timeout przy łączeniu z StackBlitz VM**
   - `Timeout: Unable to establish a connection with the StackBlitz VM`
   - StackBlitz wymaga `SharedArrayBuffer`
   - Wymaga COOP/COEP headers + HTTPS (lub localhost)
   - Może być problem z headers blokującymi zasoby

2. ❌ **Błędy:**
   - `Attempted import error: 'embedProject' is not exported from '@stackblitz/sdk'`
     - ✅ Naprawione: Użyto dynamic import zamiast statycznego
   - `ERR_CONNECTION_TIMED_OUT` z `col.csbops.io`
     - ⚠️ StackBlitz próbuje połączyć się z zewnętrznym serwerem

3. ⚠️ **Wymagania:**
   - `SharedArrayBuffer` musi być dostępny
   - Headers COOP/COEP mogą blokować niektóre zasoby
   - Może wymagać HTTPS w produkcji

**Rozwiązania:**
- ✅ Dodano sprawdzenie `SharedArrayBuffer`
- ✅ Dodano fallback do React Live
- ✅ Dodano timeout handling
- ✅ Dodano lepsze komunikaty błędów

**Wynik:** StackBlitz nie może nawiązać połączenia z VM. Fallback do React Live działa.

---

## 📊 Porównanie Rozwiązań

| Rozwiązanie | TypeScript | CSS Injection | Niezawodność | Złożoność | Status |
|------------|------------|---------------|--------------|-----------|--------|
| **React Live** | ❌ Ręczne | ✅ Działa | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Działa |
| **Sandpack** | ✅ Natywne | ❌ CORS | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⚠️ CSS nie działa |
| **StackBlitz** | ✅ Natywne | ✅ Teoretycznie | ⭐⭐ | ⭐⭐⭐ | ❌ Timeout |

---

## 🔍 Szczegółowe Błędy

### Błędy React Live

1. **TypeScript Syntax Errors**
   ```
   SyntaxError: Unexpected token, expected "," (13:68)
   export default function Component({ prop }: Type) {
   ```
   - **Przyczyna:** Babel nie obsługuje TypeScript
   - **Rozwiązanie:** Regex do usuwania type annotations

2. **Component Name Detection**
   ```
   Component name: validateEmail
   Has component function: false
   ```
   - **Przyczyna:** Regex wybierał helper functions
   - **Rozwiązanie:** Priorytetyzacja komponentów (uppercase, export default)

3. **Missing Components in Scope**
   ```
   ReferenceError: TabList is not defined
   ReferenceError: ValidationRules is not defined
   ```
   - **Przyczyna:** Brakujące komponenty w scope
   - **Rozwiązanie:** Dodano aliases i ValidationRules

4. **Toast Component Error**
   ```
   Element type is invalid: expected a string but got: undefined
   ```
   - **Przyczyna:** Toast jest funkcją, nie komponentem
   - **Rozwiązanie:** Mock Toast component

### Błędy Sandpack

1. **CSS Import Error**
   ```
   Module not found: Package path ./dist/index.css is not exported
   ```
   - **Przyczyna:** Nowsze wersje Sandpack nie eksportują CSS
   - **Rozwiązanie:** Usunięto import CSS

2. **esbuild Module Parse Error**
   ```
   ModuleParseError: Module parse failed: Unexpected token
   export type Platform = 'browser' | 'node' | 'neutral'
   ```
   - **Przyczyna:** Next.js próbował przetworzyć esbuild przez webpack
   - **Rozwiązanie:** `require("esbuild")` + `runtime: "nodejs"` + `externals`

3. **CSS Not Applied**
   - **Przyczyna:** Cross-origin iframe + CORS
   - **Status:** ❌ Nie rozwiązane

### Błędy StackBlitz

1. **Import Error**
   ```
   Attempted import error: 'embedProject' is not exported from '@stackblitz/sdk'
   ```
   - **Przyczyna:** Next.js miał problemy z bundlowaniem pakietu
   - **Rozwiązanie:** Dynamic import

2. **Connection Timeout**
   ```
   Timeout: Unable to establish a connection with the StackBlitz VM
   ```
   - **Przyczyna:** StackBlitz wymaga SharedArrayBuffer + COOP/COEP + HTTPS
   - **Status:** ❌ Nie rozwiązane (fallback do React Live)

---

## ✅ Co Działa

1. **React Live Renderer**
   - ✅ Renderuje komponenty
   - ✅ CSS jest aplikowany (działa w tym samym origin)
   - ✅ Live editing
   - ⚠️ Wymaga ręcznego czyszczenia TypeScript

2. **API Endpoints**
   - ✅ `/api/bundle` - bundluje `@fragment_ui/ui` do ESM
   - ✅ `/api/bundle-css` - bundluje CSS z tokens i UI styles
   - ✅ Działa poprawnie

3. **Code Generation**
   - ✅ OpenAI API integration
   - ✅ Rule-based parsing
   - ✅ Hybrid approach (proste → rule-based, złożone → OpenAI)

---

## ❌ Co Nie Działa

1. **CSS w Sandpack Preview**
   - ❌ CSS nie jest aplikowany z powodu CORS
   - ❌ Wszystkie próby CSS injection nie działają

2. **StackBlitz Connection**
   - ❌ Timeout przy łączeniu z VM
   - ❌ Wymaga SharedArrayBuffer (może nie być dostępny)

---

## 🎯 Obecny Stan

### Działające Rozwiązanie
**React Live** jest obecnie używany jako główne rozwiązanie:
- ✅ Działa stabilnie
- ✅ CSS jest aplikowany
- ⚠️ Wymaga ręcznego czyszczenia TypeScript
- ⚠️ Nie jest idealne, ale działa

### Fallback
**StackBlitz** ma fallback do React Live:
- Jeśli `SharedArrayBuffer` nie jest dostępny → React Live
- Jeśli StackBlitz nie może się połączyć → React Live

### Sandpack
- Nadal dostępny jako opcja
- Może być użyty w przyszłości, jeśli uda się rozwiązać problem z CSS

---

## 💡 Wnioski i Rekomendacje

### Krótkoterminowe (Obecne)
1. **Użyj React Live** jako głównego rozwiązania
   - Działa stabilnie
   - CSS jest aplikowany
   - Wymaga poprawy TypeScript stripping (użyć Babel zamiast regex)

2. **Popraw TypeScript Stripping**
   - Użyj Babel do usuwania TypeScript zamiast regex
   - Będzie bardziej niezawodne

### Średnioterminowe
1. **Przetestuj StackBlitz na HTTPS**
   - Może działać w produkcji z HTTPS
   - Wymaga testów

2. **Rozważ alternatywne rozwiązania**
   - Monaco Editor + iframe z bundle
   - Dynamic imports + Server Components

### Długoterminowe
1. **Publikacja `@fragment_ui/ui` na npm**
   - Umożliwi użycie Sandpack bez custom bundlera
   - Może rozwiązać problemy z CSS

2. **Self-hosted Sandpack bundler**
   - Pełna kontrola nad bundlerem
   - Może rozwiązać problemy z CSS

---

## 📝 Pliki Dokumentacji

- `/apps/demo/docs/AI_PLAYGROUND_ANALYSIS.md` - Analiza problemów
- `/apps/demo/docs/SOLUTION_RECOMMENDATIONS.md` - Rekomendacje rozwiązań
- `/apps/demo/docs/CSS_STYLING_ANALYSIS.md` - Analiza problemów z CSS
- `/apps/demo/docs/STACKBLITZ_ANALYSIS.md` - Analiza StackBlitz
- `/apps/demo/docs/STACKBLITZ_IMPLEMENTATION.md` - Implementacja StackBlitz
- `/apps/demo/docs/STACKBLITZ_ISSUES.md` - Problemy ze StackBlitz

---

## 🔄 Historia Zmian

1. **Początkowo:** React Live z ręcznym czyszczeniem TypeScript
2. **Eksperyment 1:** Próba poprawy TypeScript stripping (regex)
3. **Eksperyment 2:** Przejście na Sandpack (CSS nie działa)
4. **Eksperyment 3:** Próba StackBlitz (timeout)
5. **Obecnie:** React Live z fallback do StackBlitz

---

## 🎓 Wnioski Techniczne

1. **Cross-origin iframe = problemy z CSS**
   - Sandpack używa cross-origin iframe
   - CORS blokuje manipulację DOM
   - CSS injection nie działa

2. **WebContainers wymagają SharedArrayBuffer**
   - StackBlitz wymaga COOP/COEP headers
   - Może nie działać w niektórych środowiskach
   - Wymaga HTTPS w produkcji

3. **TypeScript stripping jest trudne**
   - Regex jest podatny na błędy
   - Babel może być lepszym rozwiązaniem
   - Ale nadal wymaga konfiguracji

4. **Lokalne pakiety są skomplikowane**
   - Wymagają custom bundlera
   - Wymagają transformacji importów
   - Może być problematyczne

---

## ✅ Następne Kroki

1. **Popraw TypeScript stripping w React Live**
   - Użyj Babel do usuwania TypeScript
   - Będzie bardziej niezawodne niż regex

2. **Przetestuj StackBlitz na HTTPS**
   - Może działać w produkcji
   - Wymaga testów

3. **Rozważ publikację `@fragment_ui/ui` na npm**
   - Umożliwi użycie Sandpack bez custom bundlera
   - Może rozwiązać problemy z CSS

4. **Dokumentuj edge cases**
   - Zbierz wszystkie edge cases z TypeScript
   - Stwórz testy dla nich

---

## 📊 Statystyki

- **Eksperymenty:** 3 (React Live, Sandpack, StackBlitz)
- **Błędy naprawione:** ~15
- **Błędy nienaprawione:** 2 (CSS w Sandpack, StackBlitz timeout)
- **Czas implementacji:** ~2 tygodnie
- **Linie kodu dodane:** ~2000+
- **Linie kodu usunięte:** ~500+

---

## 🎯 Podsumowanie

**Obecne rozwiązanie (React Live) działa, ale nie jest idealne:**
- ✅ Renderuje komponenty
- ✅ CSS jest aplikowany
- ⚠️ Wymaga ręcznego czyszczenia TypeScript
- ⚠️ Nie jest skalowalne

**Sandpack i StackBlitz mają potencjał, ale:**
- ❌ Sandpack: Problem z CSS (CORS)
- ❌ StackBlitz: Problem z połączeniem (timeout)

**Rekomendacja:** Kontynuuj z React Live, ale popraw TypeScript stripping używając Babel zamiast regex.

