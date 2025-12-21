# Analiza StackBlitz jako Rozwiązanie dla AI Playground

## 🎯 Dlaczego StackBlitz może być lepsze niż Sandpack?

### Kluczowa Różnica: WebContainers vs Cross-Origin Iframe

**Sandpack:**
- ❌ Działa w **cross-origin iframe** (`codesandbox.io`)
- ❌ **CORS blokuje** dostęp do iframe z parent frame
- ❌ **Nie możemy manipulować DOM** iframe z parent
- ❌ **CSS injection nie działa** z powodu CORS

**StackBlitz:**
- ✅ Działa w **WebContainers** (WebAssembly w przeglądarce)
- ✅ **Wszystko działa w tym samym origin** (lokalnie w przeglądarce)
- ✅ **Możemy manipulować DOM** bezpośrednio
- ✅ **CSS injection powinno działać** bez problemów z CORS

---

## 📊 Porównanie: StackBlitz vs Sandpack

| Feature | Sandpack | StackBlitz |
|---------|----------|------------|
| **Architektura** | Cross-origin iframe | WebContainers (WebAssembly) |
| **CORS Issues** | ❌ Tak (blokuje CSS injection) | ✅ Nie (wszystko lokalne) |
| **TypeScript Support** | ✅ Natywne | ✅ Natywne |
| **CSS Injection** | ❌ Nie działa (CORS) | ✅ Powinno działać |
| **Local Packages** | ⚠️ Wymaga bundlera | ✅ Może używać lokalnych plików |
| **Bundle Size** | ~500KB | ~200-300KB (lżejszy) |
| **Boot Time** | Sekundy | Milisekundy |
| **Offline Support** | ❌ Wymaga internetu | ✅ Działa offline |
| **React SDK** | ✅ `@codesandbox/sandpack-react` | ✅ `@stackblitz/sdk` |
| **Embedding** | ✅ Iframe | ✅ Iframe lub WebContainer |

---

## 🔍 StackBlitz SDK i Integracja

### Dostępne Biblioteki

1. **`@stackblitz/sdk`** - Główny SDK do programowego tworzenia projektów
2. **`@uiw/react-stackblitz`** - React wrapper dla StackBlitz
3. **WebContainer API** - Bezpośrednia integracja z WebContainers

### Przykład Integracji

```tsx
import { embedProject } from '@stackblitz/sdk';
import { useEffect, useRef } from 'react';

export function StackBlitzRenderer({ code, css }: { code: string; css: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    embedProject(containerRef.current, {
      title: 'Fragment UI Playground',
      description: 'Generated component',
      template: 'create-react-app',
      files: {
        'src/App.tsx': code,
        'src/styles.css': css,
        'src/index.tsx': `
          import React from 'react';
          import ReactDOM from 'react-dom/client';
          import './styles.css';
          import App from './App';

          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<App />);
        `,
        'package.json': JSON.stringify({
          name: 'fragment-ui-playground',
          version: '1.0.0',
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.0.0',
          },
        }),
      },
      // Możemy dodać lokalne pliki
      // files: {
      //   'node_modules/@fragment_ui/ui/index.js': bundledUI,
      // }
    });
  }, [code, css]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

---

## ✅ Zalety StackBlitz dla naszego przypadku

### 1. **CSS Injection Działa**
- ✅ WebContainers działają w tym samym origin
- ✅ Możemy dodać CSS jako plik i zaimportować w kodzie
- ✅ **Brak problemów z CORS**

### 2. **Lokalne Pakiety**
- ✅ Możemy dodać `@fragment_ui/ui` jako lokalny plik
- ✅ Nie wymaga publikacji na npm
- ✅ Możemy użyć bundlera do stworzenia lokalnego modułu

### 3. **Szybsze i Lżejsze**
- ✅ Boot time: milisekundy (vs sekundy w Sandpack)
- ✅ Mniejszy bundle size
- ✅ Działa offline

### 4. **Lepsze Debugowanie**
- ✅ Możemy debugować bezpośrednio w DevTools
- ✅ Pełny dostęp do console, network, etc.
- ✅ Brak problemów z cross-origin

---

## ⚠️ Potencjalne Problemy

### 1. **Wymagania Browser**
- ⚠️ Wymaga `SharedArrayBuffer` (wymaga HTTPS + COOP/COEP headers)
- ⚠️ Nie działa w Safari < 16.4 (bez flagi)
- ⚠️ Wymaga odpowiednich headers w Next.js

### 2. **Konfiguracja Next.js**
```javascript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
      ],
    },
  ],
};
```

### 3. **Lokalne Pakiety**
- ⚠️ Wymaga bundlowania `@fragment_ui/ui` do formatu ESM
- ⚠️ Może wymagać konfiguracji WebContainer

---

## 🚀 Plan Implementacji

### Krok 1: Instalacja (15 min)
```bash
cd apps/demo
pnpm add @stackblitz/sdk
```

### Krok 2: Konfiguracja Next.js (30 min)
```javascript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      ],
    },
  ],
};
```

### Krok 3: Stwórz StackBlitzRenderer (1-2h)
```tsx
// apps/demo/src/components/stackblitz-renderer.tsx
import { embedProject } from '@stackblitz/sdk';
import { useEffect, useRef, useState } from 'react';

