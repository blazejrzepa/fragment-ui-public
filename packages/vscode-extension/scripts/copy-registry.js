const fs = require("fs");
const path = require("path");

// Copy registry.json to dist/ for packaging
const registrySource = path.join(__dirname, "../../registry/registry.json");
const registryDest = path.join(__dirname, "../dist/registry.json");

if (fs.existsSync(registrySource)) {
  fs.copyFileSync(registrySource, registryDest);
  console.log("✅ Copied registry.json to dist/");
} else {
  console.warn("⚠️  Registry.json not found, extension may not work correctly");
}

