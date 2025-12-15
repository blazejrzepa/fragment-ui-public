import * as React from "react";
import "../src/styles.css";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    a11y: {
      element: "#root",
    },
    // Chromatic visual regression testing configuration
    chromatic: {
      // Viewports to test for visual regression
      viewports: [320, 768, 1024, 1440],
      // Disable animations for consistent screenshots
      disable: false,
      // Pause animations at the end for stable screenshots
      pauseAnimationAtEnd: true,
      // Threshold for visual diff (0.0 to 1.0, lower = more strict)
      diffThreshold: 0.2,
      // Ignore regions (e.g., timestamps, dynamic content)
      diffIncludeAntiAliasing: true,
      // Test all viewports by default
      viewport: {
        viewports: {
          mobile: { width: 320, height: 568 },
          tablet: { width: 768, height: 1024 },
          desktop: { width: 1024, height: 768 },
          large: { width: 1440, height: 900 },
        },
      },
    },
    // Viewport configuration for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "320px", height: "568px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1024px", height: "768px" },
        },
        large: {
          name: "Large Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
    // Backgrounds for theme testing
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#FFFFFF",
        },
        {
          name: "dark",
          value: "#0B0B0C",
        },
      ],
    },
  },
  // Global decorators for theme testing
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      
      // Set theme on document root for CSS variables to work
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      // Also set background color on body
      document.body.style.backgroundColor = theme === "dark" ? "#0B0B0C" : "#FFFFFF";
      document.body.style.color = theme === "dark" ? "#EDEDF0" : "#0B0B0C";
      
      return React.createElement(
        "div",
        {
          "data-theme": theme,
          style: {
            minHeight: "100vh",
            padding: "1rem",
            backgroundColor: theme === "dark" ? "#0B0B0C" : "#FFFFFF",
            color: theme === "dark" ? "#EDEDF0" : "#0B0B0C",
          },
        },
        React.createElement(Story)
      );
    },
  ],
  // Global types for controls
  globalTypes: {
    theme: {
      description: "Theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "high-contrast", title: "High Contrast" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

