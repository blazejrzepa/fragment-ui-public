# 🧪 Plan Testowania - Priorytet 1

**Data:** 2025-01-26  
**Status:** W trakcie

---

## ✅ Test 1: Generowanie Dashboardów z Plikami .md

### Cel
Przetestować, czy system poprawnie generuje dashboardy z plików markdown, wykorzystując nową funkcjonalność analizy dokumentacji.

### Kroki Testowe

1. **Przygotowanie pliku testowego**
   - Utwórz plik `test-dashboard.md` z przykładową dokumentacją dashboardu:
   ```markdown
   # Dashboard Analytics
   
   Dashboard do wyświetlania metryk i statystyk.
   
   ## Wymagania
   - Karty z metrykami (4 kolumny)
   - Tabela z danymi
   - Wykresy
   - Filtry
   
   ## Sekcje
   - Header z tytułem
   - Metrics cards
   - Data table
   - Charts section
   ```

2. **Test Upload i Generowania**
   - Otwórz `http://localhost:3000/playground`
   - Kliknij przycisk Upload (ikona Upload w prawym dolnym rogu inputa)
   - Wybierz plik `test-dashboard.md`
   - Sprawdź, czy:
     - ✅ Plik został załadowany
     - ✅ Zostaje wyświetlony komunikat o analizie dokumentacji
     - ✅ UI jest generowane na podstawie dokumentacji
     - ✅ Wygenerowany kod zawiera:
       - ✅ Poprawne sloty Card (CardHeader, CardContent, CardTitle)
       - ✅ Wszystkie potrzebne importy
       - ✅ Funkcję `generatePlaceholderData` (jeśli potrzebna)
       - ✅ Bindingi jako komentarze JSX

3. **Weryfikacja Wygenerowanego Kodu**
   - Sprawdź zakładkę "Code" w playground
   - Zweryfikuj:
     - ✅ Importy są poprawne
     - ✅ Komponenty Card używają poprawnych slotów
     - ✅ Bindingi są jako komentarze, nie w props
     - ✅ Kod kompiluje się bez błędów

4. **Weryfikacja Preview**
   - Sprawdź zakładkę "Preview"
   - Zweryfikuj:
     - ✅ Dashboard renderuje się poprawnie
     - ✅ Karty z metrykami są widoczne
     - ✅ Tabela z danymi jest widoczna
     - ✅ Brak błędów w konsoli

### Oczekiwane Wyniki
- ✅ Dashboard jest generowany na podstawie dokumentacji
- ✅ Analiza dokumentacji poprawia jakość generowanego UI
- ✅ Kod jest poprawny i kompiluje się bez błędów
- ✅ Preview renderuje się bez błędów

---

## ✅ Test 2: Sprawdzenie, czy Analiza Dokumentacji Poprawia Jakość UI

### Cel
Zweryfikować, czy nowa funkcjonalność analizy dokumentacji rzeczywiście poprawia jakość generowanego UI.

### Kroki Testowe

1. **Test bez Dokumentacji (Baseline)**
   - Otwórz playground
   - Wpisz prompt: "Create a dashboard with metrics cards and a table"
   - Wygeneruj UI
   - Zapisz notatki o jakości:
     - Czy tytuł jest odpowiedni?
     - Czy struktura jest logiczna?
     - Czy komponenty są odpowiednie?

2. **Test z Dokumentacją**
   - Przygotuj plik `test-dashboard-detailed.md`:
   ```markdown
   # Sales Dashboard
   
   Dashboard do monitorowania sprzedaży i analizy danych.
   
   ## Opis
   Dashboard powinien wyświetlać kluczowe metryki sprzedaży, 
   wykresy trendów oraz szczegółową tabelę transakcji.
   
   ## Wymagania Funkcjonalne
   - 4 karty z metrykami: Total Sales, Orders, Revenue, Growth
   - Tabela z transakcjami (kolumny: Date, Customer, Amount, Status)
   - Wykres liniowy pokazujący trend sprzedaży
   - Filtry: Date range, Status
   
   ## Sekcje
   - Header z tytułem "Sales Dashboard"
   - Metrics section (4 karty w rzędzie)
   - Filters section
   - Charts section
   - Data table section
   ```

