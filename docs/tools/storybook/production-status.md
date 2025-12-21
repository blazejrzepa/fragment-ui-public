# 📚 Storybook Production Status

## 🎯 Gdzie jest Storybook produkcyjnie?

Storybook jest wdrażany przez **Chromatic** - automatycznie przy każdym push do `main`.

## 🔗 Jak znaleźć URL Storybook:

### Metoda 1: GitHub Actions (Najszybsza)

1. **Otwórz GitHub Actions:**
   ```
   https://github.com/blazejrzepa/fragment-ui/actions/workflows/chromatic.yml
   ```

2. **Znajdź najnowszy successful build:**
   - Kliknij na najnowszy workflow run
   - Scrolluj do sekcji "Run Chromatic"
   - Szukaj w outputu:
     - `✓ Storybook published to https://xxxxx.chromatic.com`
     - lub link "View Storybook"

### Metoda 2: Chromatic Dashboard

1. **Zaloguj się:**
   ```
   https://www.chromatic.com
   ```
   - Zaloguj się przez GitHub

2. **Znajdź projekt:**
   - Wybierz projekt `fragment-ui` (lub nazwę jaką podałeś przy setup)
   - Przejdź do "Builds"

3. **Otwórz ostatni build:**
   - Kliknij na najnowszy successful build
   - W górnej części znajdziesz link "View Storybook"

### Metoda 3: URL Pattern

Chromatic używa stałego pattern:
```
https://[project-name].chromatic.com
```

Przykłady:
- `https://fragment-ui.chromatic.com`
- `https://fragment-ui-blazejrzepa.chromatic.com`
- (nazwa zależy od tego jak stworzyłeś projekt w Chromatic)

## ⚙️ Konfiguracja w Vercel

Po znalezieniu URL Storybook:

1. **Otwórz Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Wybierz projekt:** `fragment-ui-www` (lub nazwę Twojego projektu)

3. **Environment Variables:**
   - Settings → Environment Variables
   - Dodaj/Update: `NEXT_PUBLIC_STORYBOOK_URL`
   - Value: `https://[twoj-chromatic-url].chromatic.com`
   - **Ważne:** Wybierz wszystkie środowiska (Production, Preview, Development)

4. **Redeploy:**
   - Automatyczny redeploy po zapisaniu
   - Lub ręcznie: Deployments → ... → Redeploy

## ✅ Weryfikacja

Po skonfigurowaniu:

1. **Portal DS:**
   - Otwórz: `https://fragment-ui-www.vercel.app` (lub Twój URL)
   - Przejdź do dowolnej strony komponentu (np. `/docs/components/button`)
   - Sprawdź czy link "View in Storybook" działa

2. **Sprawdź w kodzie:**
   ```bash
   # W konsoli przeglądarki na stronie portalu:
   console.log(process.env.NEXT_PUBLIC_STORYBOOK_URL)
   ```

## 🆘 Jeśli nie możesz znaleźć URL

### Problem: Workflow nie uruchomił się

**Rozwiązanie:**
1. Sprawdź czy token jest dodany:
   ```
   https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
   ```
   Powinien być: `CHROMATIC_PROJECT_TOKEN`

2. Push commit do `main` aby uruchomić workflow:
   ```bash
   git commit --allow-empty -m "Trigger Chromatic build"
   git push origin main
   ```

### Problem: Build failed

**Rozwiązanie:**
1. Sprawdź logi w GitHub Actions
2. Najczęstsze przyczyny:
   - Brak tokena (workflow przejdzie ale Chromatic action się nie wykona)
   - Błędy build (sprawdź logi)

### Problem: Nie wiesz jak stworzyć projekt w Chromatic

**Rozwiązanie:**
1. Zaloguj się do: https://www.chromatic.com
2. Kliknij "Create Project"
3. Wybierz repozytorium: `blazejrzepa/fragment-ui`
4. Skopiuj `projectToken` który dostaniesz
5. Dodaj do GitHub Secrets jako `CHROMATIC_PROJECT_TOKEN`

## 📋 Quick Check List

- [ ] Chromatic workflow działa (sprawdź GitHub Actions)
- [ ] Ostatni build przeszedł pomyślnie
- [ ] Znalazłeś URL Storybook z Chromatic
- [ ] Dodałeś `NEXT_PUBLIC_STORYBOOK_URL` do Vercel env vars
- [ ] Zrobiłeś redeploy portalu
- [ ] Sprawdziłeś czy linki działają na stronie

