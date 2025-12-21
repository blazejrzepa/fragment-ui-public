# Analiza `globals.css` - Problemy i Rekomendacje

## Statystyki
- **Całkowita liczba `!important`**: 310
- **Rozmiar pliku**: 1181 linii
- **Główne problemy**: Nadmierne użycie `!important`, duplikacja reguł, konflikty z `packages/ui/src/styles.css`

## Główne Problemy

### 1. **Konflikt z `packages/ui/src/styles.css`**
W `packages/ui/src/styles.css` jest reguła:
```css
* {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
}
```

To powoduje, że **wszystkie elementy** mają `transform`, co psuje:
- `position: fixed` (tworzy nowy stacking context)
- `position: absolute` (może zmieniać punkt odniesienia)
- Layout flow

**Rozwiązanie**: Poprawić `packages/ui/src/styles.css` zamiast używać `!important` w `globals.css`.

### 2. **Uzasadnione użycie `!important`** (ok. 50-70 przypadków)
- Nadpisywanie stylów zewnętrznych bibliotek (Radix UI, Next.js)
- Naprawianie błędów pozycjonowania (fixed header, sidebar)
- Ukrywanie scrollbarów (wymaga `!important` w niektórych przeglądarkach)
- Nadpisywanie inline styles z Shiki

### 3. **Nieuzasadnione użycie `!important`** (ok. 240 przypadków)
- Duplikacja reguł (np. scrollbar styles powtarzane wielokrotnie)
- Nadmierna specyficzność selektorów
- Style, które można przenieść do komponentów lub użyć lepszych selektorów

## Rekomendacje

### Priorytet 1: Naprawić źródło problemu
1. **Zmienić `packages/ui/src/styles.css`**:
   ```css
   /* Zamiast: */
   * {
     transform: translate3d(0, 0, 0);
   }
   
   /* Użyć: */
   p, span, a, h1, h2, h3, h4, h5, h6, li, td, th, label, button, input, textarea, select, code, pre {
     transform: translate3d(0, 0, 0);
   }
   
   /* I wykluczyć layout elements: */
   header, nav, aside, main, section, article, div, body, html {
     transform: none;
   }
   ```

### Priorytet 2: Refaktoryzacja `globals.css`
1. **Usunąć duplikacje**:
   - Scrollbar styles (linie 346-694) - można zunifikować
   - Transform overrides (linie 51-101) - można uprościć po naprawie `ui/styles.css`

2. **Użyć lepszych selektorów zamiast `!important`**:
   ```css
   /* Zamiast: */
   header.fixed.top-0 {
     position: fixed !important;
   }
   
   /* Użyć: */
   header.fixed.top-0[data-fixed-header] {
     position: fixed;
   }
   ```

3. **Przenieść style do komponentów**:
   - Code block styles → `CodeBlock` component
   - Button custom styles → `Button` component variants
   - Logo theme styles → `Logo` component

4. **Użyć CSS Layers**:
   ```css
   @layer overrides {
     /* Style nadpisujące zewnętrzne biblioteki */
   }
   ```

### Priorytet 3: Struktura pliku
1. **Podzielić na sekcje z komentarzami**:
   - Critical CSS (FOUC prevention)
   - Layout fixes (header, sidebar)
   - Component overrides
   - Utility styles
   - Animations

2. **Usunąć nieużywane style**:
   - Sprawdzić, które selektory nie są używane
   - Usunąć zakomentowany kod

## Plan Działania

1. ✅ **Naprawić `packages/ui/src/styles.css`** - usunąć `transform: translate3d(0, 0, 0)` z `*`
2. ✅ **Zrefaktoryzować `globals.css`** - usunąć ~200 `!important` po naprawie źródła
3. ✅ **Przenieść style do komponentów** - code blocks, buttons, logo
4. ✅ **Dodać CSS Layers** - lepsza organizacja i specyficzność
5. ✅ **Dokumentacja** - dodać komentarze wyjaśniające, dlaczego niektóre `!important` są potrzebne

## Oczekiwany Rezultat
- **Redukcja `!important`**: z 310 do ~50-70 (tylko uzasadnione przypadki)
- **Lepsza maintainability**: łatwiejsze debugowanie i modyfikacje
- **Lepsza wydajność**: mniej konfliktów CSS, szybsze renderowanie

