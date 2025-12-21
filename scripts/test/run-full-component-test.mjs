#!/usr/bin/env node

/**
 * Full Component Test Runner
 * 
 * This script orchestrates the full testing and fixing process:
 * 1. Runs auto-fix to fix common issues
 * 2. Runs static analysis tests
 * 3. Generates reports
 * 
 * Usage: node scripts/run-full-component-test.mjs
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting full component test suite...\n');

try {
  // Step 1: Auto-fix components
  console.log('Step 1: Running auto-fix...');
  execSync('node scripts/auto-fix-components.mjs', { 
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✅ Auto-fix complete\n');

  // Step 2: Static analysis
  console.log('Step 2: Running static analysis...');
  execSync('node scripts/test-components-automation.mjs', { 
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✅ Static analysis complete\n');

  // Step 3: Generate test script
  console.log('Step 3: Generating test scripts...');
  execSync('node scripts/automated-component-tester.mjs', { 
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✅ Test scripts generated\n');

  console.log('✅ Full test suite complete!');
  console.log('\nNext steps:');
  console.log('1. Review docs/development/AUTOMATED_TEST_REPORT.md');
  console.log('2. Review docs/development/AUTOMATED_TEST_RESULTS.json');
  console.log('3. For browser testing, use MCP browser tools or:');
  console.log('   node scripts/browser-test-components.mjs');

} catch (error) {
  console.error('❌ Error running test suite:', error.message);
  process.exit(1);
}

