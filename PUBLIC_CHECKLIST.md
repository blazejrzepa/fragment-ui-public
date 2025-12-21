# Checklist: Przejście fragment-ui na PUBLIC

## ✅ Sprawdzenie przed publicznym udostępnieniem

### 1. Sekrety i klucze API
- [ ] Sprawdź `.env*` pliki - czy są w `.gitignore`?
- [ ] Sprawdź historię Git - czy nie ma commitowanych sekretów?
- [ ] Sprawdź `package.json` - czy nie ma hardcoded API keys?
- [ ] Sprawdź konfigurację - czy nie ma tokenów w kodzie?

### 2. Zmienne środowiskowe
Obecne repo używa:
- `OPENAI_API_KEY` - dla Studio (w `.env.local`, nie commitowane ✅)
- `POSTHOG_KEY` - dla telemetry (w `.env.local`, nie commitowane ✅)
- `POSTHOG_HOST` - dla telemetry (w `.env.local`, nie commitowane ✅)

**Status**: ✅ Wszystkie sekrety są w `.env.local` i są ignorowane przez Git

### 3. Dokumentacja
- [ ] Sprawdź czy nie ma wewnętrznych informacji w README
- [ ] Sprawdź czy nie ma linków do prywatnych zasobów
- [ ] Sprawdź czy dokumentacja jest odpowiednia dla publicznego repo

### 4. .gitignore
- [x] `.env*` - ignorowane ✅
- [x] `apps/demo/data/` - ignorowane ✅
- [x] `.vercel` - ignorowane ✅
- [x] `node_modules`, `.next`, `dist` - ignorowane ✅

### 5. Kod źródłowy
- [ ] Sprawdź czy nie ma hardcoded credentials
- [ ] Sprawdź czy nie ma linków do prywatnych serwisów
- [ ] Sprawdź czy komentarze nie zawierają wrażliwych informacji

## 🚀 Jak zrobić repo publicznym

### Na GitHub:

1. Przejdź do: https://github.com/blazejrzepa/fragment-ui/settings
2. Przewiń do sekcji **"Danger Zone"**
3. Kliknij **"Change visibility"**
4. Wybierz **"Make public"**
5. Potwierdź wpisując nazwę repozytorium

### Po zmianie na publiczne:

1. **Zaktualizuj README** (jeśli potrzebne):
   - Dodaj informację, że Studio/Playground jest eksperymentalne
   - Wyjaśnij różnicę między publicznym DS a eksperymentalnym Studio

2. **Sprawdź Issues/Discussions**:
   - Włącz Issues (jeśli chcesz)
   - Włącz Discussions (opcjonalnie)

3. **Dodaj Topics**:
   - `react`, `design-system`, `typescript`, `tailwind`, `shadcn`, `mcp`, `ai`, `components`, `studio`, `playground`

## ⚠️ Ważne uwagi

- **Studio/Playground** jest eksperymentalne - użytkownicy powinni o tym wiedzieć
- **Telemetry** może wymagać konfiguracji - upewnij się, że działa bez kluczy
- **OpenAI API** - użytkownicy muszą mieć własne klucze dla Studio

## 📝 Po przejściu na publiczne

1. Zaktualizuj dokumentację, jeśli potrzebne
2. Sprawdź czy wszystko działa dla nowych użytkowników
3. Rozważ dodanie CONTRIBUTING.md
4. Rozważ dodanie CODE_OF_CONDUCT.md

