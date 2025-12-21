# Analiza implementacji Accordion - Wszystkie kroki

**Data:** 2025-01-XX  
**Status:** Zakończone  
**Komponent:** Accordion

---

## 📋 Przegląd problemów i rozwiązań

Accordion przeszedł przez kilka etapów napraw, aby działać poprawnie we wszystkich miejscach w aplikacji:
1. **Widoczność w registry** - Accordion nie był widoczny w left pane i Library
2. **Renderowanie w Preview** - Accordion nie wyświetlał się poprawnie (pokazywał tylko "Example")
3. **Inspector w right pane** - Inspector nie był widoczny dla DS Components
4. **Podgląd w Library** - Accordion nie wyświetlał się w podglądzie w Library tab

---

## 🔍 Problem 1: Accordion nie widoczny w left pane i Library

### Symptomy:
- Accordion nie pojawiał się w left sidebar (Components)
- Accordion nie pojawiał się w Library tab
- Registry API zwracało stary plik `apps/demo/registry.json` zamiast `packages/registry/registry.json`

### Przyczyna:
- API endpoint `/api/registry` w `apps/demo/app/api/registry/route.ts` próbował załadować registry z kilku ścieżek, ale priorytetyzował lokalny plik `apps/demo/registry.json` (który miał tylko 36 komponentów) zamiast głównego `packages/registry/registry.json` (który miał 88 komponentów, w tym Accordion)

### Rozwiązanie:

**Plik:** `apps/demo/app/api/registry/route.ts`

```typescript
// PRZED: Priorytetyzował apps/demo/registry.json
const possiblePaths = [
  join(process.cwd(), "apps/demo/registry.json"), // ❌ Stary plik
  join(process.cwd(), "packages/registry/registry.json"), // ✅ Główny plik
];

// PO: Priorytetyzuje packages/registry/registry.json
const possiblePaths = [
  join(process.cwd(), "packages/registry/registry.json"), // ✅ Główny plik (pierwszy)
  join(__dirname, "../../../../packages/registry/registry.json"), // ✅ Alternatywna ścieżka
  join(process.cwd(), "apps/demo/registry.json"), // ⚠️ Fallback
  join(__dirname, "../../../registry.json"), // ⚠️ Fallback
];
```

**Efekt:**
- Registry API teraz ładuje `packages/registry/registry.json` jako pierwszy
- Accordion jest dostępny w registry (88 komponentów zamiast 36)
- Accordion pojawia się w left sidebar i Library tab

---

## 🔍 Problem 2: Accordion nie renderuje się poprawnie w Preview

### Symptomy:
- Po kliknięciu Accordion w left sidebar, Preview pokazywał tylko tekst "Example"
- Accordion nie wyświetlał się jako funkcjonalny komponent z AccordionItem, AccordionTrigger, AccordionContent

### Przyczyna:
- `ComponentCodeGenerator` traktował Accordion jako prosty komponent (self-closing lub z prostym tekstem)
- Generował kod: `<Accordion>Example</Accordion>` zamiast pełnej struktury z subkomponentami
- Accordion jest komponentem złożonym (compound component), który wymaga:
  - `AccordionItem`
  - `AccordionTrigger`
  - `AccordionContent`

### Rozwiązanie:

**Plik:** `apps/demo/src/lib/component-code-generator.ts`

#### 1. Dodano specjalną metodę `generateAccordionJSX()`:

```typescript
/**
 * Generates JSX for Accordion component
 * Accordion is a compound component that requires AccordionItem, AccordionTrigger, and AccordionContent
 */
private generateAccordionJSX(metadata: ComponentMetadata): string {
  const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
  return `<${metadata.actualName} type="single" collapsible className="w-full" ${dataUiId}>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>
        Yes. It comes with default styles that matches the Fragment UI aesthetic.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Is it animated?</AccordionTrigger>
      <AccordionContent>
        Yes. It's animated by default, but you can disable it if you prefer.
      </AccordionContent>
    </AccordionItem>
  </${metadata.actualName}>`;
}
```

#### 2. Zaktualizowano `generateComponentJSX()` aby używać specjalnej metody:

```typescript
private generateComponentJSX(metadata: ComponentMetadata): string {
  // Special handling for components that require specific props
  if (metadata.actualName === 'Accordion') {
    return this.generateAccordionJSX(metadata); // ✅ Używa specjalnej metody
  }
  // ... reszta logiki
}
```

