#!/usr/bin/env node

/**
 * MCP Browser Test Loop Script
 * 
 * This script provides a structured approach to test all components
 * using MCP browser tools. It generates a test plan and tracks results.
 * 
 * The actual browser automation should be executed manually or through
 * an MCP client that can execute browser commands in a loop.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');
const CHECKLIST_PATH = path.join(__dirname, '../docs/development/COMPONENT_TEST_CHECKLIST.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
let checklist = JSON.parse(fs.readFileSync(CHECKLIST_PATH, 'utf8'));

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

/**
 * Generate MCP browser commands for testing a component
 */
function generateTestCommands(componentName, isBlock = false) {
  return `
# Test ${componentName} (${isBlock ? 'Block' : 'Component'})

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "${isBlock ? 'Block' : 'Component'} filter button" --ref "ref-${isBlock ? 'wsghdv5qk2e' : '7ti75aycz4l'}"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "${componentName} button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ${componentName}
`;
}

/**
 * Generate full test plan
 */
function generateTestPlan() {
  const plan = [];
  
  plan.push('# Component Testing Plan\n');
  plan.push(`Total: ${components.length} components + ${blocks.length} blocks = ${components.length + blocks.length} items\n`);
  
  plan.push('## Components\n');
  components.forEach((comp, i) => {
    plan.push(`### ${i + 1}. ${comp}`);
    plan.push(generateTestCommands(comp, false));
    plan.push('');
  });
  
  plan.push('## Blocks\n');
  blocks.forEach((block, i) => {
    plan.push(`### ${i + 1}. ${block}`);
    plan.push(generateTestCommands(block, true));
    plan.push('');
  });
  
  return plan.join('\n');
}

// Generate test plan
const testPlan = generateTestPlan();
const planPath = path.join(__dirname, '../docs/development/MCP_TEST_PLAN.md');
fs.writeFileSync(planPath, testPlan);

console.log('✅ Test plan generated:', planPath);
console.log(`\n📋 Test plan includes:`);
console.log(`   - ${components.length} components`);
console.log(`   - ${blocks.length} blocks`);
console.log(`   - Total: ${components.length + blocks.length} items`);

// Generate summary
const summary = {
  total: components.length + blocks.length,
  components: components.length,
  blocks: blocks.length,
  tested: checklist.components.filter(c => c.tested).length + checklist.blocks.filter(b => b.tested).length,
  passed: checklist.components.filter(c => c.previewWorks && c.libraryWorks).length + 
          checklist.blocks.filter(b => b.previewWorks && b.libraryWorks).length,
  failed: checklist.components.filter(c => c.tested && (!c.previewWorks || !c.libraryWorks || c.errors.length > 0)).length +
           checklist.blocks.filter(b => b.tested && (!b.previewWorks || !b.libraryWorks || b.errors.length > 0)).length
};

console.log(`\n📊 Current Status:`);
console.log(`   Tested: ${summary.tested}/${summary.total}`);
console.log(`   Passed: ${summary.passed}`);
console.log(`   Failed: ${summary.failed}`);

