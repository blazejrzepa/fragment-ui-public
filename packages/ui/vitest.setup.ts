// IMPORTANT: Set up mocks BEFORE any imports that might use them
// Mock HTMLCanvasElement.getContext for jsdom (required by axe-core)
// This must be done before axe-core is imported
if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: function getContext(contextType: string) {
      if (contextType === "2d") {
        return {
          fillText: () => {},
          measureText: () => ({ width: 0 }),
          getImageData: () => ({ data: new Uint8ClampedArray(4) }),
          canvas: this,
        };
      }
      return null;
    },
    writable: true,
    configurable: true,
  });
}

import "@testing-library/jest-dom";
import { expect, afterEach, afterAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { configureAxe } from "vitest-axe";
import "./src/styles.css";

// Mock ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = () => {};

// Configure axe with rules disabled that require full browser rendering
// These rules need canvas/getComputedStyle features not available in jsdom
export const axe = configureAxe({
  rules: {
    // Disable color-contrast rule as it requires canvas/getComputedStyle
    "color-contrast": { enabled: false },
    // Disable other rules that require rendering
    "color-contrast-enhanced": { enabled: false },
  },
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear all timers to prevent tests from hanging (especially HoverCard with delays)
  vi.clearAllTimers();
  vi.clearAllMocks();
});

// Global cleanup after all tests
afterAll(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
  cleanup();
  
  // Note: In CI, we use a wrapper script (run-tests-ci.sh) to handle process exit
  // This is because process.exit doesn't work reliably in forked processes
  // The wrapper script monitors the test process and forces exit if needed
});


