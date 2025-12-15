# @fragment_ui/utils

Shared utility functions for Fragment UI projects.

## Installation

```bash
pnpm add @fragment_ui/utils
```

## Modules

### Naming Utilities (`/naming`)

Centralized functions for converting between different naming conventions:

- `toKebabCase()` - Convert to kebab-case
- `toCamelCase()` - Convert to camelCase
- `toPascalCase()` - Convert to PascalCase
- `normalizeComponentName()` - Normalize to kebab-case
- `toDisplayName()` - Convert to PascalCase for display

#### Usage

```typescript
import { toKebabCase, toPascalCase, toCamelCase } from "@fragment_ui/utils/naming";

// Convert to kebab-case
toKebabCase("DataTable") // "data-table"
toKebabCase("myComponent") // "my-component"

// Convert to PascalCase (for component names)
toPascalCase("data-table") // "DataTable"
toPascalCase("kpi-card") // "KPICard"

// Convert to camelCase
toCamelCase("data-table") // "dataTable"
toCamelCase("MyComponent") // "myComponent"
```

#### Features

- ✅ Handles acronyms (KPI, API, UI, ID, URL, etc.)
- ✅ Idempotent operations (safe to call multiple times)
- ✅ Supports multiple input formats
- ✅ Comprehensive test coverage

## License

MIT

