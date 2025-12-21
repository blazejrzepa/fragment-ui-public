# Plan integracji wszystkich komponentów i bloków

**Data:** 2025-01-XX  
**Status:** W trakcie  
**Wzorzec:** Accordion Implementation Analysis

---

## 🎯 Cel

Zintegrować wszystkie komponenty i bloki zgodnie ze ścieżką Accordion, aby:
1. Wszystkie komponenty miały pełne metadane w registry (description, props, features, examples, a11y)
2. Wszystkie compound components miały specjalną obsługę w generatorach kodu
3. Wszystkie komponenty działały poprawnie w Studio (left sidebar, Library, Preview, Inspector)

---

## 📊 Analiza obecnego stanu

### Komponenty z pełnymi metadanymi (5):
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Tabs
- ✅ Accordion

### Komponenty bez pełnych metadanych (83):
- Form, FormField, FormFieldEnhanced, PasswordInput
- Checkbox, Select, Switch, Textarea
- TabsList, TabTrigger, TabContent
- Table, Badge
- Alert, AspectRatio, Avatar, Breadcrumbs
- Calendar, Carousel, Collapsible, ColorPicker
- Combobox, CommandPalette, ContextMenu
- DataTable, DatePicker, Dialog, DropdownMenu
- FileUpload, HoverCard, Kbd, Menubar
- MultiSelect, NavigationMenu, Pagination
- Popover, Progress, Radio, Rating
- Resizable, ScrollArea, SegmentedControl
- Separator, Sheet, Skeleton, Slider
- Spinner, SplitButton, Stepper
- TagInput, Timeline, Toast, Toggle
- ToggleGroup, Tooltip, TreeView
- metric-card, activity-feed, quick-actions
- filter-bar, notification-list, chart
- hero-section, widget-container, dashboard-widgets
- authentication-block, card-grid, dashboard-layout
- navigation-header, pricing-table, settings-screen
- voice-chat-panel, benefits-section, comparison-section
- footer-section, kpi-dashboard, analytics-dashboard

### Compound Components (wymagają subkomponentów):
1. **Accordion** ✅ - AccordionItem, AccordionTrigger, AccordionContent
2. **Tabs** ✅ - TabsList, TabsTrigger, TabsContent
3. **Select** - SelectTrigger, SelectValue, SelectContent, SelectItem
4. **Dialog** - DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
5. **Table** - TableHeader, TableBody, TableRow, TableHead, TableCell
6. **Card** ✅ - CardHeader, CardTitle, CardContent, CardFooter
7. **Form** - FormField, FormFieldEnhanced (może wymagać Input)
8. **DropdownMenu** - DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
9. **ContextMenu** - ContextMenuTrigger, ContextMenuContent, ContextMenuItem
10. **NavigationMenu** - NavigationMenuList, NavigationMenuItem, NavigationMenuContent
11. **Menubar** - MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem
12. **Popover** - PopoverTrigger, PopoverContent
13. **HoverCard** - HoverCardTrigger, HoverCardContent
14. **Sheet** - SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
15. **CommandPalette** - CommandPaletteTrigger, CommandPaletteContent (może być prosty)
16. **Combobox** - ComboboxTrigger, ComboboxContent, ComboboxItem
17. **MultiSelect** - MultiSelectTrigger, MultiSelectContent, MultiSelectItem

---

## 🔧 Plan działania

### Faza 1: Compound Components (Priorytet 1)
1. **Select** - dodać pełne metadane + specjalną obsługę
2. **Dialog** - dodać pełne metadane + specjalną obsługę
3. **Table** - dodać pełne metadane + specjalną obsługę
4. **DropdownMenu** - dodać pełne metadane + specjalną obsługę
5. **ContextMenu** - dodać pełne metadane + specjalną obsługę
6. **NavigationMenu** - dodać pełne metadane + specjalną obsługę
7. **Menubar** - dodać pełne metadane + specjalną obsługę
8. **Popover** - dodać pełne metadane + specjalną obsługę
9. **HoverCard** - dodać pełne metadane + specjalną obsługę
10. **Sheet** - dodać pełne metadane + specjalną obsługę
11. **Combobox** - dodać pełne metadane + specjalną obsługę
12. **MultiSelect** - dodać pełne metadane + specjalną obsługę

### Faza 2: Proste komponenty (Priorytet 2)
1. **Alert** - dodać pełne metadane
2. **Badge** - dodać pełne metadane
3. **Button** ✅ - już ma pełne metadane
4. **Input** ✅ - już ma pełne metadane
5. **Checkbox** - dodać pełne metadane
6. **Switch** - dodać pełne metadane
7. **Radio** - dodać pełne metadane
8. **Textarea** - dodać pełne metadane
9. **Progress** - dodać pełne metadane
10. **Slider** - dodać pełne metadane
11. **Spinner** - dodać pełne metadane
12. **Skeleton** - dodać pełne metadane
13. **Separator** - dodać pełne metadane
14. **Avatar** - dodać pełne metadane
15. **Breadcrumbs** - dodać pełne metadane
16. **Tooltip** - dodać pełne metadane
17. **Toast** - dodać pełne metadane
18. **Kbd** - dodać pełne metadane
19. **AspectRatio** - dodać pełne metadane
20. **ScrollArea** - dodać pełne metadane
21. **Resizable** - dodać pełne metadane
22. **Toggle** - dodać pełne metadane
23. **ToggleGroup** - dodać pełne metadane
24. **Stepper** - dodać pełne metadane
25. **TagInput** - dodać pełne metadane
26. **Timeline** - dodać pełne metadane
27. **Rating** - dodać pełne metadane
28. **Pagination** - dodać pełne metadane
29. **Calendar** - dodać pełne metadane
30. **DatePicker** - dodać pełne metadane
31. **ColorPicker** - dodać pełne metadane
32. **FileUpload** - dodać pełne metadane
33. **Carousel** - dodać pełne metadane
34. **Collapsible** - dodać pełne metadane
35. **TreeView** - dodać pełne metadane
36. **SegmentedControl** - dodać pełne metadane
37. **SplitButton** - dodać pełne metadane

