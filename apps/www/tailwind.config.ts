import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/blocks/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /**
       * Map semantic Tailwind color names to Fragment UI design tokens.
       * This ensures classes like `text-muted-foreground`, `bg-background`,
       * `border-brand`, `ring-brand`, etc. all resolve to DS tokens.
       */
      colors: {
        background: "var(--color-bg-base)",
        foreground: "var(--color-fg-base)",
        brand: "var(--color-brand-primary)",
        border: "var(--color-border-base)",
        "border-muted": "var(--color-border-muted)",
        "muted-foreground": "var(--color-fg-muted)",

        // Status (semantic colors)
        "status-success-fg": "var(--color-status-success-fg)",
        "status-success-bg": "var(--color-status-success-bg)",
        "status-success-border": "var(--color-status-success-border)",

        "status-error-fg": "var(--color-status-error-fg)",
        "status-error-bg": "var(--color-status-error-bg)",
        "status-error-border": "var(--color-status-error-border)",

        "status-warning-fg": "var(--color-status-warning-fg)",
        "status-warning-bg": "var(--color-status-warning-bg)",
        "status-warning-border": "var(--color-status-warning-border)",

        "status-info-fg": "var(--color-status-info-fg)",
        "status-info-bg": "var(--color-status-info-bg)",
        "status-info-border": "var(--color-status-info-border)",
      },
    },
  },
} satisfies Config;

