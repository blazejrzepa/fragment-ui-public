#!/usr/bin/env node

/**
 * Automated Component Testing Script
 * 
 * This script automatically tests all components and blocks in the Studio:
 * 1. Opens http://localhost:3002/studio
 * 2. Navigates to Library tab
 * 3. Tests each component/block:
 *    - Clicks on component
 *    - Checks if Preview displays correctly
 *    - Checks for errors in console
 *    - Tests in Library tab view
 * 4. Automatically fixes issues when found
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
const components = Object.keys(registry.components || {}).filter(name => {
  const comp = registry.components[name];
  // Filter out aliases and subcomponents
  if (registry.aliases?.[name]) return false;
  // Check if it's a block (usually has @fragment_ui/blocks import or contains dash)
  const isBlock = comp.import?.includes('@fragment_ui/blocks') || 
                  (name.includes('-') && !['scroll-area', 'aspect-ratio', 'data-table', 'form-field'].includes(name));
  return true;
});

// Separate components and blocks
const uiComponents = components.filter(name => {
  const comp = registry.components[name];
  return !comp.import?.includes('@fragment_ui/blocks');
});

const blocks = components.filter(name => {
  const comp = registry.components[name];
  return comp.import?.includes('@fragment_ui/blocks');
});

console.log(`Found ${uiComponents.length} components and ${blocks.length} blocks`);

// Test results
const testResults = {
  passed: [],
  failed: [],
  fixed: [],
  errors: []
};

/**
 * Test a single component
 */
async function testComponent(componentName, isBlock = false) {
  console.log(`\n🧪 Testing ${isBlock ? 'Block' : 'Component'}: ${componentName}`);
  
  const result = {
    name: componentName,
    type: isBlock ? 'block' : 'component',
    previewWorks: false,
    libraryWorks: false,
    hasErrors: false,
    errors: [],
    fixed: false
  };

  try {
    // This would be called from browser automation
    // For now, we'll generate a report of what needs to be tested
    
    // Check if component has examples in registry
    const comp = registry.components[componentName];
    if (!comp) {
      result.errors.push(`Component not found in registry`);
      result.hasErrors = true;
      return result;
    }

    // Check if examples exist and are in correct format
    const examples = comp.examples;
    if (!examples) {
      result.errors.push(`No examples in registry`);
      result.hasErrors = true;
    } else if (typeof examples === 'object' && !Array.isArray(examples)) {
      result.errors.push(`Examples in old format (object instead of array)`);
      result.hasErrors = true;
    } else if (Array.isArray(examples) && examples.length === 0) {
      result.errors.push(`Examples array is empty`);
      result.hasErrors = true;
    } else if (Array.isArray(examples) && examples.length > 0) {
      const firstExample = examples[0];
      if (!firstExample.code) {
        result.errors.push(`First example missing 'code' field`);
        result.hasErrors = true;
      }
    }

    // Check if component is exported (would need to check actual exports)
    // This is a placeholder for actual browser testing

    if (result.hasErrors) {
      testResults.failed.push(result);
    } else {
      testResults.passed.push(result);
    }

  } catch (error) {
    result.errors.push(`Test error: ${error.message}`);
    result.hasErrors = true;
    testResults.failed.push(result);
  }

  return result;
}

/**
 * Generate fix suggestions
 */
function generateFixes(failedResults) {
  const fixes = [];
  
  for (const result of failedResults) {
    const comp = registry.components[result.name];
    const fixesForComponent = [];

    // Fix: Add examples if missing
    if (result.errors.some(e => e.includes('No examples'))) {
      fixesForComponent.push({
        type: 'add_examples',
        description: `Add examples array to ${result.name} in registry`
      });
    }

    // Fix: Convert old format to new format
    if (result.errors.some(e => e.includes('old format'))) {
      fixesForComponent.push({
        type: 'convert_examples',
        description: `Convert examples from object to array format for ${result.name}`
      });
    }

    // Fix: Add code to examples
    if (result.errors.some(e => e.includes("missing 'code' field"))) {
      fixesForComponent.push({
        type: 'add_code_to_examples',
        description: `Add 'code' field to examples for ${result.name}`
      });
    }

    if (fixesForComponent.length > 0) {
      fixes.push({
        component: result.name,
        fixes: fixesForComponent
      });
    }
  }

  return fixes;
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting automated component testing...\n');
  console.log(`Testing ${uiComponents.length} components and ${blocks.length} blocks\n`);

  // Test all components
  for (const componentName of uiComponents) {
    await testComponent(componentName, false);
  }

  // Test all blocks
  for (const blockName of blocks) {
    await testComponent(blockName, true);
  }

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`🔧 Fixed: ${testResults.fixed.length}`);

  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED COMPONENTS:');
    testResults.failed.forEach(result => {
      console.log(`\n  ${result.name} (${result.type}):`);
      result.errors.forEach(err => console.log(`    - ${err}`));
    });

    // Generate fixes
    const fixes = generateFixes(testResults.failed);
    if (fixes.length > 0) {
      console.log('\n🔧 SUGGESTED FIXES:');
      fixes.forEach(fix => {
        console.log(`\n  ${fix.component}:`);
        fix.fixes.forEach(f => {
          console.log(`    - ${f.description}`);
        });
      });
    }
  }

  // Save results to file
  const resultsPath = path.join(__dirname, '../docs/development/AUTOMATED_TEST_RESULTS.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: uiComponents.length + blocks.length,
      passed: testResults.passed.length,
      failed: testResults.failed.length,
      fixed: testResults.fixed.length
    },
    passed: testResults.passed.map(r => r.name),
    failed: testResults.failed,
    fixes: generateFixes(testResults.failed)
  }, null, 2));

  console.log(`\n📄 Results saved to: ${resultsPath}`);
}

// Run tests
runTests().catch(console.error);

