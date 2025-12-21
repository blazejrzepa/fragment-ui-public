#!/usr/bin/env node

/**
 * Test script to check if components have proper examples and configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Components to test
const componentsToTest = [
  "Accordion",
  "activity-feed",
  "Alert",
  "AnalyticsDashboard",
  "AspectRatio",
  "AuthenticationBlock",
  "Avatar",
  "Badge",
  "BenefitsSection",
  "Breadcrumbs",
  "Button",
  "Calendar",
  "Card",
  "CardGrid",
  "Carousel",
  "chart",
  "Checkbox",
  "Collapsible"
];

// Load registry
const registryPath = path.join(__dirname, '../packages/registry/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// Check ReactLiveRenderer scope
const reactLiveRendererPath = path.join(__dirname, '../apps/demo/src/components/react-live-renderer.tsx');
const reactLiveRendererContent = fs.readFileSync(reactLiveRendererPath, 'utf8');

// Check ComponentCodeGenerator
const codeGeneratorPath = path.join(__dirname, '../apps/demo/src/lib/component-code-generator.ts');
const codeGeneratorContent = fs.readFileSync(codeGeneratorPath, 'utf8');

console.log('🧪 Testing Components\n');
console.log('='.repeat(80));

const results = {
  passed: [],
  failed: [],
  warnings: []
};

for (const componentName of componentsToTest) {
  console.log(`\n📦 Testing: ${componentName}`);
  
  const result = {
    name: componentName,
    inRegistry: false,
    hasExamples: false,
    hasValidExample: false,
    inReactLiveScope: false,
    inCodeGenerator: false,
    errors: [],
    warnings: []
  };

  // 1. Check if in registry
  const componentInfo = registry.components[componentName];
  if (!componentInfo) {
    result.errors.push(`❌ Not found in registry`);
    results.failed.push(result);
    console.log(`   ❌ Not found in registry`);
    continue;
  }
  result.inRegistry = true;
  console.log(`   ✅ Found in registry`);

  // 2. Check examples
  if (!componentInfo.examples) {
    result.errors.push(`❌ No examples in registry`);
  } else if (Array.isArray(componentInfo.examples)) {
    if (componentInfo.examples.length === 0) {
      result.errors.push(`❌ Examples array is empty`);
    } else {
      const firstExample = componentInfo.examples[0];
      if (!firstExample.code) {
        result.errors.push(`❌ First example missing 'code' field`);
      } else {
        result.hasExamples = true;
        result.hasValidExample = true;
        console.log(`   ✅ Has valid example (${componentInfo.examples.length} total)`);
      }
    }
  } else {
    result.errors.push(`❌ Examples is not an array`);
  }

  // 3. Check ReactLiveRenderer scope
  // Normalize component name for scope check
  const scopeName = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Check for various patterns in scope
  const scopePatterns = [
    new RegExp(`\\b${scopeName}\\b`),
    new RegExp(`\\b${componentName}\\b`),
    new RegExp(`FragmentUI\\.${scopeName}`),
    new RegExp(`FragmentBlocks\\.${scopeName}`)
  ];
  
  const inScope = scopePatterns.some(pattern => pattern.test(reactLiveRendererContent));
  if (inScope) {
    result.inReactLiveScope = true;
    console.log(`   ✅ Found in ReactLiveRenderer scope`);
  } else {
    result.warnings.push(`⚠️  Not found in ReactLiveRenderer scope (may be auto-imported)`);
    console.log(`   ⚠️  Not explicitly in ReactLiveRenderer scope`);
  }

  // 4. Check ComponentCodeGenerator
  const codeGenPatterns = [
    new RegExp(`\\b${componentName}\\b`),
    new RegExp(`metadata\\.actualName === ['"]${componentName}['"]`),
    new RegExp(`generate${scopeName}JSX`)
  ];
  
  const inCodeGen = codeGenPatterns.some(pattern => pattern.test(codeGeneratorContent));
  if (inCodeGen) {
    result.inCodeGenerator = true;
    console.log(`   ✅ Found in ComponentCodeGenerator`);
  } else {
    result.warnings.push(`⚠️  Not explicitly handled in ComponentCodeGenerator (may use generic)`);
    console.log(`   ⚠️  Not explicitly handled in ComponentCodeGenerator`);
  }

  // Summary
  if (result.errors.length > 0) {
    results.failed.push(result);
    console.log(`   ❌ FAILED: ${result.errors.join(', ')}`);
  } else if (result.warnings.length > 0) {
    results.warnings.push(result);
    console.log(`   ⚠️  WARNINGS: ${result.warnings.join(', ')}`);
  } else {
    results.passed.push(result);
    console.log(`   ✅ PASSED`);
  }
}

// Final summary
console.log('\n' + '='.repeat(80));
console.log('\n📊 Summary:');
console.log(`   ✅ Passed: ${results.passed.length}`);
console.log(`   ⚠️  Warnings: ${results.warnings.length}`);
console.log(`   ❌ Failed: ${results.failed.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ Failed Components:');
  results.failed.forEach(r => {
    console.log(`   - ${r.name}: ${r.errors.join(', ')}`);
  });
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  Components with Warnings:');
  results.warnings.forEach(r => {
    console.log(`   - ${r.name}: ${r.warnings.join(', ')}`);
  });
}

// Exit with error code if any failed
process.exit(results.failed.length > 0 ? 1 : 0);

