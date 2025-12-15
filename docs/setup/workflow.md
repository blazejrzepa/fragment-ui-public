# 🔄 Workflow: Praca z dwoma repozytoriami

## 📦 Strategia repozytoriów

### 1. `fragment-ui` (główne repozytorium)
- **Status**: PUBLIC ✅
- **Lokalizacja**: `/Users/blazejrzepa/Dev/fragment-ui`
- **Zawartość**:
  - ✅ Pełny monorepo z wszystkimi pakietami
  - ✅ Studio/Playground (eksperymentalne)
  - ✅ Governance/Submissions
  - ✅ Telemetry
  - ✅ Eksperymentalne funkcje
  - ✅ Wszystkie pakiety (publiczne i prywatne)
- **Przeznaczenie**: 
  - **Główny workspace** - tutaj pracujesz na co dzień
  - Open source - pokazuje pełny rozwój projektu
  - Eksperymentalne funkcje i testy

### 2. `fragment-ui-public` (publiczne repozytorium)
- **Status**: PUBLIC ✅
- **Lokalizacja**: `/Users/blazejrzepa/Dev/fragment-ui-public`
- **GitHub**: https://github.com/blazejrzepa/fragment-ui-public
- **Zawartość**:
  - ✅ Czysty design system
  - ✅ `@fragment_ui/ui` - komponenty UI
  - ✅ `@fragment_ui/tokens` - design tokens
  - ✅ `@fragment_ui/blocks` - pre-built blocks
  - ✅ `@fragment_ui/mcp-server` - MCP server
  - ✅ Dokumentacja (`apps/www`)
  - ❌ **NIE zawiera**: Studio/Playground, telemetry, eksperymentalnych funkcji
- **Przeznaczenie**:
  - **Publiczny design system** - stabilna, production-ready wersja
  - Publikacja na npm
  - Dokumentacja dla użytkowników
  - Czysta wersja bez eksperymentalnego kodu

## 🔄 Workflow synchronizacji

### Scenariusz 1: Nowa funkcja w komponencie UI

**Gdy pracujesz nad komponentem w `fragment-ui`:**

1. **Pracujesz w `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Tworzysz nową funkcję, poprawiasz bug, etc.
   git add .
   git commit -m "feat(ui): Add new feature to Button"
   ```

2. **Gdy funkcja jest gotowa i przetestowana**:
   ```bash
   # Skopiuj zmiany do fragment-ui-public
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   
   # Opcja A: Skopiuj pliki ręcznie
   cp -r ../fragment-ui/packages/ui/src/button.tsx packages/ui/src/
   
   # Opcja B: Użyj git cherry-pick (jeśli commity są spójne)
   # git remote add upstream ../fragment-ui
   # git fetch upstream
   # git cherry-pick <commit-hash>
   ```

3. **Zbuduj i przetestuj w public repo**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   pnpm build
   pnpm test
   ```

4. **Zaktualizuj wersję i opublikuj**:
   ```bash
   # Zwiększ wersję w package.json
   # Opublikuj na npm
   ./publish.sh
   ```

### Scenariusz 2: Nowy komponent

1. **Tworzysz komponent w `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Tworzysz nowy komponent
   # Testujesz, rozwijasz
   ```

2. **Gdy komponent jest stabilny**:
   ```bash
   # Skopiuj komponent do fragment-ui-public
   cp -r ../fragment-ui/packages/ui/src/new-component.tsx packages/ui/src/
   cp -r ../fragment-ui/packages/ui/src/new-component.test.tsx packages/ui/src/
   
   # Zaktualizuj eksporty
   # packages/ui/src/index.ts
   export * from "./new-component";
   ```

3. **Zbuduj, przetestuj, opublikuj**:
   ```bash
   pnpm build
   pnpm test
   # Zwiększ wersję
   ./publish.sh
   ```

### Scenariusz 3: Aktualizacja dokumentacji

1. **Aktualizujesz dokumentację w `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Edytujesz apps/www
   ```

2. **Skopiuj do `fragment-ui-public`**:
   ```bash
   # Skopiuj zmiany w dokumentacji
   cp -r ../fragment-ui/apps/www/src/app/docs/components/button.mdx \
         apps/www/src/app/docs/components/
   ```

3. **Commit i push**:
   ```bash
   git add .
   git commit -m "docs: Update button documentation"
   git push
   ```

### Scenariusz 4: Aktualizacja design tokens

1. **Zmieniasz tokeny w `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Edytujesz packages/tokens/src/...
   pnpm --filter @fragment_ui/tokens build
   ```

2. **Skopiuj do `fragment-ui-public`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   cp -r ../fragment-ui/packages/tokens/src/* packages/tokens/src/
   pnpm --filter @fragment_ui/tokens build
   ```

