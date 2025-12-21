# 🔄 Figma Code Connect – Alternatywy bez planu Organization/Enterprise

> **Cel:** uzyskać praktyczny most Figma → kod bez płatnego Code Connect. Poniżej opisane rozwiązania działają na planie **Professional** (Dev Mode + Dev Resources) i współpracują z istniejącą infrastrukturą Fragment UI.

---

## 1. Dev Resources (rekomendowane obejście)

**Dlaczego:** działa natywnie w Dev Mode, jest widoczne dla całego zespołu i pozwala linkować kod, dokumentację oraz Storybook bez dodatkowych wtyczek.

### 1.1. Konfiguracja krok po kroku

1. **Zaktualizuj node ID w skrypcie** `scripts/generate-figma-dev-resources.ts`:
   - znajdź sekcję `const mappings` i wstaw rzeczywiste identyfikatory w polach `figmaNodeId` (Button ma już przykład `1304-13481`)
   - w razie potrzeby dopisz kolejne komponenty

2. **Wygeneruj instrukcję i plik JSON**:
   ```bash
   pnpm figma:dev-resources
   ```
   Komenda utworzy / zaktualizuje:
   - `docs/guides/figma-dev-resources-manual-setup.md` – manual krok po kroku dla Dev Mode
   - `.figma-dev-resources.json` – dane do automatyzacji/API

3. **Dodaj linki w Figma** (Dev Mode):
   - otwórz komponent (np. Button)
   - w panelu po prawej → sekcja **Dev Resources** → **Add**
   - wklej linki z wygenerowanego poradnika (kod, dokumentacja, Storybook)
   - powtórz dla Card, Dialog, Select itd.

4. **(Opcjonalnie) Automatyzuj z API:**
   - ustaw `FIGMA_TOKEN` (personal access token)
   - uruchom: `pnpm figma:dev-resources:add`
   - skrypt `scripts/add-figma-dev-resources-api.ts` wykorzysta `.figma-dev-resources.json` i doda linki automatycznie

### 1.2. Co dostajemy

| Zasób | Przykładowy link |
|-------|------------------|
| Kod | `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx` |
| Dokumentacja | `https://fragment-ui-www.vercel.app/docs/components/button` |
| Storybook | `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-button--docs` |

**Checklist:**
- [ ] Dev Resources dodane dla Button, Input, Card, Dialog, Select
- [ ] Manual `figma-dev-resources-manual-setup.md` zaktualizowany i udostępniony w zespole
- [ ] `.figma-dev-resources.json` przechowywany w repo (źródło prawdy dla przyszłych automatyzacji)

---

## 2. MCP / AI Assistant bridging (już działa, do rozszerzenia)

MCP Server i VS Code Extension pełnią funkcję „Code Connect” po stronie IDE:
- `mcp.json` ma reguły egzekwujące tokeny, dostępne komponenty itp.
- można dodać endpoint zwracający linki Dev Resources na podstawie `figmaNodeId`
- proponowane rozszerzenie: komenda `mcp figma get <nodeId>` zwracająca kod, docs, props oraz linki Dev Resources

**Następne kroki:**
1. Rozbudować MCP o mapowanie `figmaNodeId → componentName`
2. VS Code Extension / Cursor prompt “linkuj do Figma node” → MCP odpowiada linkami i przykładowym kodem

---

## 3. Dokumentacja jako fallback

W repo istnieje przewodnik `docs/guides/figma-dev-resources-practical-guide.md`, który opisuje przepływ z perspektywy design/dev. Warto utrzymywać dodatkowy plik referencyjny (np. `FIGMA_COMPONENT_MAP.md`) generowany z tego samego źródła danych, aby mieć offline „spis treści” linków.

Sugerowany pipeline:
- `scripts/generate-figma-dev-resources.ts` → generuje również mapę komponentów (TODO, opcjonalne)
- plik linkowany z README / DS Portal, a także z Dev Resources (jeden link do „Component Map”)

---

## 4. Inne opcje (opcjonalne / przyszłe)

| Opcja | Kiedy rozważyć | Co daje |
|-------|----------------|---------|
| GitHub Integration (Figma settings) | jeśli chcemy widzieć PR/commity w Figma | automatyczne linkowanie commitów, łatwiejsze review |
| Custom Figma Plugin | gdy Dev Resources okażą się niewystarczające | pełna kontrola UI, możliwość zaciągania danych z MCP/API |
| Automatyczne parity checks | po zebraniu node ID i Dev Resources | skrypt CI porównujący listę wariantów z `@fragment_ui/ui` |

---

## 5. Quick start (2–3h)

1. Uzupełnij `figmaNodeId` dla Card, Dialog, Select
2. `pnpm figma:dev-resources`
3. Dodaj linki w Dev Mode (lub `pnpm figma:dev-resources:add` z tokenem)
4. Zweryfikuj w Figma + udostępnij wygenerowaną instrukcję projektantom/deweloperom

**Efekt:** designers widzą aktualny kod i dokumentację w Dev Mode, a inżynierowie mają te same linki w MCP/IDE – bez potrzeby płatnego Code Connect.

---

*Ostatnia aktualizacja: 2025-11-07*

