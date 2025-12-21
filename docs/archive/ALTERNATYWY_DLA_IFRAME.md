# Alternatywy dla iframe w Playground - Analiza

## Obecne wymagania

1. **Inspector** - potrzebuje dostępu do DOM przez `data-ui-id`
2. **AI Copilot** - potrzebuje możliwości modyfikacji kodu i DSL
3. **Edycja** - potrzebuje live preview z możliwością selekcji elementów
4. **Izolacja** - CSS i JavaScript nie powinny wpływać na główną aplikację
5. **Radix UI** - komponenty oparte na obiektach (nie funkcjach)

## Problem z obecnym rozwiązaniem (iframe)

- ❌ React error #31 z komponentami Radix UI (obiekty zamiast funkcji)
- ❌ Komunikacja przez postMessage (opóźnienia, złożoność)
- ❌ Ograniczony dostęp do DOM z parent window
- ❌ Problemy z CSS injection
- ❌ Trudności z debugowaniem

## Opcje alternatywne

### Opcja 1: Isolated React Root + Shadow DOM ⭐⭐⭐⭐⭐ (NAJLEPSZE)

**Architektura:**
```
Main App
  └─ Preview Container (Shadow DOM)
      └─ Isolated React Root
          └─ Component Preview
```

**Zalety:**
- ✅ Pełny dostęp do DOM dla inspectora (ten sam document)
- ✅ CSS isolation przez Shadow DOM
- ✅ JavaScript isolation przez osobny React root
- ✅ Brak problemów z postMessage (bezpośredni dostęp)
- ✅ Radix UI działa (ten sam React instance)
- ✅ Łatwe debugowanie (DevTools)
- ✅ Szybsze renderowanie (brak iframe overhead)

**Wady:**
- ⚠️ Shadow DOM może mieć problemy z niektórymi CSS (ale można użyć scoped styles)
- ⚠️ Wymaga zarządzania osobnym React root

