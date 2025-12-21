# 🔍 Debug Chromatic Workflow

## Problem
Workflow #120 nie pokazuje URL Storybook w logach.

## Możliwe przyczyny

### 1. Chromatic action nie wykonał się

**Sprawdź w logach workflow #120:**
- Czy jest krok "Run Chromatic"?
- Jaki jest status tego kroku?
- Czy są jakieś błędy?

### 2. Brak lub nieprawidłowy token

**Sprawdź GitHub Secrets:**
```
https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
```

Powinien być:
- `CHROMATIC_PROJECT_TOKEN` z wartością: `chpt_...`

**Jeśli nie ma:**
1. Zaloguj się do: https://www.chromatic.com
2. Wybierz projekt (lub stwórz nowy)
3. Settings → Project Token
4. Skopiuj token
5. Dodaj do GitHub Secrets

### 3. Build Storybook failed

**Sprawdź logi:**
- W workflow #120, znajdź krok "Run Chromatic"
- Sprawdź czy `storybook:build` przeszedł
- Szukaj błędów w build logu

## Rozwiązanie

### Krok 1: Sprawdź status workflow

Otwórz:
```
https://github.com/blazejrzepa/fragment-ui/actions/runs/[numer-run]
```

Sprawdź:
- [ ] Czy workflow przeszedł (zielony status)?
- [ ] Czy krok "Run Chromatic" się wykonał?
- [ ] Jakie są błędy w logach?

### Krok 2: Sprawdź czy token istnieje

1. Otwórz: https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
2. Sprawdź czy jest `CHROMATIC_PROJECT_TOKEN`
3. Jeśli nie ma - dodaj zgodnie z instrukcją powyżej

### Krok 3: Uruchom nowy build

```bash
# Push commit aby uruchomić workflow
git commit --allow-empty -m "chore: Trigger Chromatic build"
git push origin main
```

Lub uruchom workflow ręcznie:
1. GitHub Actions → Chromatic workflow
2. "Run workflow" → "Run workflow"

### Krok 4: Sprawdź logi nowego buildu

Po uruchomieniu:
1. Otwórz nowy workflow run
2. Sprawdź krok "Run Chromatic"
3. Szukaj w output:
   - `✓ Storybook published to https://...`
   - lub błędy

## Typowe błędy

### "Missing project token"
**Problem:** Token nie jest ustawiony lub niepoprawny
**Rozwiązanie:** Sprawdź GitHub Secrets i upewnij się że token jest poprawny

### "Storybook build failed"
**Problem:** Build Storybook nie przeszedł
**Rozwiązanie:** Sprawdź błędy w build logu, upewnij się że lokalnie build działa

### "Cannot find module"
**Problem:** Problemy z dependencies w monorepo
**Rozwiązanie:** Upewnij się że `pnpm install` działa poprawnie

## Co dalej?

Jeśli po sprawdzeniu nadal nie działa, wykonaj:

1. **Sprawdź lokalnie czy Storybook build działa:**
   ```bash
   cd packages/ui
   pnpm storybook:build
   ```

2. **Sprawdź czy token jest poprawny:**
   - Możesz przetestować lokalnie: `npx chromatic --project-token=YOUR_TOKEN`

3. **Sprawdź czy workflow ma poprawne ustawienia:**
   - `workingDir: packages/ui`
   - `buildScriptName: storybook:build`

4. **Otwórz issue w Chromatic** jeśli problem persists