#### 3. Zaktualizowano `generateSimpleComponent()` aby importować subkomponenty:

```typescript
private generateSimpleComponent(metadata: ComponentMetadata): string {
  let additionalComponents: string[] = [];
  if (metadata.actualName === 'FormField') {
    additionalComponents.push('Input');
  }
  // ✅ Dodano import subkomponentów dla Accordion
  if (metadata.actualName === 'Accordion') {
    additionalComponents.push('AccordionItem', 'AccordionTrigger', 'AccordionContent');
  }

  const imports = this.generateImports(metadata, additionalComponents);
  // ... reszta logiki
}
```

**Efekt:**
- Accordion teraz generuje pełny, poprawny kod z wszystkimi subkomponentami
- Preview wyświetla funkcjonalny Accordion z 3 elementami
- Kod jest zgodny z wymaganiami Accordion (compound component)

---

## 🔍 Problem 3: Inspector nie widoczny w right pane dla DS Components

### Symptomy:
- Po kliknięciu Accordion w left sidebar, Inspector nie był widoczny w right pane
- Inspector był widoczny tylko dla user-generated projects, nie dla Design System Components

### Przyczyna:
- Logika `showInspectorTab` w `PlaygroundCopilotInspector` sprawdzała tylko `hasProjects` (czy są user-generated projects)
- Nie sprawdzała `isDSComponent` (czy aktywny jest Design System Component)
- Accordion jest DS Component, więc Inspector nie był widoczny

### Rozwiązanie:

**Plik:** `apps/demo/src/components/playground/playground-copilot-inspector.tsx`

#### 1. Dodano prop `isDSComponent`:

```typescript
export const PlaygroundCopilotInspector = React.memo(function PlaygroundCopilotInspector({
  // ... inne props
  isDSComponent = false, // ✅ Nowy prop
  // ...
}: PlaygroundCopilotInspectorProps) {
```

#### 2. Zaktualizowano logikę `showInspectorTab`:

```typescript
// PRZED:
const showInspectorTab = hasProjects && code && code.trim() !== "";

// PO:
const showInspectorTab = (hasProjects || isDSComponent) && code && code.trim() !== "";
```

#### 3. Przekazano `isDSComponent` z `PlaygroundRightSidebarWrapper`:

**Plik:** `apps/demo/src/components/playground/playground-right-sidebar-wrapper.tsx`

```typescript
<PlaygroundCopilotInspector
  // ... inne props
  isDSComponent={activeDsComponentTab !== null} // ✅ Przekazuje informację o DS Component
  // ...
/>
```

**Efekt:**
- Inspector jest teraz widoczny dla Design System Components (w tym Accordion)
- Inspector wyświetla właściwości i kod dla Accordion
- Użytkownik może edytować właściwości Accordion w Inspector

---

## 🔍 Problem 4: Accordion nie wyświetla się w podglądzie w Library

### Symptomy:
- Accordion był widoczny w Library tab (lista komponentów)
- Ale podgląd (preview) Accordion nie wyświetlał się poprawnie
- Pokazywał "Loading preview..." lub błąd

### Przyczyna:
- `useComponentPreview` sprawdzało `componentName === "accordion"` (lowercase)
- Ale w registry komponent nazywa się "Accordion" (PascalCase)
- Kod nie był generowany poprawnie dla Accordion

### Rozwiązanie:

**Plik:** `packages/ui/src/component-display/hooks/useComponentPreview.ts`

#### 1. Dodano normalizację nazwy komponentu:

```typescript
// Normalize component name for comparison (handle both PascalCase and lowercase)
const normalizedName = componentName.toLowerCase();
```

#### 2. Zaktualizowano sprawdzanie dla Accordion:

```typescript
// PRZED:
if (componentName === "accordion") { // ❌ Nie działało dla "Accordion"

// PO:
if (normalizedName === "accordion") { // ✅ Działa dla "Accordion" i "accordion"
```

#### 3. Poprawiono generowanie kodu dla Accordion:

