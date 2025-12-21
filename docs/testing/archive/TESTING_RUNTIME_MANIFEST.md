# Testing Runtime Manifest & Focused Element

## 🧪 Testowanie Runtime Manifest

### 1. Test automatyczny (skrypt)

```bash
# Wygeneruj manifest
pnpm runtime:manifest

# Uruchom testy
node scripts/test-runtime-manifest.mjs
```

### 2. Test API endpoint (ręcznie)

#### W przeglądarce:
1. Uruchom dev server: `pnpm dev` (w `apps/demo`)
2. Otwórz: `http://localhost:3002/api/runtime-manifest`
3. Sprawdź czy zwraca JSON z manifestem

#### Przez curl:
```bash
curl http://localhost:3002/api/runtime-manifest | jq
```

#### Oczekiwany wynik:
```json
{
  "version": "1.0.0",
  "generatedAt": "2025-11-27T...",
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    ...
  },
  "importmap": {
    "imports": {
      "react": "/api/bundle?pkg=react",
      ...
    }
  },
  "cssBundles": { ... },
  "features": { ... },
  "paths": { ... }
}
```

### 3. Test w kodzie (TypeScript)

```typescript
import { loadRuntimeManifest } from '@/types/runtime-manifest';

// W komponencie React
const manifest = await loadRuntimeManifest();
console.log('Dependencies:', manifest.dependencies);
console.log('Importmap:', manifest.importmap);
```

---

## 🎯 Testowanie Focused Element (Element Context)

### 1. Test w Playground (ręcznie)

#### Krok 1: Wygeneruj komponent z DSL
1. Otwórz Playground: `http://localhost:3002/playground`
2. Wygeneruj formularz: "Stwórz formularz rejestracji"
3. Poczekaj aż się wygeneruje i pojawi w preview

#### Krok 2: Zaznacz element
1. W preview kliknij na element (np. Button, Input)
2. Powinien pojawić się `SelectionToolbar` na górze
3. Element powinien być podświetlony

#### Krok 3: Sprawdź kontekst w chat
1. Z zaznaczonym elementem napisz w chat: "Zmień variant na outline"
2. Otwórz DevTools → Network
3. Znajdź request do `/api/chat` lub `/api/generate`
4. Sprawdź body requestu - powinien zawierać `elementContext`:

```json
{
  "message": "Zmień variant na outline",
  "context": {
    "code": "...",
    "messages": [...],
    "elementContext": {
      "selectedNodeId": "button-submit",
      "componentName": "Button",
      "subtree": { ... },
      "allowedProps": { ... },
      "currentProps": { ... },
      "parentInfo": { ... }
    }
  }
}
```

### 2. Test przez DevTools Console

```javascript
// W konsoli przeglądarki (na stronie playground)
// Sprawdź czy selectedElementId jest w state
console.log('Selected element:', window.__playgroundState?.selectedElementId);

// Sprawdź czy element context jest przekazywany
// (trzeba dodać console.log w kodzie lub użyć breakpoint)
```

### 3. Test API bezpośrednio

#### Test chat API z element context:

```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Zmień variant na outline",
    "context": {
      "code": "<Button data-ui-id=\"button-submit\">Submit</Button>",
      "elementContext": {
        "selectedNodeId": "button-submit",
        "componentName": "Button",
        "currentProps": { "variant": "solid" },
        "allowedProps": {
          "variant": ["solid", "outline", "ghost"]
        }
      }
    }
  }'
```

#### Test generate API z element context:

```bash
curl -X POST http://localhost:3002/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Zmień variant na outline",
    "elementContext": {
      "selectedNodeId": "button-submit",
      "componentName": "Button",
      "currentProps": { "variant": "solid" },
      "allowedProps": {
        "variant": ["solid", "outline", "ghost"]
      }
    }
  }'
```

### 4. Test funkcji pomocniczych (unit test)

Stwórz test w `apps/demo/src/lib/__tests__/element-context.test.ts`:

```typescript
import { getElementContext, formatElementContextForAPI } from '../element-context';
import type { UiPage } from '@fragment_ui/ui-dsl';

describe('Element Context', () => {
  const mockDsl: UiPage = {
    id: 'page-1',
    type: 'page',
    children: [
      {
        id: 'button-submit',
        type: 'component',
        component: 'Button',
        props: { variant: 'solid' },
      },
    ],
  };

  it('should extract element context', () => {
    const context = getElementContext(mockDsl, 'button-submit');
    expect(context).toBeTruthy();
    expect(context?.selectedNodeId).toBe('button-submit');
    expect(context?.componentName).toBe('Button');
  });

  it('should format for API', () => {
    const context = getElementContext(mockDsl, 'button-submit');
    const formatted = formatElementContextForAPI(context);
    expect(formatted).toHaveProperty('selectedNodeId');
    expect(formatted).toHaveProperty('componentName');
  });
});
```

---

## 🔍 Debugowanie

### Sprawdź czy manifest jest generowany w buildzie:

```bash
# Sprawdź czy prebuild hook działa
cd apps/demo
cat package.json | grep prebuild

# Uruchom build (powinien wygenerować manifest)
pnpm build
ls -la public/runtime-manifest.json
```

### Sprawdź logi w API:

Dodaj console.log w:
- `apps/demo/app/api/chat/route.ts` - sprawdź czy `elementContext` jest w request
- `apps/demo/app/api/generate/route.ts` - sprawdź czy `elementContext` jest w request

### Sprawdź w Playground:

1. Otwórz DevTools → Console
2. Dodaj breakpoint w `handleSendMessage` w `playground/page.tsx`
3. Sprawdź czy `elementContext` jest tworzony przed wysłaniem do API

---

## ✅ Checklist testowy

- [ ] Manifest generuje się poprawnie (`pnpm runtime:manifest`)
- [ ] Manifest zawiera wszystkie wymagane pola
- [ ] API endpoint `/api/runtime-manifest` zwraca manifest
- [ ] Element selection działa w preview (kliknięcie elementu)
- [ ] `selectedElementId` jest w state po kliknięciu
- [ ] Element context jest przekazywany do `/api/chat`
- [ ] Element context jest przekazywany do `/api/generate`
- [ ] AI otrzymuje informacje o zaznaczonym elemencie (sprawdź w system prompt)
- [ ] Modifications preserve `data-ui-id` attribute

---

## 🐛 Znane problemy

1. **Manifest nie generuje się w buildzie**
   - Sprawdź czy `prebuild` jest w `apps/demo/package.json`
   - Uruchom ręcznie: `pnpm runtime:manifest`

2. **Element context jest null**
   - Sprawdź czy DSL jest dostępny w projekcie
   - Sprawdź czy `selectedElementId` jest ustawiony
   - Sprawdź czy element istnieje w DSL (użyj `findNodeById`)

3. **AI nie używa element context**
   - Sprawdź czy `elementContext` jest w body requestu (DevTools → Network)
   - Sprawdź czy system prompt zawiera element context (dodaj console.log)

