# 📝 Prompty do Testowania AI Playground

## ✅ Proste Prompty (Rule-based)

### Formularze Podstawowe
```
1. "Create a registration form"
2. "Zbuduj formularz rejestracyjny z polami: email, hasło"
3. "Formularz kontaktowy z polami: imię, email, wiadomość"
4. "Create a login form with email and password"
5. "Formularz newsletter z polem email i checkboxem zgody"
```

### Formularze z Różnymi Polami
```
6. "Create a contact form with: name, email, phone, message (textarea)"
7. "Zbuduj formularz z polami: imię, nazwisko, email, telefon, adres"
8. "Formularz feedback z: rating (select 1-5), comment (textarea)"
9. "Create a form with: checkbox for terms, select for country, date picker for birthday"
10. "Formularz z polami: email, hasło, powtórz hasło, checkbox zgody RODO"
```

### Ekrany/Views
```
11. "List View z tabelą i paginacją"
12. "Dashboard z kartami statystyk"
13. "Settings page with tabs"
14. "Profile page with edit form"
```

---

## 🚀 Złożone Prompty (OpenAI - wymaga API key)

### Formularze Zaawansowane
```
1. "Create a multi-step registration form with progress indicator: 
    Step 1 (personal info: name, email, phone), 
    Step 2 (address: street, city, zip, country select), 
    Step 3 (preferences: newsletter checkbox, theme select)"

2. "Zbuduj formularz rejestracyjny z:
    - Walidacją email (tylko domeny @company.com)
    - Polem hasła z wskaźnikiem siły (weak/medium/strong)
    - Wyborem kraju z wyszukiwaniem (Select z search)
    - Checkboxem zgody RODO z linkiem do regulaminu
    - Data picker dla daty urodzenia (min 18 lat)"

3. "Create a checkout form with:
    - Shipping address section (name, street, city, zip, country)
    - Billing address checkbox (same as shipping)
    - Payment method select (credit card, paypal, bank transfer)
    - Order summary card on the right side
    - Terms checkbox and submit button"
```

### Ekrany Zaawansowane
```
4. "Create a user management dashboard with:
    - Search input at the top
    - Filter select (by role: all, admin, user)
    - Data table with columns: name, email, role, status, actions
    - Pagination at the bottom
    - Add user button in header"

5. "Zbuduj ekran ustawień z:
    - Tabs: Profile, Security, Notifications
    - Profile tab: name, email, avatar upload
    - Security tab: change password form
    - Notifications tab: checkboxes for email/sms/push notifications
    - Save button for each tab"

6. "Create a product listing page with:
    - Filters sidebar (category select, price range, rating)
    - Product grid (cards with image, name, price, rating)
    - Sort select (price, rating, name)
    - Load more button (infinite scroll simulation)"
```

### Komponenty Specjalne
```
7. "Formularz z walidacją hasła w czasie rzeczywistym:
    - Wskaźnik siły hasła (słabe/średnie/silne)
    - Wymagania: min 8 znaków, wielka litera, cyfra, znak specjalny
    - Komunikaty błędów przy każdej zmianie"

8. "Create a dynamic form that:
    - Starts with email field
    - Shows phone field after email is valid
    - Shows address fields after phone is valid
    - Submit button appears only when all fields are valid"
```

---

## 🔄 Prompty Modyfikacyjne (Iteracyjne)

### Modyfikacje Podstawowe
```
1. "Add a phone number field"
2. "Make the email field optional"
3. "Change the submit button text to 'Sign Up'"
4. "Add validation for password (min 8 characters)"
5. "Remove the phone field"
6. "Change the form layout to be wider"
```

### Modyfikacje Zaawansowane
```
7. "Add a 'Remember me' checkbox next to the login button"
8. "Add a 'Forgot password?' link below the password field"
9. "Make the form two columns: left (email, password), right (phone, address)"
10. "Add a step indicator at the top: Step 1 of 3"
11. "Change all labels to Polish"
12. "Add a success message after form submission"
```

---

