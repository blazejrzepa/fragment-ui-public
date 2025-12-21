# Fragment UI - Best Practices Guide

Comprehensive guide for using Fragment UI components effectively and following best practices.

## Table of Contents

1. [Component Usage Patterns](#component-usage-patterns)
2. [Performance Best Practices](#performance-best-practices)
3. [Accessibility Guidelines](#accessibility-guidelines)
4. [Design Patterns](#design-patterns)
5. [Common Pitfalls](#common-pitfalls)
6. [Code Organization](#code-organization)
7. [Testing Best Practices](#testing-best-practices)

---

## Component Usage Patterns

### 1. Import Only What You Need

**✅ Good:**
```tsx
import { Button } from "@fragment_ui/ui/button";
import { Input } from "@fragment_ui/ui/input";
```

**❌ Avoid:**
```tsx
import * from "@fragment_ui/ui"; // Imports everything
```

### 2. Use Semantic HTML

**✅ Good:**
```tsx
<Button asChild>
  <a href="/about">About</a>
</Button>
```

**❌ Avoid:**
```tsx
<Button onClick={() => window.location.href = "/about"}>
  About
</Button>
```

### 3. Proper Form Handling

**✅ Good:**
```tsx
import { FormEnhanced } from "@fragment_ui/ui/form-enhanced";

function MyForm() {
  return (
    <FormEnhanced
      onSubmit={async (data) => {
        await submitForm(data);
      }}
      validation={{
        email: {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        },
      }}
    >
      {/* form fields */}
    </FormEnhanced>
  );
}
```

### 4. Component Composition

**✅ Good:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

---

## Performance Best Practices

### 1. Lazy Loading

**✅ Good:**
```tsx
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Virtual Scrolling for Large Lists

**✅ Good:**
```tsx
import { VirtualList } from "@fragment_ui/ui/virtual-list";

function LargeList({ items }) {
  return (
    <VirtualList
      data={items}
      renderItem={(item) => <ListItem item={item} />}
      itemHeight={50}
      containerHeight={400}
    />
  );
}
```

### 3. Memoization

**✅ Good:**
```tsx
import { useMemo } from "react";

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
}
```

### 4. Code Splitting

Use dynamic imports for routes and heavy components:

```tsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
```

---

## Accessibility Guidelines

### 1. Always Provide Labels

**✅ Good:**
```tsx
<Input
  id="email"
  label="Email Address"
  aria-label="Email address input"
  aria-describedby="email-error"
/>
```

### 2. Keyboard Navigation

All interactive components support keyboard navigation. Ensure focus management:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    {/* Dialog automatically manages focus */}
  </DialogContent>
</Dialog>
```

### 3. ARIA Attributes

Components include proper ARIA attributes. Don't override them unless necessary:

**✅ Good:**
```tsx
<Button aria-label="Close dialog">×</Button>
```

**❌ Avoid:**
```tsx
<Button role="button" aria-role="button">×</Button> // Redundant
```

### 4. Color Contrast

Always ensure sufficient color contrast. Fragment UI components meet WCAG 2.1 AA standards by default.

---

## Design Patterns

### 1. Compound Components

Use compound components for complex UI:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### 2. Controlled vs Uncontrolled

**Controlled (recommended for forms):**
```tsx
const [value, setValue] = useState("");

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Uncontrolled (for simple cases):**
```tsx
<Input defaultValue="initial" />
```

### 3. Render Props Pattern

Some components support render props:

```tsx
<DataTable
  data={users}
  columns={columns}
  renderRow={(row) => <CustomRow row={row} />}
/>
```

---

## Common Pitfalls

### 1. ❌ Not Handling Loading States

**❌ Bad:**
```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return users.map(user => <UserCard user={user} />);
}
```

**✅ Good:**
```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return users.map(user => <UserCard user={user} />);
}
```

### 2. ❌ Missing Error Handling

**✅ Good:**
```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError);
  }, []);

  if (error) return <Alert variant="error">{error.message}</Alert>;
  return users.map(user => <UserCard user={user} />);
}
```

### 3. ❌ Not Using Proper Form Validation

**✅ Good:**
```tsx
<FormEnhanced
  validation={{
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email",
      },
    },
  }}
