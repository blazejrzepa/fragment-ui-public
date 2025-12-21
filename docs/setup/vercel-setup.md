# Vercel Deployment - Quick Setup Guide

> **📚 Storybook Deployment:** See [STORYBOOK_VERCEL_SETUP.md](./STORYBOOK_VERCEL_SETUP.md) for Storybook deployment instructions.

## 🚀 Portal (apps/www) - Vercel

### Krok 1: Import Repository

1. Przejdź do: https://vercel.com/new
2. Zaloguj się z GitHub
3. Kliknij "Import Git Repository"
4. Wybierz: `blazejrzepa/fragment-ui`
5. Kliknij "Import"

### Krok 2: Configure Project

**Project Settings:**
- **Project Name:** `fragment-ui` (lub dowolna nazwa)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/www` (KLUCZOWE!)
- **Build Command:** 
  ```
  cd ../.. && pnpm tokens:build && pnpm telemetry:build && pnpm registry:generate && cd apps/www && pnpm build
  ```
  
  **⚠️ WAŻNE:** NIE dodawaj `pnpm install` w Build Command! Vercel już wykonuje `pnpm install` automatycznie przed Build Command. Dodanie `pnpm install` w Build Command **usuwa devDependencies** (w tym TypeScript) co powoduje błędy!
- **Output Directory:** ``.next
- **Install Command:** `pnpm install`

### Krok 3: Environment Variables

Kliknij "Environment Variables" i dodaj:
```
NEXT_PUBLIC_TELEMETRY_ENABLED=true
NEXT_PUBLIC_TELEMETRY_ENDPOINT=/api/telemetry
NEXT_PUBLIC_STORYBOOK_URL=https://your-storybook-url.com
```

**NEXT_PUBLIC_STORYBOOK_URL** - **WAŻNE**: URL do wdrożonego Storybook (Chromatic, Netlify, Vercel):
- **Chromatic**: `https://your-project.chromatic.com`
- **Netlify/Vercel**: URL Twojego Storybook deployment
- Jeśli nie ustawione, linki do Storybook nie będą działać w produkcji

### Krok 4: Deploy

1. Kliknij "Deploy"
2. Poczekaj na build (~2-3 minuty)
3. Sprawdź czy deployment się powiódł
4. Vercel automatycznie da Ci URL: `https://fragment-ui.vercel.app`

### Krok 5: Custom Domain (opcjonalnie)

1. Settings → Domains
2. Dodaj własną domenę (np. `fragment-ui.dev`)
3. Skonfiguruj DNS zgodnie z instrukcjami Vercel

## 🔧 Troubleshooting

### Build fails - "Cannot find module"
- Upewnij się że `Root Directory` jest ustawione na `apps/www`
- Sprawdź czy wszystkie dependencies są w `package.json`

### Build fails - "pnpm-lock.yaml not found"
- Upewnij się że `pnpm-lock.yaml` jest w root repo
- Sprawdź czy `Install Command` to `pnpm install`

### Build fails - "tokens:build command not found"
- Upewnij się że `Build Command` zawiera `pnpm tokens:build`
- Sprawdź czy `@fragment_ui/tokens` package istnieje

### Build fails - "Command tsx not found"
- ✅ **NAPRAWIONE** - Używamy `pnpm exec tsx` zamiast `tsx`
- Upewnij się że masz najnowszy commit na main branch
- Jeśli problem persistuje, sprawdź czy `tsx` jest w `devDependencies` w root `package.json`

## ✅ Verification

Po deployment:
1. Sprawdź URL (np. `https://fragment-ui.vercel.app`)
2. Przejdź do `/components` - powinny być komponenty
3. Przejdź do `/docs` - powinna być dokumentacja
4. Przejdź do `/docs/changelog` - powinien być changelog
5. Sprawdź czy search działa

## 🔄 Automatic Deployments

Vercel automatycznie deployuje:
- ✅ Każdy push do `main` branch
- ✅ Każdy merge do `main`
- ✅ Możesz wyłączyć w Settings → Git

## 📊 Monitoring

- Build logs: Vercel Dashboard → Deployments
- Analytics: Vercel Dashboard → Analytics
- Performance: Vercel Dashboard → Speed Insights

