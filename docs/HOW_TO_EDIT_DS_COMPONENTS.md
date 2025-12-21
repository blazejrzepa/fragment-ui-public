# Jak Edytować Komponenty Design System - Przewodnik

## 🎯 Zasada: Jedno Źródło Prawdy

**Komponenty Design System są jedynym źródłem prawdy. Portal i wszystkie aplikacje używają komponentów DS.**

## 📍 Lokalizacja Komponentów DS

### Podstawowe Komponenty UI:
```
packages/ui/src/
├── button.tsx          # Komponenty podstawowe
├── input.tsx
├── navigation-menu.tsx
├── code-block.tsx      # Komponenty dokumentacji (po migracji)
└── styles.css          # Style DS
```

### Bloki (Composable Components):
```
packages/blocks/src/
├── app-shell.tsx
├── kpi-strip.tsx
├── documentation-header.tsx  # Po migracji
└── documentation-layout.tsx  # Po migracji
```

## 🔧 Proces Edycji Komponentu DS

### Krok 1: Znajdź Komponent w DS

```bash
# Przeszukaj komponenty
grep -r "NavigationMenu" packages/ui/src/

# Lub sprawdź index.ts
cat packages/ui/src/index.ts | grep -i navigation
```

### Krok 2: Edytuj Komponent

```tsx
// packages/ui/src/navigation-menu.tsx
export const NavigationMenuLink = React.forwardRef(({ className, style, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={clsx(
      "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-normal transition-colors hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-[color:var(--foreground-primary)] no-underline",
      className
    )}
    style={{
      textDecoration: "none", // ← Twoja zmiana
      ...style,
    }}
    {...props}
  />
));
```

### Krok 3: Edytuj Style (jeśli potrzebne)

```css
/* packages/ui/src/styles.css */
@layer components {
  [data-radix-navigation-menu-link] {
    text-decoration: none !important; /* ← Twoja zmiana */
  }
}
```

### Krok 4: Zbuduj Pakiet DS

```bash
# Zbuduj tylko pakiet UI
pnpm --filter @fragment_ui/ui build

# Lub zbuduj wszystkie pakiety
pnpm build
```

### Krok 5: Zmiany Są Widoczne Automatycznie

Portal automatycznie używa zbudowanego pakietu DS, więc zmiany są widoczne od razu po restarcie dev servera.

```bash
# Zrestartuj dev server (jeśli działa)
# Zmiany są już widoczne!
```

## 📝 Przykład: Edycja NavigationMenu

### Przed:
```tsx
// packages/ui/src/navigation-menu.tsx
const NavigationMenuLink = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    className={clsx("...", className)}
    {...props}
  />
));
```

### Po:
```tsx
// packages/ui/src/navigation-menu.tsx
const NavigationMenuLink = React.forwardRef(({ className, style, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    className={clsx("... no-underline", className)}
    style={{
      textDecoration: "none",
      ...style,
    }}
    {...props}
  />
));
```

### Rezultat:
- ✅ Portal automatycznie używa nowej wersji
- ✅ Wszystkie aplikacje używające DS mają zmiany
- ✅ Dokumentacja pokazuje nowe zachowanie

## 🚀 Migracja Komponentu z Portalu do DS

### Przykład: StabilityBadge

#### Krok 1: Skopiuj Komponent do DS

```bash
# Skopiuj komponent
cp apps/www/src/components/stability-badge.tsx packages/ui/src/stability-badge.tsx
```

#### Krok 2: Zaktualizuj Importy w Komponencie

```tsx
// packages/ui/src/stability-badge.tsx
// ✅ Importy już są poprawne (używa @fragment_ui/ui)
import { Badge } from "@fragment_ui/ui";
```

#### Krok 3: Dodaj do Index.ts

```tsx
// packages/ui/src/index.ts
export * from "./stability-badge";
```

#### Krok 4: Zbuduj Pakiet

