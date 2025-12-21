# Analiza Problemów z CSS w AI Playground

## 🎯 Pierwotne Założenia AI Playground

### Cel
1. **Generowanie komponentów z promptów** - użytkownik opisuje, co chce zbudować
2. **Użycie Fragment UI Design System** - wszystkie komponenty używają stylów z DS
3. **Live Preview** - natychmiastowe podglądanie wygenerowanego kodu
4. **Pełne stylowanie** - wygenerowane komponenty wyglądają identycznie jak w produkcji

### Wymagania
- ✅ Generowanie kodu React/TypeScript
- ✅ Renderowanie w przeglądarce
- ✅ Użycie komponentów Fragment UI
- ❌ **Stylowanie z Design System** - **NIE DZIAŁA**

---

## 🔴 Obecny Problem

### Symptom
Wygenerowane komponenty w Sandpack preview **nie mają stylowania** z Fragment UI Design System.

### Co próbowaliśmy
1. **CSS Injection przez `index.tsx`** - dodawanie `<style>` tagów w `useLayoutEffect`
2. **CSS Injection przez `App.tsx`** - synchroniczne dodawanie CSS przed renderowaniem
3. **CSS jako plik w Sandpack files** - dodanie `/styles.css` do files
4. **Tailwind CDN + Fragment UI styles** - kombinacja zewnętrznego CDN i lokalnych stylów

### Dlaczego nie działa
- **Sandpack działa w cross-origin iframe** (`codesandbox.io`)
- **CORS blokuje dostęp** do iframe z parent frame
- **CSS injection w kodzie** może nie być wykonywany w odpowiednim momencie
- **Sandpack może nadpisywać** `<head>` podczas hot reload

---

## 📊 Analiza Możliwości

### Opcja 1: Sandpack z CSS przez `customSetup` ⭐⭐⭐

**Podejście:** Użyj Sandpack `customSetup` do dodania CSS jako dependency lub przez `files`.

**Implementacja:**
```tsx
<Sandpack
  files={{
    "/App.tsx": code,
    "/styles.css": bundledCSS, // CSS jako plik
    "/index.tsx": `
      import "./styles.css";
      import React from "react";
      import ReactDOM from "react-dom/client";
      import App from "./App";
      
      const root = ReactDOM.createRoot(document.getElementById("root")!);
      root.render(<App />);
    `
  }}
  customSetup={{
    entry: "/index.tsx",
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  }}
/>
```

**Zalety:**
- ✅ CSS jest częścią bundla Sandpack
- ✅ Sandpack automatycznie ładuje CSS
- ✅ Działa z hot reload

**Wady:**
- ⚠️ Wymaga importu CSS w `index.tsx`
- ⚠️ Może wymagać konfiguracji bundlera Sandpack

**Status:** ❓ **NIE PRZETESTOWANE** - warto spróbować

---

### Opcja 2: Sandpack z `index.html` jako entry ⭐⭐⭐⭐

**Podejście:** Użyj `index.html` jako entry point z CSS w `<head>`.

**Implementacja:**
```tsx
<Sandpack
  files={{
    "/index.html": `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css">
          <style>${bundledCSS}</style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/index.tsx"></script>
        </body>
      </html>
    `,
    "/App.tsx": code,
    "/index.tsx": `...`
  }}
  customSetup={{
    entry: "/index.html"
  }}
/>
```

**Zalety:**
- ✅ CSS jest w `<head>` przed renderowaniem
- ✅ Działa synchronicznie
- ✅ Sandpack może obsługiwać HTML jako entry

**Wady:**
- ⚠️ `react-ts` template może nie obsługiwać `index.html` jako entry
- ⚠️ Wymaga zmiany template na `vanilla` lub custom

**Status:** ❓ **CZĘŚCIOWO PRZETESTOWANE** - nie działało z `react-ts` template

---

### Opcja 3: CSS przez Sandpack `customSetup.bundlerURL` ⭐⭐

**Podejście:** Użyj custom bundler, który automatycznie dodaje CSS.