3. **Zaktualizuj wersję i opublikuj**:
   ```bash
   # Zwiększ wersję w packages/tokens/package.json
   ./publish.sh
   ```

## 🛠️ Narzędzia pomocnicze

### Skrypt do synchronizacji (opcjonalnie)

Możesz utworzyć skrypt `sync-to-public.sh`:

```bash
#!/bin/bash
# Skrypt do synchronizacji wybranych pakietów z fragment-ui do fragment-ui-public

SOURCE_DIR="/Users/blazejrzepa/Dev/fragment-ui"
TARGET_DIR="/Users/blazejrzepa/Dev/fragment-ui-public"

# Synchronizuj UI
echo "Syncing @fragment_ui/ui..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/ui/src/" \
  "$TARGET_DIR/packages/ui/src/"

# Synchronizuj tokens
echo "Syncing @fragment_ui/tokens..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/tokens/src/" \
  "$TARGET_DIR/packages/tokens/src/"

# Synchronizuj blocks
echo "Syncing @fragment_ui/blocks..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/blocks/src/" \
  "$TARGET_DIR/packages/blocks/src/"

echo "✅ Synchronization complete!"
```

## 📋 Checklist przed synchronizacją

Przed skopiowaniem zmian do `fragment-ui-public`:

- [ ] Kod jest przetestowany w `fragment-ui`
- [ ] Nie ma zależności od Studio/Playground/telemetry
- [ ] Nie ma eksperymentalnych funkcji
- [ ] Kod jest production-ready
- [ ] Dokumentacja jest zaktualizowana
- [ ] Testy przechodzą
- [ ] Nie ma hardcoded sekretów/API keys

## 🎯 Kiedy synchronizować?

**Synchronizuj regularnie:**
- Po stabilnych zmianach w komponentach UI
- Po aktualizacji design tokens
- Po dodaniu nowych blocks
- Po aktualizacji dokumentacji
- Przed publikacją na npm

**NIE synchronizuj:**
- Eksperymentalnych funkcji
- Zmian w Studio/Playground
- Zmian w telemetry
- Wewnętrznych narzędzi

## 🚀 Publikacja na npm

Po synchronizacji i weryfikacji:

1. **Zwiększ wersję** w `package.json`
2. **Zbuduj pakiety**: `pnpm build`
3. **Przetestuj**: `pnpm test`
4. **Opublikuj**: `./publish.sh`

## 💡 Najlepsze praktyki

1. **Pracuj w `fragment-ui`** - to jest Twój główny workspace
2. **Synchronizuj regularnie** - nie czekaj zbyt długo
3. **Testuj w obu repo** - upewnij się, że wszystko działa
4. **Używaj semantycznego wersjonowania** - zwiększaj wersje odpowiednio
5. **Dokumentuj zmiany** - ułatwi to synchronizację

## ❓ FAQ

**Q: Czy mogę pracować bezpośrednio w `fragment-ui-public`?**
A: Tak, ale lepiej pracować w `fragment-ui` i synchronizować, żeby mieć pełny kontekst.

**Q: Jak często synchronizować?**
A: Zależy od tempa pracy. Raz w tygodniu to dobry rytm, ale możesz częściej.

**Q: Co jeśli zapomnę zsynchronizować?**
A: Możesz zawsze wrócić do commitu w `fragment-ui` i skopiować zmiany później.

**Q: Czy mogę zautomatyzować synchronizację?**
A: Tak, możesz użyć skryptu (patrz wyżej) lub GitHub Actions.

