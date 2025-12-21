#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * Analyzes bundle sizes for individual components and the entire UI package
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, "..");
const UI_DIR = path.join(ROOT_DIR, "packages/ui");
const OUTPUT_DIR = path.join(ROOT_DIR, "apps/www/public/bundle-sizes");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Get list of all components
 */
function getComponents() {
  const srcDir = path.join(UI_DIR, "src");
  const files = fs.readdirSync(srcDir);
  
  const components = files
    .filter((file) => {
      // Only .tsx files that are component files (not .stories, .test, etc.)
      return (
        file.endsWith(".tsx") &&
        !file.includes(".stories.") &&
        !file.includes(".test.") &&
        file !== "index.ts" &&
        file !== "styles.css"
      );
    })
    .map((file) => file.replace(".tsx", ""));

  return components;
}

/**
 * Analyze a single component file size
 * Note: This analyzes source file size as a proxy for bundle size
 * For accurate bundle sizes, you'd need to actually bundle each component
 */
function analyzeComponentSize(componentName) {
  const componentPath = path.join(UI_DIR, "src", `${componentName}.tsx`);
  
  if (!fs.existsSync(componentPath)) {
    console.warn(`Component ${componentName} not found at ${componentPath}`);
    return null;
  }

  try {
    // Read source file
    const source = fs.readFileSync(componentPath, "utf-8");
    const size = Buffer.byteLength(source, "utf8");
    
    // Estimate gzipped size (actual bundling would be more accurate)
    const gzipped = gzippedSize(source);

    return {
      component: componentName,
      size,
      gzipped,
      sizeFormatted: formatBytes(size),
      gzippedFormatted: formatBytes(gzipped),
    };
  } catch (error) {
    console.error(`Error analyzing ${componentName}:`, error.message);
    return null;
  }
}

/**
 * Estimate gzipped size
 */
function gzippedSize(content) {
  try {
    return gzipSync(content).length;
  } catch (e) {
    // Fallback: estimate as 30% of original (typical compression ratio for text)
    return Math.round(content.length * 0.3);
  }
}

/**
 * Analyze all components
 */
