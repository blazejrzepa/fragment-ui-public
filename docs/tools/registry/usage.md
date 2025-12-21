# 📦 Registry Usage Guide

## ✅ Registry is Already Working!

Registry files are **already available** through Vercel deployment. No additional setup needed!

## 🔗 Current Registry URL

**Base URL:** `https://fragment-ui-www.vercel.app/r/`

## 📋 Available Components

All 30 components and blocks are available:

```bash
# Install Button
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/button.json

# Install Input
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/input.json

# Install Dialog
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/dialog.json

# Install Card
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/card.json

# Install Block (Dashboard Layout)
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/dashboard-layout.json

# ... and all other components
```

## 📝 Full Component List

### Components:
- accordion, avatar, badge, button, card, checkbox
- date-picker, dialog, dropdown-menu, form-field, input
- popover, progress, radio, select, separator
- skeleton, spinner, switch, table, tabs, textarea, toast, tooltip

### Blocks:
- card-grid, dashboard-layout, form-container
- navigation-header, settings-screen, voice-chat-panel

## 🆕 Update Registry

Registry files are automatically updated when you:
1. Update components in `packages/ui/src/`
2. Run `pnpm registry:generate`
3. Commit and push changes
4. Vercel automatically redeploys

## 🔍 Verify Registry

Test if registry is accessible:
```bash
# Check if button.json is available
curl https://fragment-ui-www.vercel.app/r/button.json

# Should return JSON with component definition
```

## 🆘 Troubleshooting

### CORS Errors
Vercel automatically handles CORS for static files. No additional configuration needed.

### 404 Errors
- Ensure component exists in registry: `packages/registry/registry.json`
- Run `pnpm registry:generate` to regenerate files
- Check Vercel deployment is successful

### Installation Fails
- Ensure URL is correct (check spelling)
- Ensure project has required dependencies (react, react-dom)
- Check component dependencies in the JSON file

## 🔄 Alternative: GitHub Pages (Future)

If you want a separate registry domain (optional), see `REGISTRY_DEPLOYMENT.md` for GitHub Pages setup instructions.

**Note:** GitHub Pages is free for public repositories. No GitHub Pro required.