3. **Porównanie Wyników**
   - Upload plik `test-dashboard-detailed.md`
   - Wygeneruj UI
   - Porównaj z wynikiem bez dokumentacji:
     - ✅ Tytuł powinien być "Sales Dashboard" (z dokumentacji)
     - ✅ Opis powinien być bardziej szczegółowy
     - ✅ Struktura powinna być bardziej precyzyjna
     - ✅ Komponenty powinny być bardziej odpowiednie

4. **Weryfikacja Metadanych**
   - Sprawdź w Inspector → Component Overview
   - Zweryfikuj, czy metadane zawierają:
     - ✅ Informacje o analizie dokumentacji
     - ✅ Liczbę sekcji
     - ✅ Liczbę wymagań

### Oczekiwane Wyniki
- ✅ UI generowane z dokumentacją jest bardziej precyzyjne
- ✅ Tytuł i opis są ekstrahowane z dokumentacji
- ✅ Struktura jest bardziej logiczna
- ✅ Komponenty są bardziej odpowiednie do wymagań

---

## ✅ Test 3: Weryfikacja Naprawy Błędów Hydratacji

### Cel
Sprawdzić, czy wszystkie błędy hydratacji zostały naprawione.

### Kroki Testowe

1. **Test w Playground (CardDescription)**
   - Otwórz `http://localhost:3000/playground`
   - Wygeneruj komponent z Card (np. "Create a card with metrics")
   - Sprawdź konsolę przeglądarki (F12 → Console)
   - Zweryfikuj:
     - ✅ Brak błędów hydratacji związanych z CardDescription
     - ✅ Brak błędów o `<div>` w `<p>`

2. **Test w Dokumentacji (www)**
   - Otwórz `http://localhost:3002/docs/get-started/introduction`
   - Sprawdź konsolę przeglądarki
   - Zweryfikuj:
     - ✅ Brak błędów hydratacji związanych z nagłówkami
     - ✅ Nagłówki mają atrybuty `id` (sprawdź w DevTools)
     - ✅ HTML z SSR i po hydratacji są identyczne

3. **Test Różnych Stron Dokumentacji**
   - Przetestuj kilka stron:
     - `/docs/get-started/introduction`
     - `/docs/get-started/setup`
     - `/docs/get-started/copilot-ai`
   - Sprawdź konsolę na każdej stronie
   - Zweryfikuj:
     - ✅ Brak błędów hydratacji
     - ✅ Wszystkie nagłówki mają `id`

4. **Test React DevTools**
   - Zainstaluj React DevTools extension
   - Sprawdź, czy nie ma warningów o hydration mismatch
   - Zweryfikuj:
     - ✅ Brak warningów w React DevTools

### Oczekiwane Wyniki
- ✅ Brak błędów hydratacji w konsoli
- ✅ Wszystkie nagłówki mają atrybuty `id`
- ✅ HTML z SSR i po hydratacji są identyczne
- ✅ Brak warningów w React DevTools

---

## ✅ Test 4: Testowanie Klikalności Komponentów w Inspector

### Cel
Przetestować nową funkcjonalność klikalności komponentów w sekcji "Imports" w Inspector.

### Kroki Testowe

1. **Przygotowanie Testu**
   - Otwórz playground
   - Wygeneruj komponent, który używa wielu komponentów z `@fragment_ui/ui`
   - Przykład: "Create a dashboard with Button, Card, Input, Table"

2. **Test Wyświetlania Imports**
   - Otwórz Inspector (prawy panel)
   - Przejdź do zakładki "Inspector"
   - Sprawdź sekcję "Imports"
   - Zweryfikuj:
     - ✅ Lista komponentów jest widoczna
     - ✅ Komponenty z `@fragment_ui/` są wyświetlone
     - ✅ Kolor tekstu to `foreground-secondary`
     - ✅ Brak ikon przy nagłówku "Imports"

3. **Test Efektu Hover**
   - Najedź myszką na nazwę komponentu (np. "Button")
   - Zweryfikuj:
     - ✅ Kursor zmienia się na pointer
     - ✅ Tło zmienia się na `var(--color-surface-2)`
     - ✅ Tooltip pokazuje: "Click to open Button in a new tab"

