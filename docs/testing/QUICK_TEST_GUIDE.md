# 🧪 Quick Test Guide - Runtime Manifest & Focused Element

## Szybki start

### 1. Test Runtime Manifest (30 sekund)

```bash
# Wygeneruj manifest
pnpm runtime:manifest

# Uruchom testy automatyczne
pnpm test:runtime-manifest
```

**Oczekiwany wynik:**
```
✅ All tests passed!
📊 Manifest Summary:
   Version: 1.0.0
   Dependencies: 11
   Importmap entries: 6
```

### 2. Test Element Context (30 sekund)

```bash
# Uruchom testy
pnpm test:element-context
```

**Oczekiwany wynik:**
```
✅ All element context tests passed!
📊 Element Context Summary:
   Selected: button-submit
   Component: Button
   Props: {"variant":"solid","size":"md"}
```

---

## Testowanie w przeglądarce (5 minut)

### Krok 1: Uruchom dev server

```bash
cd apps/demo
pnpm dev
```

### Krok 2: Test Runtime Manifest API

Otwórz w przeglądarce:
```
http://localhost:3002/api/runtime-manifest
```

Powinieneś zobaczyć JSON z manifestem.

### Krok 3: Test Focused Element w Playground

1. **Otwórz Playground:**
   ```
   http://localhost:3002/playground
   ```

2. **Wygeneruj komponent:**
   - Wpisz w chat: "Stwórz formularz rejestracji"
   - Poczekaj aż się wygeneruje

3. **Zaznacz element:**
   - Kliknij na Button w preview
   - Powinien pojawić się `SelectionToolbar` na górze
   - Element powinien być podświetlony

4. **Sprawdź element context:**
   - Otwórz DevTools (F12) → Network
   - Z zaznaczonym elementem napisz w chat: "Zmień variant"
   - Znajdź request do `/api/chat` lub `/api/generate`
   - Kliknij na request → Payload
   - Sprawdź czy `elementContext` jest w body:

   ```json
   {
     "context": {
       "elementContext": {
         "selectedNodeId": "button-submit",
         "componentName": "Button",
         "currentProps": { "variant": "solid" },
         "allowedProps": { ... }
       }
     }
   }
   ```

---

## Testowanie przez curl (2 minuty)

### Test Runtime Manifest API:

```bash
curl http://localhost:3002/api/runtime-manifest | jq '.version, .dependencies.react'
```

**Oczekiwany wynik:**
```json
"1.0.0"
"^18.3.0"
```

### Test Chat API z element context:

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
        "currentProps": { "variant": "solid" }
      }
    }
  }' | jq '.message'
```

**Oczekiwany wynik:** AI powinien odpowiedzieć z kontekstem zaznaczonego elementu.

---

## Checklist testowy

### Runtime Manifest
- [ ] `pnpm runtime:manifest` generuje plik
- [ ] `pnpm test:runtime-manifest` przechodzi wszystkie testy
- [ ] `/api/runtime-manifest` zwraca JSON
- [ ] Manifest zawiera dependencies, importmap, features

### Focused Element
- [ ] `pnpm test:element-context` przechodzi wszystkie testy
- [ ] Element selection działa w preview (kliknięcie)
- [ ] `selectedElementId` jest w state
- [ ] Element context jest w request do `/api/chat`
- [ ] Element context jest w request do `/api/generate`
- [ ] AI otrzymuje informacje o zaznaczonym elemencie

---

## Debugowanie

### Problem: Manifest nie generuje się

```bash
# Sprawdź czy skrypt istnieje
ls -la scripts/generate-runtime-manifest.mjs

# Uruchom ręcznie
node scripts/generate-runtime-manifest.mjs

# Sprawdź czy plik został utworzony
ls -la apps/demo/public/runtime-manifest.json
```

### Problem: Element context jest null

1. Sprawdź w DevTools Console:
   ```javascript
   // W playground
   console.log('Selected:', window.__playgroundState?.selectedElementId);
   ```

2. Sprawdź czy DSL jest dostępny:
   - Otwórz DevTools → Application → Local Storage
   - Znajdź `fragment-ui-playground-ui-projects`
   - Sprawdź czy projekt ma `dsl` field

3. Dodaj console.log w kodzie:
   ```typescript
   // W playground/page.tsx, w handleSendMessage
   console.log('Element context:', elementContext);
   ```

### Problem: AI nie używa element context

1. Sprawdź Network tab - czy `elementContext` jest w request?
2. Sprawdź logi serwera - czy API otrzymuje `elementContext`?
3. Dodaj console.log w `/api/generate/route.ts`:
   ```typescript
   console.log('Element context:', elementContext);
   ```

---

## Następne kroki

Po przetestowaniu podstawowych funkcji:

1. **Test E2E** - Dodaj testy Playwright dla element selection
2. **Test unit** - Dodaj testy dla `getElementContext()` w Vitest
3. **Test integracyjny** - Test pełnego flow: select → chat → modify

Zobacz: [TESTING_RUNTIME_MANIFEST.md](./TESTING_RUNTIME_MANIFEST.md) dla szczegółowych instrukcji.

