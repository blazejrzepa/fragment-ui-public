# Modification Commands Detection

## Problem

Gdy użytkownik chciał wprowadzić zmiany do wygenerowanego UI (np. "dodaj wiecej pozycji na liste, dodaj paginators"), system traktował to jako pytanie i używał `/api/chat` zamiast `/api/generate`, co powodowało że AI tylko opisywało jak to zrobić zamiast faktycznie modyfikować kod.

## Rozwiązanie

Dodano wykrywanie komend modyfikacji, które zawsze kierują do generowania kodu, nie do chat.

### Wykrywane komendy modyfikacji:

**Polskie:**
- `dodaj` (add)
- `zmień` (change)
- `usuń` (remove)
- `update` (update)
- `modify` (modify)
- `stworz` (create)
- `zbuduj` (build)
- `zrób` (make)
- `ustaw` (set)

**Angielskie:**
- `add`
- `change`
- `remove`
- `delete`
- `update`
- `modify`
- `create`
- `build`
- `make`
- `set`

### Logika:

```typescript
// Komendy modyfikacji → zawsze generowanie
const isModificationCommand = /^(dodaj|add|zmień|change|...)/i.test(prompt) ||
                              /(?:dodaj|add|...)\s+/i.test(prompt);

// Pytania → chat (tylko jeśli NIE jest komendą modyfikacji)
const isQuestion = !isModificationCommand && (
  /^(what|how|why|...)/i.test(prompt) ||
  prompt.endsWith('?') ||
  (code && prompt.length < 30)
);
```

## Przykłady

### Traktowane jako modyfikacja (generowanie kodu):
```
✅ "dodaj wiecej pozycji na liste, dodaj paginators"
✅ "add more items to the list"
✅ "zmień kolor przycisku na niebieski"
✅ "change button color to blue"
✅ "usuń pole email"
✅ "remove email field"
```

### Traktowane jako pytania (chat):
```
✅ "jak to działa?"
✅ "what is this component?"
✅ "czy mogę dodać więcej pól?"
✅ "can I add more fields?"
```

## Status

✅ **Zaimplementowane**:
- Wykrywanie komend modyfikacji
- Priorytet modyfikacji nad pytaniami
- Komendy zawsze idą do `/api/generate`
- Pytania idą do `/api/chat`

## Pliki

Zmiany w: `apps/demo/app/playground/page.tsx`

