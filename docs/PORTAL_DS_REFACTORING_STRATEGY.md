# Strategia Refaktoryzacji Portalu DS - Jedno Źródło Prawdy

## 🎯 Cel

**Portal Design System powinien być w 100% zbudowany z komponentów Design System.**

To oznacza:
- ✅ Portal jest **przykładem** użycia DS
- ✅ Zmiany w DS automatycznie wpływają na portal
- ✅ Portal pokazuje **najlepsze praktyki** użycia DS
- ✅ Jeden źródło prawdy - komponenty w `packages/ui` i `packages/blocks`

## 📊 Obecny Stan

### Statystyki:
- **Komponenty używające DS:** ~15-20%
- **Customowe komponenty:** ~80-85%
- **Komponenty dokumentacji:** ~90% customowe

### Problem:
Portal ma wiele customowych komponentów, które powinny być częścią DS lub używać komponentów DS.

## 🏗️ Architektura Docelowa

### Zasada: "DS First"

```
┌─────────────────────────────────────────┐
│     Design System (packages/ui)         │
│  - Podstawowe komponenty                │
│  - Komponenty dokumentacji              │
│  - Komponenty nawigacji                 │
└─────────────────────────────────────────┘
              ▲              ▲
              │              │
    ┌─────────┘              └─────────┐
    │                                   │
┌───┴──────────────┐      ┌────────────┴───┐
│  Portal (www)    │      │  Inne aplikacje │
│  - Używa DS      │      │  - Używa DS     │
│  - Zero custom   │      │  - Zero custom  │
└──────────────────┘      └─────────────────┘
```

## 📋 Plan Działania

### Faza 1: Przeniesienie Komponentów do DS (2-3 tygodnie)

#### 1.1 Komponenty Dokumentacji → `@fragment_ui/ui`

**Priorytet P0:**

1. **`StabilityBadge`** → `packages/ui/src/stability-badge.tsx`
   - Status: Obecnie w `apps/www/src/components/stability-badge.tsx`
   - Akcja: Przenieś do `@fragment_ui/ui`, zaktualizuj importy

2. **`CodeBlock`** → `packages/ui/src/code-block.tsx`
   - Status: Obecnie w `apps/www/src/components/code-block.tsx`
   - Akcja: Przenieś do `@fragment_ui/ui`, dodaj do registry

3. **`TableOfContents`** → `packages/ui/src/table-of-contents.tsx`
   - Status: Obecnie w `apps/www/src/components/table-of-contents.tsx`
   - Akcja: Przenieś do `@fragment_ui/ui`, dodaj do registry

4. **`EditOnGitHub`** → `packages/ui/src/edit-on-github.tsx`
   - Status: Obecnie w `apps/www/src/components/edit-on-github.tsx`
   - Akcja: Przenieś do `@fragment_ui/ui`, dodaj do registry

**Priorytet P1:**

5. **`StorybookLink`** → `packages/ui/src/storybook-link.tsx`
6. **`VersionSwitcher`** → `packages/ui/src/version-switcher.tsx`

#### 1.2 Komponenty Nawigacji → `@fragment_ui/blocks`

**Priorytet P0:**

1. **`DocumentationHeader`** → `packages/blocks/src/documentation-header.tsx`
   - Bazuje na: `apps/www/src/components/top-navigation.tsx`
   - Props: `logo`, `links`, `search`, `actions`
   - Akcja: Utwórz nowy block, zastąp `TopNavigation`

2. **`DocumentationSidebar`** → `packages/blocks/src/documentation-sidebar.tsx`
   - Bazuje na: `apps/www/src/components/sidebar-navigation.tsx`
   - Props: `sections`, `currentPath`, `collapsible`
   - Akcja: Utwórz nowy block, zastąp `SidebarNavigation`

3. **`DocumentationLayout`** → `packages/blocks/src/documentation-layout.tsx`
   - Bazuje na: `apps/www/src/components/doc-layout.tsx`
   - Props: `header`, `sidebar`, `content`, `rightSidebar`
   - Akcja: Utwórz nowy block, zastąp `DocLayout`

**Priorytet P1:**

4. **`CommandPalette`** → `packages/ui/src/command-palette.tsx`
   - Bazuje na: `apps/www/src/components/search.tsx`
   - Akcja: Utwórz komponent DS, zastąp `Search`

### Faza 2: Refaktoryzacja Portalu (2-3 tygodnie)

#### 2.1 Zastąp Customowe Komponenty

