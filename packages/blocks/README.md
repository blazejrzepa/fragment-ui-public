# @fragment_ui/blocks

Pre-built screen compositions and blocks for Fragment UI.

## Installation

```bash
pnpm add @fragment_ui/blocks @fragment_ui/ui @fragment_ui/tokens
```

## Quick Start

```tsx
import { DashboardLayout, KPIDashboard } from "@fragment_ui/blocks";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <KPIDashboard
        metrics={[
          { id: "users", title: "Users", value: "1,234", trend: "up", trendValue: "+12%" },
        ]}
      />
    </DashboardLayout>
  );
}
```

## Documentation

- **[Blocks Documentation](https://fragment-ui.dev/docs/blocks)** - Complete blocks reference
- **[Examples](https://fragment-ui.dev/docs/examples)** - Real-world usage examples
- **[Dashboard Example](https://fragment-ui.dev/docs/examples/layout/dashboard)** - Complete dashboard example

## Available Blocks

- **Dashboard Layout** - Complete dashboard with sidebar and header
- **KPI Dashboard** - Key performance indicator cards
- **Navigation Header** - Top navigation bar
- **Settings Screen** - Settings page layout
- **Data Table** - Advanced data table with sorting and filtering
- **Form Container** - Form layout components
- **Authentication Block** - Login/signup forms
- **Pricing Table** - Pricing comparison tables
- And more...

## Example Projects

Check out our example applications:

- **[Next.js Dashboard](https://github.com/blazejrzepa/fragment-ui/tree/main/examples/nextjs-dashboard)** - Complete dashboard application
- **[SaaS Settings](https://github.com/blazejrzepa/fragment-ui/tree/main/examples/saas-settings)** - Settings page example

## License

MIT

