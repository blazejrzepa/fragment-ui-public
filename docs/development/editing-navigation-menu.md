# 🎨 Jak edytować NavigationMenu w Design System

## 📍 Lokalizacja plików

NavigationMenu składa się z dwóch głównych plików:

1. **Komponent React** (`packages/ui/src/navigation-menu.tsx`)
   - Logika komponentu
   - Klasy Tailwind CSS
   - Props i zachowanie

2. **Style CSS** (`packages/ui/src/styles.css`)
   - Globalne style CSS dla NavigationMenu
   - Style hover/focus
   - Ukrywanie domyślnych ikon

---

## 🔧 Jak edytować

### 1. Edycja komponentu React

**Plik:** `packages/ui/src/navigation-menu.tsx`

#### Przykłady zmian:

**Zmiana koloru tła przy hover:**
```tsx
// Przed:
hover:bg-[color:var(--color-surface-2)]

// Po (np. bardziej widoczne):
hover:bg-[color:var(--color-surface-3)]
```

**Zmiana padding:**
```tsx
// NavigationMenuLink - linia 82
className={clsx(
  "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-[color:var(--foreground-primary)]",
  className
)}

// Zmień na np. większy padding:
px-4 py-2  // zamiast px-2.5 py-1.5
```

**Zmiana rozmiaru tekstu:**
```tsx
// Przed:
text-sm

// Po:
text-base  // większy tekst
// lub
text-xs    // mniejszy tekst
```

**Zmiana zaokrąglenia rogów:**
```tsx
// Przed:
rounded-md

// Po:
rounded-lg  // bardziej zaokrąglone
// lub
rounded-sm  // mniej zaokrąglone
```

**Dodanie ikony do trigger:**
```tsx
// NavigationMenuTrigger - linia 49-56
// Obecnie:
{children}
<span className="ml-1">▼</span>

// Możesz zmienić na:
{children}
<ChevronDown className="h-3 w-3 ml-1" />
// (pamiętaj o imporcie: import { ChevronDown } from "lucide-react")
```

---

### 2. Edycja stylów CSS

**Plik:** `packages/ui/src/styles.css` (linie 75-115)

#### Przykłady zmian:

**Zmiana koloru tekstu:**
```css
/* Przed: */
[data-radix-navigation-menu-link] {
  color: var(--foreground-primary) !important;
}

/* Po (np. inny kolor): */
[data-radix-navigation-menu-link] {
  color: var(--color-brand-primary) !important;
}
```

**Zmiana efektu hover (dodanie podkreślenia):**
```css
[data-radix-navigation-menu-link]:hover {
  color: var(--foreground-primary) !important;
  text-decoration: underline;  /* Dodaj podkreślenie */
}
```

**Zmiana efektu hover (zmiana koloru tła):**
```css
/* W komponencie React możesz zmienić: */
hover:bg-[color:var(--color-surface-2)]

/* Lub w CSS możesz dodać: */
[data-radix-navigation-menu-link]:hover {
  background-color: color-mix(in srgb, var(--foreground-primary) 10%, transparent) !important;
}
```

**Pokazanie/ukrycie ikony trigger:**
```css
/* Ukryj ikonę (obecnie): */
[data-radix-navigation-menu-trigger] > span:last-child {
  display: none !important;
}

/* Pokaż ikonę: */
[data-radix-navigation-menu-trigger] > span:last-child {
  display: inline !important;
}
```

---

## 🚀 Proces edycji i testowania

### Krok 1: Edytuj pliki

1. Otwórz `packages/ui/src/navigation-menu.tsx`
2. Otwórz `packages/ui/src/styles.css` (jeśli potrzebujesz zmienić CSS)

### Krok 2: Przebuduj pakiet

```bash
# Przebuduj tylko pakiet @fragment_ui/ui
pnpm --filter @fragment_ui/ui build
```

### Krok 3: Zrestartuj serwer dev (jeśli działa)

```bash
# Zatrzymaj serwer (Ctrl+C) i uruchom ponownie:
pnpm dev
```

