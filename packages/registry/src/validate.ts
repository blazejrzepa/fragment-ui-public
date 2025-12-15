#!/usr/bin/env tsx

/**
 * Registry Validation Script
 * 
 * Validates registry.json structure
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadAndValidateRegistry } from "./validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const registryPath = join(__dirname, "..", "registry.json");

try {
  const json = readFileSync(registryPath, "utf-8");
  const { registry, result } = loadAndValidateRegistry(json);

  if (!result.valid) {
    console.error("❌ Registry validation failed:\n");
    result.errors.forEach((error) => {
      console.error(`  Error [${error.path}]: ${error.message}`);
    });
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️  Registry validation warnings:\n");
    result.warnings.forEach((warning) => {
      console.warn(`  Warning [${warning.path}]: ${warning.message}`);
    });
  }

  console.log("✅ Registry validation passed!");
  console.log(`   Version: ${registry?.version}`);
  console.log(`   Components: ${Object.keys(registry?.components || {}).length}`);
  process.exit(0);
} catch (error) {
  console.error("❌ Failed to validate registry:", error);
  process.exit(1);
}

