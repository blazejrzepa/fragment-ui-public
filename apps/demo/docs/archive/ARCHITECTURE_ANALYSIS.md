# Analiza Architektury AI Playground - Propozycje Ulepszeń

## Obecna Implementacja

### Flow
1. **Prompt** → `/api/generate` → **UI-DSL** → **Kod React**
2. **Kod** → `/api/render` → **Babel transpilacja** → **HTML z iframe**
3. **Iframe** → Mock komponenty FragmentUI → **Renderowanie**

### Problemy Obecnej Implementacji

#### 1. **Mock Komponenty zamiast Prawdziwych**
- ❌ Komponenty są ręcznie mockowane w iframe
- ❌ Brak dostępu do prawdziwych stylów, animacji, zachowań
- ❌ Trzeba ręcznie dodawać każdy nowy komponent
- ❌ Brak synchronizacji z rzeczywistymi komponentami

#### 2. **Skomplikowane Escapowanie**
- ❌ Problemy z regex, cudzysłowami, backslashami
- ❌ Podwójne/triple escapowanie
- ❌ Błędy składni w wygenerowanym kodzie
- ❌ Trudne w utrzymaniu

#### 3. **Babel Transpilacja po Stronie Serwera**
- ❌ Wolne (każde renderowanie = pełna transpilacja)
- ❌ Duże obciążenie serwera
- ❌ Problemy z TypeScript types
- ❌ Brak cache'owania

#### 4. **Iframe Sandboxing**
- ❌ Problemy z bezpieczeństwem (allow-scripts + allow-same-origin)
- ❌ Ograniczenia komunikacji parent ↔ iframe
- ❌ Problemy z CSS isolation
- ❌ Brak dostępu do React DevTools

#### 5. **Brak Type Safety**
- ❌ Wygenerowany kod nie jest sprawdzany przez TypeScript
- ❌ Błędy wykrywane dopiero w runtime
- ❌ Brak autocomplete w edytorze

---

## Proponowane Rozwiązania

### Opcja 1: **Dynamic Imports + Server Components** ⭐ (REKOMENDOWANE)

#### Architektura
```
Prompt → UI-DSL → Kod → Dynamic Import → Rzeczywiste Komponenty Fragment UI
```

#### Zalety
- ✅ Używa prawdziwych komponentów Fragment UI
- ✅ Automatyczna synchronizacja z design system
- ✅ Type-safe (TypeScript)
- ✅ Szybkie (Next.js Server Components)
- ✅ Brak problemów z escapowaniem
- ✅ Pełny dostęp do stylów i zachowań

#### Implementacja
```typescript
// app/api/generate/route.ts
export async function POST(request: NextRequest) {
  const { code } = await request.json();
  
  // Zamiast renderowania w iframe, używamy dynamic import
  const componentModule = await import(
    `data:text/javascript;base64,${btoa(code)}`
  );
  
  // Render jako Server Component
  return renderToString(componentModule.default);
}
```

#### Wymagania
- Next.js App Router
- Dynamic imports z data URLs (wymaga webpack config)
- Server-side rendering

---

### Opcja 2: **Sandpack Integration** ⭐⭐ (NAJLEPSZE UX)

#### Architektura
```
Prompt → UI-DSL → Kod → Sandpack Editor + Preview
```

#### Zalety
- ✅ Profesjonalne narzędzie (CodeSandbox)
- ✅ Live editing kodu
- ✅ Syntax highlighting
- ✅ Error handling
- ✅ Hot reload
- ✅ Możliwość eksportu do CodeSandbox
- ✅ Wsparcie dla TypeScript, CSS, etc.

#### Implementacja
```tsx
import { Sandpack } from "@codesandbox/sandpack-react";

<Sandpack
  template="react-ts"
  files={{
    "/App.tsx": generatedCode,
    "/package.json": JSON.stringify({
      dependencies: {
        "@fragment_ui/ui": "latest",
        "react": "^18.0.0"
      }
    })
  }}
  theme="dark"
  options={{
    showNavigator: true,
    showTabs: true,
    editorHeight: "500px"
  }}
/>
```

#### Wymagania
- `@codesandbox/sandpack-react` package
- ~500KB bundle size
- Wymaga CDN dla dependencies

---

### Opcja 3: **React Live / MDX** ⭐

#### Architektura
```
Prompt → UI-DSL → MDX → React Live → Live Preview
```

#### Zalety
- ✅ Live editing
- ✅ Syntax highlighting
- ✅ Error boundaries
- ✅ Lighter than Sandpack
- ✅ Integracja z MDX

#### Implementacja
```tsx
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import * as FragmentUI from "@fragment_ui/ui";

<LiveProvider 
  code={generatedCode}
  scope={{ ...FragmentUI, useState, useEffect }}
  theme="github"
>
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>
```

#### Wymagania
- `react-live` package
- Scope z komponentami Fragment UI
- ~100KB bundle size

---

### Opcja 4: **Web Components / Custom Elements**

