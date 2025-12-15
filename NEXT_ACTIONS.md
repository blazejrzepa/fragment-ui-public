# Co dalej? - Następne kroki

## ✅ Co już mamy

- [x] Czyste publiczne repozytorium
- [x] Wszystkie pakiety się budują
- [x] Kod na GitHub (private)
- [x] README i dokumentacja

## 🎯 Proponowane następne kroki

### 1. 🧪 Testowanie i weryfikacja

**Sprawdź czy wszystko działa:**
```bash
cd fragment-ui-public

# Test build
pnpm build

# Test dev server
pnpm dev:www
# Otwórz http://localhost:3000

# Test type checking
pnpm type-check
```

### 2. 📦 Publikacja pakietów na npm (opcjonalnie)

Jeśli chcesz opublikować pakiety na npm:

```bash
# Zaloguj się do npm
npm login

# Opublikuj publiczne pakiety
pnpm --filter @fragment_ui/ui publish --access public
pnpm --filter @fragment_ui/tokens publish --access public
pnpm --filter @fragment_ui/blocks publish --access public
pnpm --filter @fragment_ui/mcp-server publish --access public
```

**Lub użyj Changesets** (lepsze dla wersjonowania):
```bash
pnpm add -D @changesets/cli
pnpm changeset init
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

### 3. 🤖 CI/CD - GitHub Actions

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
      - run: pnpm test
```

### 4. 🌐 Zmiana na Public (gdy będzie gotowe)

Jeśli chcesz zmienić repo na publiczne:

1. Na GitHub: Settings → Danger Zone → Change visibility → Make public
2. Zaktualizuj README (jeśli potrzebne)
3. Rozważ dodanie CONTRIBUTING.md
4. Rozważ dodanie CODE_OF_CONDUCT.md

### 5. 📚 Dodatkowa dokumentacja

- **CONTRIBUTING.md** - Jak contributeować
- **CODE_OF_CONDUCT.md** - Code of conduct
- **SECURITY.md** - Security policy
- **CHANGELOG.md** - Historia zmian

### 6. 🏷️ Pierwszy Release

```bash
git tag -a v0.1.0 -m "First release: Clean design system"
git push origin v0.1.0
```

Potem na GitHub: Releases → Draft a new release

### 7. 🔍 Code Quality

- Dodać pre-commit hooks (Husky)
- Dodać linting w CI
- Dodać testy w CI
- Dodać coverage reports

## 🎯 Rekomendowane priorytety

**Krótkoterminowe (teraz):**
1. ✅ Testuj lokalnie - sprawdź czy wszystko działa
2. 🤖 Dodaj CI/CD - automatyczne testy i build
3. 📝 Dodaj CONTRIBUTING.md - jeśli planujesz contributors

**Średnioterminowe (niedługo):**
4. 📦 Publikacja na npm - jeśli chcesz dystrybuować pakiety
5. 🌐 Zmiana na public - gdy będzie gotowe
6. 🏷️ Pierwszy release - oznaczenie wersji

**Długoterminowe (później):**
7. 📚 Rozszerzona dokumentacja
8. 🔍 Code quality improvements
9. 🧪 Więcej testów

## 💡 Szybkie decyzje

**Jeśli chcesz szybko opublikować:**
→ Dodaj CI/CD → Testuj → Publikuj na npm → Zmień na public

**Jeśli chcesz najpierw przetestować:**
→ Testuj lokalnie → Dodaj CI/CD → Sprawdź wszystko → Potem publikuj

**Jeśli chcesz zachować jako private:**
→ Możesz używać jako private repo, testować, rozwijać

## ❓ Co chcesz zrobić?

Wybierz jeden z powyższych kroków, a pomogę Ci go zaimplementować!

