# Dokumentacja - Plan Reorganizacji

**Data:** 2025-01-XX  
**Status:** Propozycja reorganizacji

---

## 📋 Analiza Obecnej Struktury

### Statystyki
- **Łącznie plików MD:** 204
- **Katalogi:** 20+
- **Pliki w root docs/:** 13 (w tym wiele nieaktualnych)
- **Roadmap:** 16 plików (część nieaktualna)
- **Guides:** 46 plików (wiele o Figma, mogą być nieaktualne)
- **Testing:** 19 plików (duplikaty)

---

## 🎯 Proponowana Struktura

```
docs/
├── README.md                          # Główny index (aktualny)
├── QUICK_START.md                     # ✅ Zostaje
├── USER_GUIDE.md                      # ✅ Zostaje
│
├── architecture/                      # ✅ NOWY - Architektura systemu
│   ├── STUDIO_DOMAIN_MODEL.md         # ✅ Już istnieje
│   ├── MODULES_BOUNDARIES.md          # ✅ Już istnieje
│   └── README.md                      # NOWY - Index architektury
│
├── copilot/                          # ✅ Zostaje (aktualne)
│   ├── README.md
│   ├── contract.md
│   ├── implementation-plan.md
│   └── ab-testing-spec.md
│
├── roadmap/                          # ✅ Zostaje, ale uporządkowane
│   ├── README.md                     # ✅ Aktualny index
│   ├── FRAGMENT_UI_STUDIO_PLAN.md    # ✅ Główny plan (najnowszy)
│   ├── IMPLEMENTATION_ITERATIONS.md  # ✅ Plan iteracji
│   ├── AB_TESTING_STRATEGIC_PLAN.md  # ✅ Strategic plan
│   └── archive/                       # NOWY - Stare plany
│       ├── ai-playground-analysis.md
│       ├── BUSINESS_OVERVIEW_ANALYSIS.md
│       ├── CRITICAL_GAPS_ANALYSIS.md
│       ├── FRAGMENT_STUDIO_DEVELOPMENT_PLAN.md (stary)
│       ├── IMPLEMENTATION_COMPLETE.md
│       ├── MCP_TELEMETRY_GOVERNANCE_PLAN.md
│       ├── NEXT_STEPS.md (stary)
│       ├── project-status.md (stary)
│       ├── WHY_THESE_FEATURES.md
│       ├── dev-resources-setup-tasks.md
│       ├── figma-integration-plan.md
│       └── figma-integration-status.md
│
├── api/                              # ✅ Zostaje (dokumentacja komponentów)
│
├── guides/                           # ✅ Zostaje, ale uporządkowane
│   ├── README.md                     # NOWY - Index z kategoriami
│   ├── figma/                        # NOWY - Wszystkie Figma guides
│   │   ├── getting-started.md
│   │   ├── code-connect.md
│   │   ├── dev-resources.md
│   │   ├── button-sync.md
│   │   └── ... (konsolidacja)
│   ├── development/                  # NOWY - Development guides
│   │   ├── cli-usage.md
│   │   ├── mcp-server-setup.md
│   │   ├── vscode-extension.md
│   │   └── ...
│   └── ... (inne kategorie)
│
├── testing/                          # ✅ Zostaje, ale uporządkowane
│   ├── README.md                     # NOWY - Index
│   ├── guide.md                      # Scalony z test-guide.md, TESTING_GUIDE.md
│   ├── standards.md                  # component-testing-standards.md
│   ├── registry.md                   # test-registry.md
│   ├── results/                       # NOWY - Wyniki testów
│   │   ├── manual-results.md
│   │   └── performance-results.md
│   └── archive/                      # NOWY - Stare testy
│       ├── BUTTON_COMMANDS_TEST.md
│       ├── DECISION_PATTERNS_TEST.md
│       └── ...
│
├── submissions/                      # ✅ Zostaje (nowe)
│   └── SUBMISSIONS_FLOW.md
│
├── experiments/                     # ✅ Zostaje (nowe)
│   └── POSTHOG_EXPERIMENTS.md
│
├── dsl/                             # ✅ Zostaje (nowe)
│   └── DSL_COMPLEX_SCREENS.md
│
├── patching/                        # ✅ Zostaje (nowe)
│   └── PATCH_SYSTEM.md
│
├── technical/                        # ✅ Zostaje
│   ├── ui-dsl-versions.md
│   ├── versioning.md
│   └── ... (konsolidacja)
│
├── archive/                         # ✅ Zostaje, ale rozszerzone
│   ├── cleanup/                     # NOWY
│   │   ├── CLEANUP_AND_REFACTORING_PLAN.md
│   │   ├── CLEANUP_SUMMARY.md
│   │   ├── FINAL_CLEANUP_REPORT.md
│   │   ├── REORGANIZATION_SUMMARY.md
│   │   ├── DS_AUDIT_REPORT.md
│   │   ├── IMPROVEMENTS_RECOMMENDATIONS.md
│   │   └── UI_IMPROVEMENTS_RECOMMENDATIONS.md
│   ├── old-roadmaps/                # Już istnieje
│   └── old-docs/                    # NOWY - Inne stare dokumenty
│       ├── PROJECT_OVERVIEW.md (jeśli nieaktualny)
│       ├── PROJECT_STRUCTURE.md (jeśli nieaktualny)
│       └── SUBMISSIONS_DASHBOARD_STRUCTURE.md
│
└── ... (pozostałe katalogi bez zmian)
```

---

## 📝 Plan Działania

### Krok 1: Archiwizacja nieaktualnych plików z root

