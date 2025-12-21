#!/usr/bin/env node

/**
 * Browser-based Component Testing Script
 * 
 * This script uses Playwright to automate browser testing of components.
 * It tests each component in the Studio interface.
 * 
 * Usage: node scripts/browser-test-components.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');

// Check if Playwright is available
let playwright;
try {
  playwright = await import('playwright');
} catch (e) {
  console.error('❌ Playwright not found. Install it with: pnpm add -D playwright');
  console.error('   Then run: pnpm exec playwright install');
  process.exit(1);
}

const { chromium } = playwright;

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
});

const blocks = allItems.filter(name => {
  const comp = registry.components[name];
  return comp.import?.includes('@fragment_ui/blocks');
});

console.log(`Found ${components.length} components and ${blocks.length} blocks`);

const testResults = {
  passed: [],
  failed: [],
  errors: []
};

/**
 * Test a component in the browser
 */
async function testComponentInBrowser(page, componentName, isBlock = false) {
  console.log(`\n🧪 Testing ${isBlock ? 'Block' : 'Component'}: ${componentName}`);
  
  const result = {
    name: componentName,
    type: isBlock ? 'block' : 'component',
    previewWorks: false,
    libraryWorks: false,
    hasErrors: false,
    errors: [],
    consoleErrors: []
  };

  try {
    // Navigate to studio
    await page.goto('http://localhost:3002/studio', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Click on Library tab in left pane
    const libraryTab = page.locator('button:has-text("Library")').first();
    if (await libraryTab.isVisible()) {
      await libraryTab.click();
      await page.waitForTimeout(1000);
    }

    // Filter by Component or Block
    if (isBlock) {
      const blockButton = page.locator('button:has-text("Block")');
      if (await blockButton.isVisible()) {
        await blockButton.click();
        await page.waitForTimeout(500);
      }
    } else {
      const componentButton = page.locator('button:has-text("Component")');
      if (await componentButton.isVisible()) {
        await componentButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Clear console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // Find and click on the component
    const componentButton = page.locator(`button:has-text("${componentName}")`).first();
    
    if (await componentButton.isVisible({ timeout: 2000 })) {
      await componentButton.click();
      await page.waitForTimeout(2000); // Wait for preview to load

      // Check if preview area has content
      const previewArea = page.locator('[data-testid="preview-area"], .preview-area, [class*="preview"]').first();
      if (await previewArea.isVisible({ timeout: 3000 })) {
        result.previewWorks = true;
      } else {
        result.errors.push('Preview area not visible');
      }

      // Check for console errors
      await page.waitForTimeout(1000); // Wait for any async errors
      if (consoleErrors.length > 0) {
        result.hasErrors = true;
        result.consoleErrors = consoleErrors;
        result.errors.push(`Console errors: ${consoleErrors.length}`);
      }

    } else {
      result.errors.push(`Component button not found in left pane`);
    }

    // Test in Library tab view
    await page.goto('http://localhost:3002/studio?tab=library', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check if component appears in library view
    const componentInLibrary = page.locator(`[data-component="${componentName}"], button:has-text("${componentName}")`).first();
    if (await componentInLibrary.isVisible({ timeout: 3000 })) {
      result.libraryWorks = true;
    } else {
      result.errors.push('Component not visible in Library tab');
    }

    if (result.hasErrors || !result.previewWorks || !result.libraryWorks) {
      testResults.failed.push(result);
    } else {
      testResults.passed.push(result);
    }

  } catch (error) {
    result.errors.push(`Test error: ${error.message}`);
    result.hasErrors = true;
    testResults.failed.push(result);
    console.error(`  ❌ Error testing ${componentName}:`, error.message);
  }

  return result;
}

/**
 * Main test function
 */
async function runBrowserTests() {
  console.log('🚀 Starting browser-based component testing...\n');
  console.log(`Testing ${components.length} components and ${blocks.length} blocks\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test all components
    console.log('\n📦 Testing Components:');
    for (let i = 0; i < components.length; i++) {
      const componentName = components[i];
      console.log(`[${i + 1}/${components.length}]`);
      await testComponentInBrowser(page, componentName, false);
      // Small delay between tests
      await page.waitForTimeout(500);
    }

    // Test all blocks
    console.log('\n🧱 Testing Blocks:');
    for (let i = 0; i < blocks.length; i++) {
      const blockName = blocks[i];
      console.log(`[${i + 1}/${blocks.length}]`);
      await testComponentInBrowser(page, blockName, true);
      await page.waitForTimeout(500);
    }

  } finally {
    await browser.close();
  }

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);

  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED ITEMS:');
    testResults.failed.forEach(result => {
      console.log(`\n  ${result.name} (${result.type}):`);
      result.errors.forEach(err => console.log(`    - ${err}`));
      if (result.consoleErrors.length > 0) {
        console.log(`    Console errors:`);
        result.consoleErrors.slice(0, 3).forEach(err => {
          console.log(`      - ${err.text.substring(0, 100)}`);
        });
      }
    });
  }

  // Save results
  const resultsPath = path.join(__dirname, '../docs/development/BROWSER_TEST_RESULTS.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: components.length + blocks.length,
      passed: testResults.passed.length,
      failed: testResults.failed.length
    },
    passed: testResults.passed.map(r => ({ name: r.name, type: r.type })),
    failed: testResults.failed
  }, null, 2));

  console.log(`\n📄 Results saved to: ${resultsPath}`);
}

// Run tests
runBrowserTests().catch(console.error);

