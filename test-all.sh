#!/bin/bash

set -e  # Exit on error

echo "🧪 Rozpoczynam kompleksowe testy Fragment UI..."
echo ""

# 1. Testy A11y
echo "1️⃣  Testy dostępności (A11y)..."
pnpm test || {
  echo "❌ Testy A11y nie przeszły!"
  exit 1
}
echo "✅ Testy A11y przeszły pomyślnie"
echo ""

# 2. Build
echo "2️⃣  Build wszystkich pakietów..."
pnpm build || {
  echo "❌ Build nie powiódł się!"
  exit 1
}
echo "✅ Build zakończony pomyślnie"
echo ""

# 3. Bundle size
echo "3️⃣  Analiza bundle size..."
pnpm bundle:analyze || {
  echo "❌ Analiza bundle size nie powiodła się!"
  exit 1
}
echo "✅ Bundle size w limitach"
echo ""

# 4. TypeScript check
echo "4️⃣  TypeScript check..."
cd packages/ui && pnpm tsc --noEmit && cd ../.. || {
  echo "❌ TypeScript check nie powiódł się!"
  exit 1
}
echo "✅ TypeScript check zakończony pomyślnie"
echo ""

echo "🎉 Wszystkie testy przeszły pomyślnie!"
echo ""
echo "📊 Podsumowanie:"
echo "  ✅ A11y Tests"
echo "  ✅ Build"
echo "  ✅ Bundle Size"
echo "  ✅ TypeScript Check"
echo ""
echo "💡 Następne kroki:"
echo "  - Uruchom 'pnpm lighthouse' (wymaga uruchomionej aplikacji)"
echo "  - Sprawdź Chromatic dla visual regression tests"
