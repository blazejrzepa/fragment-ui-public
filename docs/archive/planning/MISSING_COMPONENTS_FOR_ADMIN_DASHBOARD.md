# Brakujące komponenty dla Admin Dashboard

Analiza dashboardu: https://shadcnblocks-admin.vercel.app/

## ✅ Co już mamy:

1. **AppShell** - struktura layoutu z sidebar i header ✅
2. **NavigationHeader** - header z nawigacją ✅
3. **KPIDashboard / KpiStrip** - karty z metrykami ✅
4. **Chart** - komponenty wykresów ✅
5. **DataTable** - tabela z danymi ✅
6. **DataTableToolbar** - toolbar dla tabeli ✅
7. **PaginationFooter** - paginacja ✅
8. **Avatar** - avatary użytkowników ✅
9. **Badge** - status badges ✅
10. **DropdownMenu** - menu dropdown ✅
11. **DatePicker** - wybór daty ✅
12. **Command** - search/command palette ✅
13. **Card** - karty ✅
14. **Button** - przyciski ✅
15. **Input** - pola input ✅

## ❌ Czego brakuje:

### 1. **TeamMembersList** (Block) - PRIORYTET P0
**Opis:** Lista członków zespołu z avatarami, imionami, emailami, rolami

**Funkcjonalność:**
- Wyświetlanie listy członków zespołu
- Avatar + inicjały jako fallback
- Imię i nazwisko
- Email
- Rola (Member, Owner, Admin) z badge
- Opcjonalnie: akcje (menu dropdown per użytkownik)
- Opcjonalnie: status online/offline

**Przykład użycia:**
```tsx
<TeamMembersList
  members={[
    { id: "1", name: "Dale Komen", email: "dale@example.com", role: "Member", avatar: "DK" },
    { id: "2", name: "Sofia Davis", email: "m@example.com", role: "Owner", avatar: "SD" },
  ]}
  onMemberClick={(member) => console.log(member)}
/>
```

**Priorytet:** P0 - często używany w admin dashboardach

---

### 2. **ColumnVisibility** (Component) - PRIORYTET P0
**Opis:** Komponent do pokazywania/ukrywania kolumn w tabeli

**Funkcjonalność:**
- Dropdown z listą kolumn
- Checkboxy do pokazywania/ukrywania
- Zapisywanie stanu (opcjonalnie localStorage)
- Integracja z DataTable

**Przykład użycia:**
```tsx
<ColumnVisibility
  columns={columns}
  visibleColumns={visibleColumns}
  onVisibilityChange={(visible) => setVisibleColumns(visible)}
/>
```

**Priorytet:** P0 - standardowa funkcjonalność w tabelach danych

---

### 3. **MetricCard** (Component) - ✅ JUŻ ISTNIEJE
**Opis:** Elastyczna karta metryki

**Status:** ✅ Już eksportowany w `@fragment_ui/ui` jako `MetricCard`

**Funkcjonalność:**
- ✅ Tytuł
- ✅ Wartość (liczba lub tekst)
- ✅ Trend (up/down/neutral)
- ✅ Trend value (+12%)
- ✅ Ikona
- ✅ Opis
- ✅ Footer (custom content)
- ✅ onClick handler

**Priorytet:** ✅ Gotowe do użycia

---

### 4. **SearchInput** (Component) - PRIORYTET P1
**Opis:** Dedykowany komponent search input z ikoną

**Status:** Można użyć `Command` lub `Input` z ikoną, ale może być przydatny dedykowany komponent

**Funkcjonalność:**
- Input z ikoną search
- Placeholder
- Opcjonalnie: keyboard shortcut (⌘K)
- Opcjonalnie: clear button

**Priorytet:** P1 - można użyć istniejących komponentów

---

### 5. **ThemeToggle** (Component) - PRIORYTET P2
**Opis:** Przełącznik motywu (light/dark)

**Funkcjonalność:**
- Toggle między light/dark mode
- Ikona słońca/księżyca
- Tooltip
- Opcjonalnie: system preference detection

**Priorytet:** P2 - nice to have, można zaimplementować używając istniejących komponentów

---

### 6. **Notifications** (Component) - PRIORYTET P2
**Opis:** Komponent powiadomień w headerze

**Funkcjonalność:**
- Ikona dzwonka
- Badge z liczbą nieprzeczytanych
- Dropdown z listą powiadomień
- Opcjonalnie: mark as read
- Opcjonalnie: mark all as read

**Priorytet:** P2 - nice to have

---

### 7. **SidebarNavigation** (Block) - PRIORYTET P1
**Opis:** Dedykowany komponent sidebar navigation (obecnie używamy AppShell z custom sidebar)

**Status:** 
- ✅ Mamy `Sidebar` (drawer) w `@fragment_ui/ui`
- ✅ Mamy `AppShell` w `@fragment_ui/blocks`
- ❌ Brakuje dedykowanego `SidebarNavigation` block z predefiniowaną strukturą

**Funkcjonalność:**
- Grupowanie sekcji (General, Pages, Other)
- Aktywne linki
- Nested navigation
- Collapsible sections
- Icons
- Logo/header
- Footer (user menu)

**Priorytet:** P1 - można użyć AppShell, ale dedykowany komponent byłby wygodniejszy

---

### 8. **StatusBadge** (Component) - PRIORYTET P1
**Opis:** Badge z kolorami dla statusów (success, processing, failed, etc.)

**Status:** Można użyć istniejącego `Badge`, ale może być przydatny dedykowany komponent z predefiniowanymi statusami

**Funkcjonalność:**
- Predefiniowane statusy: success, processing, failed, pending, etc.
- Kolory dla każdego statusu
- Opcjonalnie: ikony

**Przykład użycia:**
```tsx
<StatusBadge status="success">Success</StatusBadge>
<StatusBadge status="processing">Processing</StatusBadge>
<StatusBadge status="failed">Failed</StatusBadge>
```

**Priorytet:** P1 - można użyć Badge, ale dedykowany komponent byłby wygodniejszy

---

## 📋 Podsumowanie

### Priorytet P0 (Krytyczne - brakuje):
1. **TeamMembersList** - lista członków zespołu
2. **ColumnVisibility** - pokazywanie/ukrywanie kolumn

### Priorytet P1 (Ważne - można użyć istniejących, ale dedykowane byłyby lepsze):
3. **StatusBadge** - dedykowany komponent (można użyć Badge)
4. **SearchInput** - dedykowany komponent (można użyć Input/Command)
5. **SidebarNavigation** - dedykowany komponent (można użyć AppShell)

### Priorytet P2 (Nice to have):
7. **ThemeToggle** - przełącznik motywu
8. **Notifications** - komponent powiadomień

---

## 🎯 Rekomendacja

**Najpierw zaimplementować (P0):**
1. **TeamMembersList** (Block) - lista członków zespołu z avatarami
2. **ColumnVisibility** (Component) - pokazywanie/ukrywanie kolumn w tabeli

**Następnie (P1):**
3. **StatusBadge** (Component) - badge z predefiniowanymi statusami (success, processing, failed)
4. **SidebarNavigation** (Block) - dedykowany komponent sidebar z nawigacją (opcjonalnie)

**Opcjonalnie (P2):**
5. **ThemeToggle** - przełącznik motywu
6. **Notifications** - komponent powiadomień (mamy już `NotificationList`, ale może brakować triggera w headerze)

---

## 📝 Uwagi

- Większość funkcjonalności można zbudować używając istniejących komponentów
- Główne braki to: **TeamMembersList** i **ColumnVisibility**
- Reszta to głównie convenience components, które ułatwią budowanie dashboardów

