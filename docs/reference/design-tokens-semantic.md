# Semantic Color Tokens

Fragment UI provides semantic color tokens for status indicators (success, error, warning, info) that work across all themes (light, dark, high-contrast).

## Overview

Semantic color tokens provide a consistent way to communicate status and feedback across your application. Each status type includes multiple color variants:

- **base** - Primary status color
- **bg** - Background color for status containers
- **fg** - Foreground/text color for status content
- **border** - Border color for status elements
- **muted** - Muted variant for secondary status indicators

## Available Status Colors

### Success
- `--color-status-success-base` - Green primary color
- `--color-status-success-bg` - Light green background (light theme) / dark green (dark theme)
- `--color-status-success-fg` - Dark green text (light theme) / light green (dark theme)
- `--color-status-success-border` - Subtle green border
- `--color-status-success-muted` - Muted green variant

### Error
- `--color-status-error-base` - Red primary color
- `--color-status-error-bg` - Light red background (light theme) / dark red (dark theme)
- `--color-status-error-fg` - Dark red text (light theme) / light red (dark theme)
- `--color-status-error-border` - Subtle red border
- `--color-status-error-muted` - Muted red variant

### Warning
- `--color-status-warning-base` - Amber primary color
- `--color-status-warning-bg` - Light amber background (light theme) / dark amber (dark theme)
- `--color-status-warning-fg` - Dark amber text (light theme) / light amber (dark theme)
- `--color-status-warning-border` - Subtle amber border
- `--color-status-warning-muted` - Muted amber variant

### Info
- `--color-status-info-base` - Blue primary color
- `--color-status-info-bg` - Light blue background (light theme) / dark blue (dark theme)
- `--color-status-info-fg` - Dark blue text (light theme) / light blue (dark theme)
- `--color-status-info-border` - Subtle blue border
- `--color-status-info-muted` - Muted blue variant

## Usage

### CSS Variables

```css
/* Success alert */
.success-alert {
  background-color: var(--color-status-success-bg);
  color: var(--color-status-success-fg);
  border: 1px solid var(--color-status-success-border);
}

/* Error badge */
.error-badge {
  background-color: var(--color-status-error-base);
  color: white;
}

/* Warning banner */
.warning-banner {
  background-color: var(--color-status-warning-bg);
  color: var(--color-status-warning-fg);
}

/* Info message */
.info-message {
  background-color: var(--color-status-info-bg);
  color: var(--color-status-info-fg);
  border-left: 4px solid var(--color-status-info-base);
}
```

### In React Components

```tsx
// Using inline styles
<div
  style={{
    backgroundColor: "var(--color-status-success-bg)",
    color: "var(--color-status-success-fg)",
    border: "1px solid var(--color-status-success-border)",
    padding: "12px",
    borderRadius: "8px",
  }}
>
  Operation completed successfully!
</div>

// Using className with Tailwind/CSS
<div className="bg-[color:var(--color-status-error-bg)] text-[color:var(--color-status-error-fg)] border border-[color:var(--color-status-error-border)] p-3 rounded">
  Something went wrong
</div>
```

## Theme Support

Semantic color tokens automatically adapt to the current theme:

### Light Theme
- Success: Light green backgrounds with dark green text
- Error: Light red backgrounds with dark red text
- Warning: Light amber backgrounds with dark amber text
- Info: Light blue backgrounds with dark blue text

### Dark Theme
- Success: Dark green backgrounds with light green text
- Error: Dark red backgrounds with light red text
- Warning: Dark amber backgrounds with light amber text
- Info: Dark blue backgrounds with light blue text

### High Contrast Theme
- Maximum contrast colors for accessibility
- Bright, saturated colors on black background
- Clear visual distinction between status types

## Examples

### Alert Component

```tsx
function StatusAlert({ type, children }: { type: "success" | "error" | "warning" | "info"; children: React.ReactNode }) {
  const baseClass = `p-4 rounded-lg border`;
  const typeClasses = {
    success: "bg-[color:var(--color-status-success-bg)] text-[color:var(--color-status-success-fg)] border-[color:var(--color-status-success-border)]",
    error: "bg-[color:var(--color-status-error-bg)] text-[color:var(--color-status-error-fg)] border-[color:var(--color-status-error-border)]",
    warning: "bg-[color:var(--color-status-warning-bg)] text-[color:var(--color-status-warning-fg)] border-[color:var(--color-status-warning-border)]",
    info: "bg-[color:var(--color-status-info-bg)] text-[color:var(--color-status-info-fg)] border-[color:var(--color-status-info-border)]",
  };
  
  return (
    <div className={`${baseClass} ${typeClasses[type]}`}>
      {children}
    </div>
  );
}
```

### Badge Component

```tsx
function StatusBadge({ type, children }: { type: "success" | "error" | "warning" | "info"; children: React.ReactNode }) {
  const baseClass = `px-2 py-1 rounded text-sm font-medium`;
  const typeClasses = {
    success: "bg-[color:var(--color-status-success-base)] text-white",
    error: "bg-[color:var(--color-status-error-base)] text-white",
    warning: "bg-[color:var(--color-status-warning-base)] text-white",
    info: "bg-[color:var(--color-status-info-base)] text-white",
  };
  
  return (
    <span className={`${baseClass} ${typeClasses[type]}`}>
      {children}
    </span>
  );
}
```

### Progress Indicator

```tsx
function StatusProgress({ type, value }: { type: "success" | "error" | "warning" | "info"; value: number }) {
  const colors = {
    success: "var(--color-status-success-base)",
    error: "var(--color-status-error-base)",
    warning: "var(--color-status-warning-base)",
    info: "var(--color-status-info-base)",
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${value}%`,
          backgroundColor: colors[type],
        }}
      />
    </div>
  );
}
```

## Best Practices

1. **Consistency** - Use semantic colors consistently across your application
2. **Accessibility** - Ensure sufficient contrast between text and background
3. **Meaning** - Use colors that match user expectations (green = success, red = error)
4. **Theme Awareness** - Semantic tokens automatically adapt to themes, but test in all themes
5. **Context** - Consider the context when choosing between `base`, `bg`, `fg`, or `muted` variants

## Color Values

### Light Theme
- Success base: `#22C55E` (green)
- Error base: `#EF4444` (red)
- Warning base: `#F59E0B` (amber)
- Info base: `#3B82F6` (blue)

### Dark Theme
- Success base: `#22C55E` (green)
- Error base: `#EF4444` (red)
- Warning base: `#F59E0B` (amber)
- Info base: `#3B82F6` (blue)

Note: Base colors remain the same across themes for consistency, while background, foreground, and border colors adapt to provide optimal contrast.

---

*Last Updated: 2024-11-04*

