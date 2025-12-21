import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../blocks/src/**/*.{ts,tsx}",
    "../../apps/www/src/**/*.{ts,tsx}",
    "../../apps/demo/src/**/*.{ts,tsx}",
  ],
  safelist: [
    "rounded-[var(--radius-sm)]",
    "rounded-[var(--radius-md)]",
    "rounded-[var(--radius-lg)]",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand-primary)",
          600: "var(--color-brand-primary-600)",
        },
        fg: {
          DEFAULT: "var(--color-fg-base)",
          muted: "var(--color-fg-muted)",
        },
        border: {
          DEFAULT: "var(--color-border-base)",
          muted: "var(--color-border-muted)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontSize: {
        // Display styles
        "display-2xl": ["72px", { lineHeight: "110%", letterSpacing: "-1.44px" }],
        "display-xl": ["60px", { lineHeight: "110%", letterSpacing: "-1.2px" }],
        "display-lg": ["48px", { lineHeight: "110%", letterSpacing: "-0.96px" }],
        "display-md": ["36px", { lineHeight: "110%", letterSpacing: "-0.72px" }],
        "display-sm": ["24px", { lineHeight: "110%" }], // zaktualizowane z 30px
        "display-xs": ["20px", { lineHeight: "110%" }], // zaktualizowane z 24px
        // Text styles
        "text-2xl": ["22px", { lineHeight: "150%" }],
        "text-xl": ["20px", { lineHeight: "150%" }],
        "text-lg": ["18px", { lineHeight: "150%" }],
        "text-md": ["16px", { lineHeight: "160%" }],
        "text-sm": ["14px", { lineHeight: "160%" }],
        "text-xs": ["12px", { lineHeight: "160%" }],
      },
      fontFamily: {
        sans: ["var(--typography-font-sans)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 1px rgba(0,0,0,.05)",
      },
    },
  },
} satisfies Config;

