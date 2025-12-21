# Analiza Problemu z Importami CSS - react-day-picker/dist/style.css

## 📋 Podsumowanie Problemu

**Błąd:**
```
TypeError: Failed to resolve module specifier "react-day-picker/dist/style.css". 
Relative references must start with either "/", "./", or "../".
```

**Gdzie występuje:**
- W iframe preview podczas renderowania komponentów
- Występuje nawet dla prostych komponentów (np. Button), które nie używają DatePicker
- Problem jest w bundlu `@fragment_ui/ui`, który zawiera import CSS z `react-day-picker`

## 🔍 Analiza Przyczyny

### 1. Źródło Problemu

Import CSS znajduje się w komponentach Fragment UI:
- `packages/ui/src/date-picker.tsx` - linia 11: `import "react-day-picker/dist/style.css";`
- `packages/ui/src/calendar.tsx` - linia 7: `import "react-day-picker/dist/style.css";`

### 2. Przepływ Błędu

1. Użytkownik generuje kod używający `@fragment_ui/ui`
2. Kod jest bundlowany przez `worker.js` (esbuild-wasm)
3. Bundlowany kod importuje `@fragment_ui/ui` przez import map: `"@fragment_ui/ui": "/api/bundle"`
4. `/api/bundle` zwraca bundle `@fragment_ui/ui` utworzony przez esbuild
5. **Problem:** Bundle `@fragment_ui/ui` zawiera import CSS: `import "react-day-picker/dist/style.css"`
6. Gdy bundle jest ładowany w iframe, przeglądarka próbuje zaimportować CSS
7. Import CSS w ESM wymaga pełnej ścieżki (z `/`, `./` lub `../`)
8. `react-day-picker/dist/style.css` nie zaczyna się od `/`, `./` ani `../`, więc przeglądarka rzuca błąd

### 3. Dlaczego Plugin Esbuild Nie Działa?

**Zaimplementowane rozwiązania:**

1. **Plugin w `/api/bundle`** (`apps/demo/app/api/bundle/route.ts`):
   ```javascript
   {
     name: "remove-css-imports",
     setup(build) {
       build.onResolve({ filter: /\.css$/ }, (args) => {
         return { path: "", namespace: "css-stub" };
       });
       build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
         if (args.path.endsWith('.css') || args.path.includes('/style.css')) {
           return { path: "", namespace: "css-stub" };
         }
         return undefined;
       });
       build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => ({
         contents: "",
         loader: "js"
       }));
     }
   }
   ```

2. **Post-processing w `/api/bundle`**:
   - Usuwanie importów CSS przez regex
   - Agresywne czyszczenie w pętli (do 50 prób)
   - Usuwanie `.css` z wszystkich kontekstów

3. **Plugin w `worker.js`**:
   - Podobny plugin do usuwania CSS
   - Pre-processing i post-processing

4. **Import Map w `iframe.html`**:
   ```html
   "react-day-picker/dist/style.css": "data:text/javascript,export{}",
   ```

**Dlaczego nie działa:**

1. **Side-effect imports:** `import "react-day-picker/dist/style.css"` jest side-effect importem, który jest wykonywany synchronicznie podczas ładowania modułu
2. **Timing:** Błąd występuje podczas importu bundla `@fragment_ui/ui`, zanim nasz kod może go przechwycić
3. **Esbuild może nie przechwytywać wszystkich przypadków:** Import CSS może być w zależnościach bundlowanych przez esbuild
4. **Bundle może zawierać import CSS jako string:** Esbuild może generować kod, który zawiera import CSS jako string, który nie jest przechwytywany przez plugin

## 🛠️ Zaimplementowane Rozwiązania

### 1. Worker.js/Worker.ts
- ✅ Naprawiono przedwczesny return
- ✅ Dodano a11y check z axe-core
- ✅ Dodano obsługę react/jsx-runtime
- ✅ Dodano plugin do usuwania CSS
- ✅ Dodano pre-processing i post-processing CSS
- ✅ Dodano error handling dla CSS importów

