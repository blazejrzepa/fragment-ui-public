#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Storybook setup...\n");

// 1. Sprawdź czy wszystkie komponenty mają stories
const uiSrc = path.join(__dirname, "../packages/ui/src");
const components = fs.readdirSync(uiSrc)
  .filter(f => f.endsWith(".tsx") && !f.includes(".stories") && !f.includes("index") && !f.includes("styles"))
  .map(f => f.replace(".tsx", ""));

const stories = fs.readdirSync(uiSrc)
  .filter(f => f.endsWith(".stories.tsx"))
  .map(f => f.replace(".stories.tsx", ""));

console.log(`📦 Components found: ${components.length}`);
console.log(`📚 Stories found: ${stories.length}\n`);

const missing = components.filter(c => !stories.includes(c));
if (missing.length > 0) {
  console.error("❌ Missing stories for:", missing.join(", "));
  process.exit(1);
} else {
  console.log("✅ All components have stories\n");
}

// 2. Sprawdź czy A11y addon jest włączony
const mainConfig = path.join(__dirname, "../packages/ui/.storybook/main.ts");
const mainContent = fs.readFileSync(mainConfig, "utf-8");
if (mainContent.includes("@storybook/addon-a11y")) {
  console.log("✅ A11y addon configured\n");
} else {
  console.error("❌ A11y addon not found in main.ts");
  process.exit(1);
}

// 3. Sprawdź czy preview.ts ma A11y config
const previewConfig = path.join(__dirname, "../packages/ui/.storybook/preview.ts");
const previewContent = fs.readFileSync(previewConfig, "utf-8");
if (previewContent.includes("a11y")) {
  console.log("✅ A11y preview config present\n");
} else {
  console.warn("⚠️  A11y preview config not found");
}

// 4. Sprawdź czy styles.css istnieje i importuje tokens
const stylesPath = path.join(__dirname, "../packages/ui/src/styles.css");
if (fs.existsSync(stylesPath)) {
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");
  if (stylesContent.includes("@import") && stylesContent.includes("tokens")) {
    console.log("✅ Styles CSS imports tokens\n");
  } else {
    console.warn("⚠️  Styles CSS may not import tokens");
  }
} else {
  console.error("❌ styles.css not found");
  process.exit(1);
}

// 5. Sprawdź czy tokens są zbudowane
const tokensCss = path.join(__dirname, "../packages/tokens/dist/tokens.css");
if (fs.existsSync(tokensCss)) {
  console.log("✅ Tokens CSS built\n");
} else {
  console.warn("⚠️  Tokens CSS not built (run pnpm tokens:build)");
}

console.log("✅ All Storybook checks passed!");
console.log("\n📖 To test Storybook manually:");
console.log("   1. Run: pnpm -C packages/ui storybook");
console.log("   2. Open: http://localhost:6006");
console.log("   3. Check each component story");
console.log("   4. Verify A11y panel shows no critical errors\n");

