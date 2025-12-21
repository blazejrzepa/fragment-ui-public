#!/usr/bin/env node

/**
 * Browser-based Component Tester using MCP Browser Tools
 * 
 * This script provides instructions and structure for testing all components
 * using MCP browser automation tools.
 * 
 * The actual browser automation should be done through MCP browser tools
 * in an interactive session.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// Get all items
const allItems = Object.keys(registry.components || {}).filter(name => {
  if (registry.aliases?.[name]) return false;
  return true;
});

const components = allItems.filter(name => {
  const comp = registry.components[name];
  return !comp.import?.includes('@fragment_ui/blocks');
}).sort();

const blocks = allItems.filter(name => {
  const comp = registry.components[name];
  return comp.import?.includes('@fragment_ui/blocks');
}).sort();

console.log(`\n📋 Testing Plan:`);
console.log(`   Components: ${components.length}`);
console.log(`   Blocks: ${blocks.length}`);
console.log(`   Total: ${components.length + blocks.length}\n`);

// Generate test checklist
const checklist = {
  components: components.map(name => ({
    name,
    tested: false,
    previewWorks: null,
    libraryWorks: null,
    errors: []
  })),
  blocks: blocks.map(name => ({
    name,
    tested: false,
    previewWorks: null,
    libraryWorks: null,
    errors: []
  }))
};

// Save checklist
const checklistPath = path.join(__dirname, '../docs/development/COMPONENT_TEST_CHECKLIST.json');
fs.writeFileSync(checklistPath, JSON.stringify(checklist, null, 2));

console.log(`✅ Test checklist generated: ${checklistPath}`);
console.log(`\n📝 To test components:`);
console.log(`   1. Open http://localhost:3002/studio`);
console.log(`   2. Click "Library" in left pane`);
console.log(`   3. For each component:`);
console.log(`      - Click "Component" or "Block" filter`);
console.log(`      - Click component name`);
console.log(`      - Check Preview area`);
console.log(`      - Check console for errors`);
console.log(`      - Navigate to ?tab=library and verify`);
console.log(`   4. Record results in checklist\n`);

console.log(`Components to test (${components.length}):`);
components.forEach((c, i) => console.log(`   ${i + 1}. ${c}`));

console.log(`\nBlocks to test (${blocks.length}):`);
blocks.forEach((b, i) => console.log(`   ${i + 1}. ${b}`));

