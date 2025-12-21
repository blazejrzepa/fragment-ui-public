# Jak Działa AI Playground

## Przegląd

AI Playground to system, który pozwala na generowanie kompletnych komponentów React używając naturalnego języka. Opisz co chcesz zbudować, a system automatycznie wygeneruje działający kod używając komponentów Fragment UI.

## Workflow - Od Promptu do Komponentu

### 1. Wprowadzenie Promptu

**Gdzie:** Interfejs przeglądarki (`http://localhost:3002/playground`)

**Jak:**
- Wpisz prompt w polu tekstowym (np. "Zbuduj formularz rejestracyjny z polami: email, hasło")
- Opcjonalnie podaj nazwę demo
- Kliknij "Generate Component"

**Przykłady promptów:**
```
✅ "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
✅ "Stwórz formularz kontaktowy"
✅ "List View z tabelą i paginacją"
✅ "Dashboard z kartami i wykresami"
```

### 2. Przetwarzanie Promptu

**API Endpoint:** `POST /api/generate`

**Co się dzieje:**

1. **Parsowanie Promptu** (`packages/ui-dsl/src/parser.ts`)
   - Analizuje tekst promptu
   - Wykrywa typ UI (form, screen, app)
   - Ekstrahuje pola formularza
   - Wykrywa reguły walidacji
   - Wykrywa akcje (przyciski)

2. **Generowanie UI-DSL** (`packages/ui-dsl/src/parser.ts`)
   - Tworzy strukturę UI-DSL (intermediate format)
   - Definiuje pola, walidację, akcje
   - Wybiera odpowiedni scaffold (form-auth, two-column, etc.)

3. **Generowanie Kodu** (`packages/ui-dsl/src/generator.ts`)
   - Konwertuje UI-DSL na kod React
   - Dodaje importy z `@fragment_ui/ui`
   - Generuje state management (useState)
   - Generuje walidację (validateValue, ValidationRules)
   - Generuje handlers (handleSubmit, handleChange)
   - Generuje JSX z komponentami Fragment UI

**Przykładowy UI-DSL:**
```json
{
  "type": "form",
  "scaffold": "form-auth",
  "title": "Create Your Account",
  "fields": [
    {
      "name": "email",
      "component": "Input",
      "label": "Email",
      "validation": [
        { "type": "email", "message": "Invalid email address" },
        { "type": "required", "message": "This field is required" }
      ]
    }
  ],
  "actions": [
    { "type": "submit", "label": "Submit", "variant": "primary" }
  ]
}
```

### 3. Zwrócenie Wyniku

**Response z API:**
```json
{
  "code": "import { useState } from 'react';\nimport { Button, Input, ... } from '@fragment_ui/ui';\n...",
  "demoId": "registration-form",
  "metadata": {
    "title": "Create Your Account",
    "description": "Registration form with email and password",
    "createdAt": "2024-01-01T12:00:00Z",
    "fields": [...]
  }
}
```

### 4. Zapisanie i Wyświetlenie

**Co się dzieje:**
- Kod jest zapisywany w `localStorage` jako demo
- Demo pojawia się na liście
- Automatycznie otwiera się zakładka "Preview"

### 5. Renderowanie Komponentu

**Komponent:** `ReactLiveRenderer`

**Jak działa:**

1. **Czyszczenie Kodu**
   - Usuwa `"use client"` directive
   - Usuwa wszystkie `import` statements
   - Transpiluje TypeScript do JavaScript (Babel)
   - Usuwa `export default`
   - Dodaje `render(React.createElement(ComponentName))`

2. **Konfiguracja Scope**
   - Wszystkie komponenty Fragment UI są dostępne
   - React hooks (useState, useEffect, etc.)
   - Funkcje walidacji (validateValue, ValidationRules)

3. **Renderowanie z react-live**
   - `LiveProvider` - zarządza kontekstem
   - `LiveEditor` - wyświetla kod (edytowalny)
   - `LivePreview` - renderuje komponent
   - `LiveError` - wyświetla błędy

**Przykładowy oczyszczony kod:**
```javascript
function GeneratedForm() {
  const [formData, setFormData] = useState({
    email: "",
    haslo: ""
  });
  // ... reszta kodu
}

render(React.createElement(GeneratedForm))
```

### 6. Testowanie (Opcjonalne)

**Zakładka "Tests":**

1. **Kliknij "Run Tests"**
   - Wywołuje `POST /api/test` z kodem

2. **Walidacja Składni**
   - Kompiluje kod przez Babel
   - Sprawdza czy nie ma błędów składniowych

3. **Walidacja Props**
   - Sprawdza czy `Pagination` ma `currentPage`, `totalPages`, `onPageChange`
   - Sprawdza czy `Select` ma wymagane props
   - Sprawdza inne komponenty

4. **Wyświetlenie Wyników**
   - ✅ Zielony - test przeszedł
   - ❌ Czerwony - błąd
   - ⚠️ Żółty - ostrzeżenie

## Architektura

### Komponenty