**Krok po kroku:**

1. **Zaktualizuj importy:**
   ```tsx
   // PRZED
   import { StabilityBadge } from "../../src/components/stability-badge";
   
   // PO
   import { StabilityBadge } from "@fragment_ui/ui";
   ```

2. **Zastąp komponenty nawigacji:**
   ```tsx
   // PRZED
   import { TopNavigation } from "./top-navigation";
   import { SidebarNavigation } from "./sidebar-navigation";
   
   // PO
   import { DocumentationHeader, DocumentationSidebar, DocumentationLayout } from "@fragment_ui/blocks";
   ```

3. **Zastąp komponenty dokumentacji:**
   ```tsx
   // PRZED
   import { CodeBlock } from "../../src/components/code-block";
   import { TableOfContents } from "../../src/components/table-of-contents";
   
   // PO
   import { CodeBlock, TableOfContents } from "@fragment_ui/ui";
   ```

#### 2.2 Usuń Customowe Komponenty

Po zastąpieniu wszystkich użyć, usuń:
- `apps/www/src/components/stability-badge.tsx`
- `apps/www/src/components/code-block.tsx`
- `apps/www/src/components/table-of-contents.tsx`
- `apps/www/src/components/top-navigation.tsx`
- `apps/www/src/components/sidebar-navigation.tsx`
- `apps/www/src/components/doc-layout.tsx`
- `apps/www/src/components/search.tsx` (po zastąpieniu `CommandPalette`)

### Faza 3: Weryfikacja i Testy (1 tydzień)

1. **Sprawdź wszystkie strony dokumentacji**
2. **Uruchom testy E2E**
3. **Sprawdź bundle size**
4. **Weryfikuj responsywność**

## 🔧 Proces Edycji Komponentów DS

### Krok 1: Edytuj Komponent w DS

```bash
# Edytuj komponent w DS
packages/ui/src/navigation-menu.tsx
packages/ui/src/styles.css
```

### Krok 2: Zbuduj Pakiet DS

```bash
pnpm --filter @fragment_ui/ui build
```

### Krok 3: Zmiany Automatycznie w Portalu

Portal automatycznie używa zbudowanego pakietu DS, więc zmiany są widoczne od razu.

### Przykład: Edycja NavigationMenu

1. **Edytuj:** `packages/ui/src/navigation-menu.tsx`
2. **Zbuduj:** `pnpm --filter @fragment_ui/ui build`
3. **Zrestartuj:** `pnpm dev`
4. **Sprawdź:** Portal automatycznie używa nowej wersji

## 📐 Zasady Projektowania Komponentów DS

### 1. Komponenty Muszą Być Reużywalne

```tsx
// ✅ DOBRZE - Komponent DS
export function DocumentationHeader({
  logo,
  links,
  search,
  actions,
}: DocumentationHeaderProps) {
  // Używa komponentów DS wewnątrz
  return (
    <header>
      <NavigationMenu>{/* ... */}</NavigationMenu>
      <Input placeholder="Search..." />
    </header>
  );
}

// ❌ ŹLE - Customowy komponent w portalu
export function TopNavigation() {
  // Customowa logika, nie reużywalna
}
```

### 2. Komponenty Muszą Mieć Jasne Props

```tsx
// ✅ DOBRZE
interface DocumentationHeaderProps {
  logo?: React.ReactNode;
  links: Array<{ label: string; href: string }>;
  search?: boolean;
  actions?: React.ReactNode;
}

// ❌ ŹLE - Hardcoded wartości
export function TopNavigation() {
  // Hardcoded links, logo, etc.
}
```

### 3. Komponenty Muszą Być Dokumentowane

Każdy komponent DS powinien mieć:
- ✅ Dokumentację w `apps/www/app/docs/components/[component]/page.tsx`
- ✅ Registry entry w `packages/registry/registry.json`
- ✅ TypeScript types
- ✅ Przykłady użycia

## 🎨 Przykład: Migracja TopNavigation → DocumentationHeader

### PRZED (Customowy komponent):

```tsx
// apps/www/src/components/top-navigation.tsx
export function TopNavigation() {
  return (
    <header>
      {/* Hardcoded logo, links, search */}
    </header>
  );
}
```

### PO (Komponent DS):

