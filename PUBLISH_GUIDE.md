# Publikacja pakietów na npm

## 📦 Pakiety do publikacji

1. `@fragment_ui/ui` - UI components library
2. `@fragment_ui/tokens` - Design tokens
3. `@fragment_ui/blocks` - Layout blocks
4. `@fragment_ui/mcp-server` - MCP server

## 🔐 Krok 1: Zaloguj się do npm

```bash
npm login
```

Wprowadź:
- Username
- Password
- Email
- OTP (jeśli masz 2FA)

Sprawdź czy jesteś zalogowany:
```bash
npm whoami
```

## 📝 Krok 2: Sprawdź wersje pakietów

```bash
cd fragment-ui-public

# Sprawdź wersje
cat packages/ui/package.json | grep '"version"'
cat packages/tokens/package.json | grep '"version"'
cat packages/blocks/package.json | grep '"version"'
cat packages/mcp-server/package.json | grep '"version"'
```

## 🏗️ Krok 3: Zbuduj wszystkie pakiety

```bash
pnpm build
```

## 📤 Krok 4: Publikuj pakiety

### Opcja A: Publikuj wszystkie naraz

```bash
# Z roota repozytorium
pnpm --filter @fragment_ui/ui publish --access public
pnpm --filter @fragment_ui/tokens publish --access public
pnpm --filter @fragment_ui/blocks publish --access public
pnpm --filter @fragment_ui/mcp-server publish --access public
```

### Opcja B: Publikuj pojedynczo (zalecane przy pierwszej publikacji)

```bash
# 1. UI
cd packages/ui
pnpm publish --access public

# 2. Tokens
cd ../tokens
pnpm publish --access public

# 3. Blocks
cd ../blocks
pnpm publish --access public

# 4. MCP Server
cd ../mcp-server
pnpm publish --access public
```

## ✅ Krok 5: Sprawdź publikację

Sprawdź na npm:
- https://www.npmjs.com/package/@fragment_ui/ui
- https://www.npmjs.com/package/@fragment_ui/tokens
- https://www.npmjs.com/package/@fragment_ui/blocks
- https://www.npmjs.com/package/@fragment_ui/mcp-server

## ⚠️ Ważne uwagi

1. **Wersjonowanie**: Po publikacji, każda kolejna zmiana wymaga zwiększenia wersji
2. **Dry run**: Możesz najpierw przetestować z `--dry-run`:
   ```bash
   pnpm --filter @fragment_ui/ui publish --dry-run
   ```
3. **OTP**: Jeśli masz 2FA, będziesz potrzebować OTP przy każdej publikacji
4. **Registry**: Upewnij się, że publikujesz do właściwego registry (npmjs.org)

## 🔄 Aktualizacja wersji

Po zmianach, zaktualizuj wersję w `package.json`:
- Patch: `1.0.0` → `1.0.1` (bug fixes)
- Minor: `1.0.0` → `1.1.0` (new features)
- Major: `1.0.0` → `2.0.0` (breaking changes)

Lub użyj Changesets (lepsze dla monorepo):
```bash
pnpm add -D @changesets/cli
pnpm changeset init
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

## 🎯 Po publikacji

1. Zaktualizuj README z linkami do npm
2. Utwórz GitHub Release
3. Zaktualizuj dokumentację z instrukcjami instalacji

