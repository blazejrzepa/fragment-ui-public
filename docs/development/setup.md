# Development Setup

**Purpose:** Set up local development environment  
**Audience:** Developers  
**When to read:** Before starting development

---

## Prerequisites

- **Node.js:** 20.x or higher
- **pnpm:** 9.0.0 or higher
- **Git:** Latest version

---

## Setup Steps

### 1. Clone Repository

```bash
git clone https://github.com/your-org/fragment-ui.git
cd fragment-ui
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build Dependencies

Some packages need to be built before others:

```bash
# Build tokens (required by UI components)
pnpm tokens:build

# Build telemetry (if needed)
pnpm telemetry:build
```

### 4. Start Development Servers

```bash
pnpm dev
```

This starts:
- **Design System Portal:** http://localhost:3000
- **Demo App (Studio):** http://localhost:3002
- **Storybook:** http://localhost:6006

---

## Development Workflow

### Making Changes

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Edit code in packages or apps
   - Write tests
   - Update documentation

3. **Test Changes**
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

4. **Create PR**
   - Push branch
   - Create pull request
   - Wait for CI checks

---

## Common Tasks

### Add New Component

1. Create component in `packages/ui/src/`
2. Add to `packages/ui/src/index.ts`
3. Create Storybook story
4. Write tests
5. Update registry

### Add New Package

1. Create directory in `packages/`
2. Create `package.json`
3. Add to workspace (already included via `packages/*`)
4. Update root scripts if needed

### Run Specific Package

```bash
# Run dev server for specific app
pnpm --filter fragment-demo dev

# Run tests for specific package
pnpm --filter @fragment_ui/ui test
```

---

## Environment Variables

### Studio App

Create `.env.local` in `apps/demo/`:

```bash
OPENAI_API_KEY=sk-...
POSTHOG_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com
```

### Portal App

Create `.env.local` in `apps/www/` if needed.

---

## IDE Setup

### VS Code

Recommended extensions:
- **ESLint:** Linting
- **Prettier:** Code formatting
- **TypeScript:** Type checking
- **Mermaid:** Diagram rendering

### Settings

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## Gotchas

- **Build Order:** Always build tokens before UI
- **Hot Reload:** Package changes require rebuild
- **TypeScript:** Shared `tsconfig.base.json`
- **Port Conflicts:** Kill processes on ports if needed

---

## Next Steps

- [Component Implementation](./component-implementation.md) - Build components
- [Testing](./testing.md) - Write tests
- [Architecture Overview](../architecture/system-overview.md) - Understand system

---

**Last Updated:** 2025-01-XX

