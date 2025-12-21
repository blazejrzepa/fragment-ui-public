# Quick Start Guide

**Get started with Fragment UI in minutes!**

---

## 🚀 Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Servers

```bash
# Run all services in parallel
pnpm dev

# Or run individually:
# Portal: http://localhost:3000
# Demo: http://localhost:3002
# Storybook: http://localhost:6006
```

---

## 📦 Using Components in Your Project

### Install a Component

```bash
# Install from registry
npx shadcn@latest add https://fragment-ui.dev/r/button.json
```

### Use the Component

```tsx
import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button>Click me</Button>
}
```

---

## 🎯 Next Steps

1. **Browse Components** - Visit http://localhost:3000/components
2. **Try Playground** - Visit http://localhost:3002/playground
3. **Read Documentation** - See [User Guide](./USER_GUIDE.md)
4. **Check Examples** - Explore Storybook at http://localhost:6006

---

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Complete guide
- **[Component API Reference](./api/)** - All component APIs
- **[Testing Standards](./testing/component-testing-standards.md)** - Testing guidelines
- **[CLI Usage](./guides/cli-usage.md)** - CLI commands

---

## 🆘 Need Help?

- **[Troubleshooting](./troubleshooting/)** - Common issues
- **[Contributing Guide](./governance/CONTRIBUTING.md)** - How to contribute

---

**See Also:**
- [Main README](../README.md)
- [Project Status](../STATUS_AND_NEXT_STEPS.md)
