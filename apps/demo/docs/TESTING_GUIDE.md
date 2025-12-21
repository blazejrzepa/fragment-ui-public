# Przewodnik Testowania AI Playground

## 🚀 Szybki Start

### 1. Uruchom Serwer

```bash
cd apps/demo
pnpm dev
```

Serwer powinien działać na `http://localhost:3002`

### 2. Otwórz Playground

Przejdź do: `http://localhost:3002/playground`

---

## 📝 Testowanie Podstawowe

### Test 1: Prosty Formularz Rejestracyjny

**Prompt:**
```
Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu
```

**Oczekiwany wynik:**
- ✅ Formularz z 3 polami
- ✅ Walidacja email
- ✅ Walidacja hasła (min 8 znaków)
- ✅ Walidacja numeru telefonu
- ✅ Przycisk "Zarejestruj się"
- ✅ Kod z komentarzami

**Sprawdź:**
- [ ] Czy formularz się renderuje?
- [ ] Czy pola są widoczne?
- [ ] Czy walidacja działa?
- [ ] Czy kod jest sformatowany?
- [ ] Czy są komentarze w kodzie?

---

### Test 2: Formularz Kontaktowy

**Prompt:**
```
Stwórz formularz kontaktowy z polami: imię, email, wiadomość
```

**Oczekiwany wynik:**
- ✅ Formularz z 3 polami
- ✅ Textarea dla wiadomości
- ✅ Przycisk "Wyślij"

**Sprawdź:**
- [ ] Czy Textarea jest większe niż Input?
- [ ] Czy walidacja działa dla wszystkich pól?

---

### Test 3: List View

**Prompt:**
```
List View z tabelą i paginacją
```

**Oczekiwany wynik:**
- ✅ Ekran z NavigationMenu
- ✅ Input do wyszukiwania
- ✅ Select do filtrowania
- ✅ Tabela
- ✅ Paginacja z wymaganymi props

**Sprawdź:**
- [ ] Czy wszystkie komponenty są widoczne?
- [ ] Czy Pagination ma `currentPage`, `totalPages`, `onPageChange`?
- [ ] Czy nie ma błędów w konsoli?

---

## 🎯 Testowanie Nowych Szablonów

### Test 4: Formularz Feedback

**Prompt:**
```
Zbuduj formularz feedback z oceną
```

**Oczekiwany wynik:**
- ✅ Formularz z polem rating (Select)
- ✅ Opcje oceny 1-5
- ✅ Pole feedback (Textarea)

**Sprawdź:**
- [ ] Czy Select ma opcje?
- [ ] Czy walidacja działa?

---

### Test 5: Newsletter

**Prompt:**
```
Formularz newsletter
```

**Oczekiwany wynik:**
- ✅ Formularz z emailem
- ✅ Opcjonalne pole name
- ✅ Checkbox dla zainteresowań

**Sprawdź:**
- [ ] Czy checkbox działa?
- [ ] Czy opcjonalne pola nie są wymagane?

---

### Test 6: Password Reset

**Prompt:**
```
Formularz resetowania hasła
```

**Oczekiwany wynik:**
- ✅ Formularz z jednym polem email
- ✅ Przycisk "Send Reset Link"

**Sprawdź:**
- [ ] Czy formularz jest prosty?
- [ ] Czy walidacja email działa?

---

### Test 7: Profile Edit

**Prompt:**
```
Formularz edycji profilu
```

**Oczekiwany wynik:**
- ✅ Formularz z polami: firstName, lastName, email, phone, bio
- ✅ Textarea dla bio
- ✅ Przycisk "Save Changes"

**Sprawdź:**
- [ ] Czy wszystkie pola są widoczne?
- [ ] Czy bio ma maxLength?

---

### Test 8: Checkout

**Prompt:**
```
Formularz checkout
```

**Oczekiwany wynik:**
- ✅ Formularz z polami adresowymi
- ✅ Select dla kraju
- ✅ Walidacja ZIP code
- ✅ Przycisk "Complete Purchase"

**Sprawdź:**
- [ ] Czy Select ma opcje krajów?
- [ ] Czy walidacja ZIP działa?

---

## 🖥️ Testowanie Ekranów

### Test 9: Settings Page

**Prompt:**
```
Strona ustawień
```

**Oczekiwany wynik:**
- ✅ Ekran z NavigationMenu
- ✅ Card
- ✅ Tabs
- ✅ Switch
- ✅ Select
- ✅ Button

**Sprawdź:**
- [ ] Czy wszystkie komponenty są widoczne?
- [ ] Czy layout jest two-column?

---

### Test 10: Profile Page

**Prompt:**
```
Strona profilu
```

**Oczekiwany wynik:**
- ✅ Ekran z NavigationMenu
- ✅ Card
- ✅ Input
- ✅ Textarea
- ✅ Button

**Sprawdź:**
- [ ] Czy layout jest single-column?
- [ ] Czy komponenty są poprawnie rozmieszczone?

---

### Test 11: Search Results

**Prompt:**
```
Wyniki wyszukiwania
```

**Oczekiwany wynik:**
- ✅ Ekran z NavigationMenu
- ✅ Input search
- ✅ Select filter
- ✅ Card
- ✅ Pagination

**Sprawdź:**
- [ ] Czy Input ma type="search"?
- [ ] Czy Pagination ma wymagane props?

---

### Test 12: Shopping Cart