>
  <Input name="email" type="email" />
</FormEnhanced>
```

### 4. ❌ Over-nesting Components

**❌ Bad:**
```tsx
<div>
  <div>
    <div>
      <Button>Click</Button>
    </div>
  </div>
</div>
```

**✅ Good:**
```tsx
<Button>Click</Button>
```

---

## Code Organization

### 1. Component Structure

Organize components by feature:

```
src/
├── components/
│   ├── ui/              # Fragment UI components
│   ├── features/        # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── settings/
│   └── layout/          # Layout components
├── lib/                 # Utilities
└── hooks/               # Custom hooks
```

### 2. Naming Conventions

- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase starting with `use` (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 3. File Organization

One component per file:

```
UserCard/
├── UserCard.tsx
├── UserCard.test.tsx
├── UserCard.stories.tsx
└── index.ts
```

---

## Testing Best Practices

### 1. Test User Interactions

**✅ Good:**
```tsx
import { render, screen, fireEvent } from "@testing-library/react";

test("button click triggers action", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalled();
});
```

### 2. Test Accessibility

**✅ Good:**
```tsx
import { axe, toHaveNoViolations } from "vitest-axe";

expect.extend(toHaveNoViolations);

test("component has no a11y violations", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 3. Test Edge Cases

Test empty states, loading states, error states:

```tsx
test("shows empty state when no data", () => {
  render(<DataTable data={[]} />);
  expect(screen.getByText("No data available")).toBeInTheDocument();
});
```

---

## Performance Optimization

### 1. Use React.memo for Expensive Components

```tsx
export const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Expensive rendering
});
```

### 2. Use useCallback for Event Handlers

```tsx
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### 3. Use useMemo for Expensive Calculations

```tsx
const sortedData = useMemo(() => {
  return data.sort(/* expensive sort */);
}, [data]);
```

---

## Theming Best Practices

### 1. Use CSS Variables

**✅ Good:**
```css
.custom-component {
  background: var(--color-surface-1);
  color: var(--color-fg-base);
}
```

### 2. Extend, Don't Override

**✅ Good:**
```tsx
<Button className="custom-button">Click</Button>
```

```css
.custom-button {
  /* Extend, don't override */
  padding: var(--space-4);
}
```

### 3. Use Semantic Colors

**✅ Good:**
```tsx
<Alert variant="success">Success message</Alert>
<Alert variant="error">Error message</Alert>
```

---

## Security Best Practices

### 1. Sanitize User Input

Always sanitize user input before rendering:

```tsx
import DOMPurify from "dompurify";

function SafeHTML({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

### 2. Validate on Client and Server

Client-side validation is for UX, server-side is for security:

```tsx
// Client-side (UX)
<FormEnhanced validation={clientValidation} />

// Server-side (Security)
await validateOnServer(data);
```

---

## Migration Best Practices

### 1. Gradual Migration

Migrate components gradually, not all at once:

```tsx
// Old component
import { OldButton } from "./old-components";

// New component
import { Button } from "@fragment_ui/ui/button";

// Use both during migration
function App() {
  return (
    <>
      <OldButton>Old</OldButton>
      <Button>New</Button>
    </>
  );
}
```

### 2. Test After Migration

Always test thoroughly after migrating components:

```tsx
// Before migration
test("old component works", () => { /* ... */ });

// After migration
test("new component works", () => { /* ... */ });
test("new component matches old behavior", () => { /* ... */ });
```

---

## Resources

- [Fragment UI Documentation](https://fragment-ui.dev)
- [Component API Reference](https://fragment-ui.dev/docs/api)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Best Practices](https://react.dev/learn)

---

*Last updated: 2025-01-05*

