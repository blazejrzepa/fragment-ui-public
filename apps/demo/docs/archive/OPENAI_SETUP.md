# OpenAI API Setup dla AI Playground

## 🔑 Konfiguracja

### 1. Utwórz plik `.env.local` w `apps/demo/`:

```bash
# OpenAI API Key (wymagane dla AI-powered generation)
OPENAI_API_KEY=sk-...

# Opcjonalnie: Wybierz model (domyślnie: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

### 2. Gdzie znaleźć API Key?

1. Przejdź do https://platform.openai.com/api-keys
2. Zaloguj się lub utwórz konto
3. Kliknij "Create new secret key"
4. Skopiuj klucz i dodaj do `.env.local`

## 💰 Koszty

### Modele i ceny (per 1K tokens):

- **gpt-4o-mini** (domyślnie): ~$0.15/$0.60 (input/output)
  - Średni request: ~500 tokens → ~$0.0003-0.0008 per request
  - **Rekomendowane** dla większości przypadków

- **gpt-4o**: ~$2.50/$10.00 (input/output)
  - Średni request: ~500 tokens → ~$0.001-0.005 per request
  - Lepsza jakość, ale droższe

- **gpt-3.5-turbo**: ~$0.50/$1.50 (input/output)
  - Średni request: ~500 tokens → ~$0.00025-0.00075 per request
  - Tańsze, ale gorsza jakość niż gpt-4o-mini

### Przykładowe koszty:

- **100 requestów/dzień** z gpt-4o-mini: ~$0.03-0.08/dzień (~$1-2.5/miesiąc)
- **1000 requestów/dzień**: ~$0.3-0.8/dzień (~$9-25/miesiąc)

## 🎯 Hybrid Approach

System automatycznie wybiera metodę generowania:

1. **Proste prompty** (np. "Zbuduj formularz rejestracyjny z polami: email, hasło")
   - → **Rule-based parsing** (darmowe, szybkie)
   
2. **Złożone prompty** lub **modyfikacje kodu**
   - → **OpenAI API** (płatne, ale lepsza jakość)

### Przykłady:

- ✅ Rule-based: "Zbuduj formularz rejestracyjny z polami: email, hasło"
- ✅ OpenAI: "Stwórz formularz z walidacją email, hasło z wymaganiami bezpieczeństwa, i checkboxem zgody RODO"
- ✅ OpenAI: "Zmodyfikuj istniejący formularz: dodaj pole numeru telefonu"

## 🚀 Bez API Key

Jeśli `OPENAI_API_KEY` nie jest ustawiony:
- System używa **tylko rule-based parsing**
- Wszystkie prompty są przetwarzane przez reguły
- Działa, ale z ograniczeniami

## 📝 Testowanie

1. **Bez API Key:**
   ```bash
   # Usuń OPENAI_API_KEY z .env.local
   # System użyje rule-based parsing
   ```

2. **Z API Key:**
   ```bash
   # Dodaj OPENAI_API_KEY do .env.local
   # System użyje OpenAI dla złożonych promptów
   ```

3. **Sprawdź w konsoli:**
   - `metadata.method: "openai"` → użyto OpenAI
   - `metadata.method: "rule-based"` → użyto rule-based

## 🔧 Troubleshooting

### Błąd: "OpenAI API key is not configured"
- Sprawdź, czy `.env.local` istnieje w `apps/demo/`
- Sprawdź, czy `OPENAI_API_KEY` jest poprawnie ustawiony
- Zrestartuj serwer Next.js

### Błąd: "OpenAI API error: Invalid API key"
- Sprawdź, czy klucz jest poprawny
- Sprawdź, czy masz środki na koncie OpenAI
- Sprawdź, czy klucz nie wygasł

### Błąd: "Rate limit exceeded"
- Zwiększ limit w ustawieniach OpenAI
- Lub użyj tańszego modelu (gpt-4o-mini)

## 💡 Optymalizacja Kosztów

1. **Użyj gpt-4o-mini** (domyślnie) - najlepszy stosunek jakości do ceny
2. **Hybrid approach** - proste prompty używają rule-based (darmowe)
3. **Cache** - rozważ cache'owanie podobnych promptów
4. **Limit requests** - dodaj limit requestów per user/day

