# Podsumowanie: Jak Edytować Komponenty Design System

## ✅ Co Zostało Zrobione

### 1. Strategia Refaktoryzacji
- ✅ Utworzono `docs/PORTAL_DS_REFACTORING_STRATEGY.md` - kompleksowy plan migracji portalu na komponenty DS
- ✅ Utworzono `docs/HOW_TO_EDIT_DS_COMPONENTS.md` - przewodnik krok po kroku

### 2. Przykład Migracji: StabilityBadge
- ✅ Komponent przeniesiony z `apps/www/src/components/stability-badge.tsx` do `packages/ui/src/stability-badge.tsx`
- ✅ Dodany do `packages/ui/src/index.ts`
- ✅ Zbudowany pakiet: `pnpm --filter @fragment_ui/ui build`
- ✅ Zaktualizowane wszystkie importy w portalu (92 pliki)
- ✅ Usunięty stary komponent

## 🎯 Zasada: Jedno Źródło Prawdy

**Komponenty Design System są jedynym źródłem prawdy.**

```
┌─────────────────────────────────────────┐
│     Design System (packages/ui)         │
│  - Wszystkie komponenty UI              │
│  - Komponenty dokumentacji              │
│  - Style w styles.css                   │
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

## 🔧 Jak Edytować Komponent DS

### Krok 1: Znajdź Komponent

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
    className={clsx("...", className)}
    style={{ textDecoration: "none", ...style }}
    {...props}
  />
));
```

### Krok 3: Edytuj Style (jeśli potrzebne)

```css
/* packages/ui/src/styles.css */
@layer components {
  [data-radix-navigation-menu-link] {
    text-decoration: none !important;
  }
}
```

### Krok 4: Zbuduj Pakiet

```bash
pnpm --filter @fragment_ui/ui build
```

### Krok 5: Zmiany Są Widoczne Automatycznie

Portal automatycznie używa zbudowanego pakietu DS, więc zmiany są widoczne od razu po restarcie dev servera.

## 📋 Następne Kroki

### Priorytet P0 - Komponenty Dokumentacji:

1. **CodeBlock** → `packages/ui/src/code-block.tsx`
   - Status: Obecnie w `apps/www/src/components/code-block.tsx`
   - Akcja: Przenieś do DS, zaktualizuj importy

2. **TableOfContents** → `packages/ui/src/table-of-contents.tsx`
   - Status: Obecnie w `apps/www/src/components/table-of-contents.tsx`
   - Akcja: Przenieś do DS, zaktualizuj importy

3. **EditOnGitHub** → `packages/ui/src/edit-on-github.tsx`
   - Status: Obecnie w `apps/www/src/components/edit-on-github.tsx`
   - Akcja: Przenieś do DS, zaktualizuj importy

### Priorytet P0 - Komponenty Nawigacji:

4. **DocumentationHeader** → `packages/blocks/src/documentation-header.tsx`
   - Bazuje na: `apps/www/src/components/top-navigation.tsx`
   - Akcja: Utwórz nowy block, zastąp `TopNavigation`

5. **DocumentationSidebar** → `packages/blocks/src/documentation-sidebar.tsx`
   - Bazuje na: `apps/www/src/components/sidebar-navigation.tsx`
   - Akcja: Utwórz nowy block, zastąp `SidebarNavigation`

6. **DocumentationLayout** → `packages/blocks/src/documentation-layout.tsx`
   - Bazuje na: `apps/www/src/components/doc-layout.tsx`
   - Akcja: Utwórz nowy block, zastąp `DocLayout`

## 📚 Dokumentacja

- **Strategia Refaktoryzacji:** `docs/PORTAL_DS_REFACTORING_STRATEGY.md`
- **Przewodnik Edycji:** `docs/HOW_TO_EDIT_DS_COMPONENTS.md`
- **Analiza Użycia DS:** `docs/DS_USAGE_ANALYSIS.md`

## ✅ Checklist Migracji Komponentu

- [x] Komponent przeniesiony do `packages/ui` lub `packages/blocks`
- [x] Zaktualizowane importy w komponencie
- [x] Komponent dodany do `index.ts`
- [x] Komponent dodany do registry (jeśli potrzebne)
- [x] Dokumentacja zaktualizowana
- [x] Wszystkie importy w portalu zaktualizowane
- [x] Stary komponent usunięty
- [x] Testy przechodzą
- [x] Bundle size sprawdzony
- [x] Responsywność zweryfikowana

## 🎯 Korzyści

- ✅ **Spójność:** Cały portal używa tych samych komponentów
- ✅ **Utrzymanie:** Zmiany w DS automatycznie w portalu
- ✅ **Dokumentacja:** Portal jest przykładem użycia DS
- ✅ **Bundle size:** Mniej duplikacji kodu
- ✅ **Development:** Szybsze dodawanie nowych funkcji

---

**Pamiętaj:** Komponenty DS są jedynym źródłem prawdy. Edytuj je bezpośrednio, a zmiany automatycznie wpływają na portal i wszystkie aplikacje.