function analyzeAllComponents() {
  const components = getComponents();
  const results = [];

  console.log(`Analyzing ${components.length} components...`);

  for (const component of components) {
    console.log(`  - ${component}...`);
    const result = analyzeComponentSize(component);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Get total package size estimate
 */
function getPackageSize() {
  // This is a simplified version - in production you'd want to actually bundle
  // the entire package or use a tool like size-limit
  const indexPath = path.join(UI_DIR, "src", "index.ts");
  if (!fs.existsSync(indexPath)) {
    return null;
  }

  const indexContent = fs.readFileSync(indexPath, "utf-8");
  const size = Buffer.byteLength(indexContent, "utf8");
  const gzipped = gzipSync(indexContent).length;

  return {
    package: "@fragment_ui/ui",
    size,
    gzipped,
    sizeFormatted: formatBytes(size),
    gzippedFormatted: formatBytes(gzipped),
  };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Bundle size limits (in bytes)
 */
const BUNDLE_LIMITS = {
  // Individual component limits (gzipped)
  componentMaxGzipped: 50000, // 50KB per component
  componentMaxSize: 150000, // 150KB per component (uncompressed)
  // Package limits
  totalMaxGzipped: 500000, // 500KB total gzipped
  totalMaxSize: 1500000, // 1.5MB total uncompressed
  // Average limits
  averageMaxGzipped: 30000, // 30KB average per component
  averageMaxSize: 100000, // 100KB average per component
};

/**
 * Check bundle size limits
 */
function checkLimits(results, summary) {
  const errors = [];
  const warnings = [];

  // Check individual component limits
  for (const result of results) {
    if (result.gzipped > BUNDLE_LIMITS.componentMaxGzipped) {
      errors.push(
        `❌ Component "${result.component}" exceeds gzipped limit: ${result.gzippedFormatted} > ${formatBytes(BUNDLE_LIMITS.componentMaxGzipped)}`
      );
    }
    if (result.size > BUNDLE_LIMITS.componentMaxSize) {
      warnings.push(
        `⚠️  Component "${result.component}" exceeds size limit: ${result.sizeFormatted} > ${formatBytes(BUNDLE_LIMITS.componentMaxSize)}`
      );
    }
  }

  // Check total limits
  if (summary.totalGzipped > BUNDLE_LIMITS.totalMaxGzipped) {
    errors.push(
      `❌ Total gzipped size exceeds limit: ${formatBytes(summary.totalGzipped)} > ${formatBytes(BUNDLE_LIMITS.totalMaxGzipped)}`
    );
  }
  if (summary.totalSize > BUNDLE_LIMITS.totalMaxSize) {
    warnings.push(
      `⚠️  Total size exceeds limit: ${formatBytes(summary.totalSize)} > ${formatBytes(BUNDLE_LIMITS.totalMaxSize)}`
    );
  }

  // Check average limits
  if (summary.averageGzipped > BUNDLE_LIMITS.averageMaxGzipped) {
    warnings.push(
      `⚠️  Average gzipped size exceeds limit: ${formatBytes(summary.averageGzipped)} > ${formatBytes(BUNDLE_LIMITS.averageMaxGzipped)}`
    );
  }
  if (summary.averageSize > BUNDLE_LIMITS.averageMaxSize) {
    warnings.push(
      `⚠️  Average size exceeds limit: ${formatBytes(summary.averageSize)} > ${formatBytes(BUNDLE_LIMITS.averageMaxSize)}`
    );
  }

  return { errors, warnings };
}

/**
 * Save results to JSON
 */
function saveResults(results, packageInfo) {
  const timestamp = new Date().toISOString();
  const summary = {
    totalComponents: results.length,
    totalSize: results.reduce((sum, r) => sum + r.size, 0),
    totalGzipped: results.reduce((sum, r) => sum + r.gzipped, 0),
    averageSize: Math.round(results.reduce((sum, r) => sum + r.size, 0) / results.length),
    averageGzipped: Math.round(results.reduce((sum, r) => sum + r.gzipped, 0) / results.length),
  };

  const data = {
    timestamp,
    version: process.env.npm_package_version || "0.0.1",
    components: results,
    package: packageInfo,
    summary,
    limits: BUNDLE_LIMITS,
  };

  // Check limits
  const { errors, warnings } = checkLimits(results, summary);

  // Save current results
  const currentPath = path.join(OUTPUT_DIR, "current.json");
  fs.writeFileSync(currentPath, JSON.stringify(data, null, 2), "utf-8");

  // Save historical data (append to history)
  const historyPath = path.join(OUTPUT_DIR, "history.json");
  let history = [];
  if (fs.existsSync(historyPath)) {
    try {
      const existing = fs.readFileSync(historyPath, "utf-8");
      history = JSON.parse(existing);
    } catch (e) {
      console.warn("Could not read history file, starting fresh");
    }
  }

  history.push(data);
  
  // Keep only last 50 entries
  if (history.length > 50) {
    history = history.slice(-50);
  }

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), "utf-8");

  console.log("\n✅ Bundle analysis complete!");
  console.log(`   Total components: ${summary.totalComponents}`);
  console.log(`   Total size: ${formatBytes(summary.totalSize)}`);
  console.log(`   Total gzipped: ${formatBytes(summary.totalGzipped)}`);
  console.log(`   Results saved to: ${currentPath}`);

  // Display warnings and errors
  if (warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    warnings.forEach((w) => console.log(`   ${w}`));
  }

  if (errors.length > 0) {
    console.log("\n❌ Errors (bundle size limits exceeded):");
    errors.forEach((e) => console.log(`   ${e}`));
    console.log("\n💡 Consider code splitting or optimizing large components.");
    process.exit(1);
  } else if (warnings.length === 0) {
    console.log("\n✅ All bundle size limits passed!");
  }

  return data;
}

/**
 * Main execution
 */
function main() {
  console.log("📦 Analyzing bundle sizes...\n");

  const components = analyzeAllComponents();
  const packageInfo = getPackageSize();
  
  const results = saveResults(components, packageInfo);
  
  // Print top 10 largest components
  console.log("\n📊 Top 10 Largest Components (gzipped):");
  const sorted = [...components].sort((a, b) => b.gzipped - a.gzipped);
  sorted.slice(0, 10).forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.component.padEnd(30)} ${result.gzippedFormatted}`);
  });
}

main();

