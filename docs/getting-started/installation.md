# Installation

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

This installs dependencies for all packages and apps in the monorepo.

### 3. Build Dependencies

Some packages need to be built before others:

```bash
# Build tokens (required by UI components)
pnpm tokens:build

# Build telemetry (if needed)
pnpm telemetry:build
```

### 4. Verify Installation

```bash
# Run tests
pnpm test

# Check linting
pnpm lint
```

---

## Development Servers

Start all development servers in parallel:

```bash
pnpm dev
```

This starts:
- **Design System Portal:** http://localhost:3000
- **Demo App (Studio):** http://localhost:3002
- **Storybook:** http://localhost:6006

---

## Common Issues

### Issue: pnpm not found

**Solution:** Install pnpm globally:
```bash
npm install -g pnpm@9.0.0
```

### Issue: Build errors

**Solution:** Clean and rebuild:
```bash
pnpm clean
pnpm build
```

### Issue: Port already in use

**Solution:** Kill process on port or change port in config:
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

---

## Next Steps

- [Quick Start](./quick-start.md) - Build your first component
- [Architecture Overview](./architecture-overview.md) - Understand the system

---

**Last Updated:** 2025-01-XX

