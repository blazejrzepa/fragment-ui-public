# 🚀 Deployment Guide - fragmentui.com

## 📋 Strategia repozytoriów (finalna)

### 1. `fragment-ui` (PRIVATE - główne repo)
- **Status**: PRIVATE 🔒
- **Lokalizacja**: `/Users/blazejrzepa/Dev/fragment-ui`
- **Zawartość**: Pełny monorepo z Studio/Playground/telemetry
- **Przeznaczenie**: Główny workspace do codziennej pracy

### 2. `fragment-ui-public` (PUBLIC - oficjalne)
- **Status**: PUBLIC 🌐
- **Lokalizacja**: `/Users/blazejrzepa/Dev/fragment-ui-public`
- **GitHub**: https://github.com/blazejrzepa/fragment-ui-public
- **Domena**: fragmentui.com
- **Zawartość**: Czysty design system + dokumentacja
- **Przeznaczenie**: Oficjalna strona i publikacja na npm

## 🔧 Konfiguracja Vercel dla fragmentui.com

### Krok 1: Połącz repozytorium z Vercel

1. Przejdź do: https://vercel.com/new
2. Importuj `fragment-ui-public` z GitHub
3. Ustaw:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/www`
   - **Build Command**: `cd ../.. && pnpm install && pnpm tokens:build && pnpm registry:generate && pnpm -F @fragment_ui/ui build && pnpm -F @fragment_ui/blocks build && cd apps/www && pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### Krok 2: Skonfiguruj domenę

1. W Vercel Dashboard → Project Settings → Domains
2. Dodaj domenę: `fragmentui.com`
3. Dodaj subdomeny:
   - `www.fragmentui.com` (redirect do fragmentui.com)
4. Skonfiguruj DNS:
   - Dodaj rekordy DNS zgodnie z instrukcjami Vercel
   - Zwykle: CNAME dla `www` i A record dla root domain

### Krok 3: Zmienne środowiskowe (jeśli potrzebne)

W Vercel Dashboard → Settings → Environment Variables:
- Dodaj zmienne, jeśli są potrzebne (np. dla API routes)

### Krok 4: Aktualizuj konfigurację

Zaktualizuj `apps/www/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm tokens:build && pnpm registry:generate && pnpm -F @fragment_ui/ui build && pnpm -F @fragment_ui/blocks build && cd apps/www && pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## 🔄 Aktualizacja referencji do domeny

### Pliki do zaktualizowania:

1. **package.json** (wszystkie pakiety):
   - `homepage`: `https://fragmentui.com`
   - `repository.url`: GitHub URL

2. **README.md**:
   - Wszystkie linki do `fragmentui.com`

3. **apps/www**:
   - Konfiguracja Next.js (jeśli potrzebna)
   - Metadata w layout.tsx

4. **CLI** (`packages/cli`):
   - Wszystkie referencje do registry URL

## 📝 Checklist przed deploymentem

### Przed pierwszym deploymentem:

- [ ] Zaktualizuj wszystkie referencje do `fragment-ui.dev` → `fragmentui.com`
- [ ] Sprawdź czy `vercel.json` ma poprawny build command
- [ ] Usuń referencje do telemetry (jeśli są w build command)
- [ ] Sprawdź czy wszystkie zależności są dostępne
- [ ] Przetestuj build lokalnie: `pnpm build`
- [ ] Sprawdź czy dokumentacja się renderuje poprawnie

### Po deploymentem:

- [ ] Sprawdź czy strona się ładuje: https://fragmentui.com
- [ ] Sprawdź czy wszystkie linki działają
- [ ] Sprawdź czy komponenty się wyświetlają
- [ ] Sprawdź czy registry działa: https://fragmentui.com/r/button.json
- [ ] Sprawdź czy dokumentacja jest dostępna
- [ ] Sprawdź SEO (meta tags, sitemap)

## 🔗 Konfiguracja DNS

### Dla fragmentui.com:

1. **A Record** (root domain):
   - Name: `@`
   - Value: IP z Vercel (lub użyj CNAME jeśli provider to wspiera)

2. **CNAME Record** (www):
   - Name: `www`
   - Value: `cname.vercel-dns.com` (lub co Vercel poda)

3. **Czekaj na propagację DNS** (zwykle 24-48h)

## 🚀 Automatyczny deployment

Po połączeniu z GitHub, Vercel automatycznie:
- ✅ Deployuje przy każdym push do `main`
- ✅ Tworzy preview deployments dla PR
- ✅ Pokazuje status w GitHub

## 📊 Monitoring

Po deploymentem:

1. **Vercel Analytics** (opcjonalnie):
   - Włącz w Vercel Dashboard
   - Tracking performance i errors

2. **Google Analytics** (opcjonalnie):
   - Dodaj tracking code do `apps/www/app/layout.tsx`

3. **Error Tracking** (opcjonalnie):
   - Sentry, LogRocket, etc.

## 🔄 Workflow deploymentu

1. **Pracujesz w `fragment-ui`** (private)
2. **Synchronizujesz do `fragment-ui-public`** (public)
3. **Push do GitHub** → automatyczny deploy na Vercel
4. **Strona aktualizuje się automatycznie** na fragmentui.com

## 🐛 Troubleshooting

### Build fails:
- Sprawdź logi w Vercel Dashboard
- Sprawdź czy wszystkie zależności są dostępne
- Sprawdź czy build command jest poprawny

### DNS nie działa:
- Sprawdź konfigurację DNS w panelu domeny
- Sprawdź propagację DNS: https://dnschecker.org
- Sprawdź czy domena jest zweryfikowana w Vercel

### Strona się nie ładuje:
- Sprawdź czy build się powiódł
- Sprawdź logi w Vercel Dashboard
- Sprawdź czy wszystkie assets są dostępne

## 📚 Przydatne linki

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