### Faza 3: Bloki (Priorytet 3)
1. **metric-card** - dodać pełne metadane
2. **activity-feed** - dodać pełne metadane
3. **quick-actions** - dodać pełne metadane
4. **filter-bar** - dodać pełne metadane
5. **notification-list** - dodać pełne metadane
6. **chart** - dodać pełne metadane
7. **hero-section** - dodać pełne metadane
8. **widget-container** - dodać pełne metadane
9. **dashboard-widgets** - dodać pełne metadane
10. **authentication-block** - dodać pełne metadane
11. **card-grid** - dodać pełne metadane
12. **dashboard-layout** - dodać pełne metadane
13. **navigation-header** - dodać pełne metadane
14. **pricing-table** - dodać pełne metadane
15. **settings-screen** - dodać pełne metadane
16. **voice-chat-panel** - dodać pełne metadane
17. **benefits-section** - dodać pełne metadane
18. **comparison-section** - dodać pełne metadane
19. **footer-section** - dodać pełne metadane
20. **kpi-dashboard** - dodać pełne metadane
21. **analytics-dashboard** - dodać pełne metadane

---

## 📝 Wzorzec implementacji (na podstawie Accordion)

### 1. Registry (packages/registry/registry.json)
```json
{
  "ComponentName": {
    "import": "@fragment_ui/ui/component-name",
    "description": "Opis komponentu...",
    "props": {
      "prop1": "type | [\"value1\", \"value2\"]",
      "prop2": "boolean"
    },
    "variants": [
      {
        "name": "variant1",
        "props": { "prop1": "value1" },
        "description": "Opis wariantu"
      }
    ],
    "slots": ["slot1", "slot2"],
    "features": [
      "Feature 1",
      "Feature 2"
    ],
    "a11y": {
      "role": "role-name",
      "notes": "Notatki o dostępności",
      "wcag": ["2.1.1", "2.1.2", "4.1.2"]
    },
    "note": "Wymagane subkomponenty (jeśli compound)",
    "related": ["RelatedComponent1", "RelatedComponent2"],
    "examples": [
      {
        "name": "default",
        "code": "import { Component } from \"@fragment_ui/ui/component\";\n\nexport default function Preview() {\n  return <Component />;\n}",
        "description": "Opis przykładu"
      }
    ]
  }
}
```

### 2. ComponentCodeGenerator (apps/demo/src/lib/component-code-generator.ts)
```typescript
// Dla compound components:
private generateComponentNameJSX(metadata: ComponentMetadata): string {
  // Generuj pełną strukturę z subkomponentami
}

// W generateComponentJSX():
if (metadata.actualName === 'ComponentName') {
  return this.generateComponentNameJSX(metadata);
}

// W generateSimpleComponent():
if (metadata.actualName === 'ComponentName') {
  additionalComponents.push('SubComponent1', 'SubComponent2');
}
```

### 3. useComponentPreview (packages/ui/src/component-display/hooks/useComponentPreview.ts)
```typescript
// W compoundComponents:
"componentname": "Component, SubComponent1, SubComponent2",

// W generate basic usage:
if (normalizedName === "componentname") {
  return `import { ... } from "${packageName}";
export default function Preview() {
  return (
    <Component>
      <SubComponent1>...</SubComponent1>
    </Component>
  );
}`;
}
```

---

## 🚀 Rozpoczęcie implementacji

Zaczynamy od Fazy 1 - Compound Components, zaczynając od najczęściej używanych:
1. ✅ Select - **ZAKOŃCZONE**
2. ✅ Dialog - **ZAKOŃCZONE**
3. ⏳ Table - **W TRAKCIE**
4. ⏳ DropdownMenu - **OCZEKUJE**

---

## ✅ Postęp implementacji

### Zakończone (3/17 compound components):
1. ✅ **Accordion** - Pełne metadane, specjalna obsługa w generatorach
2. ✅ **Select** - Pełne metadane, specjalna obsługa w generatorach
3. ✅ **Dialog** - Pełne metadane, specjalna obsługa w generatorach

### W trakcie:
- Table
- DropdownMenu
- ContextMenu
- NavigationMenu
- Menubar
- Popover
- HoverCard
- Sheet
- Combobox
- MultiSelect

### Oczekuje:
- Pozostałe compound components
- Proste komponenty (Faza 2)
- Bloki (Faza 3)

