#!/usr/bin/env node
/**
 * Generate Runtime Manifest
 * 
 * Generates a runtime-manifest.json file that provides a unified contract
 * between generator, bundler, iframe, and UI editor.
 * 
 * This manifest includes:
 * - Dependency versions
 * - Import map entries
 * - CSS bundle paths
 * - Feature flags
 * - API endpoints
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

/**
 * Read package.json and extract dependency versions
 */
function getDependencyVersions(packageJsonPath) {
  try {
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    
    // Extract key dependencies
    const keyDeps = [
      "react",
      "react-dom",
      "lucide-react",
      "react-day-picker",
      "date-fns",
      "clsx",
      "cmdk",
      "sonner",
    ];
    
    const versions = {};
    for (const dep of keyDeps) {
      if (deps[dep]) {
        versions[dep] = deps[dep].replace(/^[\^~]/, ""); // Remove ^ or ~
      }
    }
    
    // Add all @radix-ui packages
    for (const [dep, version] of Object.entries(deps)) {
      if (dep.startsWith("@radix-ui/")) {
        versions[dep] = version.replace(/^[\^~]/, "");
      }
    }
    
    return versions;
  } catch (error) {
    console.warn(`Warning: Could not read ${packageJsonPath}:`, error.message);
    return {};
  }
}

/**
 * Generate import map entries
 */
function generateImportmap() {
  const uiPackageJson = path.resolve(rootDir, "packages/ui/package.json");
  const uiDeps = getDependencyVersions(uiPackageJson);
  
  const imports = {
    // React core
    "react": `https://esm.sh/react@${uiDeps.react || "18.3.0"}`,
    "react-dom": `https://esm.sh/react-dom@${uiDeps["react-dom"] || "18.3.0"}`,
    "react/jsx-runtime": `https://esm.sh/react@${uiDeps.react || "18.3.0"}/jsx-runtime`,
    "react/jsx-dev-runtime": `https://esm.sh/react@${uiDeps.react || "18.3.0"}/jsx-dev-runtime`,
    
    // Fragment UI packages (bundled via API)
    "@fragment_ui/ui": "/api/bundle",
    "@fragment_ui/blocks": "/api/bundle-blocks",
    "@fragment_ui/tokens": "/api/bundle-css",
  };
  
  return { imports };
}

/**
 * Generate CSS bundle paths
 */
function generateCSSPaths() {
  return {
    bundle: "/api/bundle-css",
    vendor: [
      // Vendor CSS is included in bundle-css
      // react-day-picker is loaded via /api/bundle-css
    ],
  };
}

/**
 * Generate feature flags
 */
function generateFeatureFlags() {
  return {
    a11y: process.env.ENABLE_A11Y !== "false", // Default: true
    devMode: process.env.NODE_ENV === "development",
    telemetry: process.env.ENABLE_TELEMETRY === "true", // Default: false
  };
}

/**
 * Generate API endpoints
 */
function generateEndpoints() {
  return {
    bundle: "/api/bundle",
    "bundle-blocks": "/api/bundle-blocks",
    "bundle-css": "/api/bundle-css",
    "runtime-manifest": "/api/runtime-manifest",
  };
}

/**
 * Main function to generate runtime manifest
 */
function generateRuntimeManifest() {
  const uiPackageJson = path.resolve(rootDir, "packages/ui/package.json");
  const dependencies = getDependencyVersions(uiPackageJson);
  
  const manifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    dependencies,
    importmap: generateImportmap(),
    css: generateCSSPaths(),
    features: generateFeatureFlags(),
    endpoints: generateEndpoints(),
  };
  
  return manifest;
}

// Generate and write manifest
try {
  const manifest = generateRuntimeManifest();
  const outputPath = path.resolve(rootDir, "apps/demo/public/runtime-manifest.json");
  
  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write manifest
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), "utf-8");
  
  console.log("✅ Generated runtime-manifest.json");
  console.log(`   Location: ${path.relative(rootDir, outputPath)}`);
  console.log(`   Dependencies: ${Object.keys(manifest.dependencies).length} packages`);
  console.log(`   Import map entries: ${Object.keys(manifest.importmap.imports).length}`);
} catch (error) {
  console.error("❌ Failed to generate runtime-manifest.json:", error);
  process.exit(1);
}

