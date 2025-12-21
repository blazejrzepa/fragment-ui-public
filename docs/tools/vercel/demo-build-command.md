# 🚨 WAŻNE: Zaktualizuj Build Command w Vercel dla Demo App!

## Problem

Vercel build dla demo app nie może znaleźć modułu `@fragment_ui/ui-dsl`, ponieważ pakiet nie jest budowany przed buildem aplikacji.

## Rozwiązanie

### ❌ Obecny (błędny) Build Command w Vercel:
```bash
cd ../.. && pnpm tokens:build && cd apps/demo && pnpm build
```

### ✅ Poprawny Build Command (do skopiowania):
```bash
cd ../.. && pnpm tokens:build && pnpm -F @fragment_ui/ui-dsl run build && cd apps/demo && pnpm build
```

**WAŻNE:** 
- Usuń `pnpm install` z Build Command! Vercel już wykonuje `pnpm install` automatycznie przed Build Command.
- Dodaj `pnpm -F @fragment_ui/ui-dsl run build` aby zbudować pakiet `@fragment_ui/ui-dsl` przed buildem aplikacji.

## Jak zaktualizować w Vercel Dashboard:

1. **Otwórz Vercel Dashboard**: https://vercel.com/dashboard
2. **Wybierz projekt**: `fragment-ui-demo` (lub twoja nazwa projektu dla demo app)
3. **Przejdź do Settings**: Kliknij "Settings" w górnym menu
4. **Otwórz "Build & Development Settings"**: W lewym menu
5. **Zaktualizuj "Build Command"**: Wklej poprawny Build Command z powyżej
6. **Zapisz zmiany**: Kliknij "Save"
7. **Redeploy**: Przejdź do "Deployments" i kliknij "Redeploy" lub push nowy commit

## Po aktualizacji:

- Build powinien przejść ✅
- Pakiet `@fragment_ui/ui-dsl` będzie budowany przed buildem demo app ✅
- Webpack będzie mógł znaleźć `@fragment_ui/ui-dsl` ✅

## Weryfikacja:

Po redeploy sprawdź logi build w Vercel:
- Powinien zawierać: `> @fragment_ui/ui-dsl@0.1.0 build`
- Nie powinien zawierać błędów: `Module not found: Can't resolve '@fragment_ui/ui-dsl'`

## 🔗 Production URL

**Playground:** https://demo-oe8tmopzp-blakes-projects-7564cdfa.vercel.app/playground

