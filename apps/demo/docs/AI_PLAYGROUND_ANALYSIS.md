# Analiza AI Playground - Obecna Sytuacja i Rekomendacje

## 🔴 Obecne Problemy

### 1. React Live + TypeScript = Ciągłe Błędy

**Problem:**
- React Live nie obsługuje TypeScript natywnie
- Musimy ręcznie usuwać wszystkie TypeScript syntax przez regex
- To jest **bardzo podatne na błędy** i wymaga ciągłych poprawek

**Przykłady błędów:**
- `export default function Component({ prop }: Type)` - type annotation w parametrach
- `interface Props { ... }` - interface definitions
- `const value: string = "test"` - type annotations w zmiennych
- `useState<Type>()` - generic types
- `React.FormEvent<HTMLFormElement>` - złożone typy

**Obecne rozwiązanie:**
- 200+ linii regex do usuwania typów
- Ciągłe poprawki i edge cases
- **To nie jest skalowalne rozwiązanie**

### 2. Błędy w Renderowaniu

**Problemy:**
- Babel transpilation fails → fallback do ręcznego parsowania
- Component name detection nie działa poprawnie
- Scope issues (brakujące komponenty)
- Type errors w runtime

### 3. Ograniczenia React Live

- Nie obsługuje TypeScript
- Ograniczone error handling
- Problemy z niektórymi składniami React
- Wymaga ręcznego zarządzania scope

## ✅ Dostępne Rozwiązania

### Opcja 1: Sandpack (NAJLEPSZE) ⭐⭐⭐⭐⭐

**Status:** ✅ Komponent już istnieje (`sandpack-renderer.tsx`)

**Zalety:**
- ✅ **Natywne wsparcie TypeScript** - zero ręcznego czyszczenia kodu
- ✅ Profesjonalne narzędzie (CodeSandbox)
- ✅ Live editing i preview
- ✅ Syntax highlighting
- ✅ Lepsze error handling
- ✅ Eksport do CodeSandbox
- ✅ Hot reload

**Problem:**
- ⚠️ Wymaga `@fragment_ui/ui` na npm lub custom bundler

**Rozwiązanie problemu:**

#### A) Publikacja lokalnego pakietu przez Custom Bundler

```typescript
// apps/demo/app/api/bundle/route.ts
import { build } from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  // Bundle @fragment_ui/ui do UMD
  const result = await build({
    entryPoints: [path.join(process.cwd(), '../../packages/ui/src/index.ts')],
    bundle: true,
    format: 'esm',
    outfile: 'fragment-ui.js',
    external: ['react', 'react-dom'],
  });

  return new Response(result.outputFiles[0].text, {
    headers: { 'Content-Type': 'application/javascript' },
  });
}
```

```tsx
// apps/demo/src/components/sandpack-renderer.tsx
<Sandpack
  customSetup={{
    bundlerURL: "http://localhost:3002/api/bundle",
    dependencies: {
      "@fragment_ui/ui": "file:/api/bundle",
    },
  }}
/>
```

#### B) Użycie lokalnego CDN (najprostsze)

```typescript
// apps/demo/next.config.mjs
export default {
  async rewrites() {
    return [
      {
        source: '/fragment-ui/:path*',
        destination: '/api/bundle/:path*',
      },
    ];
  },
};
```

### Opcja 2: Poprawa React Live (PLASTER) ⭐⭐

**Status:** ⚠️ Obecne rozwiązanie

**Co można poprawić:**
1. Użycie Babel do usuwania typów zamiast regex
2. Lepsze error handling
3. Fallback do Sandpack gdy React Live fails

**Problem:**
- To nadal będzie miało ograniczenia
- Wymaga ciągłej konserwacji

### Opcja 3: Dynamic Imports + Server Components ⭐⭐⭐⭐

**Status:** ❌ Nie zaimplementowane

**Zalety:**
- ✅ Używa prawdziwych komponentów (nie transpilacji)
- ✅ Type-safe
- ✅ Najszybsze
- ✅ Zero problemów z escapowaniem

**Wady:**
- ⚠️ Wymaga bundlingu (esbuild/webpack)
- ⚠️ Większa złożoność

## 🎯 Rekomendacja

### Krótkoterminowe (1-2 dni)

**Przejście na Sandpack z lokalnym bundlerem:**

1. **Stwórz API endpoint do bundlowania `@fragment_ui/ui`:**
   ```typescript
   // apps/demo/app/api/bundle/route.ts
   import { build } from 'esbuild';
   import * as path from 'path';
   
   export async function GET() {
     const uiPath = path.join(process.cwd(), '../../packages/ui/src/index.ts');
     
     const result = await build({
       entryPoints: [uiPath],
       bundle: true,
       format: 'esm',
       platform: 'browser',
       external: ['react', 'react-dom'],
     });
     
     return new Response(result.outputFiles[0].text, {
       headers: { 'Content-Type': 'application/javascript' },
     });
   }
   ```

2. **Zaktualizuj SandpackRenderer:**
   ```tsx
   <Sandpack
     customSetup={{
       bundlerURL: "http://localhost:3002/api/bundle",
     }}
   />
   ```

