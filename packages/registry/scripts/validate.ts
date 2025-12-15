#!/usr/bin/env tsx
/**
 * Registry Validation Script
 * 
 * Validates registry.json structure and content
 * 
 * Usage: pnpm validate
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadAndValidateRegistry } from "../src/validator";

const REGISTRY_PATH = join(__dirname, "..", "registry.json");

function main() {
  console.log("🔍 Validating registry.json...\n");

  const registryJson = readFileSync(REGISTRY_PATH, "utf8");
  const { registry, result } = loadAndValidateRegistry(registryJson);

  if (!result.valid) {
    console.error("❌ Registry validation failed!\n");
    
    if (result.errors.length > 0) {
      console.error("Errors:");
      result.errors.forEach((error) => {
        console.error(`  ✗ ${error.path}: ${error.message}`);
      });
      console.error();
    }

    if (result.warnings.length > 0) {
      console.warn("Warnings:");
      result.warnings.forEach((warning) => {
        console.warn(`  ⚠ ${warning.path}: ${warning.message}`);
      });
      console.warn();
    }

    process.exit(1);
  }

  console.log("✅ Registry is valid!\n");

  if (result.warnings.length > 0) {
    console.warn("Warnings (non-blocking):");
    result.warnings.forEach((warning) => {
      console.warn(`  ⚠ ${warning.path}: ${warning.message}`);
    });
    console.warn();
  }

  if (registry) {
    const componentCount = Object.keys(registry.components).length;
    console.log(`📦 Registry contains ${componentCount} components`);
    console.log(`📌 Version: ${registry.version}\n`);

    // Check completeness
    let missingVariants = 0;
    let missingSlots = 0;
    let missingA11y = 0;
    let missingExamples = 0;

    Object.entries(registry.components).forEach(([name, info]) => {
      if (!info.variants || info.variants.length === 0) {
        missingVariants++;
      }
      if (!info.slots || info.slots.length === 0) {
        missingSlots++;
      }
      if (!info.a11y) {
        missingA11y++;
      }
      if (!info.examples) {
        missingExamples++;
      }
    });

    if (missingVariants > 0 || missingSlots > 0 || missingA11y > 0 || missingExamples > 0) {
      console.log("📊 Completeness check:");
      if (missingVariants > 0) {
        console.log(`  ⚠ ${missingVariants} components missing variants`);
      }
      if (missingSlots > 0) {
        console.log(`  ⚠ ${missingSlots} components missing slots`);
      }
      if (missingA11y > 0) {
        console.log(`  ⚠ ${missingA11y} components missing a11y`);
      }
      if (missingExamples > 0) {
        console.log(`  ⚠ ${missingExamples} components missing examples`);
      }
      console.log();
    } else {
      console.log("✨ All components have complete metadata!\n");
    }
  }

  process.exit(0);
}

main();

