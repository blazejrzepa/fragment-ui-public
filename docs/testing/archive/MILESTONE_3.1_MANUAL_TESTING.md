# 🧪 Milestone 3.1 - Manual Testing Guide

## Przed rozpoczęciem

1. **Uruchom serwer deweloperski:**
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   pnpm --filter @fragment_ui/demo dev
   ```

2. **Otwórz playground:**
   - Przejdź do: `http://localhost:3002/playground`
   - Kliknij "New Component" (jeśli nie masz otwartej zakładki)

---

## 📋 Test Cases

### 1. Test Grid Layout z parametrami

**Prompt:**
```
Create a dashboard page with 4 cards in a grid layout with 4 columns, gap 8, and max width 2xl
```

**Oczekiwany wynik:**
- ✅ Grid z 4 kolumnami (`grid-cols-4`)
- ✅ Gap 8 (`gap-8`)
- ✅ Max width 2xl (`max-w-2xl`)
- ✅ 4 karty w gridzie

**Sprawdź w kodzie:**
- Szukaj: `grid-cols-4`, `gap-8`, `max-w-2xl`

---

### 2. Test Stack Layout z parametrami

**Prompt:**
```
Create a page with 3 sections in a stack layout with gap 12 and max width full
```

**Oczekiwany wynik:**
- ✅ Stack layout (`space-y-12`)
- ✅ Max width full (`max-w-full`)
- ✅ 3 sekcje jedna pod drugą

**Sprawdź w kodzie:**
- Szukaj: `space-y-12`, `max-w-full`

---

### 3. Test Landing Page z modułami (Hero, Pricing, FAQ)

**Prompt:**
```
Create a landing page with hero section, pricing table with 3 tiers, and FAQ section
```

**Oczekiwany wynik:**
- ✅ Screen DSL z regions (header, content, footer)
- ✅ Hero module w content region
- ✅ Pricing module z 3 tierami
- ✅ FAQ module
- ✅ Navigation module w header
- ✅ Footer module w footer

**Sprawdź w kodzie:**
- Szukaj: `<header>`, `<main>`, `<footer>`
- Szukaj: `data-module-type="hero"`, `data-module-type="pricing"`, `data-module-type="faq"`

---

### 4. Test Testimonials Module z danymi

**Prompt:**
```
Create a testimonials section with 3 customer reviews
```

**Oczekiwany wynik:**
- ✅ Testimonials module
- ✅ 3 karty z opiniami
- ✅ Każda karta zawiera: tekst, imię, rolę

**Sprawdź w kodzie:**
- Szukaj: `data-module-type="testimonials"`
- Szukaj: `Card` z opiniami

---

### 5. Test KPI Header Module

**Prompt:**
```
Create a dashboard with KPI header showing revenue, users, and conversion metrics
```

**Oczekiwany wynik:**
- ✅ KPI Header module
- ✅ Wyświetla metryki (Revenue, Users, Conversion)
- ✅ Każda metryka ma wartość i etykietę
- ✅ Opcjonalnie trend (np. +5%)

**Sprawdź w kodzie:**
- Szukaj: `data-module-type="kpi-header"`
- Szukaj: wartości metryk

---

### 6. Test Data Table Section Module

**Prompt:**
```
Create a data table section with columns: ID, Name, Status, and 5 rows of data
```

**Oczekiwany wynik:**
- ✅ Data Table Section module
- ✅ Tabela z kolumnami: ID, Name, Status
- ✅ 5 wierszy danych
- ✅ Używa komponentów Table, TableHeader, TableBody

**Sprawdź w kodzie:**
- Szukaj: `data-module-type="data-table-section"`
- Szukaj: `<Table>`, `<TableHeader>`, `<TableBody>`
- Szukaj: kolumny i wiersze

---

### 7. Test Screen DSL z wszystkimi regionami

**Prompt:**
```
Create a full screen layout with header navigation, sidebar menu, main content area, and footer
```

**Oczekiwany wynik:**
- ✅ Screen DSL z regions: header, sidebar, content, footer
- ✅ Navigation module w header
- ✅ Sidebar z menu
- ✅ Main content area
- ✅ Footer module

**Sprawdź w kodzie:**
- Szukaj: `<header>`, `<aside>` lub sidebar, `<main>`, `<footer>`
- Szukaj: `regions` w DSL

---

### 8. Test Landing Page z kompletnym layoutem

**Prompt:**
```
Create a complete landing page with hero section, features grid, pricing table with 3 tiers, testimonials carousel, and FAQ accordion
```

**Oczekiwany wynik:**
- ✅ Hero module
- ✅ Features module (grid)
- ✅ Pricing module (3 tiers)
- ✅ Testimonials module
- ✅ FAQ module
- ✅ Wszystkie moduły poprawnie wyrenderowane

**Sprawdź w kodzie:**
- Szukaj: wszystkie `data-module-type` atrybuty
- Sprawdź, czy wszystkie moduły są widoczne w preview

---

## 🔍 Co sprawdzać podczas testowania

### W Preview:
1. ✅ Czy komponenty renderują się poprawnie?
2. ✅ Czy layout wygląda zgodnie z oczekiwaniami?
3. ✅ Czy dane są wyświetlane poprawnie?
4. ✅ Czy moduły mają właściwe style?

### W Kodzie:
1. ✅ Czy generowane są poprawne klasy Tailwind?
2. ✅ Czy `data-ui-id` są obecne?
3. ✅ Czy `data-module-type` są poprawne?
4. ✅ Czy importy są poprawne?
5. ✅ Czy layout parametry są zastosowane?

### W DSL (jeśli dostępne):
1. ✅ Czy DSL zawiera `regions`?
2. ✅ Czy moduły mają `data` bindings?
3. ✅ Czy layout ma wszystkie parametry?

---

## 🐛 Znane problemy / Uwagi

1. **Grid columns:** Jeśli `columns` nie jest podane, domyślnie używa `grid-cols-1`
2. **Mock data:** Mock data schema jest generowane w czasie kompilacji, nie w runtime
3. **Data bindings:** `http` kind jest tylko placeholder - nie wykonuje rzeczywistych requestów

---

## 📝 Checklist testowania

- [ ] Grid layout z parametrami
- [ ] Stack layout z parametrami
- [ ] Landing page z modułami
- [ ] Testimonials module
- [ ] KPI Header module
- [ ] Data Table Section module
- [ ] Screen DSL z wszystkimi regionami
- [ ] Kompletny landing page

---

## 🎯 Następne kroki po testowaniu

Jeśli znajdziesz błędy:
1. Sprawdź konsolę przeglądarki (F12)
2. Sprawdź logi serwera
3. Sprawdź wygenerowany kod
4. Zgłoś problem z przykładowym promptem i oczekiwanym wynikiem

Jeśli wszystko działa:
- ✅ Milestone 3.1 jest gotowy do użycia!
- Możemy przejść do Milestone 3.2 (Block Registry)