4. **Test Klikalności**
   - Kliknij na nazwę komponentu (np. "Button")
   - Zweryfikuj:
     - ✅ Komponent otwiera się w nowej zakładce w main container
     - ✅ Zakładka ma nazwę komponentu (np. "Button")
     - ✅ Kod komponentu jest wyświetlony
     - ✅ Preview komponentu jest wyświetlony
     - ✅ Toast notification: "Opened Button in a new tab"

5. **Test Różnych Komponentów**
   - Kliknij na różne komponenty:
     - Button
     - Card
     - Input
     - Table
   - Zweryfikuj:
     - ✅ Każdy komponent otwiera się poprawnie
     - ✅ Każdy ma własną zakładkę
     - ✅ Można przełączać się między zakładkami

6. **Test Namespace Imports**
   - Sprawdź, czy importy typu `* as X` nie są klikalne
   - Zweryfikuj:
     - ✅ Namespace imports nie mają efektu hover
     - ✅ Nie są klikalne

7. **Test Dynamicznego Tytułu**
   - Sprawdź sekcję "Component Overview"
   - Zweryfikuj:
     - ✅ Tytuł to nazwa komponentu (np. "Dashboard", "GeneratedPage")
     - ✅ Nie ma ikony przy tytule
     - ✅ Jeśli nie można wyekstrahować nazwy, pokazuje "Component Overview"

### Oczekiwane Wyniki
- ✅ Komponenty w Imports są klikalne
- ✅ Efekt hover działa poprawnie
- ✅ Kliknięcie otwiera komponent w nowej zakładce
- ✅ Dynamiczny tytuł działa poprawnie
- ✅ Namespace imports nie są klikalne

---

## 📊 Checklist Testowania

### Test 1: Generowanie Dashboardów z .md
- [ ] Plik .md został załadowany
- [ ] Analiza dokumentacji działa
- [ ] Kod zawiera poprawne sloty Card
- [ ] Wszystkie importy są poprawne
- [ ] Bindingi są jako komentarze
- [ ] Preview renderuje się bez błędów

### Test 2: Analiza Dokumentacji
- [ ] UI z dokumentacją jest bardziej precyzyjne
- [ ] Tytuł jest ekstrahowany z dokumentacji
- [ ] Opis jest ekstrahowany z dokumentacji
- [ ] Struktura jest bardziej logiczna
- [ ] Metadane zawierają informacje o analizie

### Test 3: Naprawa Błędów Hydratacji
- [ ] Brak błędów hydratacji w playground
- [ ] Brak błędów hydratacji w dokumentacji
- [ ] Nagłówki mają atrybuty `id`
- [ ] HTML z SSR i po hydratacji są identyczne
- [ ] Brak warningów w React DevTools

### Test 4: Klikalność Komponentów
- [ ] Lista imports jest widoczna
- [ ] Efekt hover działa
- [ ] Kliknięcie otwiera komponent w nowej zakładce
- [ ] Dynamiczny tytuł działa
- [ ] Namespace imports nie są klikalne

---

## 🐛 Raportowanie Błędów

Jeśli znajdziesz błędy podczas testowania:

1. **Zapisz szczegóły:**
   - Krok, który spowodował błąd
   - Komunikat błędu (z konsoli)
   - Zrzut ekranu (jeśli możliwe)
   - Wersja przeglądarki

2. **Sprawdź logi:**
   - Konsola przeglądarki (F12)
   - Logi serwera (terminal)
   - Network tab (sprawdź requesty API)

3. **Zgłoś błąd:**
   - Utwórz issue w GitHub
   - Dodaj szczegóły z kroku 1
   - Dodaj logi z kroku 2

---

## ✅ Kiedy Testy Są Ukończone

Testy są ukończone, gdy:
- ✅ Wszystkie checkboxy w checklist są zaznaczone
- ✅ Wszystkie oczekiwane wyniki są spełnione
- ✅ Brak krytycznych błędów
- ✅ Wszystkie funkcjonalności działają zgodnie z oczekiwaniami

---

**Status:** 🟡 W trakcie testowania  
**Następny krok:** Rozpoczęcie Testu 1