```bash
pnpm --filter @fragment_ui/ui build
```

#### Krok 5: Zaktualizuj Importy w Portalu

```bash
# Znajdź wszystkie użycia
grep -r "from.*stability-badge" apps/www/

# Zaktualizuj importy
# PRZED:
import { StabilityBadge } from "../../../../src/components/stability-badge";

# PO:
import { StabilityBadge } from "@fragment_ui/ui";
```

#### Krok 6: Usuń Stary Komponent

```bash
rm apps/www/src/components/stability-badge.tsx
```

#### Krok 7: Zweryfikuj

```bash
# Uruchom portal
pnpm dev

# Sprawdź czy wszystko działa
# Wszystkie strony dokumentacji powinny działać poprawnie
```

## 🎨 Zasady Projektowania Komponentów DS

### 1. Komponenty Muszą Być Reużywalne

```tsx
// ✅ DOBRZE - Komponent przyjmuje props
export function DocumentationHeader({
  logo,
  links,
  search = true,
}: DocumentationHeaderProps) {
  return (
    <header>
      {logo}
      <NavigationMenu links={links} />
      {search && <CommandPalette />}
    </header>
  );
}

// ❌ ŹLE - Hardcoded wartości
export function TopNavigation() {
  return (
    <header>
      <Logo /> {/* Hardcoded */}
      <NavigationMenu links={[...]} /> {/* Hardcoded */}
    </header>
  );
}
```

### 2. Komponenty Muszą Mieć Jasne Props

```tsx
// ✅ DOBRZE - Typowane props
interface DocumentationHeaderProps {
  logo?: React.ReactNode;
  links: Array<{ label: string; href: string }>;
  search?: boolean;
  actions?: React.ReactNode;
}

// ❌ ŹLE - Brak typów
export function TopNavigation(props: any) {
  // ...
}
```

### 3. Komponenty Muszą Używać Innych Komponentów DS

```tsx
// ✅ DOBRZE - Używa komponentów DS
export function DocumentationHeader({ links }: Props) {
  return (
    <header>
      <NavigationMenu links={links} /> {/* Z DS */}
      <Input placeholder="Search..." /> {/* Z DS */}
    </header>
  );
}

// ❌ ŹLE - Customowe komponenty
export function TopNavigation() {
  return (
    <header>
      <CustomNav /> {/* Customowy */}
      <CustomSearch /> {/* Customowy */}
    </header>
  );
}
```

### 4. Style w `styles.css`, Nie Inline

```tsx
// ✅ DOBRZE - Style w styles.css
// packages/ui/src/styles.css
@layer components {
  [data-radix-navigation-menu-link] {
    text-decoration: none !important;
  }
}

// ❌ ŹLE - Inline style w komponencie (tylko jeśli konieczne)
<div style={{ textDecoration: "none" }} />
```

## 🔍 Jak Znaleźć Komponent do Edycji

### Metoda 1: Przeszukaj Kod

```bash
# Znajdź komponent po nazwie
grep -r "NavigationMenu" packages/ui/src/

# Znajdź komponent po funkcjonalności
grep -r "navigation.*menu" packages/ui/src/ -i
```

### Metoda 2: Sprawdź Registry

```bash
# Sprawdź registry
cat packages/registry/registry.json | grep -i navigation

# Znajdź plik komponentu
cat packages/registry/registry.json | jq '.components["navigation-menu"].files'
```

### Metoda 3: Sprawdź Dokumentację

```bash
# Sprawdź dokumentację komponentu
cat apps/www/app/docs/components/navigation-menu/page.tsx | grep -i import
```

## 📊 Struktura Komponentu DS

### Standardowa Struktura:

