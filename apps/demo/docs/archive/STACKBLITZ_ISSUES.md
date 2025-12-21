# StackBlitz - Problemy i Rozwiązania

## ❌ Problem: Timeout przy łączeniu z StackBlitz VM

### Błąd
```
Timeout: Unable to establish a connection with the StackBlitz VM
```

### Możliwe Przyczyny

1. **SharedArrayBuffer nie jest dostępny**
   - WebContainers wymagają `SharedArrayBuffer`
   - Wymaga COOP/COEP headers
   - Wymaga HTTPS (lub localhost)

2. **Headers COOP/COEP mogą blokować zasoby**
   - `Cross-Origin-Embedder-Policy: require-corp` może blokować niektóre zasoby
   - Zewnętrzne skrypty/fonty mogą nie działać

3. **StackBlitz wymaga połączenia z zewnętrznym serwerem**
   - `embedProject` łączy się z `stackblitz.com`
   - Może być problem z siecią/firewallem

4. **Next.js dev server może mieć problemy z COEP**
   - Niektóre zasoby Next.js mogą nie mieć odpowiednich headers

---

## 🔍 Diagnostyka

### Sprawdź SharedArrayBuffer
```javascript
console.log("SharedArrayBuffer available:", typeof SharedArrayBuffer !== "undefined");
```

### Sprawdź Headers
W DevTools → Network → sprawdź czy response headers zawierają:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

### Sprawdź Console
Szukaj błędów związanych z:
- CORS
- SharedArrayBuffer
- Cross-origin isolation

---

## 💡 Rozwiązania

### Opcja 1: Sprawdź czy działa na HTTPS
StackBlitz WebContainers wymagają HTTPS (lub localhost). Sprawdź czy:
- Używasz `localhost` (powinno działać)
- Używasz HTTPS w produkcji

### Opcja 2: Zmniejsz restrykcyjność COEP
Możemy spróbować użyć `credentialless` zamiast `require-corp`:

```javascript
// next.config.mjs
headers: [
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'credentialless', // zamiast 'require-corp'
  },
]
```

### Opcja 3: Użyj `openProject` zamiast `embedProject`
`openProject` otwiera projekt w nowym oknie, co może być prostsze:

```javascript
sdk.openProject({
  title: "...",
  files: {...},
});
```

### Opcja 4: Fallback do React Live
Jeśli StackBlitz nie działa, możemy użyć React Live jako fallback:

```javascript
if (typeof SharedArrayBuffer === "undefined") {
  // Use React Live instead
  return <ReactLiveRenderer code={code} />;
}
```

---

## 🎯 Rekomendacja

**Dla lokalnego developmentu:**
- StackBlitz może mieć problemy z COEP headers
- Rozważ użycie React Live jako głównego rozwiązania
- StackBlitz może być lepsze dla produkcji (HTTPS)

**Dla produkcji:**
- StackBlitz powinno działać z HTTPS
- Upewnij się, że wszystkie zasoby mają odpowiednie headers

---

## 📝 Następne Kroki

1. **Sprawdź czy SharedArrayBuffer jest dostępny** w konsoli
2. **Sprawdź headers** w DevTools → Network
3. **Rozważ fallback** do React Live jeśli StackBlitz nie działa
4. **Przetestuj na HTTPS** w produkcji

