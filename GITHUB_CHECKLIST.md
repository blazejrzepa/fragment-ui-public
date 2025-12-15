# GitHub Release Checklist

## ✅ Przed pierwszym commitem

### 1. Sprawdź sekrety i klucze
- [x] Brak `.env` plików
- [x] Brak hardcoded API keys
- [x] Brak tokenów w kodzie
- [x] `.gitignore` zawiera `.env*`

### 2. Sprawdź dokumentację
- [x] `README.md` jest kompletny i aktualny
- [x] `LICENSE` jest poprawny (MIT)
- [ ] `CONTRIBUTING.md` (opcjonalnie)
- [ ] `CHANGELOG.md` (opcjonalnie)

### 3. Sprawdź build
- [x] `pnpm install` działa
- [x] `pnpm build` działa (wszystkie pakiety)
- [x] `pnpm type-check` przechodzi
- [ ] `pnpm test` przechodzi (jeśli są testy)

### 4. Sprawdź strukturę
- [x] Wszystkie publiczne pakiety są włączone
- [x] Brak referencji do Studio/Playground
- [x] Brak referencji do telemetry w kodzie źródłowym
- [x] `apps/www` działa bez telemetry

## 🚀 Przygotowanie do GitHub

### Krok 1: Inicjalizacja Git
```bash
cd fragment-ui-public
git init
git add .
git commit -m "Initial commit: Public Fragment UI repository"
```

### Krok 2: Utwórz repozytorium na GitHub
1. Przejdź do https://github.com/new
2. Nazwa: `fragment-ui` (lub inna)
3. Opis: "AI-native design system components based on shadcn/ui"
4. Public / Private (wybierz)
5. **NIE** dodawaj README, LICENSE, .gitignore (już mamy)

### Krok 3: Połącz z GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/fragment-ui.git
git branch -M main
git push -u origin main
```

### Krok 4: Ustawienia repozytorium
- [ ] Włącz Issues
- [ ] Włącz Discussions (opcjonalnie)
- [ ] Ustaw GitHub Pages (jeśli chcesz hostować docs)
- [ ] Dodaj topics: `react`, `design-system`, `typescript`, `tailwind`, `shadcn`, `mcp`

### Krok 5: GitHub Actions CI (opcjonalnie)
Utwórz `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm type-check
```

## 📦 Publikacja pakietów na npm

### Przygotowanie
1. Zaloguj się do npm:
   ```bash
   npm login
   ```

2. Sprawdź, które pakiety są publiczne:
   - `@fragment_ui/ui` - ✅ public
   - `@fragment_ui/tokens` - ✅ public
   - `@fragment_ui/blocks` - ✅ public
   - `@fragment_ui/mcp-server` - ✅ public (zmienione z private)

### Publikacja
```bash
# Z roota repozytorium
pnpm --filter @fragment_ui/ui publish --access public
pnpm --filter @fragment_ui/tokens publish --access public
pnpm --filter @fragment_ui/blocks publish --access public
pnpm --filter @fragment_ui/mcp-server publish --access public
```

**Lub użyj Changesets** (jeśli skonfigurowane):
```bash
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

## 🎯 Pierwszy Release

1. Utwórz tag:
   ```bash
   git tag -a v0.1.0 -m "First public release"
   git push origin v0.1.0
   ```

2. Utwórz GitHub Release:
   - Przejdź do Releases → Draft a new release
   - Tag: `v0.1.0`
   - Title: "Fragment UI v0.1.0 - First Public Release"
   - Opis: Zobacz `CHANGELOG.md` lub `PUBLIC_REPO_SUMMARY.md`

## 📝 Co dalej?

- [ ] Dodaj GitHub Actions CI
- [ ] Skonfiguruj Changesets dla wersjonowania
- [ ] Dodaj CODE_OF_CONDUCT.md
- [ ] Dodaj SECURITY.md
- [ ] Skonfiguruj Dependabot
- [ ] Dodaj badges do README (build status, npm version, etc.)

## ⚠️ Ważne uwagi

1. **Nie commituj**:
   - `node_modules/`
   - `.next/`, `dist/`, `.turbo/`
   - `.env*` pliki
   - Build artifacts

2. **Sprawdź przed commitem**:
   ```bash
   git status
   git diff
   ```

3. **Pakiety private** (nie publikuj):
   - `@fragment_ui/registry` - private
   - `@fragment_ui/cli` - private
   - `@fragment_ui/utils` - private
   - `@fragment_ui/plugin-system` - private
   - `@fragment_ui/patches` - private

