# AI Chat Playground

## Przegląd

AI Chat Playground to interaktywny interfejs do budowania i modyfikowania komponentów React poprzez rozmowę z AI. W przeciwieństwie do standardowego playground, tutaj możesz iteracyjnie modyfikować komponenty poprzez konwersację.

## Funkcje

### 🎨 Layout
- **Lewa kolumna**: Preview i Code tabs
- **Prawa kolumna**: AI Chat interface
- **Pełnoekranowy**: Zajmuje cały ekran dla lepszego doświadczenia

### 💬 AI Chat
- **Historia konwersacji**: Wszystkie wiadomości są zapisywane
- **Kontekst**: AI widzi obecny kod i może go modyfikować
- **Real-time updates**: Kod jest aktualizowany natychmiast po odpowiedzi AI

### 🔄 Modyfikacja Kodu
- **Iteracyjne zmiany**: Możesz prosić o kolejne modyfikacje
- **Zachowanie kontekstu**: AI pamięta obecny kod
- **Automatyczne zapisywanie**: Kod jest zapisywany w localStorage

## Jak Używać

### 1. Otwórz Chat Playground
Przejdź do: `http://localhost:3002/studio/chat`

### 2. Rozpocznij Konwersację

**Przykładowe wiadomości:**
```
"Create a registration form with email and password"
"Add a phone number field"
"Make the email field optional"
"Change the submit button text to 'Sign Up'"
"Add validation for password (min 8 characters)"
```

### 3. Obserwuj Zmiany
- Lewa kolumna pokazuje preview w czasie rzeczywistym
- Zakładka "Code" pokazuje wygenerowany kod
- Możesz kopiować kod w dowolnym momencie

## Przykładowe Scenariusze

### Scenariusz 1: Budowanie Formularza Krok po Kroku

1. **Start**: "Create a contact form"
2. **Dodaj pole**: "Add a phone number field"
3. **Modyfikuj**: "Make the phone field optional"
4. **Styl**: "Change the submit button to say 'Send Message'"
5. **Walidacja**: "Add email validation"

### Scenariusz 2: Modyfikacja Istniejącego Komponentu

1. **Start**: "Create a login form"
2. **Modyfikuj**: "Add a 'Remember me' checkbox"
3. **Modyfikuj**: "Add a 'Forgot password?' link"
4. **Modyfikuj**: "Change the layout to be wider"

## Różnice vs Standardowy Playground

| Feature | Standard Playground | Chat Playground |
|---------|-------------------|-----------------|
| **Interfejs** | Lista demo + Preview | Chat + Preview |
| **Modyfikacja** | Tylko nowe komponenty | Iteracyjne modyfikacje |
| **Kontekst** | Brak | AI widzi obecny kod |
| **Historia** | Lista demo | Historia czatu |
| **Layout** | Jedna kolumna | Dwie kolumny |

## Funkcje Techniczne

### State Management
- **Code**: Aktualny kod komponentu
- **Messages**: Historia konwersacji
- **localStorage**: Automatyczne zapisywanie kodu

### API Integration
- Używa `/api/generate` z kontekstem obecnego kodu
- Automatyczna aktualizacja po każdej odpowiedzi AI

### UI Features
- Auto-scroll do najnowszych wiadomości
- Loading state podczas generowania
- Error handling z przyjaznymi komunikatami
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Przykłady Promptów

### Tworzenie Nowego Komponentu
```
"Create a registration form"
"Build a contact form with name, email, and message"
"Make a login form"
```

### Modyfikacja Istniejącego
```
"Add a submit button"
"Change the email field to be required"
"Make the form wider"
"Add validation for the password field"
"Change the button text to 'Sign Up'"
```

### Styling i Layout
```
"Make the form centered"
"Add more spacing between fields"
"Change the card background color"
```

## Tips & Tricks

1. **Bądź konkretny**: "Add a phone field" zamiast "add something"
2. **Używaj kontekstu**: AI widzi obecny kod, więc możesz odwoływać się do niego
3. **Iteracyjne zmiany**: Możesz prosić o wiele małych zmian zamiast jednej dużej
4. **Sprawdzaj kod**: Zawsze sprawdź zakładkę "Code" aby zobaczyć co zostało wygenerowane

## Troubleshooting

### Problem: Kod się nie aktualizuje
- Sprawdź konsolę przeglądarki (F12)
- Upewnij się, że serwer działa
- Spróbuj "Clear Chat" i zacznij od nowa

### Problem: AI nie rozumie modyfikacji
- Bądź bardziej konkretny w opisie
- Możesz wskazać konkretny fragment kodu
- Spróbuj przeformułować prośbę

### Problem: Błędy w preview
- Sprawdź zakładkę "Code" - może być błąd składniowy
- Użyj "Run Tests" w standardowym playground
- Spróbuj wyczyścić i zacząć od nowa