**Implementacja:**
```typescript
// Custom bundler endpoint
export async function GET() {
  // Bundle JS + CSS razem
  const js = await bundleJS();
  const css = bundledCSS;
  
  return new Response(`
    ${js}
    // Inject CSS
    (function() {
      const style = document.createElement('style');
      style.textContent = ${JSON.stringify(css)};
      document.head.appendChild(style);
    })();
  `, {
    headers: { 'Content-Type': 'application/javascript' }
  });
}
```

**Zalety:**
- ✅ CSS jest częścią JS bundle
- ✅ Wykonuje się automatycznie

**Wady:**
- ❌ Wymaga własnego bundlera
- ❌ Większa złożoność
- ❌ Może nie działać z Sandpack bundlerem

**Status:** ❌ **NIE REKOMENDOWANE** - zbyt skomplikowane

---

### Opcja 4: React Live zamiast Sandpack ⭐⭐⭐⭐

**Podejście:** Wróć do React Live, który działa w tym samym origin.

**Implementacja:**
```tsx
<LiveProvider code={code} scope={scope}>
  <LivePreview />
</LiveProvider>
```

**Zalety:**
- ✅ **Działa w tym samym origin** - możemy manipulować DOM
- ✅ Możemy dodać CSS do parent document
- ✅ Lżejszy niż Sandpack
- ✅ Już zaimplementowane

**Wady:**
- ⚠️ Wymaga ręcznego czyszczenia TypeScript
- ⚠️ Ograniczenia z niektórymi składniami
- ⚠️ Mniej profesjonalne niż Sandpack

**Status:** ✅ **DZIAŁA** - ale ma problemy z TypeScript

---

### Opcja 5: CSS przez Sandpack `theme` customization ⭐⭐

**Podejście:** Użyj Sandpack theme do dodania custom CSS.

**Implementacja:**
```tsx
const customTheme = {
  ...sandpackDark,
  colors: {
    ...sandpackDark.colors,
  },
  // Custom CSS injection
};

<Sandpack theme={customTheme} />
```

**Zalety:**
- ✅ Oficjalne API Sandpack

**Wady:**
- ❌ Theme nie pozwala na dodanie zewnętrznego CSS
- ❌ Tylko style edytora, nie aplikacji

**Status:** ❌ **NIE DZIAŁA** - theme nie obsługuje CSS aplikacji

---

### Opcja 6: CSS przez Sandpack `options.editorHeight: 0` + iframe manipulation ⭐

**Podejście:** Ukryj edytor, użyj tylko preview, manipuluj iframe.

**Implementacja:**
```tsx
<Sandpack
  options={{ editorHeight: 0 }}
  // Try to inject CSS after iframe loads
/>
```

**Zalety:**
- ✅ Możemy spróbować manipulować iframe

**Wady:**
- ❌ **CORS blokuje dostęp** do cross-origin iframe
- ❌ Nie działa z `codesandbox.io`

**Status:** ❌ **NIE DZIAŁA** - CORS blokuje

---

### Opcja 7: Sandpack z lokalnym bundlerem (self-hosted) ⭐⭐⭐⭐⭐

**Padejście:** Użyj Sandpack w trybie self-hosted z własnym bundlerem.

**Implementacja:**
```tsx
<Sandpack
  customSetup={{
    bundlerURL: "http://localhost:3002/api/sandpack-bundler"
  }}
/>
```

**Zalety:**
- ✅ **Pełna kontrola** nad bundlerem
- ✅ Możemy dodać CSS do bundla
- ✅ Działa w tym samym origin (lokalny bundler)
- ✅ Najbardziej elastyczne rozwiązanie

**Wady:**
- ⚠️ Wymaga implementacji własnego bundlera
- ⚠️ Większa złożoność
- ⚠️ Wymaga więcej zasobów serwera

**Status:** ❓ **NIE PRZETESTOWANE** - najlepsze długoterminowe rozwiązanie

---

### Opcja 8: CSS przez Sandpack `files` + import w kodzie ⭐⭐⭐

**Padejście:** Dodaj CSS jako plik i zaimportuj w wygenerowanym kodzie.

