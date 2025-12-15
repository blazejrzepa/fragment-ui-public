import type { ChromaticConfig } from "@chromatic-com/storybook";

/**
 * Chromatic configuration for visual regression testing
 * 
 * This configuration controls how Chromatic captures and compares visual snapshots
 * of your components across different viewports, themes, and states.
 */
const chromaticConfig: ChromaticConfig = {
  // Viewports to test for visual regression
  viewports: [320, 768, 1024, 1440],

  // Visual diff threshold (0.0 to 1.0)
  // Lower = more strict, higher = more lenient
  diffThreshold: 0.2,

  // Include anti-aliasing in diff calculation
  diffIncludeAntiAliasing: true,

  // Pause animations at the end for stable screenshots
  pauseAnimationAtEnd: true,

  // Delay before capturing screenshots (ms)
  // Useful for components that need time to render
  delay: 0,

  // Test all viewports by default
  // Can be overridden per-story using parameters.chromatic.viewports
  testOnly: false,

  // Ignore regions for dynamic content
  // Use this for timestamps, random IDs, etc.
  ignore: {
    // Ignore regions specified as CSS selectors or pixel coordinates
    // Example: { selector: '.timestamp' } or { x: 0, y: 0, width: 100, height: 100 }
  },

  // Test modes (e.g., different themes, states)
  // Can be configured per-story using parameters.chromatic.modes
  modes: {
    light: {
      // Light theme configuration
      dataTheme: "light",
    },
    dark: {
      // Dark theme configuration
      dataTheme: "dark",
    },
    "high-contrast": {
      // High contrast theme configuration
      dataTheme: "high-contrast",
    },
  },

  // Story-specific overrides
  storyConfiguration: {
    // Example: Override specific stories
    // "Component--StoryName": {
    //   viewports: [768, 1024],
    //   diffThreshold: 0.1,
    // },
  },
};

export default chromaticConfig;

