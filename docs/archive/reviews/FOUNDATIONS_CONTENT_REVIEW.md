# 📋 Przegląd Treści - Foundations Section

**Data:** 2025-01-XX  
**Zakres:** Wszystkie dokumenty z sekcji Foundations

---

## 📊 Status Wszystkich Stron

| Strona | Status | Priorytet | Uwagi |
|--------|--------|-----------|-------|
| **Design Tokens** | ⚠️ Częściowo nieaktualne | Wysoki | Spacing values mogą być niepełne |
| **Theming** | ⚠️ Niekompletne | Wysoki | Brakuje opcji "light" i "system" |
| **Dark Mode** | ⚠️ Błędna informacja | Wysoki | Mówi że "System" jest default, a w rzeczywistości "dark" |
| **Semantic Colors** | ✅ Aktualna | Niski | Wszystko zgodne z tokens.json |
| **Spacing** | ⚠️ Niekompletna | Średni | Pokazuje tylko część wartości |

---

## 🔍 Szczegółowy Przegląd

### 1. Design Tokens ✅/⚠️

**Status:** ⚠️ Częściowo nieaktualna

#### ✅ Co jest dobre:
- Kolory są zgodne z tokens.json
- Semantic colors są poprawne
- Typography info jest dobra
- High contrast mode opisany

#### ⚠️ Problemy:
1. **Spacing values są różne od tokens.json**
   - Dokumentacja pokazuje: `--spacing-4xs`, `--spacing-3xs`, `--spacing-2xs`, etc.
   - tokens.json ma tylko: `0`, `1`, `2`, `3`, `4`, `6`, `8`
   - Dokumentacja używa `--space-X` formatu, ale w tokens.json jest `space` z wartościami 4, 8, 12, 16, 24, 32
   - Strona Spacing używa `--space-0`, `--space-1`, `--space-2`, etc. (zgodne z tokens.json)

2. **Border Radius**
   - Dokumentacja pokazuje wiele wartości: `--radius-4xs`, `--radius-3xs`, etc.
   - tokens.json ma tylko: `sm: 8`, `md: 12`, `lg: 16`, `xl: 24`
   - Niejasne które wartości są rzeczywiste

**Rekomendacje:**
- ✅ Zunifikować spacing format - używać `--space-X` jak w stronie Spacing
- ✅ Sprawdzić jakie border radius wartości są rzeczywiście używane
- ✅ Zaktualizować dokumentację aby odzwierciedlała rzeczywiste tokeny

---

### 2. Theming ⚠️

**Status:** ⚠️ Niekompletna

#### ✅ Co jest dobre:
- Density modes opisane poprawnie
- RTL support opisany poprawnie
- Przykłady użycia są dobre

#### ⚠️ Problemy:
1. **Brakuje opcji "light" i "system"**
   - Strona pokazuje tylko "dark" i "high-contrast"
   - W rzeczywistości są 4 opcje: `light`, `dark`, `high-contrast`, `system`
   - ThemeProvider i useTheme wspierają wszystkie 4 opcje

2. **Brakuje informacji o ThemeProvider**
   - Strona nie wspomina o ThemeProvider komponencie
   - Nie pokazuje jak używać useTheme hook
   - Brakuje informacji o automatycznej detekcji system preference

**Rekomendacje:**
- ✅ Dodać wszystkie 4 opcje tematów
- ✅ Dodać sekcję o ThemeProvider
- ✅ Dodać informacje o useTheme hook
- ✅ Wyjaśnić różnicę między `theme` i `effectiveTheme`

---

### 3. Dark Mode ⚠️

**Status:** ⚠️ Błędna informacja

#### ✅ Co jest dobre:
- Implementacja opisana poprawnie
- CSS Variables wyjaśnione
- Theme persistence opisana
- High contrast mode opisany

#### ⚠️ Problemy:
1. **Błędna informacja o domyślnym motywie**
   - **Linia 46:** "System - Automatically follows system preference **(default)**"
   - **Fakty:** Domyślny motyw to `"dark"`, nie `"system"`
   - W `theme.ts` linia 27: `return "dark";` gdy nie ma stored theme
   - W `theme.ts` linia 19, 27, 98: default to `"dark"`

2. **Niezgodność z rzeczywistością**
   - Dokumentacja sugeruje że "System" jest domyślny
   - W rzeczywistości domyślny to "dark"
   - Można ustawić "system", ale to nie jest default

**Rekomendacje:**
- ⚠️ **PRIORYTET WYSOKI:** Naprawić informację o domyślnym motywie
- ✅ Zmienić: "System - Automatically follows system preference (default)"
- ✅ Na: "System - Automatically follows system preference"
- ✅ Dodać: "Dark - Dark color scheme (default)"
- ✅ Albo: "Dark - Dark color scheme (default, automatically applied)"

---

### 4. Semantic Colors ✅

**Status:** ✅ Aktualna