#### Architektura
```
Prompt → UI-DSL → Web Component → Custom Element
```

#### Zalety
- ✅ Framework-agnostic
- ✅ Nativne wsparcie przeglądarki
- ✅ Izolacja CSS
- ✅ Możliwość użycia w różnych frameworkach

#### Wady
- ❌ Trzeba konwertować React → Web Components
- ❌ Ograniczenia React hooks
- ❌ Większa złożoność

---

### Opcja 5: **Monaco Editor + Iframe z Bundle**

#### Architektura
```
Prompt → UI-DSL → Kod → Bundle (esbuild) → Iframe z prawdziwymi komponentami
```

#### Zalety
- ✅ Profesjonalny edytor (VS Code)
- ✅ Prawdziwe komponenty w iframe
- ✅ Type checking
- ✅ IntelliSense

#### Implementacja
```typescript
// Bundle code with esbuild
import { build } from "esbuild";

const bundle = await build({
  entryPoints: ["virtual:component.tsx"],
  bundle: true,
  format: "iife",
  external: ["react", "react-dom"],
  plugins: [virtualComponentPlugin(generatedCode)]
});

// Load in iframe
iframe.contentWindow.eval(bundle.outputFiles[0].text);
```

---

## Porównanie Rozwiązań

| Rozwiązanie | Złożoność | Bundle Size | UX | Type Safety | Maintenance |
|------------|-----------|-------------|-----|-------------|-------------|
| **Obecne (Mock + Iframe)** | Wysoka | ~50KB | ⭐⭐ | ❌ | ❌❌❌ |
| **Dynamic Imports** | Średnia | ~10KB | ⭐⭐⭐ | ✅ | ⭐⭐⭐ |
| **Sandpack** | Niska | ~500KB | ⭐⭐⭐⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ |
| **React Live** | Niska | ~100KB | ⭐⭐⭐⭐ | ⚠️ | ⭐⭐⭐⭐ |
| **Web Components** | Wysoka | ~20KB | ⭐⭐⭐ | ⚠️ | ⭐⭐ |
| **Monaco + Bundle** | Wysoka | ~200KB | ⭐⭐⭐⭐⭐ | ✅ | ⭐⭐⭐ |

---

## Rekomendacja

### Dla MVP: **React Live** ⭐
- Szybka implementacja
- Dobra UX
- Niski bundle size
- Łatwe w utrzymaniu

### Dla Produkcji: **Sandpack** ⭐⭐
- Najlepsza UX
- Profesjonalne narzędzie
- Live editing
- Eksport do CodeSandbox
- Wsparcie społeczności

### Dla Optymalizacji: **Dynamic Imports + Server Components** ⭐
- Najszybsze
- Type-safe
- Używa prawdziwych komponentów
- Brak problemów z escapowaniem

---

## Plan Migracji

### Faza 1: React Live ✅ UKOŃCZONA
1. ✅ Zainstaluj `react-live`
2. ✅ Zastąp `DynamicComponentRenderer` komponentem React Live
3. ✅ Przekaż scope z komponentami Fragment UI
4. ✅ Usuń `/api/render` endpoint

### Faza 2: Sandpack (opcjonalnie, 3-5 dni)
1. Zainstaluj `@codesandbox/sandpack-react`
2. Zastąp React Live Sandpackiem
3. Dodaj możliwość eksportu do CodeSandbox
4. Dodaj live editing

### Faza 3: Optymalizacja (opcjonalnie)
1. Implementuj Server Components dla statycznych preview
2. Cache'uj wygenerowany kod
3. Dodaj TypeScript checking

---

## Przykład Implementacji z React Live

```tsx
// src/components/dynamic-component-renderer.tsx
"use client";

import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import * as FragmentUI from "@fragment_ui/ui";
import { useState, useEffect, useRef, useCallback } from "react";

interface DynamicComponentRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

export function DynamicComponentRenderer({ 
  code, 
  onError 
}: DynamicComponentRendererProps) {
  const scope = {
    ...FragmentUI,
    useState,
    useEffect,
    useRef,
    useCallback,
    React: require("react"),
  };

  return (
    <LiveProvider 
      code={code}
      scope={scope}
      theme="github"
      noInline={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <LiveEditor 
            style={{
              fontFamily: "Monaco, Consolas, monospace",
              fontSize: 14,
            }}
          />
          <LiveError />
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <LivePreview />
        </div>
      </div>
    </LiveProvider>
  );
}
```

---

## Podsumowanie

**Obecna implementacja** ma wiele problemów:
- Mock komponenty zamiast prawdziwych
- Skomplikowane escapowanie
- Problemy z bezpieczeństwem iframe
- Brak type safety

**Najlepsze rozwiązanie**: **Sandpack** dla produkcji lub **React Live** dla MVP.

**Korzyści**:
- ✅ Prawdziwe komponenty Fragment UI
- ✅ Live editing
- ✅ Type safety
- ✅ Profesjonalna UX
- ✅ Łatwiejsze utrzymanie

