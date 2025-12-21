# Implementacja StackBlitz w AI Playground

## ✅ Wykonane Zmiany

### 1. Instalacja
- ✅ Zainstalowano `@stackblitz/sdk`

### 2. Konfiguracja Next.js
- ✅ Dodano headers COOP/COEP w `next.config.mjs` dla WebContainers

### 3. Komponent StackBlitzRenderer
- ✅ Utworzono `apps/demo/src/components/stackblitz-renderer.tsx`
- ✅ Implementuje `StackBlitzRenderer` i `StackBlitzPreview`
- ✅ Ładuje bundled UI i CSS z `/api/bundle` i `/api/bundle-css`
- ✅ Transformuje importy `@fragment_ui/ui` na lokalne moduły
- ✅ Dodaje CSS jako plik i importuje w `index.tsx`

### 4. Integracja w Playground
- ✅ Zastąpiono `SandpackPreview` przez `StackBlitzPreview` w `app/playground/page.tsx`
- ✅ Zachowano `SandpackCodeEditor` dla zakładki Code

---

## 🧪 Testowanie

### Test 1: Podstawowe Renderowanie
1. Otwórz `http://localhost:3002/playground`
2. Wygeneruj komponent (np. "Create a form with email and password")
3. Sprawdź czy StackBlitz się ładuje
4. Sprawdź czy komponent renderuje się w preview

### Test 2: CSS Injection
1. Wygeneruj komponent z Fragment UI komponentami
2. Otwórz DevTools → Elements
3. Sprawdź czy CSS jest załadowany w `<head>`
4. Sprawdź czy komponenty mają stylowanie z Design System

### Test 3: Lokalne Pakiety
1. Sprawdź czy `@fragment_ui/ui` jest dostępny
2. Sprawdź czy komponenty renderują się poprawnie
3. Sprawdź console czy nie ma błędów importów

### Test 4: TypeScript Support
1. Wygeneruj komponent z TypeScript (interfaces, types)
2. Sprawdź czy działa bez błędów
3. Sprawdź czy TypeScript jest poprawnie przetwarzany

### Test 5: Browser Compatibility
1. Test w Chrome/Edge (powinno działać)
2. Test w Firefox (powinno działać)
3. Test w Safari (może wymagać flagi `SharedArrayBuffer`)

---

## ⚠️ Potencjalne Problemy

### 1. Headers COOP/COEP
- **Problem:** Niektóre zewnętrzne zasoby mogą nie działać z COEP
- **Rozwiązanie:** Możemy dodać wyjątki dla konkretnych ścieżek

### 2. SharedArrayBuffer
- **Problem:** Safari < 16.4 nie obsługuje SharedArrayBuffer bez flagi
- **Rozwiązanie:** Możemy dodać fallback do React Live dla Safari

### 3. Bundle Size
- **Problem:** StackBlitz może być cięższy niż Sandpack
- **Rozwiązanie:** Lazy loading komponentu

---

## 📋 Checklist Testowania

- [ ] StackBlitz ładuje się poprawnie
- [ ] Komponenty renderują się w preview
- [ ] CSS jest załadowany i aplikowany
- [ ] Lokalne pakiety (`@fragment_ui/ui`) działają
- [ ] TypeScript jest poprawnie przetwarzany
- [ ] Nie ma błędów w console
- [ ] Hot reload działa
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## 🔍 Debugowanie

### Jeśli StackBlitz się nie ładuje:
1. Sprawdź console czy są błędy
2. Sprawdź czy headers COOP/COEP są ustawione (Network tab → Headers)
3. Sprawdź czy `SharedArrayBuffer` jest dostępny: `typeof SharedArrayBuffer !== 'undefined'`

### Jeśli CSS nie działa:
1. Sprawdź czy `bundledCSS` jest załadowany (console log)
2. Sprawdź czy plik `src/styles.css` jest w files
3. Sprawdź czy import w `index.tsx` jest poprawny
4. Sprawdź DevTools → Elements → `<head>` czy CSS jest tam

### Jeśli komponenty nie renderują się:
1. Sprawdź czy `bundledUI` jest załadowany
2. Sprawdź czy importy są poprawnie transformowane
3. Sprawdź console czy nie ma błędów importów

---

## 📚 Dokumentacja

- [StackBlitz SDK Docs](https://developer.stackblitz.com/)
- [WebContainers Browser Support](https://developer.stackblitz.com/platform/webcontainers/browser-support)
- [StackBlitz Embedding](https://developer.stackblitz.com/guides/integration/embedding)

---

## 🎯 Następne Kroki

1. **Przetestować** podstawowe renderowanie
2. **Sprawdzić** CSS injection
3. **Zweryfikować** browser compatibility
4. **Zoptymalizować** jeśli potrzeba (lazy loading, fallback)