3. **Zastąp ReactLiveRenderer w playground:**
   ```tsx
   // apps/demo/app/playground/page.tsx
   import { SandpackPreview, SandpackCodeEditor } from "@/components/sandpack-renderer";
   
   // Zamiast ReactLiveRenderer użyj:
   <SandpackPreview code={code} />
   ```

4. **Usuń całą logikę czyszczenia kodu** - Sandpack obsługuje TypeScript natywnie!

### Długoterminowe (opcjonalne)

1. **Publikacja `@fragment_ui/ui` na npm** (dla produkcji)
2. **Hybrid approach:** Proste prompty → rule-based, złożone → OpenAI
3. **Optymalizacja kosztów OpenAI** (użyj GPT-3.5 dla prostych przypadków)

## 📊 Porównanie

| Rozwiązanie | TypeScript | Niezawodność | Złożoność | Czas implementacji |
|------------|------------|--------------|-----------|-------------------|
| **React Live (obecne)** | ❌ Ręczne | ⭐⭐ | ⭐⭐⭐⭐⭐ | - |
| **Sandpack + Local Bundle** | ✅ Natywne | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 1-2 dni |
| **Sandpack + npm** | ✅ Natywne | ⭐⭐⭐⭐⭐ | ⭐⭐ | 0.5 dnia |
| **Dynamic Imports** | ✅ Natywne | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 3-5 dni |

## 🚀 Plan Działania

### Krok 1: Stwórz Bundler API (2h)

```typescript
// apps/demo/app/api/bundle/route.ts
import { build } from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';

export async function GET() {
  try {
    const uiIndex = path.join(
      process.cwd(),
      '../../packages/ui/src/index.ts'
    );
    
    if (!fs.existsSync(uiIndex)) {
      return new Response('UI package not found', { status: 404 });
    }

    const result = await build({
      entryPoints: [uiIndex],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      jsx: 'automatic',
      external: ['react', 'react-dom'],
      write: false,
    });

    return new Response(result.outputFiles[0].text, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Bundle error:', error);
    return new Response(`Bundle error: ${error}`, { status: 500 });
  }
}
```

### Krok 2: Zaktualizuj SandpackRenderer (1h)

```tsx
// apps/demo/src/components/sandpack-renderer.tsx
export function SandpackPreview({ code }: { code: string }) {
  return (
    <Sandpack
      template="react-ts"
      theme="dark"
      files={{
        "/App.tsx": code,
        "/index.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);`,
      }}
      customSetup={{
        dependencies: {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
        },
        // Custom bundler URL dla lokalnego pakietu
        bundlerURL: typeof window !== 'undefined' 
          ? `${window.location.origin}/api/bundle`
          : undefined,
      }}
      options={{
        showNavigator: false,
        showTabs: false,
        editorHeight: 0,
      }}
    />
  );
}
```

### Krok 3: Zastąp ReactLiveRenderer (30min)

```tsx
// apps/demo/app/playground/page.tsx
import { SandpackPreview, SandpackCodeEditor } from "@/components/sandpack-renderer";

// W Preview tab:
<TabsContent value="preview">
  {code ? (
    <SandpackPreview code={code} />
  ) : (
    // Empty state
  )}
</TabsContent>

// W Code tab:
<TabsContent value="code">
  {code ? (
    <SandpackCodeEditor code={code} />
  ) : (
    // Empty state
  )}
</TabsContent>
```

### Krok 4: Usuń React Live (opcjonalne)

Możesz zachować jako fallback, ale Sandpack powinien działać lepiej.

## 💡 Alternatywne Podejście: Lepszy Babel Transform

Jeśli nie chcesz używać Sandpack, możemy użyć Babel do transformacji TypeScript:

```typescript
// apps/demo/src/components/react-live-renderer.tsx
import * as Babel from "@babel/standalone";

function cleanTypeScript(code: string): string {
  // Użyj Babel do usunięcia TypeScript
  const result = Babel.transform(code, {
    presets: [
      ["typescript", { isTSX: true, allExtensions: true }],
      ["react", { runtime: "automatic" }],
    ],
    plugins: [
      // Usuń type annotations
      ["@babel/plugin-transform-typescript", { 
        isTSX: true,
        allowNamespaces: true,
      }],
    ],
  });
  
  return result.code || code;
}
```

**Ale to nadal będzie miało problemy z niektórymi składniami.**

## ❓ Pytania

1. **Czy możesz zainstalować `esbuild`?** (wymagane dla bundlera)
2. **Czy chcesz zachować React Live jako fallback?**
3. **Czy planujesz publikację `@fragment_ui/ui` na npm?**

## 🎯 Moja Rekomendacja

**Przejdź na Sandpack z lokalnym bundlerem:**
- ✅ Rozwiązuje wszystkie problemy z TypeScript
- ✅ Profesjonalne narzędzie
- ✅ Szybka implementacja (1-2 dni)
- ✅ Zero ręcznego czyszczenia kodu
- ✅ Lepsze UX dla użytkowników

**To jest najlepsze długoterminowe rozwiązanie.**

