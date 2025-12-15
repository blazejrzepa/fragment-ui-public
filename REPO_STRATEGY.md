# Strategia repozytoriów

## 🎯 Plan

### Repozytorium 1: `fragment-ui` (obecne na GitHub)
- **Status**: PUBLIC
- **Zawartość**: 
  - Pełny monorepo
  - Studio/Playground
  - Governance/Submissions
  - Telemetry
  - Eksperymentalne funkcje
- **Przeznaczenie**: Open source, pełna funkcjonalność

### Repozytorium 2: `fragment-ui-public` (nowe)
- **Status**: PRIVATE (na razie)
- **Zawartość**:
  - Czysty design system
  - UI components, tokens, blocks
  - MCP server
  - Dokumentacja
- **Przeznaczenie**: Można później zmienić na publiczne, gdy będzie gotowe

## ✅ Co zrobić

### Krok 1: Przygotuj obecne `fragment-ui` do publicznego

1. **Sprawdź sekrety**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Sprawdź czy nie ma .env, API keys, etc.
   ```

2. **Sprawdź .gitignore**:
   - Upewnij się, że `.env*` są ignorowane
   - Sprawdź czy nie ma commitowanych sekretów

3. **Przejrzyj historię Git**:
   ```bash
   git log --all --full-history --source -- "*.env*" "*.key" "*secret*"
   ```

4. **Ustaw na GitHub jako Public**:
   - Settings → Danger Zone → Change visibility → Make public

### Krok 2: Przygotuj nowe repo jako Private

1. **Utwórz nowe private repo na GitHub**:
   - Nazwa: `fragment-ui-ds` lub `fragment-ui-design-system`
   - Visibility: **Private**

2. **Push nowego repo**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   git remote add origin https://github.com/YOUR_USERNAME/fragment-ui-ds.git
   git branch -M main
   git push -u origin main
   ```

## 🔍 Checklist przed publicznym `fragment-ui`

- [ ] Sprawdź `.env*` pliki - czy są w .gitignore?
- [ ] Sprawdź historię Git - czy nie ma commitowanych sekretów?
- [ ] Sprawdź `package.json` - czy nie ma hardcoded API keys?
- [ ] Sprawdź konfigurację - czy nie ma tokenów w kodzie?
- [ ] Sprawdź dokumentację - czy nie ma wewnętrznych informacji?
- [ ] Sprawdź `.gitignore` - czy wszystkie sekrety są ignorowane?

## 📝 Uwagi

- Obecne `fragment-ui` może zawierać więcej "eksperymentalnego" kodu
- Nowe repo jest czystsze i bardziej "production-ready"
- Możesz później zmienić nowe repo z private na public, gdy będzie gotowe
- Obecne repo jako publiczne pokazuje pełny rozwój projektu

## 🚀 Zalety tego podejścia

1. **Obecne repo (public)**:
   - Pokazuje pełny rozwój projektu
   - Transparentność dla społeczności
   - Może przyciągnąć contributorów

2. **Nowe repo (private)**:
   - Możesz spokojnie testować przed publikacją
   - Możesz później zdecydować czy publikować
   - Czysta wersja bez eksperymentalnego kodu

