# 🚀 Fragment UI – Następne Kroki

**Data:** 2025-01-XX  
**Last Updated:** 2025-01-XX  
**Aktualna wersja:** v1.8.0  
**Status:** ✅ v1.8.0 wdrożone (pełny zakres komponentów, governance, analityka)

---

## 📊 Stan na dziś

### Co zostało dowiezione w v1.8.0
- 5 nowych komponentów (Segmented Control, Rating, File Upload, Split Button, Tag Input)
- Performance polish (React.memo, memoized selectors, loading/error state framework)
- DS Portal UX (loading/error guidelines, docs alignment, sidebar improvements)
- Analytics & governance suite (Component Usage dashboard, Migration Assistant, Governance dashboard)
- Upstream drift mitigation (overlay patches system, rebase playbook)
- Dokumentacja (README, guides, business overview) ujednolicona

### Co wciąż blokuje „pełny” end-to-end flow
1. **Figma Code Connect** – 2 z 5 wymaganych komponentów (Button, Input); brak Card/Dialog/Select
2. **Automatyzacja synchronizacji** – brak CI checka porównującego propsy/varianty Figma ↔ `@fragment_ui/ui`
3. **GitHub ↔ Telemetry** – dane PR nie są jeszcze agregowane w ROI dashboardzie
4. **Proposal workflow** – zgłoszenia nowych wariantów w Figma obsługiwane manualnie
5. **AI context** – MCP/VS Code nie pobiera jeszcze danych z Figma node ID (brak auto-MDX)

---

## 🎯 Priorytetowy plan (Q4 2025)

### Priorytet A — Figma Code Connect & Parity (TOP)
- **Czas:** 3–4 dni robocze
- **Status:** 🚧 W trakcie (2/5 komponentów)
- **Task List:** [dev-resources-setup-tasks.md](./dev-resources-setup-tasks.md)
- **Kroki:**
  1. ✅ Przygotuj `figma-code-connect/card.ts`, `dialog.ts`, `select.ts` (lub Dev Resources JSON + instrukcje)
  2. ✅ Uzupełnij `.figma-dev-resources.json` i wygeneruj przewodnik (`pnpm figma:dev-resources`)
  3. ⏳ Uruchom `pnpm figma:dev-resources:add` (manual token -> automatyczny upload) - **Zobacz [dev-resources-setup-tasks.md](./dev-resources-setup-tasks.md)**
  4. ⏳ Dodaj CI: `pnpm check:figma-parity` (skrypt porównujący props/varianty z `packages/ui`)
  5. ⏳ Zaktualizuj dokumentację (`docs/guides/figma-code-connect*.md`) + DS Portal

### Priorytet B — Telemetry & GitHub Alignment
- **Czas:** 3–5 dni
- **Kroki:**
  1. Dokończ integrację webhooków GitHub → `apps/www/app/api/github/webhook`
  2. Wzbogacaj ROI dashboard o metryki PR (czas od projektu w Figma → merge, reuse rate per PR)
  3. Dodaj alerty (np. niski reuse, brak DS w PR) + raport kwartalny

### Priorytet C — Proposal Governance Automation
- **Czas:** 2–3 dni
- **Kroki:**
  1. DS Portal sekcja „Proposals” (lista Figma frame’ów z tagiem `Proposal` + status)
  2. MCP komunikaty w PR (np. „variant wymaga akceptacji DS”)
  3. Dokumentacja workflow (Notion/Portal) + checklisty

### Priorytet D — AI Enrichment (stretch na grudzień)
- Figma node lookup w MCP (`mcp figma get-component <id>`)
- Autogenerowanie MDX/Storybook na bazie zatwierdzonych wariantów
- Rozszerzony VS Code Extension (hover z kontekstem Figma, quick fixy)

---

## 🗓️ Harmonogram (sugerowany)

| Termin | Działanie | Rezultat |
|--------|-----------|----------|
| Tydz. 1 (listopad) | Card/Dialog/Select Code Connect + Dev Resources sync | 5/5 komponentów, zaktualizowane przewodniki |
| Tydz. 2 | CI parity check + portal update + figma doc refresh | Automatyczne walidacje w pipeline |
| Tydz. 3 | GitHub telemetry pipeline + dashboard KPI | ROI dashboard pokazuje PR lead time & reuse |
| Tydz. 4 | Proposal workflow + MCP hinting | Designers/devs mają jasny proces i automatyczne przypomnienia |
| Tydz. 5+ | AI enrichment (MCP, VS Code) | Auto-MDX, Figma context w IDE |

---

## 🔭 Roadmapa na Q1 2026 (v1.9.0 w przygotowaniu)
- **Component Generator** – import z Figma Dev Mode → scaffolding w repo (CLI/MCP)
- **Chromatic Review UI** – DS Portal z podglądem diffów i akceptacją
- **i18n & Mobile Expansion** – RTL, dodatkowe komponenty React Native, locale-aware tokens
- **Plugin Marketplace** – publikacja i zarządzanie pluginami DS
- **AI Authoring** – generowanie dokumentacji i przykładowego kodu na podstawie promptów MCP

---

## ✅ Checklista zamknięcia Figma E2E
1. 5 komponentów z Code Connect lub Dev Resources (Button, Input, Card, Dialog, Select)
2. `scripts/check-figma-parity.ts` dodany do CI (fail on mismatch)
3. `pnpm figma:dev-resources` uruchomione, pliki w repo, instrukcja w docs
4. Wydanie przewodnika „Figma → Code workflow” (Portal + README)
5. Telemetry dashboard prezentuje lead time + reuse rate (PR → deploy)

---

## 📌 Po ukończeniu priorytetów A–D
- Business Overview = 100% pokrycia
- Workflow design ↔ code ↔ telemetry w pełni zautomatyzowany
- Gotowość do startu v1.9.0 (AI + marketplace)

---

**Następny przegląd:** 2025-12-15 (po wdrożeniu Code Connect parity + telemetry pipeline)

