# Performance Optimization - Build Times

**Data:** 2025-01-XX  
**Problem:** Długi czas budowania aplikacji podczas developmentu

---

## 🔍 Problem

Podczas uruchamiania `pnpm dev`, Turbo uruchamia wszystkie aplikacje równolegle:
- `apps/www` (Portal dokumentacji)
- `apps/demo` (Studio/Demo application)

`apps/demo` to duża aplikacja z:
- Wieloma API routes
- Złożoną konfiguracją webpack
- Ciężkimi zależnościami (esbuild, @babel/standalone, etc.)
- Wiele plików TypeScript do skompilowania

To powoduje, że build trwa bardzo długo, nawet jeśli pracujesz tylko nad `apps/www`.

---

## ✅ Rozwiązanie

### Opcja 1: Uruchamianie tylko www (Rekomendowane) ⭐

Użyj dedykowanego scriptu do uruchamiania tylko aplikacji www:

```bash
pnpm dev:www
```

**Zalety:**
- Szybki start (tylko www)
- Mniej obciążenia CPU/memory
- Szybszy hot reload

**Kiedy używać:**
- Podczas pracy nad portalem dokumentacji
- Podczas pracy nad komponentami DS
- Podczas pracy nad admin dashboard

### Opcja 2: Uruchamianie tylko demo

Jeśli pracujesz nad demo/studio:

```bash
pnpm dev:demo
```

### Opcja 3: Uruchamianie wszystkich aplikacji

Jeśli potrzebujesz wszystkich aplikacji jednocześnie:

```bash
pnpm dev
```

---

## 📊 Porównanie Czasów

### `pnpm dev` (wszystkie aplikacje)
- **Czas startu:** ~30-60 sekund
- **Memory:** ~2-3 GB
- **CPU:** Wysokie obciążenie

### `pnpm dev:www` (tylko www)
- **Czas startu:** ~10-15 sekund
- **Memory:** ~1 GB
- **CPU:** Średnie obciążenie

### `pnpm dev:demo` (tylko demo)
- **Czas startu:** ~20-30 sekund
- **Memory:** ~1.5-2 GB
- **CPU:** Wysokie obciążenie

---

## 🎯 Rekomendacja

**Dla codziennej pracy:** Używaj `pnpm dev:www`

**Dla pracy nad demo:** Używaj `pnpm dev:demo`

**Dla integracji:** Używaj `pnpm dev` (wszystkie aplikacje)

---

## 🔧 Dodatkowe Optymalizacje

### 1. Watch Mode dla Workspace Packages

Jeśli pracujesz nad komponentami DS, użyj watch mode:

```bash
# Terminal 1: Watch mode dla pakietów
pnpm watch

# Terminal 2: Dev server dla www
pnpm dev:www
```

### 2. Turbo Cache

Turbo automatycznie cache'uje build artifacts. Jeśli zmieniasz tylko pliki w `apps/www`, Turbo użyje cache dla niezmienionych pakietów.

### 3. Next.js Cache

Next.js cache'uje skompilowane strony. Po pierwszym buildzie, kolejne zmiany są szybsze.

---

## 📝 Checklist

- [ ] Używaj `pnpm dev:www` podczas pracy nad portalem
- [ ] Używaj `pnpm dev:demo` podczas pracy nad demo
- [ ] Używaj `pnpm watch` dla workspace packages
- [ ] Sprawdzaj czy Turbo cache działa poprawnie

---

**Status:** ✅ **Zoptymalizowane** - Dodano dedykowane scripts dla szybszego developmentu

