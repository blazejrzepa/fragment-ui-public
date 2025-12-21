# 🚨 WAŻNE: Zaktualizuj Build Command w Vercel!

## Problem

Vercel build nadal używa **starego Build Command**, który nie zawiera `pnpm telemetry:build`.

## Rozwiązanie

### ❌ Obecny (błędny) Build Command w Vercel:
```bash
cd ../.. && pnpm install && pnpm tokens:build && pnpm registry:generate && cd apps/www && pnpm build
```

### ✅ Poprawny Build Command (do skopiowania):
```bash
cd ../.. && pnpm tokens:build && pnpm telemetry:build && pnpm registry:generate && cd apps/www && pnpm build
```

**WAŻNE:** Usuń `pnpm install` z Build Command! Vercel już wykonuje `pnpm install` automatycznie przed Build Command. Dodanie `pnpm install` w Build Command **usuwa devDependencies** (w tym TypeScript)!

## Jak zaktualizować w Vercel Dashboard:

1. **Otwórz Vercel Dashboard**: https://vercel.com/dashboard
2. **Wybierz projekt**: `fragment-ui` (lub twoja nazwa projektu)
3. **Przejdź do Settings**: Kliknij "Settings" w górnym menu
4. **Otwórz "Build & Development Settings"**: W lewym menu
5. **Zaktualizuj "Build Command"**: Wklej poprawny Build Command z powyżej
6. **Zapisz zmiany**: Kliknij "Save"
7. **Redeploy**: Przejdź do "Deployments" i kliknij "Redeploy" lub push nowy commit

## Po aktualizacji:

- Build powinien przejść ✅
- Telemetry package będzie budowany przed buildem www ✅
- Webpack będzie mógł znaleźć `@fragment_ui/telemetry/client` ✅

## Weryfikacja:

Po redeploy sprawdź logi build w Vercel:
- Powinien zawierać: `> @fragment_ui/telemetry@0.0.1 build`
- Nie powinien zawierać błędów: `Module not found: Can't resolve '@fragment_ui/telemetry/client'`

