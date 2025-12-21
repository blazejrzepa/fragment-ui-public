# Plan Implementacji - AI Playground Ulepszenia

## Priorytety Implementacji

### Faza 1: React Live (MVP) - 1-2 dni ⭐
**Cel**: Szybka poprawa UX z minimalnym wysiłkiem

### Faza 2: Sandpack (Produkcja) - 3-5 dni ⭐⭐
**Cel**: Profesjonalna, pełnofunkcjonalna implementacja

### Faza 3: Dynamic Imports (Opcjonalna optymalizacja) - 2-3 dni
**Cel**: Maksymalna wydajność i type safety

---

## Faza 1: React Live (MVP)

### Krok 1.1: Instalacja zależności
```bash
cd apps/demo
pnpm add react-live prism-react-renderer
pnpm add -D @types/react-live
```

### Krok 1.2: Stwórz ReactLiveComponent
**Plik**: `apps/demo/src/components/react-live-renderer.tsx`

```tsx
"use client";

import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import * as FragmentUI from "@fragment_ui/ui";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";

interface ReactLiveRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

export function ReactLiveRenderer({ code, onError }: ReactLiveRendererProps) {
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
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveEditor 
              style={{
                fontFamily: "Monaco, Consolas, monospace",
                fontSize: 14,
                minHeight: "400px",
              }}
            />
            <LiveError 
              style={{
                color: "var(--color-status-error-base)",
                padding: "8px",
                marginTop: "8px",
                borderRadius: "4px",
                backgroundColor: "var(--color-surface-1)",
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white dark:bg-[color:var(--color-surface-base)]">
              <LivePreview />
            </div>
          </CardContent>
        </Card>
      </div>
    </LiveProvider>
  );
}
```

### Krok 1.3: Zintegruj z playground ✅ UKOŃCZONE
**Plik**: `apps/demo/app/playground/page.tsx`

✅ Zastąpiono `DynamicComponentRenderer` przez `ReactLiveRenderer`

### Krok 1.4: Testowanie ✅ UKOŃCZONE
- [x] Sprawdź czy komponenty renderują się poprawnie
- [x] Sprawdź czy błędy są wyświetlane
- [x] Sprawdź czy live editing działa
- [x] Sprawdź czy wszystkie komponenty Fragment UI są dostępne

---

## Faza 2: Sandpack (Produkcja)

### Krok 2.1: Instalacja zależności
```bash
cd apps/demo
pnpm add @codesandbox/sandpack-react
```

### Krok 2.2: Stwórz SandpackComponent
**Plik**: `apps/demo/src/components/sandpack-renderer.tsx`

```tsx
"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { SandpackThemeProp } from "@codesandbox/sandpack-react/dist/types";
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";

interface SandpackRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

const sandpackTheme: SandpackThemeProp = {
  colors: {
    surface1: "var(--color-surface-1)",
    surface2: "var(--color-surface-2)",
    surface3: "var(--color-surface-2)",
    disabled: "var(--color-fg-muted)",
    base: "var(--color-fg-base)",
    clickable: "var(--color-brand-primary)",
    hover: "var(--color-brand-primary)",
    accent: "var(--color-brand-primary)",
    error: "var(--color-status-error-base)",
    errorSurface: "var(--color-surface-1)",
    warning: "#F59E0B",
    warningSurface: "var(--color-surface-1)",
  },
  syntax: {
    plain: "var(--color-fg-base)",
    comment: "var(--color-fg-muted)",
    keyword: "#C678DD",
    tag: "#E06C75",
    punctuation: "var(--color-fg-base)",
    definition: "#61AFEF",
    property: "#56B6C2",
    string: "#98C379",
  },
  font: {
    body: "Geist, system-ui, sans-serif",
    mono: "Monaco, Consolas, monospace",
    size: "14px",
    lineHeight: "1.6",
  },
};

export function SandpackRenderer({ code, onError }: SandpackRendererProps) {
  // Extract imports and component code
  const imports = code.match(/import\s+.*?from\s+["'][^"']+["'];?\s*\n?/g)?.join("\n") || "";
  const componentCode = code.replace(/import\s+.*?from\s+["'][^"']+["'];?\s*\n?/g, "").trim();

  const files = {
    "/App.tsx": `${imports}\n\nexport default function App() {\n${componentCode}\n}`,
    "/package.json": JSON.stringify({
      dependencies: {
        "@fragment_ui/ui": "workspace:*",
        "react": "^18.3.0",
        "react-dom": "^18.3.0",
      },
    }),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Editor & Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Sandpack
          template="react-ts"
          files={files}
          theme={sandpackTheme}
          options={{
            showNavigator: true,
            showTabs: true,
            editorHeight: "500px",
            editorWidthPercentage: 50,
            wrapContent: true,
            closableTabs: false,
          }}
          customSetup={{
            dependencies: {
              "@fragment_ui/ui": "workspace:*",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
```

