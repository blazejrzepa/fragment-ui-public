# Postęp Refaktoryzacji `globals.css`

## ✅ Co zostało zrobione

### 1. Naprawiono źródło problemu
- ✅ Zmieniono `packages/ui/src/styles.css` - `transform` tylko dla elementów tekstowych
- ✅ Layout elements mają `transform: none` (nie psuje fixed positioning)

### 2. Utworzono `utils.css`
- ✅ Przeniesiono wszystkie animacje do `apps/www/src/styles/utils.css`
- ✅ Przeniesiono utility classes (fade-in, intro-text)

### 3. Zrefaktoryzowano `globals.css`
- ✅ Usunięto duplikacje (font rendering, transform overrides)
- ✅ Dodano CSS Layers (`@layer base`, `@layer utilities`)
- ✅ Uproszczono strukturę html/body styles
- ✅ Usunięto zbędne `!important` związane z transform (po naprawie `ui/styles.css`)

## 📊 Statystyki

### Przed refaktoryzacją:
- **1181 linii** w `globals.css`
- **310 `!important`**
- Duplikacje i konflikty

### Po pierwszej fazie refaktoryzacji:
- **1024 linie** w `globals.css` (-157 linii, -13%)
- **112 linii** w `utils.css` (nowy plik)
- **254 `!important`** (-56, -18%)

## 🎯 Co jeszcze trzeba zrobić

### Priorytet Wysoki:
1. **Usunąć więcej `!important`** (zostało 254):
   - Scrollbar styles (linie 346-694) - zunifikować i usunąć `!important`
   - Code block styles - sprawdzić czy można bez `!important`
   - Button custom styles - przenieść do komponentu

2. **Przenieść style do komponentów**:
   - Logo theme styles → `Logo` component
   - Button custom styles → `Button` component variants
   - Sidebar positioning → `Sidebar` component

3. **Zunifikować duplikacje**:
   - Scrollbar styles są powtarzane wielokrotnie
   - Sidebar styles są duplikowane

### Priorytet Średni:
4. **Przenieść do `packages/ui/src/styles.css`**:
   - Code block styles (sprawdzić duplikacje)
   - Document content styles (sprawdzić duplikacje)

5. **Dodać `@custom-variant` dla dark mode** (Tailwind v3):
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```

### Priorytet Niski:
6. **Final cleanup**:
   - Usunąć nieużywane style
   - Dodać komentarze wyjaśniające
   - Dokumentacja

## 📝 Docelowy Stan

### `globals.css` (~100-150 linii):
```css
@import "@fragment_ui/tokens/dist/tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "@fragment_ui/ui/styles.css";
@import "./utils.css";

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
  
  html, body {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

@layer utilities {
  /* Critical fixes only */
  nextjs-portal { ... }
  header.fixed.top-0 { ... }
}
```

### `utils.css` (już gotowy):
- Animations
- Utility classes

## 🚀 Następne kroki

1. **Testować** czy wszystko działa po zmianach
2. **Usunąć scrollbar `!important`** - zunifikować style
3. **Przenieść logo/button styles** do komponentów
4. **Kontynuować cleanup** - dążyć do ~100-150 linii w `globals.css`