```tsx
// packages/blocks/src/documentation-header.tsx
export function DocumentationHeader({
  logo,
  links,
  search = true,
  actions,
}: DocumentationHeaderProps) {
  return (
    <header>
      {logo}
      <NavigationMenu links={links} />
      {search && <CommandPalette />}
      {actions}
    </header>
  );
}

// apps/www/src/components/conditional-layout.tsx
import { DocumentationHeader } from "@fragment_ui/blocks";

export function ConditionalLayout({ children }) {
  return (
    <DocumentationHeader
      logo={<Logo />}
      links={[
        { label: "Docs", href: "/docs" },
        { label: "Components", href: "/components" },
      ]}
      search={true}
      actions={<ThemeToggle />}
    />
    {children}
  );
}
```

## 📊 Metryki Sukcesu

### Przed Refaktoryzacją:
- Customowe komponenty: ~80-85%
- Komponenty DS: ~15-20%

### Po Refaktoryzacji:
- Customowe komponenty: ~5-10% (tylko Next.js specific)
- Komponenty DS: ~90-95%

### Korzyści:
- ✅ **Spójność:** Cały portal używa tych samych komponentów
- ✅ **Utrzymanie:** Zmiany w DS automatycznie w portalu
- ✅ **Dokumentacja:** Portal jest przykładem użycia DS
- ✅ **Bundle size:** Mniej duplikacji kodu
- ✅ **Development:** Szybsze dodawanie nowych funkcji

## 🚀 Quick Start: Jak Zacząć

### 1. Wybierz Komponent do Migracji

Zacznij od prostych komponentów:
- `StabilityBadge` (najprostszy)
- `CodeBlock`
- `TableOfContents`

### 2. Przenieś do DS

```bash
# 1. Skopiuj komponent do DS
cp apps/www/src/components/stability-badge.tsx packages/ui/src/stability-badge.tsx

# 2. Zaktualizuj importy w komponencie
# 3. Dodaj do packages/ui/src/index.ts
export { StabilityBadge } from "./stability-badge";

# 4. Zbuduj pakiet
pnpm --filter @fragment_ui/ui build
```

### 3. Zaktualizuj Portal

```bash
# 1. Zaktualizuj importy w portalu
# apps/www/app/docs/components/*/page.tsx
# Zmień: import { StabilityBadge } from "../../../../src/components/stability-badge";
# Na: import { StabilityBadge } from "@fragment_ui/ui";

# 2. Usuń stary komponent
rm apps/www/src/components/stability-badge.tsx
```

### 4. Zweryfikuj

```bash
# 1. Uruchom portal
pnpm dev

# 2. Sprawdź czy wszystko działa
# 3. Uruchom testy
pnpm test
```

## 📝 Checklist Migracji Komponentu

- [ ] Komponent przeniesiony do `packages/ui` lub `packages/blocks`
- [ ] Zaktualizowane importy w komponencie
- [ ] Komponent dodany do `index.ts`
- [ ] Komponent dodany do registry (jeśli potrzebne)
- [ ] Dokumentacja zaktualizowana
- [ ] Wszystkie importy w portalu zaktualizowane
- [ ] Stary komponent usunięty
- [ ] Testy przechodzą
- [ ] Bundle size sprawdzony
- [ ] Responsywność zweryfikowana

## 🎯 Priorytety

### P0 - Krytyczne (Zrób Najpierw):
1. `StabilityBadge` → `@fragment_ui/ui`
2. `DocumentationHeader` → `@fragment_ui/blocks`
3. `DocumentationSidebar` → `@fragment_ui/blocks`
4. `DocumentationLayout` → `@fragment_ui/blocks`

### P1 - Ważne:
5. `CodeBlock` → `@fragment_ui/ui`
6. `TableOfContents` → `@fragment_ui/ui`
7. `CommandPalette` → `@fragment_ui/ui`

### P2 - Nice to Have:
8. `EditOnGitHub` → `@fragment_ui/ui`
9. `StorybookLink` → `@fragment_ui/ui`
10. `VersionSwitcher` → `@fragment_ui/ui`

## 🔄 Ciągła Integracja

Po refaktoryzacji, każda zmiana w DS automatycznie:
- ✅ Wpływa na portal
- ✅ Jest widoczna w dokumentacji
- ✅ Jest przetestowana przez E2E testy

## 📚 Dokumentacja Procesu

Każdy komponent DS powinien mieć:
- ✅ Dokumentację w portalu
- ✅ Przykłady użycia
- ✅ Props documentation
- ✅ Accessibility notes
- ✅ Registry entry

---

**Następny Krok:** Rozpocznij migrację od `StabilityBadge` - najprostszy komponent do przeniesienia.

