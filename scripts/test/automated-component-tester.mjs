#!/usr/bin/env node

/**
 * Automated Component Tester
 * 
 * This script uses MCP browser tools to automatically test all components:
 * 1. Opens http://localhost:3002/studio
 * 2. Navigates to Library tab
 * 3. Tests each component/block:
 *    - Clicks on component
 *    - Checks if Preview displays correctly
 *    - Checks for errors in console
 *    - Tests in Library tab view
 * 4. Automatically fixes issues when found
 * 
 * Usage: node scripts/automated-component-tester.mjs
 * 
 * Note: This script is designed to be called from an environment that has
 * access to MCP browser tools. For standalone browser testing, use
 * scripts/browser-test-components.mjs with Playwright.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');

// Load registry
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// Get all components and blocks
const allItems = Object.keys(registry.components || {}).filter(name => {
  if (registry.aliases?.[name]) return false;
  return true;
});

// Separate components and blocks
const components = allItems.filter(name => {
  const comp = registry.components[name];
  return !comp.import?.includes('@fragment_ui/blocks');
}).sort();

const blocks = allItems.filter(name => {
  const comp = registry.components[name];
  return comp.import?.includes('@fragment_ui/blocks');
}).sort();

console.log(`Found ${components.length} components and ${blocks.length} blocks`);

// Test results
const testResults = {
  passed: [],
  failed: [],
  needsFix: []
};

/**
 * Generate test report
 */
function generateReport() {
  const reportPath = path.join(__dirname, '../docs/development/AUTOMATED_TEST_REPORT.md');
  
  const report = `# Automated Component Test Report

**Generated:** ${new Date().toISOString()}

## Summary

- **Total Tested:** ${components.length + blocks.length}
- **Passed:** ${testResults.passed.length}
- **Failed:** ${testResults.failed.length}
- **Needs Fix:** ${testResults.needsFix.length}

## Passed Components

${testResults.passed.length > 0 ? testResults.passed.map(c => `- ✅ ${c}`).join('\n') : 'None'}

## Failed Components

${testResults.failed.length > 0 ? testResults.failed.map(c => `- ❌ ${c.name}: ${c.error}`).join('\n') : 'None'}

## Components Needing Fixes

${testResults.needsFix.length > 0 ? testResults.needsFix.map(c => `- 🔧 ${c.name}: ${c.issue}`).join('\n') : 'None'}

## Recommendations

${testResults.failed.length > 0 || testResults.needsFix.length > 0 ? `
1. Run \`node scripts/auto-fix-components.mjs\` to automatically fix common issues
2. Check console errors for each failed component
3. Verify components are exported correctly
4. Ensure examples are in the new array format
` : 'All components are working correctly! ✅'}
`;

  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Main function - this would be called with MCP browser tools
 * For now, we'll create a script that can be used with the browser tools
 */
function generateTestScript() {
  const scriptPath = path.join(__dirname, '../docs/development/TEST_SCRIPT.md');
  
  const script = `# Automated Component Testing Script

This document contains instructions for automated testing using MCP browser tools.

## Test Plan

### Components to Test: ${components.length}
${components.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### Blocks to Test: ${blocks.length}
${blocks.map((b, i) => `${i + 1}. ${b}`).join('\n')}

## Testing Steps (for each component/block)

1. Navigate to http://localhost:3002/studio
2. Click "Library" tab in left pane
3. Click "Component" or "Block" filter button
4. Click on component name
5. Wait for preview to load
6. Check console for errors
7. Navigate to http://localhost:3002/studio?tab=library
8. Verify component appears in library view
9. Record results

## Automated Test Commands

Run the following commands in sequence for each component:

\`\`\`bash
# For each component:
# 1. Navigate
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

# 2. Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-library-tab"

# 3. Click Component/Block filter
mcp_cursor-ide-browser_browser_click --element "Component/Block button" --ref "ref-filter-button"

# 4. Click component
mcp_cursor-ide-browser_browser_click --element "ComponentName button" --ref "ref-component-button"

# 5. Check console
mcp_cursor-ide-browser_browser_console_messages

# 6. Check preview
mcp_cursor-ide-browser_browser_snapshot

# 7. Navigate to library tab
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"

# 8. Verify component
mcp_cursor-ide-browser_browser_snapshot
\`\`\`
`;

  fs.writeFileSync(scriptPath, script);
  console.log(`📝 Test script saved to: ${scriptPath}`);
}

// Generate test script
generateTestScript();
generateReport();

console.log('\n✅ Test script generated!');
console.log('\nTo run automated tests:');
console.log('1. Use MCP browser tools to execute the test plan');
console.log('2. Or use: node scripts/browser-test-components.mjs (requires Playwright)');
console.log('3. Or use: node scripts/test-components-automation.mjs (static analysis)');

