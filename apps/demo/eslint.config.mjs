/**
 * ESLint Configuration for Copilot Playground
 * 
 * Includes custom rules for Design System enforcement:
 * - no-raw-elements: Ban raw HTML elements
 * - design-system-imports-only: Only import from @fragment_ui/ui
 * - no-inline-hardcoded-colors: Use design tokens
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load custom Design System ESLint rules
const DS_RULES_DIR = join(__dirname, "../../tooling/lint");
const noRawElementsRule = require(join(DS_RULES_DIR, "eslint-no-raw-elements.js"));
const designSystemImportsRule = require(join(DS_RULES_DIR, "eslint-design-system-imports-only.js"));
const noHardcodedColorsRule = require(join(DS_RULES_DIR, "eslint-no-inline-hardcoded-colors.js"));
const noUncontractedActionsRule = require(join(DS_RULES_DIR, "eslint-no-uncontracted-actions.js"));

// Load TypeScript parser (required for TS/TSX files)
const tsParser = require("@typescript-eslint/parser");

export default [
  {
    ignores: ["**/*.config.*", "**/node_modules/**", "**/.next/**", "**/dist/**"],
  },
  {
    // Base rules for all files
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: join(__dirname, "tsconfig.json"),
      },
    },
    rules: {
      // Allow console.log in demo app (not production code)
      "no-console": "off",
    },
  },
  {
    // Design System rules for UI components only (not API routes, layouts, or demo pages)
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "**/api/**",
      "**/route.ts",
      "**/route.tsx",
      "**/layout.tsx",
      "**/page.tsx",
      "**/runtime/**",
      "**/worker.*",
      "**/error-boundary.tsx", // Error boundary - may need special handling
      "**/theme-provider.tsx", // Theme provider - uses lucide-react icons
      "**/scripts/**", // Scripts - not UI components
      "**/*-renderer.tsx", // Renderers - may use raw HTML for demo purposes
      "**/same-origin-preview.tsx", // Preview component - may use raw HTML
      "**/playground/**", // Playground components - may use raw HTML for demo purposes
      "**/quality/**", // Quality dashboard components - existing UI, not generated
      "**/ai-prompt-input.tsx", // Existing UI component
      "**/demo-list.tsx", // Existing UI component
      "**/test-eslint-rule.tsx", // Test file - intentionally has errors
      "**/__tests__/**", // Test files - may import test libraries
      "**/*.test.ts", // Test files
      "**/*.test.tsx", // Test files
    ],
    plugins: {
      "ds-no-raw": {
        rules: {
          "no-raw-elements": noRawElementsRule,
        },
      },
      "ds-imports-only": {
        rules: {
          "design-system-imports-only": designSystemImportsRule,
        },
      },
      "ds-no-hardcolors": {
        rules: {
          "no-inline-hardcoded-colors": noHardcodedColorsRule,
        },
      },
      "axl-no-uncontracted": {
        rules: {
          "no-uncontracted-actions": noUncontractedActionsRule,
        },
      },
    },
    rules: {
      // Design System rules - enforce as errors for UI components
      "ds-no-raw/no-raw-elements": "error",
      "ds-imports-only/design-system-imports-only": [
        "error",
        {
          allowed: ["^lucide-react$", "^vitest$", "^@testing-library/"], // Allow lucide-react for icons, vitest and testing-library for tests
          forbidden: {}, // Override forbidden to allow lucide-react and test libraries
        },
      ],
      "ds-no-hardcolors/no-inline-hardcoded-colors": "error",
      "axl-no-uncontracted/no-uncontracted-actions": "error",
    },
  },
  {
    // Allow console.log in runtime files, API routes, logger files, and hooks (for debugging)
    files: ["**/runtime/**", "**/worker.*", "**/api/**", "**/route.ts", "**/route.tsx", "**/logger.ts", "**/server-logger.ts", "**/hooks/**"],
    rules: {
      "no-console": "off",
    },
  },
];

