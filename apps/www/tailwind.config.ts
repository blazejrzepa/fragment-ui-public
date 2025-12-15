import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/blocks/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
} satisfies Config;