### Krok 2.3: Dodaj funkcję eksportu do CodeSandbox
**Plik**: `apps/demo/src/components/sandpack-renderer.tsx`

```tsx
import { getSandpackCssText } from "@codesandbox/sandpack-react";

export function exportToCodeSandbox(code: string) {
  const files = {
    "App.tsx": code,
    "package.json": JSON.stringify({
      dependencies: {
        "@fragment_ui/ui": "latest",
        "react": "^18.3.0",
        "react-dom": "^18.3.0",
      },
    }),
  };

  const parameters = {
    files: Object.entries(files).reduce((acc, [path, content]) => {
      acc[path] = { content };
      return acc;
    }, {} as Record<string, { content: string }>),
  };

  const url = `https://codesandbox.io/api/v1/sandboxes/define?json=1&parameters=${encodeURIComponent(JSON.stringify(parameters))}`;
  
  window.open(url, "_blank");
}
```

### Krok 2.4: Zintegruj z playground
Zastąp `ReactLiveRenderer` na `SandpackRenderer` w `playground/page.tsx`

### Krok 2.5: Testowanie
- [ ] Sprawdź czy Sandpack ładuje się poprawnie
- [ ] Sprawdź czy komponenty renderują się
- [ ] Sprawdź czy live editing działa
- [ ] Sprawdź czy eksport do CodeSandbox działa
- [ ] Sprawdź czy theme jest poprawnie zastosowany

---

## Faza 3: Dynamic Imports (Opcjonalna)

### Krok 3.1: Zbadaj możliwości
- [ ] Sprawdź czy Next.js App Router wspiera dynamic imports z data URLs
- [ ] Sprawdź czy można użyć Server Components do renderowania
- [ ] Sprawdź czy można cache'ować wygenerowany kod

### Krok 3.2: Stwórz Server Component
**Plik**: `apps/demo/app/api/preview/route.ts`

```tsx
import { NextRequest, NextResponse } from "next/server";
import { renderToString } from "react-dom/server";
import * as FragmentUI from "@fragment_ui/ui";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    // Dynamic import z data URL (wymaga webpack config)
    // Lub użyj esbuild do bundlowania
    
    // Render jako Server Component
    const html = renderToString(/* component */);
    
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

### Krok 3.3: Zaimplementuj bundling
- [ ] Użyj esbuild do bundlowania wygenerowanego kodu
- [ ] Dodaj cache dla zbudowanych bundle'ów
- [ ] Zoptymalizuj dla production

---

## Cleanup

### Krok 4.1: Usuń stary kod ✅ UKOŃCZONE
- [x] Usuń `/api/render` endpoint ✅
- [x] Usuń `DynamicComponentRenderer` component ✅
- [x] Usuń mock komponenty z render route ✅ (usunięte wraz z endpointem)
- [x] Usuń Babel transpilację ✅ (Babel jest teraz używany tylko w ReactLiveRenderer dla transpilacji TypeScript)

### Krok 4.2: Zaktualizuj dokumentację ✅ UKOŃCZONE
- [x] Zaktualizuj README z nową architekturą ✅
- [x] Dodaj przykłady użycia ✅
- [x] Zaktualizuj ARCHITECTURE_ANALYSIS.md ✅

---

## Harmonogram

### Tydzień 1: React Live (MVP)
- **Dzień 1**: Instalacja + implementacja podstawowa
- **Dzień 2**: Integracja + testowanie + cleanup

### Tydzień 2: Sandpack (Produkcja)
- **Dzień 1-2**: Instalacja + implementacja
- **Dzień 3**: Eksport do CodeSandbox
- **Dzień 4**: Theme + styling
- **Dzień 5**: Testowanie + optymalizacja

### Tydzień 3: Dynamic Imports (Opcjonalna)
- **Dzień 1**: Research + proof of concept
- **Dzień 2-3**: Implementacja + optymalizacja

---

## Decyzje do podjęcia

1. **Którą fazę implementować najpierw?**
   - Rekomendacja: Faza 1 (React Live) dla szybkiej poprawy

2. **Czy implementować wszystkie fazy?**
   - Rekomendacja: Faza 1 + Faza 2 (Sandpack dla produkcji)

3. **Czy zachować starą implementację jako fallback?**
   - Rekomendacja: Nie, usuń po migracji

4. **Jak obsłużyć bundle size?**
   - Rekomendacja: Code splitting dla Sandpack

---

## Metryki sukcesu

- ✅ Komponenty renderują się poprawnie (100% przypadków)
- ✅ Brak błędów escapowania
- ✅ Live editing działa
- ✅ Type safety dla wygenerowanego kodu
- ✅ Bundle size < 600KB (Sandpack)
- ✅ Czas renderowania < 500ms

