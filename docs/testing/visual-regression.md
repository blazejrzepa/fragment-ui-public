# Visual Regression Testing with Chromatic

Fragment UI uses Chromatic for automated visual regression testing to catch unintended visual changes across components.

## Overview

Chromatic automatically:
- Captures screenshots of all Storybook stories
- Compares them against baseline images
- Detects visual differences between versions
- Provides a visual review interface for PRs
- Tracks component changes over time

## How It Works

### Automatic Testing

1. **On Pull Requests**: Chromatic runs automatically and comments on PRs with visual changes
2. **On Main Branch**: Chromatic updates baseline images and runs tests
3. **Visual Diffs**: Screenshots are compared pixel-by-pixel with configurable thresholds

### Configuration

Visual regression tests are configured in:
- `.storybook/preview.ts` - Global Chromatic parameters
- `.storybook/chromatic.config.ts` - Chromatic-specific configuration
- `.github/workflows/chromatic.yml` - CI/CD workflow

### Viewports

Components are tested across multiple viewports:
- **Mobile**: 320px × 568px
- **Tablet**: 768px × 1024px
- **Desktop**: 1024px × 768px
- **Large Desktop**: 1440px × 900px

### Themes

Visual tests run across different themes:
- **Light** theme (default)
- **Dark** theme
- **High Contrast** theme

## Viewing Results

### In GitHub PRs

When Chromatic detects visual changes:
1. A comment is automatically added to the PR
2. Click "Review changes" to see visual diffs
3. Approve or request changes
4. PR cannot be merged until visual changes are approved

### In Chromatic Dashboard

1. Go to [Chromatic Dashboard](https://www.chromatic.com)
2. Select your project
3. View build history and visual diffs
4. Compare versions side-by-side

## Story Configuration

### Per-Story Configuration

Override Chromatic settings for specific stories:

```tsx
export const MyStory: Story = {
  parameters: {
    chromatic: {
      // Only test specific viewports
      viewports: [768, 1024],
      // Use stricter diff threshold
      diffThreshold: 0.1,
      // Disable for this story
      disable: false,
      // Pause animations
      pauseAnimationAtEnd: true,
    },
  },
};
```

### Ignoring Dynamic Content

For components with dynamic content (timestamps, random IDs, etc.):

```tsx
export const MyStory: Story = {
  parameters: {
    chromatic: {
      ignore: {
        // Ignore by CSS selector
        selector: '.timestamp',
        // Or by pixel coordinates
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },
};
```

### Testing Multiple Themes

Test stories across different themes:

```tsx
export const MyStory: Story = {
  parameters: {
    chromatic: {
      modes: {
        light: { dataTheme: "light" },
        dark: { dataTheme: "dark" },
        "high-contrast": { dataTheme: "high-contrast" },
      },
    },
  },
};
```

## Best Practices

### 1. Stable Screenshots

- **Disable animations**: Use `pauseAnimationAtEnd: true` for animated components
- **Fix dynamic content**: Use `ignore` for timestamps, random IDs, etc.
- **Wait for async content**: Use Chromatic's `delay` parameter if needed

### 2. Appropriate Thresholds

- **Default**: `0.2` (20% pixel difference allowed)
- **Strict components**: `0.1` for critical UI elements
- **Lenient**: `0.3` for components with subtle variations

### 3. Viewport Testing

- Test all relevant viewports for responsive components
- Focus on breakpoints that matter for your components
- Consider mobile-first components that only need mobile viewport

### 4. Theme Testing

- Test critical components across all themes
- Focus on components that heavily use color tokens
- Ensure contrast and readability in all themes

## Troubleshooting

### False Positives

If Chromatic reports changes that aren't meaningful:

1. **Check diff threshold**: Increase if too sensitive
2. **Ignore regions**: Add selectors for dynamic content
3. **Review actual changes**: Some visual changes might be intentional

### Missing Screenshots

If stories aren't being captured:

1. **Check story format**: Ensure stories follow Storybook format
2. **Verify viewports**: Ensure viewports are configured
3. **Check errors**: Review Chromatic build logs

### Build Failures

If Chromatic builds fail:

1. **Check Storybook build**: Ensure `pnpm storybook:build` works locally
2. **Verify dependencies**: Ensure all dependencies are installed
3. **Check token**: Verify `CHROMATIC_PROJECT_TOKEN` is set in GitHub Secrets

## CI/CD Integration

### Workflow Configuration

The Chromatic workflow (`.github/workflows/chromatic.yml`) is configured to:
- Run on pushes to `main` branch
- Run on pull requests (opened, synchronized, reopened)
- Auto-accept changes on `main` branch
- Skip on feature branches (except main)

### Manual Testing

Run Chromatic locally:

```bash
# Install Chromatic CLI
pnpm add -D chromatic

# Run Chromatic (requires project token)
npx chromatic --project-token=YOUR_TOKEN
```

## Configuration Options

### Global Configuration

Edit `.storybook/chromatic.config.ts`:

```typescript
{
  viewports: [320, 768, 1024, 1440],
  diffThreshold: 0.2,
  diffIncludeAntiAliasing: true,
  pauseAnimationAtEnd: true,
  modes: {
    light: { dataTheme: "light" },
    dark: { dataTheme: "dark" },
  },
}
```

### Story-Level Configuration

Override in story parameters:

```tsx
parameters: {
  chromatic: {
    viewports: [768, 1024],
    diffThreshold: 0.1,
    disable: false,
  },
}
```

## Resources

- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Visual Testing Guide](https://www.chromatic.com/docs/visual-testing)
- [Storybook Configuration](https://storybook.js.org/docs/react/configure/overview)

---

*Last Updated: 2024-11-04*

