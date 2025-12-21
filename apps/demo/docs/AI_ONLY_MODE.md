# AI-Only Mode - Playground

## Zmiana

Usunięto całkowicie lokalny parser i przełączono system na **tylko AI** do generowania komponentów.

## Co zostało usunięte

1. **Lokalny parser** (`parsePrompt` z `dsl/parser.ts`)
2. **Generator DSL** (`generateTSX` z `dsl/generator.ts`)
3. **Walidator DSL** (`validateUiDsl` z `dsl/schema.ts`)
4. **State DSL** (`dsl`, `setDsl`)
5. **Fallback logic** - nie ma już fallback do lokalnego parsera

## Jak działa teraz

### Flow:

```
1. Użytkownik: "Create a registration form"
   ↓
2. System zawsze używa: POST /api/generate
   ↓
3. /api/generate używa OpenAI API (jeśli dostępne)
   ↓
4. OpenAI generuje kompletny kod TSX
   ↓
5. System wyświetla wygenerowany kod
   ↓
6. Preview renderuje komponent
```

### Bez API Key:

Jeśli `OPENAI_API_KEY` nie jest ustawiony:
- System zwróci błąd
- Użytkownik zobaczy komunikat: "Please make sure OPENAI_API_KEY is configured"
- **Nie ma fallback** - system wymaga AI

## Wymagania

### Konfiguracja

**Wymagane** w `apps/demo/.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

Bez tego klucza system **nie będzie działał**.

## Zalety

✅ **Zawsze inteligentne** - AI rozumie złożone intencje  
✅ **Profesjonalne komponenty** - lepsza jakość kodu  
✅ **Elastyczność** - obsługuje niestandardowe wymagania  
✅ **Lepsze UX** - AI tworzy komponenty zgodne z best practices  

## Wady

❌ **Wymaga API Key** - nie działa bez OpenAI  
❌ **Koszty** - każda generacja kosztuje  
❌ **Opóźnienia** - API call trwa dłużej niż lokalny parser  
❌ **Zależność** - system zależy od zewnętrznego API  

## Koszty

### Przybliżone koszty (gpt-4o-mini):

- **1 generacja**: ~500-1000 tokens → ~$0.000075-0.00015
- **100 generacji/dzień**: ~$0.0075-0.015/dzień
- **1000 generacji/dzień**: ~$0.075-0.15/dzień

## Status

✅ **Zaimplementowane**:
- Usunięto lokalny parser
- Usunięto fallback logic
- System zawsze używa `/api/generate`
- Komunikaty błędów wskazują na potrzebę API Key

## Pliki

Zmiany w: `apps/demo/app/playground/page.tsx`

Usunięto:
- Importy: `parsePrompt`, `validateUiDsl`, `generateTSX`
- State: `dsl`, `setDsl`
- Wszystkie referencje do lokalnego parsera

## Uwaga

System teraz **wymaga** `OPENAI_API_KEY` do działania. Bez tego klucza nie będzie generował komponentów.

