# Critical Gaps Analysis — Business Overview vs bieżąca implementacja

**Aktualizacja:** 2025-11-07

Po v1.8.0 większość luk została zamknięta. Poniżej aktualny obraz:

---

## ✅ W pełni zrealizowane (0 krytycznych luk)

| Obszar | Status | Notatki |
|--------|--------|---------|
| Source-first registry | ✅ | CLI, registry JSON, pluginy, overlay patches + rebase proces |
| Docs-in-code | ✅ | DS Portal (Next.js), Storybook, MDX, automatyczne generatory API |
| Blocks | ✅ | 9 bloków, przykłady, instrumentacja telemetry |
| A11y & QA | ✅ | axe, Storybook, Chromatic VRT, Lighthouse CI |
| Versioning & releases | ✅ | Semver, changelog, release checklist, CI/CD |
| Telemetry & ROI | ✅ | ROI dashboard, Component Usage, Governance dashboard |
| MCP & AI workflow | ✅ | MCP server, VS Code extension, enforcement rules |
| Enterprise features | ✅ | Multi-tenant, advanced theming, white-label, governance |

---

## ⚠️ Pozostałe luki (wysoki priorytet)

| Luka | Dlaczego ważna | Co istnieje | Co brakuje |
|------|----------------|-------------|-------------|
| **Figma Code Connect coverage** | Kluczowy wyróżnik „design→code” | Button, Input + pełne przewodniki Dev Resources | Mapowania Card/Dialog/Select (min), Tabs/Table (stretch) |
| **Figma↔code parity automation** | Zapobiega dryfowi, daje pewność CI | Dokumentacja, manualne checklisty | Skrypt CI porównujący props/variants, sync w release pipeline |
| **Telemetry ↔ GitHub integracja** | KPI „Lead time” zależy od danych PR | ROI dashboard, telemetry eventy | Końcowe spięcie webhooków i raport lead-time/reuse per PR |
| **Proposal workflow automation** | Governance dla nowych wariantów | Manualny proces + dokumentacja | Portal board + MCP przypomnienia (stretch) |

---

## 🔍 Wnioski

- Portfolio funkcjonalności Business Overview jest dowiezione w 98%.
- Kilka elementów wymaga automatyzacji, aby zapewnić pełny, powtarzalny workflow (szczególnie Figma → Code).
- Brak nowych inwestycji w infrastrukturę; potrzebne są finishery i automatyzacja.

---

## 🚀 Plan zamknięcia luk

### 1. Figma Code Connect (Card, Dialog, Select) — 3 dni
1. Przygotować/migr. pliki `figma-code-connect/*.ts` lub Dev Resources JSON.
2. Zaktualizować `.figma-dev-resources.json`, uruchomić `pnpm figma:dev-resources`, dodać instrukcje.
3. Zweryfikować w Figma (zielone linki) + odświeżyć dokumentację w `docs/guides/` i portalu.

### 2. Parity automation — 2 dni
1. Napisać `scripts/check-figma-parity.ts` (porównuje warianty/props).
2. Włączyć do CI (`pnpm check:figma-parity`).
3. Dodać krok do release (sync + raport z listą rozbieżności).

### 3. Telemetry ↔ GitHub — 3 dni
1. Finalizować webhook w `apps/www/app/api/github/webhook` (mapowanie PR ↔ komponenty).
2. Dodać dane do ROI dashboard (lead time, reuse na PR, adoption alerts).
3. Przygotować kwartalny raport auto-generowany (node script lub MCP).

### 4. Proposal automation (stretch) — 2 dni
1. Zbudować w portalu listę klatek Figma oznaczonych jako `Proposal`.
2. Dodać MCP reminder podczas review/PR.
3. Uzupełnić dokumentację governance o proces zatwierdzania.

---

## 📊 KPI wpływ

| KPI | Wpływ po zamknięciu luk |
|-----|-------------------------|
| Lead time Figma → PR | Spadek do ≤ 1 dnia (automatyczna korelacja PR) |
| DS adoption | ≥ 85% (utrwalenie przez parity check) |
| Reuse rate | Zwiększona przejrzystość dzięki telemetry alertom |
| A11y/QA | Bez zmian (już 100%) |

---

## 🧭 Rekomendowana kolejność (listopad 2025)

1. **Tydzień 1:** Code Connect dla Card/Dialog/Select + Dev Resources sync
2. **Tydzień 2:** Parity CI + portal docs update
3. **Tydzień 3:** Telemetry ↔ GitHub + raport lead-time
4. **Tydzień 4:** (Stretch) Proposal automation + MCP feedback

---

## ✅ Po zamknięciu planu

- Business Overview spełnione w 100%
- End-to-end workflow: Figma → MCP/IDE → kod → telemetry → governance w pełni automatyczne
- Gotowość do rozszerzeń v1.9 (AI authoring, marketplace)

---

**Następna rewizja:** po wdrożeniu parity CI (plan 2025-12-15)