### 2. /api/bundle Route
- ✅ Dodano plugin do usuwania CSS
- ✅ Dodano agresywne czyszczenie CSS w pętli
- ✅ Dodano post-processing CSS
- ✅ Dodano logowanie dla debugowania

### 3. iframe.html
- ✅ Dodano import map dla CSS
- ✅ Zaktualizowano import map dla react/jsx-runtime

### 4. Import Map
- ✅ Dodano mapowanie dla `react-day-picker/dist/style.css`

## ❌ Co Nie Działa

1. **Plugin esbuild nie przechwytuje wszystkich importów CSS**
   - Może nie działać dla side-effect imports
   - Może nie działać dla importów w zależnościach

2. **Post-processing nie usuwa wszystkich referencji**
   - Import CSS może być w różnych formatach
   - Może być w minifikowanym kodzie

3. **Import Map nie działa**
   - Błąd występuje przed sprawdzeniem import map
   - Import CSS jest wykonywany synchronicznie

4. **Error handling w worker.js nie pomaga**
   - Błąd występuje podczas importu bundla, nie podczas renderowania
   - Nie można przechwycić błędu przed jego wystąpieniem

## 💡 Możliwe Rozwiązania

### Rozwiązanie 1: Usunąć Import CSS z Komponentów (Najlepsze)

**Opis:** Usunąć `import "react-day-picker/dist/style.css"` z `date-picker.tsx` i `calendar.tsx`

**Zalety:**
- Rozwiązuje problem u źródła
- Nie wymaga skomplikowanych workaroundów
- Bundle nie będzie zawierał importów CSS

**Wady:**
- Style `react-day-picker` nie będą dostępne
- Trzeba będzie dodać style ręcznie lub przez CDN

**Implementacja:**
```typescript
// packages/ui/src/date-picker.tsx
// Usunąć: import "react-day-picker/dist/style.css";
// Dodać komentarz: // CSS is loaded via CDN or manually
```

### Rozwiązanie 2: Warunkowy Import CSS

**Opis:** Importować CSS tylko w środowisku Node.js (SSR), nie w przeglądarce

**Implementacja:**
```typescript
if (typeof window === 'undefined') {
  require("react-day-picker/dist/style.css");
}
```

**Zalety:**
- CSS będzie dostępny w SSR
- Nie będzie problemu w przeglądarce

**Wady:**
- Style nie będą dostępne w przeglądarce
- Trzeba będzie dodać style ręcznie

### Rozwiązanie 3: Dynamic Import CSS w Runtime

**Opis:** Ładować CSS dynamicznie w runtime, nie przez import

**Implementacja:**
```typescript
useEffect(() => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/react-day-picker@9.11.1/dist/style.css';
    document.head.appendChild(link);
  }
}, []);
```

**Zalety:**
- CSS będzie dostępny
- Nie będzie problemu z importem

**Wady:**
- Wymaga dodatkowego kodu
- CSS jest ładowany asynchronicznie

### Rozwiązanie 4: Lepszy Plugin Esbuild

**Opis:** Stworzyć bardziej agresywny plugin, który przechwytuje wszystkie możliwe formaty importów CSS

**Implementacja:**
```javascript
{
  name: "remove-css-imports-aggressive",
  setup(build) {
    // Przechwyć wszystkie możliwe formaty
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.path.endsWith('.css') || 
          args.path.includes('/style.css') ||
          args.path.includes('react-day-picker/dist/style.css')) {
        return { path: "", namespace: "css-stub" };
      }
    });
  }
}
```

**Zalety:**
- Może przechwycić więcej przypadków

**Wady:**
- Może nie działać dla wszystkich formatów
- Może wpływać na inne importy

### Rozwiązanie 5: Przetransformować Bundle Przed Zwróceniem

