# DataTable API Reference

Auto-generated API documentation for `DataTable` component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | - |
| `columns` | `DataTableColumn<T>[]` | - | - |
| `getRowKey?` | `(row: T, index: number) => string | number` | - | - |
| `selectable?` | `boolean` | - | - |
| `selectedRows?` | `Set<string | number>` | - | - |
| `onSelectionChange?` | `(selected: Set<string | number>) => void` | - | - |
| `sortable?` | `boolean` | - | - |
| `defaultSort?` | `{ columnId: string; direction: SortDirection }` | - | - |
| `onSortChange?` | `(columnId: string | null, direction: SortDirection) => void` | - | - |
| `filterable?` | `boolean` | - | - |
| `filters?` | `Record<string, string>` | - | - |
| `onFilterChange?` | `(filters: Record<string, string>) => void` | - | - |
| `resizable?` | `boolean` | - | - |
| `rowActions?` | `RowAction<T>[]` | - | - |
| `onRowClick?` | `(row: T, index: number) => void` | - | - |
| `emptyMessage?` | `string` | - | - |
| `className?` | `string` | - | - |
| `headerClassName?` | `string` | - | - |
| `rowClassName?` | `string | ((row: T, index: number) => string)` | - | - |

---

*This documentation is auto-generated from TypeScript types.*