## 🎯 Scenariusze Testowe

### Scenariusz 1: Budowanie Formularza Krok po Kroku
```
Krok 1: "Create a registration form"
Krok 2: "Add a phone number field"
Krok 3: "Add a country select field"
Krok 4: "Change submit button to 'Create Account'"
Krok 5: "Make phone field optional"
Krok 6: "Add validation: password must be at least 8 characters"
```

### Scenariusz 2: Formularz Kontaktowy
```
Krok 1: "Create a contact form with name, email, and message"
Krok 2: "Add a subject select field (Support, Sales, Other)"
Krok 3: "Add a phone number field (optional)"
Krok 4: "Change message field to textarea with 10 rows"
Krok 5: "Add a 'Privacy Policy' checkbox before submit"
```

### Scenariusz 3: Dashboard
```
Krok 1: "Create a dashboard with navigation menu"
Krok 2: "Add a search input at the top"
Krok 3: "Add a data table with columns: name, email, role"
Krok 4: "Add pagination at the bottom"
Krok 5: "Add filter select by role"
```

---

## 🐛 Prompty do Testowania Edge Cases

### Testowanie Błędów
```
1. "Create a form" (bardzo ogólny)
2. "Zbuduj formularz z 20 polami" (zbyt dużo pól)
3. "Create a form with fields: a, b, c, d, e, f, g, h, i, j" (pola bez kontekstu)
4. "" (pusty prompt - powinien zwrócić błąd)
```

### Testowanie Różnych Języków
```
1. "Zbuduj formularz rejestracyjny"
2. "Stwórz formularz kontaktowy"
3. "Utwórz ekran ustawień"
4. "Formularz logowania z polami email i hasło"
```

### Testowanie Specjalnych Wymagań
```
1. "Create a form where password must contain uppercase, lowercase, number, and special character"
2. "Formularz z walidacją email tylko dla domen @example.com"
3. "Create a form with file upload for avatar"
4. "Formularz z datą urodzenia (minimum 18 lat)"
```

---

## 📊 Jak Testować

### Testowanie Podstawowe
```bash
# Użyj skryptu testowego
pnpm test-prompt "Create a registration form"
pnpm test-prompt "Zbuduj formularz kontaktowy" --browser
```

### Testowanie w Przeglądarce
1. Otwórz http://localhost:3002/playground/chat
2. Wpisz prompt
3. Sprawdź Preview - czy się renderuje?
4. Sprawdź Code - czy kod jest poprawny?
5. Sprawdź Console - czy są błędy?

### Testowanie Modyfikacji
1. Utwórz podstawowy formularz
2. Poproś o modyfikację (np. "Add phone field")
3. Sprawdź czy zmiana została zastosowana
4. Poproś o kolejną modyfikację

---

## ✅ Checklist Testowania

Dla każdego promptu sprawdź:
- [ ] Kod się generuje
- [ ] Kod jest sformatowany
- [ ] Formularz się renderuje (Preview)
- [ ] Wszystkie pola są widoczne
- [ ] Walidacja działa
- [ ] Nie ma błędów w konsoli
- [ ] Komponenty mają wymagane props
- [ ] Stylowanie jest poprawne

---

## 🎨 Przykłady Kreatywne

### Formularze Tematyczne
```
1. "Create a job application form with: name, email, phone, resume upload, cover letter textarea, position select"
2. "Zbuduj formularz rezerwacji stolika z: imię, telefon, data, godzina, liczba osób, uwagi"
3. "Create a feedback form for a restaurant: rating (1-5), food quality, service, ambiance, comment textarea"
4. "Formularz zgłoszenia błędu: tytuł, opis (textarea), priorytet (select: low/medium/high), załącznik (file upload)"
```

### Aplikacje
```
1. "Create a todo app interface: input for new task, list of tasks with checkboxes, delete button for each"
2. "Zbuduj interfejs wyszukiwarki produktów: search input, filters sidebar, product grid, pagination"
3. "Create a chat interface: message list, input at bottom, send button, user avatar display"
```

