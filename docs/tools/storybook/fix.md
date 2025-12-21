# Storybook Fix

## Problem
Storybook nie uruchamiał się z błędem:
```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension 
and '/Users/blazejrzepa/Dev/fragment-ui/packages/ui/package.json' contains "type": "module"
```

## Rozwiązanie
Zmieniono `postcss.config.js` na `postcss.config.cjs`, ponieważ:
- `packages/ui/package.json` ma `"type": "module"` 
- `postcss.config.js` używa CommonJS syntax (`module.exports`)
- Node.js traktuje `.js` jako ES module gdy `type: "module"`
- Rozszerzenie `.cjs` wymusza CommonJS

## Status
✅ Storybook uruchamia się poprawnie
✅ Dostępny na http://localhost:6006

## Testowanie
```bash
pnpm -C packages/ui storybook
# Otwórz http://localhost:6006 w przeglądarce
```

