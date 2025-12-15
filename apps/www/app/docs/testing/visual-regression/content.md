---
title: Visual Regression Testing with Chromatic
---

Fragment UI uses Chromatic for automated visual regression testing to catch unintended
visual changes across components.

## Overview

Chromatic automatically:

- Captures screenshots of all Storybook stories
- Compares them against baseline images
- Detects visual differences between versions
- Provides a visual review interface for PRs
- Tracks component changes over time

## How It Works

### Automatic Testing

1. **On Pull Requests:** Chromatic runs automatically and comments on PRs with
   visual changes
2. **On Main Branch:** Chromatic updates baseline images and runs tests
3. **Visual Diffs:** Screenshots are compared pixel-by-pixel with configurable
   thresholds

### Configuration

Visual regression tests are configured in:

- `packages/ui/.storybook/preview.ts` - Global Chromatic parameters
- `packages/ui/.storybook/chromatic.config.ts` - Chromatic-specific configuration
- `.github/workflows/chromatic.yml` - CI/CD workflow

### Viewports

Components are tested across multiple viewports:

- **Mobile:** 320px × 568px
- **Tablet:** 768px × 1024px
- **Desktop:** 1024px × 768px
- **Large Desktop:** 1440px × 900px

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

```typescript
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

```typescript
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

## Diff Thresholds

The diff threshold determines how sensitive Chromatic is to visual changes. Lower values
mean more strict comparison:

- **0.0 - 0.1:** Very strict (catches minor changes)
- **0.1 - 0.2:** Standard (default: 0.2)
- **0.2 - 0.5:** Relaxed (catches major changes only)

## Best Practices

- **Review all changes:** Always review visual diffs before approving
- **Use appropriate thresholds:** Adjust thresholds per story if needed
- **Ignore dynamic content:** Use ignore regions for timestamps, IDs, etc.
- **Test all themes:** Ensure components work in light, dark, and high-contrast
- **Test all viewports:** Verify responsive behavior across screen sizes

## Troubleshooting

### False Positives

If Chromatic detects changes that aren't real:

- Check if animations are paused
- Verify dynamic content is ignored
- Adjust diff threshold if needed

### Missing Screenshots

If screenshots aren't being generated:

- Verify Storybook is building correctly
- Check Chromatic workflow in GitHub Actions
- Ensure Chromatic token is configured

## Links

- [Test Guide](/docs/testing/test-guide)
- [Performance Tests](/docs/testing/performance-tests)
- [Chromatic Dashboard](https://www.chromatic.com)