**Przenieść do `docs/archive/cleanup/`:**
- `CLEANUP_AND_REFACTORING_PLAN.md`
- `CLEANUP_SUMMARY.md`
- `FINAL_CLEANUP_REPORT.md`
- `REORGANIZATION_SUMMARY.md`
- `DS_AUDIT_REPORT.md`
- `IMPROVEMENTS_RECOMMENDATIONS.md`
- `UI_IMPROVEMENTS_RECOMMENDATIONS.md`
- `SUBMISSIONS_DASHBOARD_STRUCTURE.md` (jeśli nieaktualny)

**Przenieść do `docs/archive/old-docs/`:**
- `PROJECT_OVERVIEW.md` (jeśli nieaktualny - sprawdzić datę)
- `PROJECT_STRUCTURE.md` (jeśli nieaktualny)

---

### Krok 2: Uporządkowanie roadmap/

**Zostawić (aktualne):**
- `README.md`
- `FRAGMENT_UI_STUDIO_PLAN.md` (najnowszy, główny plan)
- `IMPLEMENTATION_ITERATIONS.md` (nowy)
- `AB_TESTING_STRATEGIC_PLAN.md` (strategiczny)

**Przenieść do `docs/roadmap/archive/`:**
- `ai-playground-analysis.md`
- `BUSINESS_OVERVIEW_ANALYSIS.md`
- `CRITICAL_GAPS_ANALYSIS.md`
- `FRAGMENT_STUDIO_DEVELOPMENT_PLAN.md` (stary, zastąpiony przez FRAGMENT_UI_STUDIO_PLAN.md)
- `IMPLEMENTATION_COMPLETE.md`
- `MCP_TELEMETRY_GOVERNANCE_PLAN.md`
- `NEXT_STEPS.md` (stary)
- `project-status.md` (stary)
- `WHY_THESE_FEATURES.md`
- `dev-resources-setup-tasks.md`
- `figma-integration-plan.md`
- `figma-integration-status.md`

---

### Krok 3: Konsolidacja testing/

**Scalić:**
- `test-guide.md` + `TESTING_GUIDE.md` → `guide.md`
- `test-results.md` + `MANUAL_TEST_RESULTS.md` → `results/manual-results.md`
- `component-testing-standards.md` → `standards.md`
- `test-registry.md` → `registry.md`

**Przenieść do `docs/testing/archive/`:**
- `BUTTON_COMMANDS_TEST.md`
- `DECISION_PATTERNS_TEST.md`
- `ESLINT_RULE_MANUAL_TEST.md`
- `MILESTONE_2_TEST_PLAN.md`
- `MILESTONE_3.1_MANUAL_TESTING.md`
- `QUICK_TEST.md` (zostawić QUICK_TEST_GUIDE.md)
- `ROI_DASHBOARD_TESTING.md`
- `ROI_QUICK_TEST.md`
- `TESTING_RUNTIME_MANIFEST.md`

**Zostawić:**
- `QUICK_TEST_GUIDE.md`
- `performance-tests.md`
- `visual-regression.md`
- `troubleshooting-test-hanging.md`

---

### Krok 4: Organizacja guides/

**Utworzyć `docs/guides/figma/`:**
- Przenieść wszystkie pliki `figma-*.md` (ok. 30 plików)
- Utworzyć `README.md` z indexem

**Utworzyć `docs/guides/development/`:**
- `cli-usage.md`
- `mcp-server-setup.md`
- `vscode-extension-usage.md`
- `plugin-system-usage.md`
- `github-integration-setup.md`
- `github-editing-guide.md`
- `upstream-rebase-process.md`

**Zostawić w root guides/:**
- `best-practices.md`
- `design-to-code-workflow.md`
- `enterprise-features.md`
- `mdx-editing.md`
- `roi-dashboard-setup.md`
- `assets-and-graphics.md`

---

### Krok 5: Uporządkowanie deployment/

**Przenieść stare PR do `docs/archive/deployment/`:**
- `pr-v1.1.0.md`
- `pr-v1.2.0.md`
- `pr-v1.3.0.md`
- `pr-v1.4.0.md`

**Zostawić:**
- `deployment.md`
- `github-release-notes.md`
- `pr-description.md` (template)
- `release-checklist.md`

---

### Krok 6: Utworzenie README.md w kluczowych katalogach

**Nowe README:**
- `docs/architecture/README.md`
- `docs/guides/README.md`
- `docs/testing/README.md`
- `docs/roadmap/archive/README.md`
- `docs/archive/README.md` (aktualizacja)

---

## ✅ Korzyści

1. **Czytelność:** Mniej plików w root, lepsza organizacja
2. **Nawigacja:** README w każdym katalogu z indexem
3. **Historia:** Stare dokumenty w archive/, ale dostępne
4. **Aktualność:** Jasne rozróżnienie aktualnych vs archiwalnych
5. **Skalowalność:** Łatwo dodawać nowe dokumenty w odpowiednich miejscach

---

## 🚨 Uwagi

1. **Backward Compatibility:** Sprawdzić czy są linki do przenoszonych plików
2. **Git History:** Pliki przenoszone zachowają historię
3. **Search:** Zaktualizować wyszukiwanie jeśli jest
4. **CI/CD:** Sprawdzić czy nie ma referencji w skryptach

---

## 📊 Statystyki Po Reorganizacji

- **Pliki w root docs/:** 3 (README.md, QUICK_START.md, USER_GUIDE.md)
- **Katalogi:** 20+ (lepiej zorganizowane)
- **Archive:** Wszystkie nieaktualne dokumenty w archive/
- **README files:** W każdym głównym katalogu

---

**Status:** Propozycja do zatwierdzenia  
**Następny krok:** Zatwierdzenie planu, potem wykonanie reorganizacji

