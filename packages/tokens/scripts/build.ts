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

function toCssVars(obj: any, prefix: string[] = []): string {
  return Object.entries(obj)
    .flatMap(([k, v]) => {
      const key = [...prefix, k];
      if (Array.isArray(v)) {
        // Skip arrays (like modes)
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
      let val: string;
      if (typeof v === "number") {
        // Don't add px to multipliers, line-height, or duration values
        const fullKey = key.join("-");
        const needsUnit = !fullKey.includes("multiplier") && 
                          !fullKey.includes("line-height") && 
                          !fullKey.includes("duration");
        
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

const css = `:root {\n${toCssVars(tokens)}\n  /* Logical properties for i18n/RTL support */\n  --i18n-logical-start: left;\n  --i18n-logical-end: right;\n  --i18n-border-start: border-left;\n  --i18n-border-end: border-right;\n  --i18n-margin-start: margin-left;\n  --i18n-margin-end: margin-right;\n  --i18n-padding-start: padding-left;\n  --i18n-padding-end: padding-right;\n}\n\n[data-theme="dark"] {\n  /* Optional dark overrides */\n}\n\n[data-theme="high-contrast"] {\n  --color-bg-base: var(--color-high-contrast-bg-base);\n  --color-bg-inverse: var(--color-high-contrast-bg-inverse);\n  --color-fg-base: var(--color-high-contrast-fg-base);\n  --color-fg-muted: var(--color-high-contrast-fg-muted);\n  --color-accent-border: var(--color-high-contrast-border);\n}\n\n[dir="rtl"] {\n  --i18n-logical-start: right;\n  --i18n-logical-end: left;\n  --i18n-border-start: border-right;\n  --i18n-border-end: border-left;\n  --i18n-margin-start: margin-right;\n  --i18n-margin-end: margin-left;\n  --i18n-padding-start: padding-right;\n  --i18n-padding-end: padding-left;\n}\n\n[data-density="compact"] {\n  /* Compact density - applied via multipliers in components */\n}\n\n[data-density="comfortable"] {\n  /* Comfortable density - applied via multipliers in components */\n}\n\n/* Motion keyframes */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n@keyframes fadeOut {\n  from { opacity: 1; }\n  to { opacity: 0; }\n}\n\n@keyframes slideIn {\n  from { transform: translateY(-10px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}\n\n@keyframes slideOut {\n  from { transform: translateY(0); opacity: 1; }\n  to { transform: translateY(-10px); opacity: 0; }\n}\n`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outCss, css);
fs.writeFileSync(outTs, `export default ${JSON.stringify(tokens, null, 2)} as const;\n`);

console.log("✔ tokens built");

