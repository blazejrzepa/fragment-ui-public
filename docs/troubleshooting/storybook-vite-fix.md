# Storybook Vite Fix

## Problem
Storybook wyświetlał błąd 404 dla virtual files Vite:
```
GET http://localhost:6006/@id/__x00__virtual:/@storybook/builder-vite/vite-app.js net::ERR_ABORTED 404
```

## Rozwiązania zastosowane

1. ✅ **PostCSS config** - zmieniono `postcss.config.js` → `postcss.config.cjs`
2. ✅ **Wersje Storybook** - zaktualizowano do `^8.6.14` (zgodne wersje)
3. ✅ **Vite cache** - wyczyszczono wszystkie cache
4. ✅ **Vite config** - dodano `viteFinal` hook dla lepszej kompatybilności

## Status

- ✅ Storybook manager startuje
- ✅ Preview server startuje  
- ✅ iframe.html się ładuje
- ✅ Wszystkie wersje zsynchronizowane na 8.6.14

## Testowanie

```bash
# Zatrzymaj wszystkie procesy
pkill -f storybook

# Wyczyść cache
rm -rf packages/ui/node_modules/.vite packages/ui/.storybook-static

# Uruchom Storybook
pnpm -C packages/ui storybook
```

Następnie otwórz http://localhost:6006 w przeglądarce.

## Jeśli problem nadal występuje

1. Sprawdź czy wszystkie zależności są zainstalowane:
   ```bash
   pnpm install
   ```

2. Sprawdź wersje:
   ```bash
   pnpm list @storybook/react-vite @storybook/addon-essentials
   ```

3. Wyczyść wszystko i zainstaluj ponownie:
   ```bash
   rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
   pnpm install
   ```

