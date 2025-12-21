# Sandpack Setup dla Fragment UI

## ⚠️ Ważne: Sandpack i Lokalne Pakiety

Sandpack działa w przeglądarce i używa CDN do pobierania zależności. **Nie może** bezpośrednio używać lokalnych pakietów z monorepo.

## Rozwiązania

### Opcja 1: Publikacja na npm (REKOMENDOWANE dla produkcji)

Jeśli `@fragment_ui/ui` jest opublikowany na npm:

```json
{
  "dependencies": {
    "@fragment_ui/ui": "latest"  // lub konkretna wersja
  }
}
```

Sandpack automatycznie pobierze pakiet z npm.

### Opcja 2: Użycie React Live (Dla lokalnego developmentu)

Jeśli pakiet nie jest opublikowany, użyj React Live zamiast Sandpack:

```tsx
import { ReactLiveRenderer } from "@/components/react-live-renderer";
```

React Live może używać lokalnych komponentów przez scope.

### Opcja 3: Custom Bundler URL (Zaawansowane)

Możesz skonfigurować własny bundler, który ma dostęp do lokalnych pakietów:

```tsx
<Sandpack
  customSetup={{
    bundlerURL: "http://localhost:3001", // Twój custom bundler
  }}
/>
```

## Aktualna Implementacja

Obecnie używamy **Sandpack** z fallback do **React Live** jeśli Sandpack nie może załadować `@fragment_ui/ui`.

## Testowanie

1. **Z opublikowanym pakietem:**
   - Sandpack powinien działać od razu
   - Komponenty będą dostępne z npm

2. **Bez opublikowanego pakietu:**
   - Sandpack pokaże błąd ładowania `@fragment_ui/ui`
   - Możesz użyć React Live jako fallback

## Rekomendacja

Dla lokalnego developmentu:
- Użyj **React Live** (już zaimplementowane)
- Komponenty są dostępne przez scope

Dla produkcji:
- Opublikuj `@fragment_ui/ui` na npm
- Użyj **Sandpack** dla lepszej UX