**Opis:** Po bundlowaniu, przetransformować bundle i usunąć wszystkie importy CSS

**Implementacja:**
```javascript
let bundledCode = result.outputFiles[0].text;

// Bardzo agresywne usuwanie
bundledCode = bundledCode.replace(
  /import\s+["'][^"']*react-day-picker[^"']*style\.css["'];?\n?/g,
  ''
);
// I wiele innych regexów...
```

**Zalety:**
- Może usunąć wszystkie referencje

**Wady:**
- Może usunąć za dużo (np. w stringach)
- Może być nieefektywne

### Rozwiązanie 6: Użyć Innego Bundlera

**Opis:** Użyć innego bundlera, który lepiej obsługuje CSS

**Opcje:**
- Vite
- Rollup
- Webpack

**Zalety:**
- Może lepiej obsługiwać CSS

**Wady:**
- Wymaga dużych zmian
- Może nie działać w przeglądarce (esbuild-wasm)

## 🎯 Rekomendowane Rozwiązanie

**Najlepsze rozwiązanie: Rozwiązanie 1 + Rozwiązanie 3**

1. **Usunąć import CSS z komponentów** (`date-picker.tsx`, `calendar.tsx`)
2. **Dodać dynamiczne ładowanie CSS w runtime** w komponentach, które go potrzebują
3. **Dodać CSS do `/api/bundle-css`** lub ładować z CDN

**Implementacja:**

```typescript
// packages/ui/src/date-picker.tsx
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
// USUNĄĆ: import "react-day-picker/dist/style.css";

// Dodać hook do ładowania CSS
function useDayPickerStyles() {
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingLink = document.getElementById('react-day-picker-styles');
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'react-day-picker-styles';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/react-day-picker@9.11.1/dist/style.css';
        document.head.appendChild(link);
      }
    }
  }, []);
}

export const DatePicker = React.forwardRef(function DatePicker(props, ref) {
  useDayPickerStyles(); // Dodaj hook
  
  // ... reszta kodu
});
```

**Alternatywnie:** Dodać CSS do `/api/bundle-css` i ładować go razem z innymi stylami Fragment UI.

## 📝 Następne Kroki

1. **Krótkoterminowe (Workaround):**
   - Dodać lepsze error handling w worker.js
   - Kontynuować renderowanie mimo błędu CSS (komponenty powinny działać bez stylów)

2. **Średnioterminowe (Częściowe rozwiązanie):**
   - Usunąć import CSS z komponentów
   - Dodać dynamiczne ładowanie CSS

3. **Długoterminowe (Pełne rozwiązanie):**
   - Dodać CSS do `/api/bundle-css`
   - Upewnić się, że wszystkie style są dostępne w preview

## 🔗 Powiązane Pliki

- `apps/demo/app/api/bundle/route.ts` - Bundle endpoint
- `apps/demo/app/playground/runtime/worker.ts` - Worker dla iframe
- `apps/demo/public/playground/runtime/worker.js` - Skompilowany worker
- `apps/demo/app/playground/runtime/iframe.html` - HTML iframe
- `packages/ui/src/date-picker.tsx` - Komponent z importem CSS
- `packages/ui/src/calendar.tsx` - Komponent z importem CSS

## 📊 Status

- ✅ Worker.js/Worker.ts - Naprawione i zsynchronizowane
- ✅ /api/bundle - Plugin dodany, ale nie działa w 100%
- ✅ iframe.html - Import map dodany
- ❌ Problem z CSS importami - **NIE ROZWIĄZANY**

## 💭 Uwagi

Problem jest złożony, ponieważ:
1. Import CSS jest w bundlu `@fragment_ui/ui`
2. Bundle jest ładowany przez import map
3. Błąd występuje podczas importu, nie podczas renderowania
4. Nie można przechwycić błędu przed jego wystąpieniem

Najlepszym rozwiązaniem jest usunięcie importu CSS z komponentów i dodanie dynamicznego ładowania CSS w runtime.

