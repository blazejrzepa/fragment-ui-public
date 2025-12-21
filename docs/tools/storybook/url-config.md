# 📚 Storybook URL - Konfiguracja

## ✅ Znaleziony URL Storybook

Z logów Chromatic workflow:

```
https://6908c46a37e9c1c1fe40b48d-fscznyhnyd.chromatic.com/
```

**Build #50** został opublikowany pomyślnie!

## 🔗 Alternatywny URL (główny projektu)

Możesz też użyć głównego URL projektu Chromatic:
```
https://6908c46a37e9c1c1fe40b48d.chromatic.com
```

(bez sufiksu `-fscznyhnyd`, to jest URL dla konkretnego buildu)

## ⚙️ Konfiguracja w Vercel

### Krok 1: Otwórz Vercel Dashboard
```
https://vercel.com/dashboard
```

### Krok 2: Wybierz projekt
- Wybierz projekt: `fragment-ui-www` (lub nazwę Twojego projektu)

### Krok 3: Environment Variables
1. Przejdź do: **Settings** → **Environment Variables**
2. Dodaj/Update zmienną:
   - **Key:** `NEXT_PUBLIC_STORYBOOK_URL`
   - **Value:** `https://6908c46a37e9c1c1fe40b48d-fscznyhnyd.chromatic.com`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Krok 4: Redeploy
1. Przejdź do: **Deployments**
2. Kliknij "..." na najnowszym deploymencie
3. Wybierz **Redeploy**
4. Wybierz środowisko: **Production**

Lub:
- Automatyczny redeploy po zapisaniu env var (jeśli włączony)
- Lub push nowy commit do `main`

## ✅ Weryfikacja

Po redeploy:

1. **Otwórz portal:**
   ```
   https://fragment-ui-www.vercel.app
   ```
   (lub Twój URL Vercel)

2. **Przejdź do strony komponentu:**
   - Np. `/docs/components/button`
   - Sprawdź czy link "View in Storybook" działa

3. **Sprawdź w konsoli przeglądarki:**
   ```javascript
   // Na stronie portalu w konsoli:
   console.log(process.env.NEXT_PUBLIC_STORYBOOK_URL)
   ```

## 📊 Status Build

- **Build #50** - ✅ Opublikowany
- **114 stories** z 24 komponentami
- **URL:** https://6908c46a37e9c1c1fe40b48d-fscznyhnyd.chromatic.com/
- **Dashboard:** https://www.chromatic.com/build?appId=6908c46a37e9c1c1fe40b48d&number=50

## 🔄 Automatyczne aktualizacje

Chromatic automatycznie publikuje nowy build przy każdym push do `main`.

URL może się zmieniać między buildami. Dla stabilnego URL użyj:
- Głównego URL projektu (jeśli dostępny)
- Lub ustaw automatyczne przekierowanie w Chromatic Settings

## 🆘 Jeśli linki nie działają

1. **Sprawdź czy env var jest ustawione:**
   - Vercel Dashboard → Settings → Environment Variables

2. **Sprawdź czy portal jest zredeployowany:**
   - Powinien używać nowej wartości env var

3. **Sprawdź w kodzie:**
   - Czy `getStorybookUrl()` zwraca poprawny URL
   - Sprawdź `apps/www/src/lib/storybook.ts`