export function StackBlitzRenderer({ 
  code, 
  bundledUI, 
  bundledCSS 
}: { 
  code: string;
  bundledUI?: string;
  bundledCSS?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const files: Record<string, string> = {
      'src/App.tsx': code,
      'src/index.tsx': `
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        ${bundledCSS ? "import './styles.css';" : ''}
        import App from './App';

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      `,
      'package.json': JSON.stringify({
        name: 'fragment-ui-playground',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
      }),
    };

    // Add CSS if available
    if (bundledCSS) {
      files['src/styles.css'] = bundledCSS;
    }

    // Add bundled UI as local module
    if (bundledUI) {
      files['src/fragment-ui.js'] = bundledUI;
      // Transform imports in code
      const transformedCode = code.replace(
        /from\s+["']@fragment\/ui["']/g,
        'from "./fragment-ui.js"'
      );
      files['src/App.tsx'] = transformedCode;
    }

    embedProject(containerRef.current, {
      title: 'Fragment UI Playground',
      description: 'Generated component',
      template: 'create-react-app',
      files,
    }).then(() => {
      setLoading(false);
    });
  }, [code, bundledUI, bundledCSS]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading StackBlitz...</p>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

### Krok 4: Zastąp SandpackRenderer (30 min)
```tsx
// apps/demo/app/playground/page.tsx
import { StackBlitzRenderer } from "@/components/stackblitz-renderer";

// Zamiast:
// <SandpackPreview code={code} />

// Użyj:
<StackBlitzRenderer 
  code={code} 
  bundledUI={bundledUI}
  bundledCSS={bundledCSS}
/>
```

---

## 📋 Testowanie

### Test 1: CSS Injection
1. Wygeneruj komponent
2. Sprawdź czy CSS jest załadowany w DevTools
3. Sprawdź czy komponenty mają stylowanie

### Test 2: Lokalne Pakiety
1. Sprawdź czy `@fragment_ui/ui` jest dostępny
2. Sprawdź czy komponenty renderują się poprawnie

### Test 3: TypeScript
1. Wygeneruj komponent z TypeScript
2. Sprawdź czy działa bez błędów

### Test 4: Browser Compatibility
1. Test w Chrome/Edge (powinno działać)
2. Test w Firefox (powinno działać)
3. Test w Safari (może wymagać flagi)

---

## 🎯 Rekomendacja

### ✅ **TAK, StackBlitz jest lepszym rozwiązaniem niż Sandpack dla naszego przypadku!**

**Dlaczego:**
1. ✅ **Rozwiązuje problem z CSS** - brak CORS issues
2. ✅ **Lokalne pakiety** - nie wymaga publikacji na npm
3. ✅ **Szybsze i lżejsze** - lepsza UX
4. ✅ **Lepsze debugowanie** - pełny dostęp do DevTools

**Wymagania:**
- ⚠️ Konfiguracja Next.js headers (COOP/COEP)
- ⚠️ Browser compatibility (Safari może wymagać flagi)
- ⚠️ Bundlowanie `@fragment_ui/ui` do ESM

**Czas implementacji:** 2-3 godziny

---

## 📚 Źródła

- [StackBlitz Documentation](https://developer.stackblitz.com/)
- [WebContainers Browser Support](https://developer.stackblitz.com/platform/webcontainers/browser-support)
- [StackBlitz SDK](https://github.com/stackblitz/webcontainer-core)
- [React StackBlitz Wrapper](https://github.com/uiwjs/react-stackblitz)

---

## ❓ Pytania

1. **Czy możemy dodać COOP/COEP headers w Next.js?**
   - Jeśli tak → StackBlitz jest najlepszym rozwiązaniem

2. **Czy browser compatibility jest problemem?**
   - Jeśli nie → StackBlitz jest idealne

3. **Czy mamy czas na implementację?**
   - 2-3 godziny → Warto spróbować!

