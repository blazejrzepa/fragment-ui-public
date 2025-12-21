# Migracja z iframe na IsolatedPreview

## Wykonane zmiany

### 1. Utworzono IsolatedPreview component
- **Lokalizacja:** `apps/demo/src/components/isolated-preview.tsx`
- **Funkcjonalności:**
  - ✅ Isolated React root (osobny React instance)
  - ✅ Scoped container dla CSS isolation
  - ✅ Pełny dostęp do DOM dla inspectora
  - ✅ Bundling z esbuild-wasm (ten sam co worker.ts)
  - ✅ Cache dla bundled code
  - ✅ A11y checks (axe-core)
  - ✅ Zoom support
  - ✅ Element selection przez click handlers
  - ✅ Highlight selected elements

### 2. Zastąpiono SameOriginPreview
- **Zmieniono:** `apps/demo/src/components/playground/playground-preview-code.tsx`
- **Z:** `SameOriginPreview` (iframe-based)
- **Na:** `IsolatedPreview` (isolated React root)

### 3. Rozwiązane problemy
- ✅ **React error #31** - Radix UI komponenty działają (ten sam React instance)
- ✅ **Brak postMessage** - bezpośredni dostęp do DOM
- ✅ **Lepsze performance** - brak iframe overhead
- ✅ **Łatwiejsze debugowanie** - DevTools dostępne bezpośrednio

## Architektura

```
Main App
  └─ Preview Container
      └─ Isolated React Root
          └─ Component Preview (scoped CSS)
```

### Zalety nad iframe:
1. **Pełny dostęp do DOM** - Inspector może bezpośrednio query'ować elementy
2. **Radix UI działa** - Ten sam React instance, brak problemów z obiektami
3. **Brak postMessage** - Bezpośrednia komunikacja, szybsze aktualizacje
4. **Lepsze performance** - Brak iframe overhead
5. **Łatwiejsze debugowanie** - DevTools dostępne bezpośrednio

### CSS Isolation:
- Używa `isolation: isolate` na kontenerze
- CSS z `/api/bundle-css` jest wstrzykiwany do `<style>` tagu
- Nie używa Shadow DOM (problemy z import maps)

## Użycie

```tsx
import { IsolatedPreview } from "@/components/isolated-preview";

<IsolatedPreview
  code={code}
  zoom={previewZoom}
  onError={onPreviewError}
  onA11yResults={onA11yResults}
  selectedId={selectedElementId}
  onSelectionChange={onSelectionChange}
  onZoomChange={onZoomChange}
  containerRef={previewContainerRef}
/>
```

## Testowanie

### DS Components (Accordion, Dialog, Tabs)
- Otwórz Playground
- Wybierz komponent z DS Components sidebar
- Sprawdź, czy renderuje się bez React error #31
- Sprawdź, czy można kliknąć elementy i wybrać je w Inspector

### AI-generated Components (Projects)
- Otwórz Playground
- Utwórz nowy projekt przez AI Copilot
- Sprawdź, czy komponent renderuje się poprawnie
- Sprawdź, czy można edytować przez Inspector

## Następne kroki

1. ✅ Migracja zakończona
2. ⏳ Testowanie z DS Components
3. ⏳ Testowanie z AI-generated components
4. ⏳ Usunięcie SameOriginPreview (jeśli wszystko działa)
5. ⏳ Aktualizacja dokumentacji

## Znane problemy

- **Build-time bundling:** Dynamiczne importy z `https://` muszą być w runtime (używamy `Function('return import(...)')()`)
- **CSS scoping:** Używamy `isolation: isolate` zamiast Shadow DOM (import maps nie działają w Shadow DOM)

## Rollback

Jeśli trzeba wrócić do iframe:
1. Zmień `IsolatedPreview` na `SameOriginPreview` w `playground-preview-code.tsx`
2. Przywróć import z `@/components/same-origin-preview`