#### ✅ Co jest dobre:
- Wszystkie kolory są zgodne z tokens.json
- Light i dark variants są poprawne
- High contrast values są poprawne
- Przykłady użycia są dobre

**Wszystko OK - brak zmian potrzebnych**

---

### 5. Spacing ⚠️

**Status:** ⚠️ Niekompletna

#### ✅ Co jest dobre:
- Pokazuje wartości zgodne z tokens.json: 0, 1, 2, 3, 4, 6, 8
- Przykłady użycia są dobre
- Format CSS variables jest poprawny

#### ⚠️ Problemy:
1. **Brakuje wartości z tokens.json**
   - Strona pokazuje tylko: 0, 1, 2, 3, 4, 6, 8
   - tokens.json ma: 0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px)
   - To jest OK - wszystkie wartości są pokazane

2. **Design Tokens pokazuje inne wartości**
   - Design Tokens content.md pokazuje: `--spacing-4xs`, `--spacing-3xs`, etc.
   - Spacing page pokazuje: `--space-0`, `--space-1`, etc.
   - **Niejasność:** Który format jest poprawny?

**Rekomendacje:**
- ✅ Upewnić się że Design Tokens używa tego samego formatu co Spacing
- ✅ Zunifikować format: `--space-X` (nie `--spacing-X`)

---

## 🎯 Priorytety Aktualizacji

### Priority 1 (Wysoki) - Naprawić natychmiast:

#### 1. Dark Mode - Naprawić błędną informację o default theme
**Plik:** `apps/www/app/docs/foundations/dark-mode/page.tsx`

**Problem:** Mówi że "System" jest default, ale w rzeczywistości "dark" jest default

**Zmiana:**
- Linia 46: Zmienić opis "System" - usunąć "(default)"
- Linia 44: Zmienić opis "Dark" - dodać "(default)"

---

#### 2. Theming - Dodać brakujące opcje tematów
**Plik:** `apps/www/app/docs/foundations/theming/page.tsx`

**Problem:** Pokazuje tylko "dark" i "high-contrast", brakuje "light" i "system"

**Zmiany:**
- Dodać przyciski dla "light" i "system"
- Dodać sekcję o ThemeProvider
- Dodać informacje o useTheme hook

---

### Priority 2 (Średni) - Naprawić wkrótce:

#### 3. Design Tokens - Zunifikować spacing format
**Plik:** `apps/www/app/docs/foundations/tokens/content.md`

**Problem:** Używa `--spacing-*` formatu zamiast `--space-*`

**Zmiany:**
- Zmienić wszystkie `--spacing-*` na `--space-*`
- Zaktualizować wartości aby były zgodne z tokens.json

---

#### 4. Spacing - Upewnić się że wszystkie wartości są pokazane
**Status:** Wszystkie wartości są pokazane (0, 1, 2, 3, 4, 6, 8)

**Uwaga:** Można rozważyć dodanie więcej przykładów użycia

---

## ✅ Checklist Aktualizacji

- [ ] **Dark Mode:**
  - [ ] Usunąć "(default)" z "System"
  - [ ] Dodać "(default)" do "Dark"
  
- [ ] **Theming:**
  - [ ] Dodać przycisk "Light"
  - [ ] Dodać przycisk "System"
  - [ ] Dodać sekcję o ThemeProvider
  - [ ] Dodać informacje o useTheme hook

- [ ] **Design Tokens:**
  - [ ] Zunifikować spacing format (--space-* zamiast --spacing-*)
  - [ ] Sprawdzić border radius values
  - [ ] Zaktualizować aby odzwierciedlał tokens.json

- [ ] **Weryfikacja:**
  - [ ] Sprawdzić czy wszystkie zmiany są zgodne z implementacją
  - [ ] Przetestować przykłady kodu

---

## 📊 Statystyki

- **Stron do zaktualizowania:** 3 (Dark Mode, Theming, Design Tokens)
- **Krytycznych błędów:** 1 (Dark Mode - błędna informacja o default)
- **Stron OK:** 2 (Semantic Colors, Spacing)

---

## 🔍 Szczegóły Implementacji

### Default Theme
- **Rzeczywistość:** `"dark"` jest domyślnym motywem
- **Źródło:** `apps/www/src/lib/theme.ts` linia 27
- **Dokumentacja:** Mówi że "System" jest default ❌

### Available Themes
- **Rzeczywistość:** `light`, `dark`, `high-contrast`, `system`
- **Źródło:** `apps/www/src/lib/theme.ts` linia 10
- **Theming page:** Pokazuje tylko `dark` i `high-contrast` ❌

### Spacing Format
- **tokens.json:** `space: { "0": 0, "1": 4, "2": 8, ... }`
- **CSS Variables:** Powinno być `--space-0`, `--space-1`, `--space-2`, etc.
- **Design Tokens:** Używa `--spacing-*` formatu ❌
- **Spacing page:** Używa `--space-*` formatu ✅

---

**Przegląd ukończony:** 2025-01-XX