**Prompt:**
```
Koszyk zakupów
```

**Oczekiwany wynik:**
- ✅ Ekran z NavigationMenu
- ✅ Table
- ✅ Card (summary)
- ✅ Button (large, primary)

**Sprawdź:**
- [ ] Czy Table jest widoczna?
- [ ] Czy Button jest duży?

---

## 🔍 Testowanie Ulepszeń Parsowania

### Test 13: Różne Formy Promptów

**Prompty do przetestowania:**
```
✅ "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
✅ "Formularz z polami A, B i C"
✅ "Stwórz formularz z polami: imię, nazwisko, email"
✅ "Formularz kontaktowy"
✅ "Zbuduj formularz feedback"
```

**Sprawdź:**
- [ ] Czy wszystkie formy są rozpoznawane?
- [ ] Czy pola są poprawnie ekstrahowane?

---

### Test 14: Automatyczne Wykrywanie Typów

**Prompty:**
```
✅ "Formularz z emailem" → Input type="email"
✅ "Formularz z hasłem" → Input type="password"
✅ "Formularz z wiadomością" → Textarea
✅ "Formularz z kategorią" → Select
✅ "Formularz z datą" → DatePicker
```

**Sprawdź:**
- [ ] Czy typy komponentów są poprawnie wykrywane?
- [ ] Czy walidacja jest automatycznie dodawana?

---

### Test 15: Wykrywanie Walidacji

**Prompty:**
```
✅ "Formularz z emailem (wymagane)" → required validation
✅ "Formularz z hasłem (min 8 znaków)" → minLength: 8
✅ "Formularz z wiadomością (max 500 znaków)" → maxLength: 500
```

**Sprawdź:**
- [ ] Czy walidacja jest poprawnie dodawana?
- [ ] Czy komunikaty błędów są wyświetlane?

---

## 🧪 Testowanie Jakości Kodu

### Test 16: Komentarze w Kodzie

**Sprawdź wygenerowany kod:**
- [ ] Czy jest JSDoc dla komponentu?
- [ ] Czy są komentarze dla funkcji?
- [ ] Czy są komentarze inline?
- [ ] Czy są komentarze dla state?

---

### Test 17: Formatowanie Kodu

**Sprawdź wygenerowany kod:**
- [ ] Czy kod jest sformatowany przez Prettier?
- [ ] Czy wcięcia są poprawne (2 spacje)?
- [ ] Czy linie nie są zbyt długie?

---

### Test 18: Nazewnictwo

**Sprawdź wygenerowany kod:**
- [ ] Czy zmienne mają czytelne nazwy?
- [ ] Czy funkcje mają standardowe nazwy React?
- [ ] Czy komponenty mają sensowne nazwy?

---

## 🐛 Testowanie Obsługi Błędów

### Test 19: Nieprawidłowe Prompty

**Prompty:**
```
❌ "" (pusty)
❌ "asdfghjkl" (bez sensu)
❌ "123456789" (tylko cyfry)
```

**Sprawdź:**
- [ ] Czy są przyjazne komunikaty błędów?
- [ ] Czy błędy są wyświetlane w toast?
- [ ] Czy stack trace jest tylko w development?

---

### Test 20: Błędy Renderowania

**Sprawdź konsolę przeglądarki:**
- [ ] Czy nie ma błędów React?
- [ ] Czy nie ma ostrzeżeń o brakujących props?
- [ ] Czy nie ma błędów hydratacji?

---

## ✅ Testowanie Automatyczne

### Użyj Skryptu Testowego

```bash
# Podstawowy test
pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło"

# Test z przeglądarką
pnpm test-prompt "List View z tabelą i paginacją" --browser

# Verbose output
pnpm test-prompt "Formularz kontaktowy" --browser --verbose
```

**Sprawdź:**
- [ ] Czy test przechodzi?
- [ ] Czy kod jest poprawny?
- [ ] Czy props są poprawne?
- [ ] Czy UI jest poprawne?

---

## 📊 Checklist Testowania

### Przed Użyciem:
- [ ] Serwer działa (`http://localhost:3002`)
- [ ] Playground jest dostępny (`/playground`)
- [ ] Konsola przeglądarki jest otwarta (F12)

### Podczas Testowania:
- [ ] Sprawdzaj konsolę na błędy
- [ ] Sprawdzaj zakładkę "Tests"
- [ ] Sprawdzaj wygenerowany kod
- [ ] Sprawdzaj preview

### Po Testowaniu:
- [ ] Wszystkie testy przechodzą
- [ ] Nie ma błędów w konsoli
- [ ] Kod jest poprawny
- [ ] UI wygląda dobrze

---

## 🎯 Priorytetowe Testy

**Zacznij od tych:**
1. ✅ Prosty formularz rejestracyjny
2. ✅ Formularz kontaktowy
3. ✅ List View
4. ✅ Jeden z nowych szablonów (feedback/checkout)
5. ✅ Test automatyczny

**Jeśli wszystko działa, przejdź do:**
- Testowanie różnych form promptów
- Testowanie ekranów
- Testowanie jakości kodu
- Testowanie obsługi błędów

---

## 📝 Raportowanie Problemów

Jeśli znajdziesz problem:
1. Zapisz prompt, który go wywołał
2. Zapisz błąd z konsoli
3. Zapisz wygenerowany kod
4. Sprawdź zakładkę "Tests" dla szczegółów