**Implementacja:**
```tsx
// Transform generated code to include CSS import
const codeWithCSS = `
import "./styles.css";
${code}
`;

<Sandpack
  files={{
    "/App.tsx": codeWithCSS,
    "/styles.css": bundledCSS
  }}
/>
```

**Zalety:**
- ✅ CSS jest częścią bundla
- ✅ Sandpack automatycznie przetwarza importy CSS
- ✅ Działa z hot reload

**Wady:**
- ⚠️ Wymaga modyfikacji wygenerowanego kodu
- ⚠️ Może nie działać jeśli Sandpack nie obsługuje CSS imports

**Status:** ❓ **NIE PRZETESTOWANE** - warto spróbować

---

## 🎯 Rekomendacje

### Krótkoterminowe (1-2 dni)

**Opcja 8: CSS przez import w kodzie** ⭐⭐⭐
- Najprostsze do zaimplementowania
- Nie wymaga zmian w architekturze
- Warto przetestować jako pierwsze

**Opcja 1: CSS przez `files` + `index.tsx`** ⭐⭐⭐
- Jeśli Opcja 8 nie zadziała
- Wymaga zmiany `index.tsx` w Sandpack files

### Średnioterminowe (3-5 dni)

**Opcja 4: React Live z poprawkami** ⭐⭐⭐⭐
- Jeśli Sandpack nadal nie działa
- Poprawić TypeScript stripping (użyć Babel zamiast regex)
- Dodać CSS injection do parent document

### Długoterminowe (1-2 tygodnie)

**Opcja 7: Self-hosted Sandpack bundler** ⭐⭐⭐⭐⭐
- Najlepsze rozwiązanie dla produkcji
- Pełna kontrola nad bundlerem i CSS
- Wymaga więcej pracy, ale najbardziej niezawodne

---

## 📋 Plan Testowania

### Test 1: CSS przez import w kodzie
1. Dodaj `import "./styles.css"` na początku wygenerowanego kodu
2. Dodaj `/styles.css` do Sandpack files
3. Sprawdź czy CSS jest załadowany

### Test 2: CSS przez `index.tsx`
1. Zmodyfikuj `/index.tsx` w Sandpack files, aby importował CSS
2. Sprawdź czy CSS jest załadowany przed renderowaniem

### Test 3: CSS przez `index.html`
1. Zmień template na `vanilla` lub custom
2. Dodaj `index.html` z CSS w `<head>`
3. Sprawdź czy CSS jest załadowany

### Test 4: React Live z CSS injection
1. Wróć do React Live
2. Dodaj CSS do parent document w `useEffect`
3. Sprawdź czy CSS jest aplikowany

---

## ❓ Pytania do Rozważenia

1. **Czy możemy zaakceptować React Live zamiast Sandpack?**
   - Jeśli tak → Opcja 4 jest najszybsza

2. **Czy możemy zainwestować w self-hosted bundler?**
   - Jeśli tak → Opcja 7 jest najlepsza długoterminowo

3. **Czy Sandpack musi używać `react-ts` template?**
   - Jeśli nie → Opcja 2 (index.html) może działać

4. **Czy możemy modyfikować wygenerowany kod?**
   - Jeśli tak → Opcja 8 jest najprostsza

---

## 🚀 Następne Kroki

1. **Przetestuj Opcję 8** (CSS przez import) - najszybsze do sprawdzenia
2. **Jeśli nie działa → Opcja 1** (CSS przez index.tsx)
3. **Jeśli nadal nie działa → Opcja 4** (React Live z poprawkami)
4. **Długoterminowo → Opcja 7** (self-hosted bundler)

---

## 📝 Notatki

- Sandpack używa cross-origin iframe (`codesandbox.io`), co blokuje bezpośrednią manipulację DOM
- Wszystkie próby CSS injection w kodzie mogą nie działać z powodu timing issues
- Najlepsze rozwiązanie to CSS jako część bundla, nie jako zewnętrzny zasób
- React Live działa w tym samym origin, więc możemy manipulować DOM bezpośrednio