### Krok 4: Przetestuj zmiany

1. Otwórz `http://localhost:3000/docs/components/navigation-menu`
2. Sprawdź przykłady
3. Sprawdź `http://localhost:3000` (TopNavigation używa NavigationMenu)

---

## 📝 Przykładowe scenariusze

### Scenariusz 1: Zmiana koloru tła przy hover

**1. Edytuj `packages/ui/src/navigation-menu.tsx`:**

```tsx
// Znajdź NavigationMenuLink (linia ~82)
className={clsx(
  "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-[color:var(--color-surface-3)] focus:bg-[color:var(--color-surface-3)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-[color:var(--foreground-primary)]",
  className
)}
```

**2. Przebuduj:**
```bash
pnpm --filter @fragment_ui/ui build
```

**3. Zrestartuj serwer:**
```bash
# Zatrzymaj i uruchom ponownie
pnpm dev
```

---

### Scenariusz 2: Dodanie podkreślenia przy hover

**1. Edytuj `packages/ui/src/styles.css`:**

```css
[data-radix-navigation-menu-link]:hover {
  color: var(--foreground-primary) !important;
  text-decoration: underline;
}
```

**2. Przebuduj:**
```bash
pnpm --filter @fragment_ui/ui build
```

**3. Zrestartuj serwer**

---

### Scenariusz 3: Zmiana rozmiaru i padding

**1. Edytuj `packages/ui/src/navigation-menu.tsx`:**

```tsx
// NavigationMenuLink
className={clsx(
  "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium transition-colors hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-[color:var(--foreground-primary)]",
  className
)}
```

**2. Przebuduj i zrestartuj**

---

## 🎯 Najczęstsze zmiany

| Co chcesz zmienić | Gdzie edytować | Przykład |
|------------------|----------------|----------|
| Kolor tła hover | `navigation-menu.tsx` | `hover:bg-[color:var(--color-surface-3)]` |
| Padding | `navigation-menu.tsx` | `px-4 py-2` |
| Rozmiar tekstu | `navigation-menu.tsx` | `text-base` |
| Zaokrąglenie rogów | `navigation-menu.tsx` | `rounded-lg` |
| Kolor tekstu | `styles.css` | `color: var(--color-brand-primary)` |
| Efekt hover (CSS) | `styles.css` | `text-decoration: underline` |
| Ikona trigger | `navigation-menu.tsx` | Usuń `<span>▼</span>` lub zmień |

---

## ⚠️ Ważne uwagi

1. **Zawsze przebuduj pakiet** po zmianach w `packages/ui/src/`
2. **Zrestartuj serwer dev** po przebudowie
3. **Testuj w obu miejscach:**
   - Przykłady w dokumentacji (`/docs/components/navigation-menu`)
   - TopNavigation na stronie głównej (`/`)
4. **Używaj zmiennych CSS** zamiast hardkodowanych wartości:
   - ✅ `var(--foreground-primary)`
   - ❌ `#000000`
5. **Sprawdzaj dark mode** - zmiany powinny działać w obu trybach

---

## 🔍 Debugowanie

Jeśli zmiany nie są widoczne:

1. **Sprawdź czy przebudowa się powiodła:**
   ```bash
   pnpm --filter @fragment_ui/ui build
   ```

2. **Sprawdź czy serwer dev jest zrestartowany**

3. **Wyczyść cache przeglądarki:**
   - Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows/Linux)

4. **Sprawdź konsolę przeglądarki** pod kątem błędów

5. **Sprawdź czy style są załadowane:**
   - DevTools → Network → Sprawdź czy `styles.css` jest załadowany

---

## 📚 Dodatkowe zasoby

- **Design Tokens:** `packages/tokens/src/` - dostępne zmienne CSS
- **Przykłady użycia:** `apps/www/app/docs/components/navigation-menu/page.tsx`
- **TopNavigation:** `apps/www/src/components/top-navigation.tsx` - przykład użycia w produkcji