```typescript
if (normalizedName === "accordion") {
  const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content for item 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content for item 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}`;
  return code;
}
```

**Efekt:**
- Accordion teraz generuje poprawny kod niezależnie od wielkości liter w nazwie
- Podgląd w Library wyświetla funkcjonalny Accordion
- Kod jest zgodny z wymaganiami `ReactLiveRenderer` (ma `export default function Preview()`)

---

## 📊 Podsumowanie zmian w plikach

### 1. Registry API (`apps/demo/app/api/registry/route.ts`)
- ✅ Zmieniono priorytety ścieżek - `packages/registry/registry.json` jest pierwszy
- ✅ Dodano debug logging

### 2. Component Code Generator (`apps/demo/src/lib/component-code-generator.ts`)
- ✅ Dodano metodę `generateAccordionJSX()` dla specjalnej obsługi Accordion
- ✅ Zaktualizowano `generateComponentJSX()` aby używać specjalnej metody
- ✅ Zaktualizowano `generateSimpleComponent()` aby importować subkomponenty

### 3. Component Renderer (`apps/demo/src/lib/component-renderer.ts`)
- ✅ Zaktualizowano `ensureRenderCall()` aby używać `render(${componentName}())` zamiast `render(React.createElement(...))`

### 4. Left Sidebar (`apps/demo/src/components/playground/playground-left-sidebar.tsx`)
- ✅ Dodano `formatComponentName()` helper do formatowania nazw komponentów
- ✅ Dodano debug logging dla Accordion

### 5. Right Sidebar Inspector (`apps/demo/src/components/playground/playground-copilot-inspector.tsx`)
- ✅ Dodano prop `isDSComponent`
- ✅ Zaktualizowano logikę `showInspectorTab` aby uwzględniać DS Components

### 6. Right Sidebar Wrapper (`apps/demo/src/components/playground/playground-right-sidebar-wrapper.tsx`)
- ✅ Przekazano `isDSComponent={activeDsComponentTab !== null}` do Inspector

### 7. Component Preview Hook (`packages/ui/src/component-display/hooks/useComponentPreview.ts`)
- ✅ Dodano normalizację nazwy komponentu (`normalizedName`)
- ✅ Zaktualizowano sprawdzanie dla Accordion aby używać `normalizedName`
- ✅ Poprawiono generowanie kodu dla Accordion (2 elementy zamiast 1)
- ✅ Dodano debug logging

### 8. Component Preview (`packages/ui/src/component-display/ComponentPreview.tsx`)
- ✅ Dodano debug logging dla Accordion
- ✅ Dodano lepsze error handling

### 9. React Live Renderer (`apps/demo/src/components/react-live-renderer.tsx`)
- ✅ Zaktualizowano regex do wykrywania camelCase i PascalCase nazw funkcji
- ✅ Zaktualizowano `ensureRenderCall()` aby używać `render(${componentName}())`

---

## 🎯 Rezultat końcowy

Po wszystkich zmianach, Accordion działa poprawnie we wszystkich miejscach:

1. ✅ **Left Sidebar (Components)** - Accordion jest widoczny i można go kliknąć
2. ✅ **Library Tab** - Accordion jest widoczny w liście i ma poprawny podgląd
3. ✅ **Preview** - Accordion renderuje się poprawnie z wszystkimi subkomponentami
4. ✅ **Inspector (Right Pane)** - Inspector jest widoczny i wyświetla właściwości Accordion
5. ✅ **Documentation** - Accordion ma pełną dokumentację w `apps/www/app/docs/components/accordion/page.tsx`

---

## 🔧 Kluczowe lekcje

1. **Registry jako źródło prawdy** - Wszystkie komponenty powinny być w `packages/registry/registry.json`
2. **Compound Components** - Komponenty złożone (jak Accordion) wymagają specjalnej obsługi w generatorach kodu
3. **Normalizacja nazw** - Nazwy komponentów mogą być w różnych formatach (PascalCase, lowercase), więc należy je normalizować
4. **DS Components vs User Projects** - Inspector powinien być widoczny dla obu typów komponentów
5. **Debug logging** - Pomaga w identyfikacji problemów podczas developmentu

---

## 📝 Następne kroki (opcjonalne)

1. Dodać więcej metadanych do Accordion w registry (description, features, examples)
2. Zautomatyzować dodawanie nowych compound components do generatora kodu
3. Dodać testy dla Accordion w różnych miejscach aplikacji
4. Zoptymalizować generowanie kodu dla innych compound components (Tabs, Select, Dialog)

---

**Autor:** AI Assistant  
**Data utworzenia:** 2025-01-XX  
**Ostatnia aktualizacja:** 2025-01-XX

