#!/usr/bin/env node

/**
 * Test a single component in browser
 * Usage: node scripts/test-component-in-browser.mjs ComponentName
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');
const RESULTS_PATH = path.join(__dirname, '../docs/development/BROWSER_TEST_RESULTS.json');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node scripts/test-component-in-browser.mjs ComponentName');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const componentInfo = registry.components[componentName];

if (!componentInfo) {
  console.error(`Component "${componentName}" not found in registry`);
  process.exit(1);
}

const isBlock = componentInfo.import?.includes('@fragment_ui/blocks');

console.log(`Testing ${isBlock ? 'Block' : 'Component'}: ${componentName}`);
console.log(`Import: ${componentInfo.import}`);
console.log(`Has examples: ${!!componentInfo.examples && (Array.isArray(componentInfo.examples) ? componentInfo.examples.length > 0 : true)}`);

// Load existing results
let results = { tested: [], failed: [] };
if (fs.existsSync(RESULTS_PATH)) {
  results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
}

// This script is meant to be called from browser automation
// For now, just log the component info
console.log('\n✅ Component info logged');
console.log('To test in browser:');
console.log(`  1. Navigate to http://localhost:3002/studio`);
console.log(`  2. Click Library tab`);
console.log(`  3. Click ${isBlock ? 'Block' : 'Component'} filter`);
console.log(`  4. Click ${componentName}`);
console.log(`  5. Check Preview and console errors`);