```
apps/demo/
├── app/
│   ├── playground/
│   │   └── page.tsx          # Główna strona playground
│   └── api/
│       ├── generate/
│       │   └── route.ts      # Generowanie kodu
│       └── test/
│           └── route.ts      # Testowanie kodu
└── src/
    └── components/
        ├── ai-prompt-input.tsx      # Input dla promptów
        ├── react-live-renderer.tsx  # Renderowanie z react-live
        ├── test-runner.tsx          # Interfejs testowania
        └── demo-list.tsx            # Lista demo
```

### Pakiety

```
packages/
└── ui-dsl/
    ├── src/
    │   ├── types.ts          # Typy UI-DSL
    │   ├── parser.ts         # Parsowanie promptu → UI-DSL
    │   ├── generator.ts      # UI-DSL → kod React
    │   └── index.ts          # Export
    └── package.json
```

## Przykładowy Flow

### Krok 1: Prompt
```
Użytkownik: "Zbuduj formularz rejestracyjny z polami: email, hasło"
```

### Krok 2: Parsowanie
```typescript
// parser.ts wykrywa:
- type: "form"
- scaffold: "form-auth"
- fields: ["email", "hasło"]
- validation: email validation dla email, minLength dla hasła
```

### Krok 3: UI-DSL
```json
{
  "type": "form",
  "scaffold": "form-auth",
  "title": "Create Your Account",
  "fields": [
    { "name": "email", "component": "Input", "label": "Email", ... },
    { "name": "haslo", "component": "Input", "label": "Hasło", ... }
  ]
}
```

### Krok 4: Generowanie Kodu
```typescript
// generator.ts tworzy:
export default function GeneratedForm() {
  const [formData, setFormData] = useState({
    email: "",
    haslo: ""
  });
  // ... walidacja, handlers, JSX
}
```

### Krok 5: Renderowanie
```typescript
// react-live-renderer.tsx:
- Czyści kod
- Transpiluje przez Babel
- Dodaje do scope komponenty Fragment UI
- Renderuje w LivePreview
```

### Krok 6: Testowanie (opcjonalne)
```typescript
// test-runner.tsx:
- Wywołuje /api/test
- Waliduje składnię
- Sprawdza props
- Wyświetla wyniki
```

## Funkcje

### ✅ Co Działa

1. **Generowanie Formularzy**
   - Wykrywanie pól z promptu
   - Automatyczna walidacja
   - Różne typy inputów (email, tel, text, password)

2. **Generowanie Aplikacji/Ekranów**
   - List View (tabela + paginacja)
   - Dashboard
   - Detail View
   - Landing Page

3. **Live Preview**
   - Renderowanie w czasie rzeczywistym
   - Edycja kodu w przeglądarce
   - Wyświetlanie błędów

4. **Testowanie**
   - Walidacja składni
   - Sprawdzanie props
   - Interfejs w przeglądarce

5. **Zarządzanie Demo**
   - Zapis w localStorage
   - Lista wszystkich demo
   - Kopiowanie kodu

### 🔄 Co Można Rozszerzyć

1. **Więcej Typów Komponentów**
   - Więcej komponentów Fragment UI
   - Więcej scaffoldów

2. **Lepsze Parsowanie**
   - Użycie AI/ML do lepszego rozumienia promptów
   - Wsparcie dla bardziej złożonych promptów

3. **Testowanie UI**
   - Screenshoty
   - Visual regression testing
   - Accessibility testing

4. **Eksport**
   - Eksport do CodeSandbox
   - Eksport do pliku
   - Sharing przez URL

## Przykłady Użycia

### Przykład 1: Formularz Rejestracyjny

**Prompt:**
```
"Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
```

**Wynik:**
- Formularz z 3 polami
- Walidacja email
- Walidacja hasła (min 8 znaków)
- Walidacja numeru telefonu (regex)
- Przycisk Submit

### Przykład 2: List View

**Prompt:**
```
"List View z tabelą i paginacją"
```

**Wynik:**
- Ekran z NavigationMenu
- Input do wyszukiwania
- Select do filtrowania
- Tabela z danymi
- Paginacja (z wymaganymi props!)

### Przykład 3: Dashboard

**Prompt:**
```
"Dashboard z kartami i metrykami"
```

**Wynik:**
- Ekran z NavigationMenu
- Karty z metrykami
- Tabela danych
- Progress bars

## Troubleshooting

### Problem: Komponent się nie renderuje

**Sprawdź:**
1. Konsolę przeglądarki (F12) - czy są błędy?
2. Zakładkę "Tests" - czy kod jest poprawny?
3. Czy wszystkie komponenty są dostępne w scope?

### Problem: Błędy walidacji

**Sprawdź:**
1. Czy wszystkie wymagane props są podane?
2. Czy składnia kodu jest poprawna?
3. Czy nie ma błędów TypeScript?

### Problem: Komponenty nie wyglądają dobrze

**Sprawdź:**
1. Czy używane są komponenty Fragment UI?
2. Czy style są poprawnie załadowane?
3. Czy CSS variables są dostępne?

## Następne Kroki

1. **Wygeneruj komponent** - użyj promptu
2. **Zobacz preview** - sprawdź jak wygląda
3. **Przetestuj** - użyj zakładki "Tests"
4. **Skopiuj kod** - użyj przycisku "Copy Code"
5. **Użyj w projekcie** - wklej kod do swojego projektu