```tsx
// packages/ui/src/[component-name].tsx
"use client";

import * as React from "react";
import * as Primitive from "@radix-ui/react-[primitive]";
import clsx from "clsx";

// Types
export interface ComponentNameProps {
  // Props definition
}

// Component
export const ComponentName = React.forwardRef<
  React.ElementRef<typeof Primitive.Root>,
  ComponentNameProps
>(({ className, ...props }, ref) => {
  return (
    <Primitive.Root
      ref={ref}
      className={clsx(
        "base-classes",
        className
      )}
      {...props}
    />
  );
});

ComponentName.displayName = Primitive.Root.displayName;

// Sub-components
export const ComponentNameItem = React.forwardRef(/* ... */);

// Exports
export {
  ComponentName,
  ComponentNameItem,
};
```

## ✅ Checklist Edycji Komponentu DS

- [ ] Znalazłem komponent w `packages/ui/src/` lub `packages/blocks/src/`
- [ ] Edytowałem komponent
- [ ] Edytowałem style w `styles.css` (jeśli potrzebne)
- [ ] Zbudowałem pakiet: `pnpm --filter @fragment_ui/ui build`
- [ ] Zrestartowałem dev server
- [ ] Sprawdziłem zmiany w portalu
- [ ] Sprawdziłem czy nie zepsułem innych komponentów
- [ ] Zaktualizowałem dokumentację (jeśli potrzebne)
- [ ] Uruchomiłem testy (jeśli istnieją)

## 🎯 Najczęstsze Zadania

### Zmiana Koloru Tekstu:

```tsx
// packages/ui/src/navigation-menu.tsx
className={clsx(
  "text-[color:var(--foreground-primary)]", // ← Zmień tutaj
  className
)}
```

### Zmiana Padding:

```tsx
// packages/ui/src/navigation-menu.tsx
className={clsx(
  "px-2.5 py-1.5", // ← Zmień tutaj
  className
)}
```

### Usunięcie Podkreślenia:

```tsx
// packages/ui/src/navigation-menu.tsx
style={{
  textDecoration: "none", // ← Dodaj tutaj
  ...style,
}}
```

### Zmiana Hover Effect:

```css
/* packages/ui/src/styles.css */
[data-radix-navigation-menu-link]:hover {
  background-color: var(--color-surface-2); /* ← Zmień tutaj */
}
```

## 🚨 Częste Błędy

### ❌ Błąd 1: Edycja Komponentu w Portalu

```tsx
// ❌ ŹLE - Edycja w portalu
// apps/www/src/components/top-navigation.tsx
export function TopNavigation() {
  // Zmiany tutaj nie wpływają na DS
}
```

**Rozwiązanie:** Edytuj komponent w `packages/ui/src/` lub `packages/blocks/src/`

### ❌ Błąd 2: Zapomnienie o Zbudowaniu Pakietu

```bash
# ❌ ŹLE - Zmiany nie są widoczne
# Edytowałem komponent, ale nie zbudowałem pakietu
```

**Rozwiązanie:** Zawsze buduj pakiet po edycji:
```bash
pnpm --filter @fragment_ui/ui build
```

### ❌ Błąd 3: Hardcoded Wartości

```tsx
// ❌ ŹLE - Hardcoded wartości
export function TopNavigation() {
  return <NavigationMenu links={[{ label: "Docs", href: "/docs" }]} />;
}
```

**Rozwiązanie:** Użyj props:
```tsx
// ✅ DOBRZE - Props
export function TopNavigation({ links }: { links: Link[] }) {
  return <NavigationMenu links={links} />;
}
```

## 📚 Dodatkowe Zasoby

- **Strategia Refaktoryzacji:** `docs/PORTAL_DS_REFACTORING_STRATEGY.md`
- **Analiza Użycia DS:** `docs/DS_USAGE_ANALYSIS.md`
- **Registry:** `packages/registry/registry.json`

---

**Pamiętaj:** Komponenty DS są jedynym źródłem prawdy. Edytuj je bezpośrednio, a zmiany automatycznie wpływają na portal i wszystkie aplikacje.

