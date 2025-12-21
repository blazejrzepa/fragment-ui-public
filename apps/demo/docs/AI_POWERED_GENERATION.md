# AI-Powered Component Generation

## Problem

Użytkownik zauważył, że system nie zawsze tworzy to, o co prosi, ponieważ używa tylko prostego rule-based parsera zamiast inteligentnego AI.

## Rozwiązanie

Zmieniono system tak, aby używał **hybrydowego podejścia**:
- **Proste prompty** → Lokalny parser (szybki, darmowy)
- **Złożone prompty** → OpenAI API (inteligentny, elastyczny)

## Kiedy używa AI?

System automatycznie używa AI API gdy:

1. **Długi prompt** (> 100 znaków)
2. **Słowa kluczowe** wskazujące na złożoność:
   - `wg`, `według`, `best`, `najlepszych`
   - `standard`, `standar`, `ux`, `ui`
   - `design`, `projekt`
   - `custom`, `własny`, `specjalny`
   - `zaawansowany`, `advanced`, `complex`, `złożony`
   - `przykładowymi`, `example`, `przykład`
3. **Modyfikacja istniejącego kodu** (zawsze używa AI)

## Przykłady

### Używa AI (złożone):
```
✅ "chciałbym stworzyc nowy komponent formularz rejestracyjny z przykladowymi polami, wg najlepszych standarow UX"
✅ "Create a custom dashboard with advanced filtering and real-time updates"
✅ "Zmodyfikuj istniejący formularz: dodaj pole numeru telefonu"
```

### Używa lokalnego parsera (proste):
```
✅ "Create a login form"
✅ "Formularz rejestracyjny"
✅ "Contact form with name and email"
```

## Jak to działa?

### Flow dla złożonych promptów:

```
1. Użytkownik: "formularz rejestracyjny z przykladowymi polami, wg najlepszych standarow UX"
   ↓
2. System wykrywa: długi prompt + słowa kluczowe → używa AI
   ↓
3. Wywołuje: POST /api/generate
   ↓
4. OpenAI API generuje kompletny kod TSX
   ↓
5. System wyświetla wygenerowany kod
   ↓
6. Preview renderuje komponent
```

### Flow dla prostych promptów:

```
1. Użytkownik: "Create a login form"
   ↓
2. System wykrywa: prosty prompt → używa lokalnego parsera
   ↓
3. Lokalny parser → UI-DSL
   ↓
4. Generator → TSX
   ↓
5. System wyświetla kod
```

## Konfiguracja

### Wymagane

W `apps/demo/.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

### Bez API Key

Jeśli `OPENAI_API_KEY` nie jest ustawiony:
- System używa tylko lokalnego parsera
- Złożone prompty mogą nie działać dobrze
- Proste prompty działają normalnie

## Zalety

### AI API:
- ✅ Rozumie złożone intencje
- ✅ Tworzy profesjonalne komponenty
- ✅ Obsługuje niestandardowe wymagania
- ✅ Lepsze UX i walidacja

### Lokalny parser:
- ✅ Szybki (brak opóźnień API)
- ✅ Darmowy (brak kosztów)
- ✅ Działa offline
- ✅ Przewidywalny

## Koszty

### Przybliżone koszty (gpt-4o-mini):

- **1 generacja**: ~500-1000 tokens → ~$0.000075-0.00015
- **100 generacji/dzień**: ~$0.0075-0.015/dzień
- **1000 generacji/dzień**: ~$0.075-0.15/dzień

**Rekomendacja**: Użyj `gpt-4o-mini` - najlepszy stosunek jakości do ceny.

## Status

✅ **Zaimplementowane**:
- Automatyczne wykrywanie złożonych promptów
- Integracja z `/api/generate`
- Fallback do lokalnego parsera
- Logowanie metody generowania

⏳ **Do rozważenia**:
- Cache dla podobnych promptów
- Lepsze wykrywanie intencji
- Konfigurowalne progi dla AI
- Rate limiting

## Pliki

Zmiany w: `apps/demo/app/playground/page.tsx`

