# 🔗 Jak znaleźć URL Storybook w Chromatic

## Metoda 1: GitHub Actions (Najłatwiejsza)

1. **Otwórz GitHub Actions:**
   - Przejdź do: https://github.com/blazejrzepa/fragment-ui/actions
   - Kliknij na najnowszy workflow run "Chromatic"

2. **Znajdź link Storybook:**
   - W logach buildu znajdź linię z tekstem:
     - `✓ Storybook published to https://xxxxx.chromatic.com`
     - lub `View your Storybook at: https://xxxxx.chromatic.com`
   - Może być też jako "View Storybook" button/link w interfejsie

3. **Alternatywnie - w kroku "Run Chromatic":**
   - Scrolluj do sekcji "Run Chromatic"
   - Szukaj outputu z linkiem

## Metoda 2: Chromatic Dashboard

1. **Zaloguj się do Chromatic:**
   - Przejdź do: https://www.chromatic.com
   - Zaloguj się przez GitHub

2. **Znajdź projekt:**
   - Wybierz projekt `fragment-ui` (lub nazwę jaką podałeś)
   - Przejdź do zakładki "Builds"

3. **Otwórz ostatni build:**
   - Kliknij na najnowszy successful build
   - W górnej części znajdziesz link "View Storybook" lub podobny

4. **Alternatywnie - Project Settings:**
   - Przejdź do: Project Settings → Manage
   - Powinien być link do Storybook

## Metoda 3: Sprawdź URL Pattern

Chromatic używa stałego pattern:
```
https://[project-name].chromatic.com
```

Przykład:
- Jeśli projekt to `fragment-ui` → `https://fragment-ui.chromatic.com`
- Jeśli projekt ma inną nazwę → `https://[nazwa-projektu].chromatic.com`

## Metoda 4: Z tokena i repozytorium

1. **Otwórz Chromatic:**
   - https://www.chromatic.com/builds

2. **Filtruj po repozytorium:**
   - Szukaj: `blazejrzepa/fragment-ui`
   - Otwórz najnowszy build
   - Link Storybook będzie widoczny

## 🔍 Szybkie sprawdzenie

**Jeśli workflow nie działa:**
1. Sprawdź czy token jest dodany:
   - https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
   - Powinien być: `CHROMATIC_PROJECT_TOKEN`

2. Sprawdź ostatni workflow run:
   - https://github.com/blazejrzepa/fragment-ui/actions/workflows/chromatic.yml
   - Otwórz najnowszy run i sprawdź output

## 📝 Po znalezieniu URL

1. Skopiuj URL Storybook (np. `https://xxxxx.chromatic.com`)

2. Zaktualizuj portal:
   - Vercel Dashboard → `fragment-ui-www` → Settings → Environment Variables
   - Dodaj/Update: `NEXT_PUBLIC_STORYBOOK_URL` = [URL z Chromatic]
   - Redeploy portal

## 🆘 Jeśli nie możesz znaleźć

**Możliwe przyczyny:**
- Workflow jeszcze nie uruchomił się (dodaj token i push commit)
- Build failed (sprawdź logi w GitHub Actions)
- Projekt nie jest skonfigurowany w Chromatic (utwórz projekt)

**Następne kroki:**
1. Uruchom workflow ręcznie (push commit)
2. Sprawdź logi w GitHub Actions
3. Zaloguj się do Chromatic dashboard

