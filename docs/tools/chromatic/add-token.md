# 🎨 Dodanie tokena Chromatic do GitHub Secrets

## Quick Setup

### 1. Przejdź do GitHub Secrets
👉 **Kliknij ten link:** https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions

### 2. Dodaj nowy secret
1. Kliknij **"New repository secret"**
2. **Name:** `CHROMATIC_PROJECT_TOKEN`
3. **Secret:** `chpt_a9a800ba2c497a7`
4. Kliknij **"Add secret"**

### 3. Gotowe! ✅
- Po dodaniu secret, workflow Chromatic automatycznie zacznie działać
- Sprawdź status w: https://github.com/blazejrzepa/fragment-ui/actions

**Status:** ✅ Token dodany! Chromatic aktywny.

---

## Test lokalny (opcjonalne)

Jeśli chcesz przetestować Chromatic lokalnie przed dodaniem do CI:

```bash
# Zainstaluj Chromatic
pnpm add -D chromatic

# Uruchom publikację Storybook
npx chromatic --project-token=chpt_a9a800ba2c497a7
```

---

## Weryfikacja

Po dodaniu secret:
1. Push nowy commit lub otwórz PR
2. Sprawdź GitHub Actions - powinien pojawić się workflow "Chromatic"
3. Sprawdź status w: https://www.chromatic.com/builds

