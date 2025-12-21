# GitHub Pages Setup - Registry Deployment

## 📦 Registry Deployment na GitHub Pages

### Opcja A: Deploy registry files do /docs folder

1. **Przygotuj registry files:**
   ```bash
   # Upewnij się że registry jest wygenerowany
   pnpm registry:generate
   
   # Sprawdź pliki
   ls apps/www/public/r/
   ```

2. **Skopiuj registry files do /docs folder:**
   ```bash
   # Utwórz docs/r folder jeśli nie istnieje
   mkdir -p docs/r
   
   # Skopiuj pliki registry
   cp -r apps/www/public/r/* docs/r/
   ```

3. **Commit i push:**
   ```bash
   git add docs/r/
   git commit -m "docs: Add registry files for GitHub Pages"
   git push origin main
   ```

4. **Enable GitHub Pages:**
   - Przejdź do: https://github.com/blazejrzepa/fragment-ui/settings/pages
   - Source: Deploy from a branch
   - Branch: `main` / `/docs` folder
   - Save

5. **URL będzie:**
   ```
   https://blazejrzepa.github.io/fragment-ui/r/button.json
   ```

### Opcja B: GitHub Actions (automatyczny)

Możemy dodać workflow do automatycznego deployowania registry:

```yaml
name: Deploy Registry to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'packages/registry/**'
      - 'apps/www/public/r/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Copy registry files
        run: |
          mkdir -p docs/r
          cp -r apps/www/public/r/* docs/r/
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔍 Verification

Po deployment:
1. Sprawdź URL: `https://blazejrzepa.github.io/fragment-ui/r/button.json`
2. Powinien zwrócić JSON z definicją komponentu
3. Test instalacji:
   ```bash
   npx shadcn@latest add https://blazejrzepa.github.io/fragment-ui/r/button.json
   ```

## ⚠️ Important Notes

- Registry files muszą być dostępne przez HTTPS
- GitHub Pages używa `/docs` folder jako root
- URL będzie: `https://USERNAME.github.io/REPO-NAME/r/COMPONENT.json`
- CORS jest automatycznie skonfigurowany przez GitHub Pages

## 🔄 Alternative: CDN

Jeśli GitHub Pages nie jest wystarczający, możesz użyć:
- **Cloudflare Pages** (darmowy CDN)
- **Netlify** (darmowy hosting)
- **AWS S3 + CloudFront** (płatny, skalowalny)
- **Vercel** (można hostować static files)

