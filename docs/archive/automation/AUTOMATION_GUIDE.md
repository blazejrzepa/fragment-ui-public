# Przewodnik automatyzacji testowania komponentów

## Przegląd

System automatyzacji testowania komponentów składa się z kilku skryptów:

1. **`scripts/auto-fix-components.mjs`** - Automatycznie naprawia typowe problemy w registry
2. **`scripts/test-components-automation.mjs`** - Statyczna analiza komponentów
3. **`scripts/browser-test-components.mjs`** - Testowanie w przeglądarce z Playwright
4. **`scripts/run-full-component-test.mjs`** - Główny skrypt uruchamiający wszystkie testy

## Szybki start

### 1. Automatyczne naprawy

```bash
node scripts/auto-fix-components.mjs
```

Ten skrypt automatycznie:
- Dodaje brakujące przykłady
- Konwertuje stary format examples na nowy
- Dodaje kod do przykładów

### 2. Pełny test

```bash
node scripts/run-full-component-test.mjs
```

Ten skrypt uruchamia:
1. Auto-fix
2. Statyczną analizę
3. Generowanie raportów

### 3. Testowanie w przeglądarce (Playwright)

```bash
# Najpierw zainstaluj Playwright
pnpm add -D playwright
pnpm exec playwright install

# Uruchom testy
node scripts/browser-test-components.mjs
```

## Testowanie z użyciem MCP Browser Tools

Aby przetestować wszystkie komponenty używając narzędzi MCP browser, wykonaj następujące kroki dla każdego komponentu:

### Dla każdego komponentu:

1. **Nawigacja do Studio**
   ```
   mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"
   ```

2. **Kliknij Library w left pane**
   ```
   mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-library-tab"
   ```

3. **Filtruj Component/Block**
   ```
   mcp_cursor-ide-browser_browser_click --element "Component/Block button" --ref "ref-filter-button"
   ```

4. **Kliknij komponent**
   ```
   mcp_cursor-ide-browser_browser_click --element "ComponentName button" --ref "ref-component-button"
   ```

5. **Sprawdź Preview**
   ```
   mcp_cursor-ide-browser_browser_snapshot
   mcp_cursor-ide-browser_browser_console_messages
   ```

6. **Sprawdź Library tab**
   ```
   mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
   mcp_cursor-ide-browser_browser_snapshot
   ```

## Lista komponentów do przetestowania

Zobacz: `docs/development/COMPONENT_TEST_CHECKLIST.json`

- **67 komponentów** UI
- **21 bloków**

## Raporty

Po uruchomieniu testów, raporty są zapisywane w:

- `docs/development/AUTOMATED_TEST_REPORT.md` - Raport tekstowy
- `docs/development/AUTOMATED_TEST_RESULTS.json` - Wyniki w JSON
- `docs/development/COMPONENT_TEST_CHECKLIST.json` - Checklist do wypełnienia

## Automatyczne naprawy

System automatycznie naprawia:

1. **Brakujące przykłady** - Generuje podstawowe przykłady
2. **Stary format** - Konwertuje `examples: { tsx: ... }` na `examples: [{ code: ... }]`
3. **Brakujący kod** - Dodaje pole `code` do przykładów

## Status

✅ **Auto-fix:** Działa - naprawił 44 komponenty  
✅ **Statyczna analiza:** Działa - wszystkie komponenty przeszły  
⏳ **Testowanie w przeglądarce:** Wymaga ręcznego uruchomienia lub Playwright

