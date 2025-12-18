// Build script in JavaScript (ESM) - no tsx required
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensPath = path.join(__dirname, "../src/tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));

const distDir = path.join(__dirname, "../dist");
const outCss = path.join(distDir, "tokens.css");
const outTs = path.join(distDir, "tokens.ts");

function toCssVars(obj, prefix = []) {
  return Object.entries(obj)
    .flatMap(([k, v]) => {
      const key = [...prefix, k];
      if (Array.isArray(v)) {
        // Skip arrays (like modes)
        return [];
      }
      // Skip color.light and color.dark as they're handled separately
      if (prefix[0] === "color" && (k === "light" || k === "dark")) {
        return [];
      }
      // Skip i18n.logical as it references other vars that we define manually
      if (prefix[0] === "i18n" && prefix[1] === "logical") {
        return [];
      }
      if (typeof v === "object" && v !== null) {
        return toCssVars(v, key);
      }
      // Determine if value needs unit or not
      let val;
      if (typeof v === "number") {
        // Don't add px to unitless values (multipliers, line-height, duration, weights)
        const fullKey = key.join("-");
        const needsUnit = !fullKey.includes("multiplier") && 
                          !fullKey.includes("line-height") && 
                          !fullKey.includes("duration") &&
                          !fullKey.includes("weight");
        
        // Duration should be in ms
        if (fullKey.includes("duration")) {
          val = `${v}ms`;
        } else if (needsUnit) {
          val = `${v}px`;
        } else {
          val = String(v);
        }
      } else {
        val = String(v);
      }
      return `  --${key.join("-")}: ${val};`;
    })
    .join("\n");
}

function toThemeCssVars(obj, prefix = []) {
  return Object.entries(obj)
    .flatMap(([k, v]) => {
      const key = [...prefix, k];
      if (typeof v === "object" && v !== null) {
        return toThemeCssVars(v, key);
      }
      // Convert color.light.bg.base -> --color-bg-base
      // and color.dark.bg.base -> --color-bg-base (in [data-theme="dark"])
      // Remove first two elements (color, light/dark) to get the path
      const varKey = key.slice(2).join("-"); // Remove "color" and theme prefix
      return `  --color-${varKey}: ${v};`;
    })
    .join("\n");
}

const lightColors = tokens.color.light || {};
const darkColors = tokens.color.dark || {};
const highContrastColors = tokens.color["high-contrast"] || {};

const css = `:root {
${toCssVars(tokens)}
  /* Logical properties for i18n/RTL support */
  --i18n-logical-start: left;
  --i18n-logical-end: right;
  --i18n-border-start: border-left;
  --i18n-border-end: border-right;
  --i18n-margin-start: margin-left;
  --i18n-margin-end: margin-right;
  --i18n-padding-start: padding-left;
  --i18n-padding-end: padding-right;

  /* Active density defaults (normal) */
  --density-space-multiplier: ${tokens.density.normal.space.multiplier};
  --density-space-base: ${tokens.density.normal.space.base}px;
  --density-typography-line-height: ${tokens.density.normal.typography["line-height"]};
  --density-typography-size-multiplier: ${tokens.density.normal.typography["size-multiplier"]};
  --density-component-height-multiplier: ${tokens.density.normal.component["height-multiplier"]};
  --density-component-padding-multiplier: ${tokens.density.normal.component["padding-multiplier"]};
}

/* Light theme (default) */
:root,
[data-theme="light"] {
${toThemeCssVars(lightColors, ["color", "light"])}
  /* Legacy tokens - aliases for backward compatibility */
  --background-primary: var(--color-bg-base);
  --foreground-primary: var(--color-fg-base);
  --background-secondary: var(--color-bg-inverse);
  --foreground-secondary: var(--color-fg-muted);
}

/* Dark theme */
[data-theme="dark"] {
${toThemeCssVars(darkColors, ["color", "dark"])}
  /* Legacy tokens - aliases for backward compatibility */
  --background-primary: var(--color-bg-base);
  --foreground-primary: var(--color-fg-base);
  --background-secondary: var(--color-bg-inverse);
  --foreground-secondary: var(--color-fg-muted);
}

/* Auto dark mode based on system preference - only when no explicit theme is set */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]):not([data-theme="high-contrast"]) {
${toThemeCssVars(darkColors, ["color", "dark"])}
    /* Legacy tokens - aliases for backward compatibility */
    --background-primary: var(--color-bg-base);
    --foreground-primary: var(--color-fg-base);
    --background-secondary: var(--color-bg-inverse);
    --foreground-secondary: var(--color-fg-muted);
  }
}

/* Auto light mode based on system preference - only when no explicit theme is set */
@media (prefers-color-scheme: light) {
  :root:not([data-theme="light"]):not([data-theme="dark"]):not([data-theme="high-contrast"]) {
${toThemeCssVars(lightColors, ["color", "light"])}
    /* Legacy tokens - aliases for backward compatibility */
    --background-primary: var(--color-bg-base);
    --foreground-primary: var(--color-fg-base);
    --background-secondary: var(--color-bg-inverse);
    --foreground-secondary: var(--color-fg-muted);
  }
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --color-bg-base: ${highContrastColors.bg?.base || "#000000"};
  --color-bg-inverse: ${highContrastColors.bg?.inverse || "#1a1a1a"};
  --color-fg-base: ${highContrastColors.fg?.base || "#FFFFFF"};
  --color-fg-muted: ${highContrastColors.fg?.muted || "#CCCCCC"};
  /* Legacy tokens - aliases for backward compatibility */
  --background-primary: var(--color-bg-base);
  --foreground-primary: var(--color-fg-base);
  --background-secondary: var(--color-bg-inverse);
  --foreground-secondary: var(--color-fg-muted);
  --color-bg-inverse: ${highContrastColors.bg?.inverse || "#FFFFFF"};
  --color-fg-base: ${highContrastColors.fg?.base || "#FFFFFF"};
  --color-fg-muted: ${highContrastColors.fg?.muted || "#CCCCCC"};
  --color-brand-primary: ${tokens.color.dark?.brand?.primary || tokens.color.light?.brand?.primary || "#6B8CFF"};
  --color-brand-primary-600: ${tokens.color.dark?.brand?.["primary-600"] || tokens.color.light?.brand?.["primary-600"] || "#5B7AF0"};
  --color-button-solid-bg: ${highContrastColors.button?.solid?.bg || tokens.color.dark?.button?.solid?.bg || tokens.color.light?.button?.solid?.bg || "#F4F4F5"};
  --color-button-solid-hover: ${highContrastColors.button?.solid?.hover || tokens.color.dark?.button?.solid?.hover || tokens.color.light?.button?.solid?.hover || "#E4E4E7"};
  --color-button-solid-text: ${highContrastColors.button?.solid?.text || tokens.color.dark?.button?.solid?.text || tokens.color.light?.button?.solid?.text || "#0a0a0a"};
  --color-surface-1: ${tokens.color.dark?.surface?.["1"] || "#121214"};
  --color-surface-2: ${tokens.color.dark?.surface?.["2"] || "#19191B"};
  --color-accent-green: ${highContrastColors.accent?.green || tokens.color.dark?.accent?.green || tokens.color.light?.accent?.green || "#22C55E"};
  --color-accent-red: ${highContrastColors.accent?.red || tokens.color.dark?.accent?.red || tokens.color.light?.accent?.red || "#EF4444"};
  --color-border-base: ${highContrastColors.border || "#FFFFFF"};
  --color-border-muted: ${highContrastColors.border || "#FFFFFF"};
  --color-status-success-base: ${highContrastColors.status?.success?.base || tokens.color.dark?.status?.success?.base || tokens.color.light?.status?.success?.base || "#22C55E"};
  --color-status-success-bg: ${highContrastColors.status?.success?.bg || tokens.color.dark?.status?.success?.bg || tokens.color.light?.status?.success?.bg || "#000000"};
  --color-status-success-fg: ${highContrastColors.status?.success?.fg || tokens.color.dark?.status?.success?.fg || tokens.color.light?.status?.success?.fg || "#00FF00"};
  --color-status-success-border: ${highContrastColors.status?.success?.border || tokens.color.dark?.status?.success?.border || tokens.color.light?.status?.success?.border || "#00FF00"};
  --color-status-success-muted: ${highContrastColors.status?.success?.muted || tokens.color.dark?.status?.success?.muted || tokens.color.light?.status?.success?.muted || "#00FF00"};
  --color-status-error-base: ${highContrastColors.status?.error?.base || tokens.color.dark?.status?.error?.base || tokens.color.light?.status?.error?.base || "#EF4444"};
  --color-status-error-bg: ${highContrastColors.status?.error?.bg || tokens.color.dark?.status?.error?.bg || tokens.color.light?.status?.error?.bg || "#000000"};
  --color-status-error-fg: ${highContrastColors.status?.error?.fg || tokens.color.dark?.status?.error?.fg || tokens.color.light?.status?.error?.fg || "#FF0000"};
  --color-status-error-border: ${highContrastColors.status?.error?.border || tokens.color.dark?.status?.error?.border || tokens.color.light?.status?.error?.border || "#FF0000"};
  --color-status-error-muted: ${highContrastColors.status?.error?.muted || tokens.color.dark?.status?.error?.muted || tokens.color.light?.status?.error?.muted || "#FF0000"};
  --color-status-warning-base: ${highContrastColors.status?.warning?.base || tokens.color.dark?.status?.warning?.base || tokens.color.light?.status?.warning?.base || "#F59E0B"};
  --color-status-warning-bg: ${highContrastColors.status?.warning?.bg || tokens.color.dark?.status?.warning?.bg || tokens.color.light?.status?.warning?.bg || "#000000"};
  --color-status-warning-fg: ${highContrastColors.status?.warning?.fg || tokens.color.dark?.status?.warning?.fg || tokens.color.light?.status?.warning?.fg || "#FFFF00"};
  --color-status-warning-border: ${highContrastColors.status?.warning?.border || tokens.color.dark?.status?.warning?.border || tokens.color.light?.status?.warning?.border || "#FFFF00"};
  --color-status-warning-muted: ${highContrastColors.status?.warning?.muted || tokens.color.dark?.status?.warning?.muted || tokens.color.light?.status?.warning?.muted || "#FFFF00"};
  --color-status-info-base: ${highContrastColors.status?.info?.base || tokens.color.dark?.status?.info?.base || tokens.color.light?.status?.info?.base || "#3B82F6"};
  --color-status-info-bg: ${highContrastColors.status?.info?.bg || tokens.color.dark?.status?.info?.bg || tokens.color.light?.status?.info?.bg || "#000000"};
  --color-status-info-fg: ${highContrastColors.status?.info?.fg || tokens.color.dark?.status?.info?.fg || tokens.color.light?.status?.info?.fg || "#00FFFF"};
  --color-status-info-border: ${highContrastColors.status?.info?.border || tokens.color.dark?.status?.info?.border || tokens.color.light?.status?.info?.border || "#00FFFF"};
  --color-status-info-muted: ${highContrastColors.status?.info?.muted || tokens.color.dark?.status?.info?.muted || tokens.color.light?.status?.info?.muted || "#00FFFF"};
}

[dir="rtl"] {
  --i18n-logical-start: right;
  --i18n-logical-end: left;
  --i18n-border-start: border-right;
  --i18n-border-end: border-left;
  --i18n-margin-start: margin-right;
  --i18n-margin-end: margin-left;
  --i18n-padding-start: padding-right;
  --i18n-padding-end: padding-left;
}

/* Density modes */
[data-density="compact"] {
  --density-space-multiplier: ${tokens.density.compact.space.multiplier};
  --density-space-base: ${tokens.density.compact.space.base}px;
  --density-typography-line-height: ${tokens.density.compact.typography["line-height"]};
  --density-typography-size-multiplier: ${tokens.density.compact.typography["size-multiplier"]};
  --density-component-height-multiplier: ${tokens.density.compact.component["height-multiplier"]};
  --density-component-padding-multiplier: ${tokens.density.compact.component["padding-multiplier"]};
}

[data-density="normal"] {
  --density-space-multiplier: ${tokens.density.normal.space.multiplier};
  --density-space-base: ${tokens.density.normal.space.base}px;
  --density-typography-line-height: ${tokens.density.normal.typography["line-height"]};
  --density-typography-size-multiplier: ${tokens.density.normal.typography["size-multiplier"]};
  --density-component-height-multiplier: ${tokens.density.normal.component["height-multiplier"]};
  --density-component-padding-multiplier: ${tokens.density.normal.component["padding-multiplier"]};
}

[data-density="comfortable"] {
  --density-space-multiplier: ${tokens.density.comfortable.space.multiplier};
  --density-space-base: ${tokens.density.comfortable.space.base}px;
  --density-typography-line-height: ${tokens.density.comfortable.typography["line-height"]};
  --density-typography-size-multiplier: ${tokens.density.comfortable.typography["size-multiplier"]};
  --density-component-height-multiplier: ${tokens.density.comfortable.component["height-multiplier"]};
  --density-component-padding-multiplier: ${tokens.density.comfortable.component["padding-multiplier"]};
}

/* Motion modes */
[data-motion="reduced"] {
  --motion-duration-fast: 0ms;
  --motion-duration-base: 0ms;
  --motion-duration-slow: 0ms;
  --motion-duration-slower: 0ms;
  --motion-transition-base: none;
  --motion-transition-fast: none;
  --motion-transition-slow: none;
  --motion-animation-fade-in: none;
  --motion-animation-fade-out: none;
  --motion-animation-slide-in: none;
  --motion-animation-slide-out: none;
}

[data-motion="normal"] {
  --motion-duration-fast: ${tokens.motion.duration.fast}ms;
  --motion-duration-base: ${tokens.motion.duration.base}ms;
  --motion-duration-slow: ${tokens.motion.duration.slow}ms;
  --motion-duration-slower: ${tokens.motion.duration.slower}ms;
  --motion-transition-base: ${tokens.motion.transition.base};
  --motion-transition-fast: ${tokens.motion.transition.fast};
  --motion-transition-slow: ${tokens.motion.transition.slow};
  --motion-animation-fade-in: ${tokens.motion.animation["fade-in"]};
  --motion-animation-fade-out: ${tokens.motion.animation["fade-out"]};
  --motion-animation-slide-in: ${tokens.motion.animation["slide-in"]};
  --motion-animation-slide-out: ${tokens.motion.animation["slide-out"]};
}

/* Respect system reduce-motion by default (unless explicitly overridden) */
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="normal"]):not([data-motion="reduced"]) {
    --motion-duration-fast: 0ms;
    --motion-duration-base: 0ms;
    --motion-duration-slow: 0ms;
    --motion-duration-slower: 0ms;
    --motion-transition-base: none;
    --motion-transition-fast: none;
    --motion-transition-slow: none;
    --motion-animation-fade-in: none;
    --motion-animation-fade-out: none;
    --motion-animation-slide-in: none;
    --motion-animation-slide-out: none;
  }
}

/* Motion keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-10px); opacity: 0; }
}
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outCss, css);
fs.writeFileSync(outTs, `export default ${JSON.stringify(tokens, null, 2)} as const;\n`);

console.log("✔ tokens built");