**Implementacja:**
```tsx
// IsolatedPreview.tsx
"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import React from "react";

interface IsolatedPreviewProps {
  code: string;
  onError?: (error: Error) => void;
  selectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
}

export function IsolatedPreview({ 
  code, 
  onError, 
  selectedId, 
  onSelectionChange 
}: IsolatedPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const reactRootRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Shadow DOM for CSS isolation
    if (!shadowRootRef.current) {
      shadowRootRef.current = containerRef.current.attachShadow({ 
        mode: 'open' 
      });
    }

    const shadowRoot = shadowRootRef.current;

    // Create root element in Shadow DOM
    let rootElement = shadowRoot.querySelector('#preview-root');
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = 'preview-root';
      shadowRoot.appendChild(rootElement);
    }

    // Inject CSS into Shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Fragment UI styles */
      @import url('/api/bundle-css');
      
      /* Preview container styles */
      #preview-root {
        padding: 20px;
        min-height: 100%;
      }
    `;
    if (!shadowRoot.querySelector('style')) {
      shadowRoot.insertBefore(styleElement, rootElement);
    }

    // Create isolated React root
    if (!reactRootRef.current) {
      reactRootRef.current = createRoot(rootElement);
    }

    // Bundle and render code
    const renderCode = async () => {
      try {
        // Bundle code with esbuild (same as iframe approach)
        const response = await fetch('/api/bundle-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        
        const { bundledCode } = await response.json();
        
        // Create module from bundled code
        const blob = new Blob([bundledCode], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const module = await import(url);
        
        const Component = module.default;
        
        // Render with data-ui-id support
        reactRootRef.current.render(
          React.createElement(Component, {
            'data-ui-id': 'root',
            onClick: (e: MouseEvent) => {
              // Handle element selection
              const target = e.target as HTMLElement;
              const uiId = target.closest('[data-ui-id]')?.getAttribute('data-ui-id');
              onSelectionChange?.(uiId || null);
            },
          })
        );
        
        URL.revokeObjectURL(url);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    renderCode();

    return () => {
      // Cleanup
      if (reactRootRef.current) {
        reactRootRef.current.unmount();
      }
    };
  }, [code, onError, onSelectionChange]);

  return (
    <div 
      ref={containerRef} 
      className="isolated-preview-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
```

---

### Opcja 2: Portal + Scoped Styles ⭐⭐⭐⭐

**Architektura:**
```
Main App
  └─ Preview Container (Portal)
      └─ Isolated React Root
          └─ Component Preview (scoped CSS)
```

**Zalety:**
- ✅ Pełny dostęp do DOM
- ✅ Łatwa komunikacja
- ✅ Radix UI działa
- ✅ Prostsze niż Shadow DOM

**Wady:**
- ⚠️ CSS isolation przez scoped styles (może być mniej skuteczne)
- ⚠️ Wymaga prefixowania wszystkich CSS

**Implementacja:**
```tsx
// PortalPreview.tsx
"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import React from "react";

export function PortalPreview({ code, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactRootRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create isolated container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-scope';
    previewContainer.style.cssText = `
      all: initial;
      display: block;
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    containerRef.current.appendChild(previewContainer);

    // Inject scoped CSS
    const styleId = 'preview-scoped-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .preview-scope {
          /* Fragment UI styles scoped */
        }
        .preview-scope * {
          box-sizing: border-box;
        }
      `;
      document.head.appendChild(style);
    }

    // Create React root
    reactRootRef.current = createRoot(previewContainer);

    // Render code (same as IsolatedPreview)

    return () => {
      reactRootRef.current?.unmount();
      previewContainer.remove();
    };
  }, [code]);

  return <div ref={containerRef} />;
}
```

---

### Opcja 3: React Live (już używany) ⭐⭐⭐

**Zalety:**
- ✅ Już częściowo zaimplementowany
- ✅ Live editing
- ✅ Prosty w użyciu

**Wady:**
- ❌ Problem z Radix UI (obiekty) nadal występuje
- ❌ Brak pełnej izolacji CSS
- ❌ Ograniczony scope (wymaga ręcznego dodawania komponentów)

**Użycie:**
- Obecnie używany w `/playground/chat`
- Działa dla prostych komponentów
- Nie rozwiązuje problemu z Radix UI

---

### Opcja 4: Sandpack ⭐⭐⭐

**Zalety:**
- ✅ Profesjonalne narzędzie
- ✅ TypeScript support
- ✅ Eksport do CodeSandbox

**Wady:**
- ❌ Duży bundle size (~500KB)
- ❌ Wymaga CDN dla dependencies
- ❌ Może mieć problemy z custom packages (@fragment_ui/ui)
- ❌ Nadal używa iframe wewnętrznie

---

## Rekomendacja: Isolated React Root + Shadow DOM

### Dlaczego to najlepsze rozwiązanie?

1. **Rozwiązuje problem z Radix UI**
   - Używa tego samego React instance
   - Brak problemów z obiektami jako typami
   - Standardowy `jsx` z `react/jsx-runtime` działa

2. **Pełny dostęp do DOM dla Inspectora**
   - Inspector może bezpośrednio query'ować elementy
   - Łatwe dodawanie `data-ui-id` atrybutów
   - Bezpośredni dostęp do computed styles

3. **AI Copilot**
   - Łatwa modyfikacja DOM przez inspector
   - Bezpośrednia komunikacja (brak postMessage)
   - Szybsze aktualizacje

4. **Edycja**
   - Live preview bez opóźnień
   - Łatwa selekcja elementów
   - Natychmiastowe feedback

5. **Izolacja**
   - Shadow DOM zapewnia CSS isolation
   - Osobny React root zapewnia JavaScript isolation
   - Nie wpływa na główną aplikację

### Plan migracji

1. **Faza 1: Implementacja IsolatedPreview** (2-3 dni)
   - Stwórz `IsolatedPreview` component
   - Zastąp `SameOriginPreview` w playground
   - Przetestuj z prostymi komponentami

2. **Faza 2: Migracja Inspectora** (1-2 dni)
   - Zaktualizuj selektory (brak iframe)
   - Usuń postMessage communication
   - Przetestuj selekcję elementów

3. **Faza 3: Optymalizacja** (1 dzień)
   - Cache'owanie bundled code
   - Lazy loading komponentów
   - Performance monitoring

### Przykład użycia

```tsx
// app/playground/page.tsx
import { IsolatedPreview } from "@/components/isolated-preview";

<IsolatedPreview
  code={code}
  onError={handleError}
  selectedId={selectedElementId}
  onSelectionChange={setSelectedElementId}
/>
```

---

## Porównanie rozwiązań

| Cecha | iframe | Isolated Root + Shadow | Portal + Scoped | React Live | Sandpack |
|-------|--------|------------------------|-----------------|------------|----------|
| Radix UI support | ❌ | ✅ | ✅ | ❌ | ✅ |
| DOM access | ⚠️ (postMessage) | ✅ | ✅ | ✅ | ⚠️ |
| CSS isolation | ✅ | ✅ | ⚠️ | ❌ | ✅ |
| Performance | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| Debugging | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| Bundle size | ✅ | ✅ | ✅ | ✅ | ❌ |
| Complexity | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |

---

## Podsumowanie

**Najlepsze rozwiązanie: Isolated React Root + Shadow DOM**

- Rozwiązuje wszystkie problemy z iframe
- Zapewnia pełny dostęp do DOM
- Radix UI działa out-of-the-box
- Lepsze performance
- Łatwiejsze debugowanie

**Alternatywa: Portal + Scoped Styles** (jeśli Shadow DOM jest problematyczny)

- Prostsze w implementacji
- Nadal zapewnia izolację
- Pełny dostęp do DOM

