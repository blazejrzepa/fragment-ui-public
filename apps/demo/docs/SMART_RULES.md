# Smart Rules System - Fragment UI AI Playground

## Overview

System inteligentnych reguł, który pozwala generować kompletne aplikacje, ekrany i flow używając wszystkich dostępnych komponentów z Fragment UI Design System.

## Architektura

### 1. **System Reguł Komponentów** (`rules.ts`)

#### Component Rules
Automatycznie rozpoznaje, które komponenty użyć na podstawie promptu:

```typescript
{
  pattern: ["navigation", "menu", "nav"],
  component: "NavigationMenu",
  context: ["header", "sidebar"],
  priority: 10,
}
```

#### Screen Type Detection
Rozpoznaje typ ekranu:
- `dashboard` - panel z metrykami
- `landing` - strona marketingowa
- `list` - lista/tabela z filtrami
- `detail` - strona szczegółów
- `form` - formularz
- `search` - wyszukiwarka

#### App Flow Templates
Gotowe szablony dla całych aplikacji:
- **E-commerce** - landing → lista → szczegóły → checkout
- **Admin Panel** - dashboard → lista → szczegóły → edycja
- **Onboarding** - welcome → rejestracja → profil → dashboard

### 2. **System Generowania Aplikacji** (`app-route.ts`)

Generuje:
- **Pojedyncze ekrany** - jeden ekran z komponentami
- **Flow ekranów** - wiele ekranów z nawigacją
- **Kompletne aplikacje** - pełna aplikacja z routingiem

### 3. **Composition Rules**

Reguły kompozycji komponentów:
- **Layout patterns** - single-column, two-column, dashboard
- **Component groups** - jak grupować komponenty
- **Required combinations** - wymagane sub-komponenty

## Przykłady Użycia

### Formularz
```
"zbuduj formularz rejestracyjny"
→ Generuje formularz z walidacją
```

### Pojedynczy Ekran
```
"zbuduj dashboard z metrykami"
→ Generuje ekran dashboard z kartami i tabelą
```

### Flow Ekranów
```
"zbuduj aplikację e-commerce"
→ Generuje: landing → lista produktów → szczegóły → checkout
```

### Kompletna Aplikacja
```
"zbuduj panel administracyjny"
→ Generuje: dashboard → lista użytkowników → edycja → formularz
```

## Jak Działa

1. **Analiza Promptu**
   - Rozpoznaje typ (form/screen/app)
   - Wykrywa intencję użytkownika
   - Sugeruje komponenty

2. **Wybór Szablonu**
   - Używa gotowego szablonu lub generuje custom
   - Wybiera odpowiedni layout
   - Dodaje wymagane komponenty

3. **Generowanie Kodu**
   - Tworzy komponenty React
   - Dodaje nawigację między ekranami
   - Implementuje logikę biznesową

4. **Kompozycja**
   - Grupuje komponenty według reguł
   - Układa w odpowiednim layout
   - Dodaje wymagane sub-komponenty

## Rozszerzanie Systemu

### Dodanie Nowego Szablonu Ekranu

```typescript
const SCREEN_TEMPLATES: Record<string, ScreenTemplate> = {
  "my-screen": {
    type: "my-screen",
    name: "My Screen",
    description: "Description",
    layout: "single-column",
    components: [
      { component: "Card", position: "body" },
      { component: "Button", position: "body" },
    ],
  },
};
```

### Dodanie Nowego Flow

```typescript
const APP_FLOW_TEMPLATES: Record<string, AppFlow> = {
  "my-app": {
    name: "My App",
    screens: [SCREEN_TEMPLATES.screen1, SCREEN_TEMPLATES.screen2],
    navigation: [
      { from: "screen1", to: "screen2", trigger: "Next" },
    ],
  },
};
```

### Dodanie Nowej Reguły Komponentu

```typescript
const COMPONENT_RULES: ComponentRule[] = [
  {
    pattern: ["my-component", "moj-komponent"],
    component: "MyComponent",
    context: ["body"],
    priority: 10,
  },
];
```

## Dostępne Komponenty

System automatycznie rozpoznaje i używa wszystkich komponentów z Fragment UI:

- **Layout**: Sidebar, NavigationMenu, Breadcrumbs, Tabs
- **Forms**: Input, Select, DatePicker, Checkbox, Radio, Switch, Slider
- **Data**: Table, VirtualList, Card, DataTable
- **Feedback**: Alert, Toast, Dialog, Progress, Spinner
- **Navigation**: Pagination, Stepper, Timeline
- **Specialized**: FileUpload, Rating, ColorPicker, TagInput

## Przykłady Promptów

### Formularze
- "zbuduj formularz rejestracyjny"
- "formularz kontaktowy z polami: imię, email, wiadomość"
- "formularz logowania"

### Ekrany
- "zbuduj dashboard z metrykami i tabelą"
- "strona listy produktów z filtrami"
- "strona szczegółów produktu"

### Aplikacje
- "zbuduj aplikację e-commerce"
- "panel administracyjny"
- "flow onboarding użytkownika"

## Przyszłe Rozszerzenia

- [ ] Integracja z MCP server dla lepszego AI
- [ ] Wizualny edytor wygenerowanych aplikacji
- [ ] Eksport do CodeSandbox/StackBlitz
- [ ] Generowanie testów automatycznych
- [ ] Integracja z backend API
- [ ] Real-time collaboration

