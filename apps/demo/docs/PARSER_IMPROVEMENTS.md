# Parser Improvements - Form Templates

## Problem

Użytkownik wysłał prompt:
> "chciałbym stworzyc nowy komponent formularz rejestracyjny z przykladowymi polami, wg najlepszych standarow UX"

System nie stworzył formularza rejestracyjnego z typowymi polami - tylko podstawowe pole "input".

## Przyczyna

Parser był zbyt prosty:
- Szukał tylko konkretnych słów kluczowych w promptcie (email, password, name)
- Nie rozpoznawał typów formularzy (registration, login, contact)
- Gdy nie znalazł pól, tworzył tylko podstawowe pole

## Rozwiązanie

Dodano rozpoznawanie szablonów formularzy:

### 1. Wykrywanie typów formularzy

Parser teraz rozpoznaje:
- **Registration** (`registration`, `rejestrac`, `rejestracyjny`, `sign up`, `zarejestruj`)
- **Login** (`login`, `logowanie`, `zaloguj`, `sign in`)
- **Contact** (`contact`, `kontakt`)
- **Profile** (`profile`, `profil`)

### 2. Szablony formularzy

#### Registration Form
Automatycznie tworzy:
- First Name (required, minLength: 2)
- Last Name (required, minLength: 2)
- Email (email validation, required)
- Password (required, minLength: 8)
- Confirm Password (required)
- Accept Terms (Checkbox, required)
- Tytuł: "Create Your Account"

#### Login Form
- Email (email validation, required)
- Password (required)
- Tytuł: "Sign In"

#### Contact Form
- Name (required)
- Email (email validation, required)
- Subject (required)
- Message (Textarea, required)
- Tytuł: "Contact Us"

#### Profile Form
- First Name (required)
- Last Name (required)
- Email (email validation, required)
- Phone (required)
- Tytuł: "Profile"

### 3. Rozszerzone wzorce pól

Dodano więcej wzorców:
- `firstName`, `first name`
- `lastName`, `last name`, `surname`, `nazwisko`
- `phone`, `telefon`, `numer`
- `subject`, `temat`
- `terms`, `zgoda`

## Przykłady

### Przed poprawką:
```
Prompt: "formularz rejestracyjny"
Wynik: Formularz z 1 polem "Input"
```

### Po poprawce:
```
Prompt: "formularz rejestracyjny"
Wynik: Formularz z 6 polami:
  - First Name
  - Last Name
  - Email
  - Password
  - Confirm Password
  - Accept Terms
```

## Testowanie

### Test 1: Formularz rejestracyjny
```
Prompt: "chciałbym stworzyc nowy komponent formularz rejestracyjny z przykladowymi polami"
Oczekiwany wynik: Formularz z polami rejestracyjnymi
```

### Test 2: Formularz logowania
```
Prompt: "stworz formularz logowania"
Oczekiwany wynik: Formularz z email i password
```

### Test 3: Formularz kontaktowy
```
Prompt: "formularz kontaktowy"
Oczekiwany wynik: Formularz z name, email, subject, message
```

## Status

✅ **Zaimplementowane**:
- Wykrywanie typów formularzy
- Szablony dla registration, login, contact, profile
- Rozszerzone wzorce pól
- Automatyczne tytuły

⏳ **Do rozważenia**:
- Więcej szablonów (newsletter, feedback, etc.)
- Konfigurowalne pola w szablonach
- Integracja z OpenAI dla bardziej złożonych promptów

## Plik

Zmiany w: `apps/demo/app/playground/dsl/parser.ts`

