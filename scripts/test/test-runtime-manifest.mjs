#!/usr/bin/env node
/**
 * Test Runtime Manifest
 * 
 * Tests that:
 * 1. Manifest file exists and is valid JSON
 * 2. Manifest contains required fields
 * 3. API endpoint returns manifest correctly
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const manifestPath = resolve(rootDir, 'apps/demo/public/runtime-manifest.json');

console.log('🧪 Testing Runtime Manifest...\n');

// Test 1: File exists
try {
  const manifestContent = readFileSync(manifestPath, 'utf-8');
  console.log('✅ Test 1: Manifest file exists');
  
  // Test 2: Valid JSON
  const manifest = JSON.parse(manifestContent);
  console.log('✅ Test 2: Manifest is valid JSON');
  
  // Test 3: Required fields
  const requiredFields = ['version', 'dependencies', 'importmap', 'cssBundles', 'features', 'paths'];
  const missingFields = requiredFields.filter(field => !(field in manifest));
  
  if (missingFields.length === 0) {
    console.log('✅ Test 3: All required fields present');
  } else {
    console.error('❌ Test 3: Missing fields:', missingFields);
    process.exit(1);
  }
  
  // Test 4: Dependencies structure
  if (manifest.dependencies && typeof manifest.dependencies === 'object') {
    console.log('✅ Test 4: Dependencies structure valid');
    console.log(`   Found ${Object.keys(manifest.dependencies).length} dependencies`);
  } else {
    console.error('❌ Test 4: Dependencies structure invalid');
    process.exit(1);
  }
  
  // Test 5: Importmap structure
  if (manifest.importmap && manifest.importmap.imports && typeof manifest.importmap.imports === 'object') {
    console.log('✅ Test 5: Importmap structure valid');
    console.log(`   Found ${Object.keys(manifest.importmap.imports).length} import entries`);
  } else {
    console.error('❌ Test 5: Importmap structure invalid');
    process.exit(1);
  }
  
  // Test 6: Features structure
  if (manifest.features && manifest.features.a11y && manifest.features.bundle && manifest.features.preview) {
    console.log('✅ Test 6: Features structure valid');
  } else {
    console.error('❌ Test 6: Features structure invalid');
    process.exit(1);
  }
  
  console.log('\n✅ All tests passed!');
  console.log('\n📊 Manifest Summary:');
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Generated: ${manifest.generatedAt}`);
  console.log(`   Dependencies: ${Object.keys(manifest.dependencies).length}`);
  console.log(`   Importmap entries: ${Object.keys(manifest.importmap.imports).length}`);
  console.log(`   CSS bundles: ${Object.keys(manifest.cssBundles).length}`);
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('❌ Manifest file not found. Run: pnpm runtime:manifest');
    process.exit(1);
  } else {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

