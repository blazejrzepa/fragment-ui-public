# 📝 Component Implementation Guide

## Quick Start Checklist

When implementing a new component, follow this checklist:

### 1. Create Component File
- [ ] Create `packages/ui/src/[component-name].tsx`
- [ ] Export component with proper TypeScript types
- [ ] Follow existing component patterns

### 2. Add to Index
- [ ] Export from `packages/ui/src/index.ts`
- [ ] Verify export works

### 3. Create Stories
- [ ] Create `packages/ui/src/[component-name].stories.tsx`
- [ ] Add multiple variants/examples
- [ ] Add documentation (if needed)

### 4. Create Tests
- [ ] Create `packages/ui/src/[component-name].test.tsx`
- [ ] Add unit tests (rendering, interactions, accessibility)
- [ ] Ensure all tests pass

### 5. Add Styles
- [ ] Use design tokens (no hardcoded values)
- [ ] Ensure responsive design
- [ ] Test dark mode (if applicable)

### 6. Documentation
- [ ] Create `apps/www/app/docs/components/[component-name]/page.tsx`
- [ ] Add usage examples
- [ ] Add API reference
- [ ] Add Storybook link

### 7. Registry
- [ ] Add entry to `packages/registry/registry.json`
- [ ] Run `pnpm registry:generate`
- [ ] Verify JSON file created in `apps/www/public/r/`

### 8. Final Checks
- [ ] Component works in Storybook
- [ ] Component works in docs
- [ ] Component installs via registry
- [ ] Accessibility passes (A11y addon)
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Mobile responsive

## File Structure

```
packages/ui/src/
├── [component-name].tsx          # Component implementation
├── [component-name].stories.tsx  # Storybook stories
└── [component-name].test.tsx     # Unit tests

apps/www/app/docs/components/
└── [component-name]/
    └── page.tsx                  # Documentation page

apps/www/public/r/
└── [component-name].json         # Registry file (auto-generated)
```

## Component Template

```typescript
// packages/ui/src/slider.tsx
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
      <SliderPrimitive.Range className="absolute h-full bg-[color:var(--color-brand-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-1)] ring-offset-[color:var(--color-surface-1)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
```

## Story Template

```typescript
// packages/ui/src/slider.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Core/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
  },
};

export const WithSteps: Story = {
  args: {
    defaultValue: [25],
    max: 100,
    step: 25,
    marks: true,
  },
};
```

## Test Template

```typescript
// packages/ui/src/slider.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders", () => {
    render(<Slider defaultValue={[50]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });

  it("handles value changes", async () => {
    const handleChange = vi.fn();
    render(<Slider defaultValue={[50]} onValueChange={handleChange} />);
    // Add interaction tests
  });

  // Add more tests...
});
```

## Documentation Page Template

```typescript
// apps/www/app/docs/components/slider/page.tsx
import { StorybookLink } from "../../../../src/components/storybook-link";

export default function SliderPage() {
  return (
    <article>
      <h1>Slider</h1>
      <p>Description...</p>
      
      <h2>Examples</h2>
      {/* Examples here */}
      
      <h2>API</h2>
      {/* API docs */}
      
      <h2>Links</h2>
      <ul>
        <li><StorybookLink path="/docs/core-slider--docs">View in Storybook</StorybookLink></li>
      </ul>
    </article>
  );
}
```

## Common Patterns

### Using Design Tokens
```typescript
// ✅ Good
className="bg-[color:var(--color-surface-1)]"

// ❌ Bad
className="bg-white"
```

### Forwarding Ref
```typescript
const Component = React.forwardRef<RefType, Props>(
  ({ className, ...props }, ref) => (
    // implementation
  )
);
Component.displayName = "Component";
```

### Variants with clsx
```typescript
import { cn } from "./lib/utils";

const variants = {
  variant: {
    default: "default-classes",
    outline: "outline-classes",
  },
  size: {
    sm: "sm-classes",
    md: "md-classes",
  },
};
```

## Testing Best Practices

1. **Accessibility First**
   - Use `getByRole` when possible
   - Test keyboard navigation
   - Test screen readers

2. **Interaction Tests**
   - Test user interactions (click, type, etc.)
   - Test state changes
   - Test edge cases

3. **Visual Regression**
   - Chromatic will catch visual changes
   - Ensure stories cover all variants

## Need Help?

- Check existing components for patterns
- Review Storybook examples
- See `button.tsx` for a complete example
- Check tests in `button.test.tsx`

