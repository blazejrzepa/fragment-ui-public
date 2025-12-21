# 🎯 Plan Rozwoju Dashboard - Poziom shadcn/ui

**Cel:** Zbudować dashboard na poziomie [shadcn/ui dashboard example](https://ui.shadcn.com/examples/dashboard) przy użyciu Copilota

**Status:** W trakcie implementacji  
**Data:** 2025-01-XX

---

## 📊 Analiza Dashboardu shadcn/ui

### Struktura Dashboardu

1. **Sidebar Navigation**
   - Logo + tekst
   - Menu items z ikonami (Dashboard, Analytics, Projects, Team, Settings)
   - Collapsible groups (Documents z submenu)
   - User menu w footer sidebar

2. **Top Header**
   - Logo + navigation items
   - Search bar
   - User menu (avatar, dropdown)

3. **KPI Cards (4 cards)**
   - Total Revenue: $1,250.00, +12.5%, trend indicator
   - New Customers: 1,234, -20%, status badge
   - Active Accounts: 45,678, +12.5%, status badge
   - Growth Rate: 4.5%, +4.5%, status badge

4. **Chart Section**
   - "Visitors for the last 6 months" - Line chart
   - Date range selector (Last 3 months, Last 30 days, Last 7 days)
   - View toggle

5. **Data Table**
   - Zaawansowana tabela z:
     - Sortowaniem kolumn
     - Filtrowaniem
     - Paginacją (68 rows, 7 pages)
     - Row selection (checkbox)
     - Drag & drop reordering
     - Column customization
     - Actions menu per row
   - Kolumny: Header, Section Type, Status, Target, Limit, Reviewer, Actions

---

## ✅ Co już mamy

### 1. Podstawowa Struktura ✅
- ✅ Dashboard scaffold z regions (header, sidebar, content)
- ✅ Navigation modules (navigation-header, navigation-sidebar)
- ✅ Grid layout system (12-column grid)
- ✅ KPI cards structure
- ✅ Charts structure
- ✅ Basic table generator

### 2. Komponenty UI ✅
- ✅ `DataTable` component (`packages/ui/src/data-table.tsx`)
- ✅ `Table` components (TableHeader, TableBody, TableRow, etc.)
- ✅ `Card` components
- ✅ `Badge` component
- ✅ `Select`, `Input` components

### 3. Generatory ✅
- ✅ `generateScreenWithRegions` - obsługuje header/sidebar/content
- ✅ `generateGenericSection` - z col-span support
- ✅ `generateTable` - podstawowa tabela
- ✅ `generateModule` - navigation modules

---

## 🚧 Co trzeba dodać/ulepszyć

### 1. Enhanced Data Table (PRIORYTET)

**Status:** ⚠️ Częściowo zaimplementowane

**Wymagane funkcje:**
- [ ] Sortowanie kolumn (ascending/descending)
- [ ] Filtrowanie (search, select filters)
- [ ] Paginacja (page size, page navigation)
- [ ] Row selection (checkbox)
- [ ] Column visibility toggle
- [ ] Actions menu per row
- [ ] Drag & drop reordering (opcjonalnie)

**Pliki do modyfikacji:**
- `apps/demo/app/studio/dsl/generators/table-generator.ts` - rozszerzyć o sortowanie, filtrowanie, paginację
- `apps/demo/app/studio/dsl/types.ts` - dodać typy dla table features
- `apps/demo/src/lib/scaffolds/dashboard.ts` - użyć enhanced table w scaffold

**Estymacja:** 8-12h

---

### 2. Enhanced KPI Cards

**Status:** ⚠️ Podstawowa struktura istnieje

**Wymagane funkcje:**
- [ ] Trend indicators (up/down arrows)
- [ ] Trend values (+12.5%, -20%)
- [ ] Status badges (trending up, down, neutral)
- [ ] Description text pod wartością
- [ ] Better styling (shadows, borders)

**Pliki do modyfikacji:**
- `apps/demo/app/studio/dsl/generators/dashboard-generator.ts` - `generateMetricWidget`
- `apps/demo/src/lib/scaffolds/dashboard.ts` - KPI cards structure

**Estymacja:** 4-6h

---

### 3. Enhanced Charts

**Status:** ⚠️ Podstawowa struktura istnieje

**Wymagane funkcje:**
- [ ] Date range selector (Last 3 months, Last 30 days, Last 7 days)
- [ ] View toggle (chart type switching)
- [ ] Better chart styling
- [ ] Tooltips z wartościami
- [ ] Legend

**Pliki do modyfikacji:**
- `apps/demo/app/studio/dsl/generators/dashboard-generator.ts` - `generateChartWidget`
- `apps/demo/src/lib/scaffolds/dashboard.ts` - Charts section

**Estymacja:** 6-8h

---

### 4. Enhanced Navigation

**Status:** ✅ Podstawowa struktura istnieje

**Wymagane funkcje:**
- [ ] Icons dla menu items (już wspierane w navigation-sidebar)
- [ ] Collapsible groups (Documents z submenu)
- [ ] Active state highlighting
- [ ] User menu w sidebar footer
- [ ] Search bar w header

**Pliki do modyfikacji:**
- `apps/demo/app/studio/dsl/generators/modules/module-types.ts` - `generateNavigationModule`
- `apps/demo/src/lib/scaffolds/dashboard.ts` - Navigation structure

**Estymacja:** 4-6h

---

### 5. Layout Improvements

**Status:** ✅ Grid layout naprawiony

**Wymagane funkcje:**
- [ ] Better spacing i padding
- [ ] Responsive breakpoints
- [ ] Sidebar collapse/expand
- [ ] Sticky header

**Pliki do modyfikacji:**
- `apps/demo/app/studio/dsl/generators/page-generator.ts` - `generateScreenWithRegions`
- `apps/demo/app/studio/dsl/generators/layouts/layout-generators.ts`

**Estymacja:** 4-6h

---

## 📋 Plan Implementacji

### Faza 1: Enhanced Data Table (1-2 dni)
1. Rozszerzyć `table-generator.ts` o:
   - Sortowanie kolumn
   - Filtrowanie (search + select)
   - Paginację
   - Row selection
2. Zaktualizować `dashboard.ts` scaffold, aby używał enhanced table
3. Testy

### Faza 2: Enhanced KPI Cards (0.5-1 dzień)
1. Rozszerzyć `generateMetricWidget` o:
   - Trend indicators
   - Status badges
   - Description text
2. Zaktualizować scaffold
3. Testy

### Faza 3: Enhanced Charts (1 dzień)
1. Rozszerzyć `generateChartWidget` o:
   - Date range selector
   - View toggle
   - Better styling
2. Zaktualizować scaffold
3. Testy

### Faza 4: Enhanced Navigation (0.5-1 dzień)
1. Rozszerzyć `generateNavigationModule` o:
   - Collapsible groups
   - User menu w sidebar
   - Search bar w header
2. Zaktualizować scaffold
3. Testy

### Faza 5: Layout Polish (0.5-1 dzień)
1. Spacing i padding improvements
2. Responsive breakpoints
3. Sidebar collapse/expand
4. Sticky header

---

## 🎯 Success Criteria

### Poziom 1: Podstawowy Dashboard ✅
- ✅ Sidebar navigation
- ✅ Top header
- ✅ KPI cards (4 cards)
- ✅ Charts section
- ✅ Basic table

### Poziom 2: Enhanced Dashboard (CEL)
- [ ] Enhanced data table (sorting, filtering, pagination)
- [ ] Enhanced KPI cards (trends, badges)
- [ ] Enhanced charts (date range, view toggle)
- [ ] Enhanced navigation (collapsible groups, user menu)
- [ ] Professional layout (spacing, responsive)

### Poziom 3: Advanced Dashboard (FUTURE)
- [ ] Drag & drop reordering
- [ ] Column customization
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Real-time updates

---

## 📝 Przykładowy Prompt dla Copilota

```
Stwórz profesjonalny dashboard dla SaaS CRM z:
- Sidebar navigation z logo, menu items (Dashboard, Analytics, Projects, Team, Settings) i user menu
- Top header z logo, navigation i search bar
- 4 KPI cards: Total Revenue ($1,250.00, +12.5%), New Customers (1,234, -20%), Active Accounts (45,678, +12.5%), Growth Rate (4.5%, +4.5%)
- Chart section "Visitors for the last 6 months" z date range selector
- Data table z sortowaniem, filtrowaniem, paginacją i row selection
- Kolumny tabeli: Header, Section Type, Status, Target, Limit, Reviewer, Actions
```

---

## 🔗 Referencje

- [shadcn/ui Dashboard Example](https://ui.shadcn.com/examples/dashboard)
- [Fragment UI DataTable Component](../../../../packages/ui/src/data-table.tsx)
- [Dashboard Scaffold](../../../apps/demo/src/lib/scaffolds/dashboard.ts)

---

**Last Updated:** 2025-01-XX

