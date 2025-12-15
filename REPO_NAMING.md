# Wybór nazwy repozytorium

## 📋 Sytuacja

- **Obecny repo na GitHub**: `fragment-ui` (zostaje jako publiczny, zawiera Studio/Playground)
- **Nowy publiczny repo**: Potrzebuje innej nazwy

## 🎯 Proponowane nazwy

### Opcja 1: `fragment-ui-ds` ⭐ (Rekomendowane)
- **DS** = Design System
- Krótkie i jasne
- Łatwe do zapamiętania
- URL: `github.com/YOUR_USERNAME/fragment-ui-ds`

### Opcja 2: `fragment-design-system`
- Bardziej opisowe
- Dłuższe, ale bardzo jasne
- URL: `github.com/YOUR_USERNAME/fragment-design-system`

### Opcja 3: `fragment-ui-components`
- Podkreśla, że to komponenty
- URL: `github.com/YOUR_USERNAME/fragment-ui-components`

### Opcja 4: `fragment-ui-public`
- Jasno wskazuje, że to publiczna wersja
- URL: `github.com/YOUR_USERNAME/fragment-ui-public`

## 🔗 Relacja między repozytoriami

```
fragment-ui (GitHub)
├── Zawiera: Studio, Playground, governance, telemetry
├── Status: Public (zostaje)
└── Przeznaczenie: Pełny monorepo z eksperymentalnymi funkcjami

fragment-ui-ds (GitHub) - NOWE
├── Zawiera: UI components, tokens, blocks, MCP server, docs
├── Status: Public
└── Przeznaczenie: Czysty design system dla publicznego użytku
```

## 📝 Aktualizacja dokumentacji

Po wyborze nazwy, zaktualizuj:
- README.md (jeśli zawiera linki do repo)
- package.json (repository.url)
- Inne miejsca z referencjami do repo

## ✅ Rekomendacja

**Użyj: `fragment-ui-ds`**

Powody:
- Krótkie i profesjonalne
- Jasno wskazuje na Design System
- Łatwe do wpisania i zapamiętania
- Nie koliduje z istniejącym `fragment-ui`

