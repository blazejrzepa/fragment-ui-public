#!/bin/bash

# Publikacja pakietów Fragment UI na npm
# Użycie: ./publish.sh [--dry-run]

set -e

DRY_RUN=""
if [ "$1" == "--dry-run" ]; then
  DRY_RUN="--dry-run"
  echo "🧪 DRY RUN MODE - nie będzie rzeczywistej publikacji"
fi

echo "📦 Publikacja pakietów Fragment UI na npm"
echo ""

# Sprawdź czy jesteś zalogowany
if ! npm whoami &>/dev/null; then
  echo "❌ Nie jesteś zalogowany do npm"
  echo "   Uruchom: npm login"
  exit 1
fi

echo "✅ Zalogowany jako: $(npm whoami)"
echo ""

# Zbuduj wszystkie pakiety
echo "🏗️  Budowanie pakietów..."
pnpm build

echo ""
echo "📤 Publikacja pakietów..."
echo ""

# Publikuj pakiety
packages=("ui" "tokens" "blocks" "mcp-server")

for pkg in "${packages[@]}"; do
  echo "📦 Publikowanie @fragment_ui/$pkg..."
  cd "packages/$pkg"
  
  if [ -n "$DRY_RUN" ]; then
    pnpm publish --access public --dry-run
  else
    pnpm publish --access public
  fi
  
  cd ../..
  echo "✅ @fragment_ui/$pkg opublikowany"
  echo ""
done

echo "🎉 Wszystkie pakiety opublikowane!"
echo ""
echo "Sprawdź na npm:"
echo "  - https://www.npmjs.com/package/@fragment_ui/ui"
echo "  - https://www.npmjs.com/package/@fragment_ui/tokens"
echo "  - https://www.npmjs.com/package/@fragment_ui/blocks"
echo "  - https://www.npmjs.com/package/@fragment_ui/mcp-server"

