#!/usr/bin/env node

/**
 * Automated Component Fix Script
 * 
 * This script automatically fixes common issues with components:
 * 1. Adds missing examples
 * 2. Converts old example format to new format
 * 3. Adds code to examples
 * 4. Ensures components are in scope
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, '../packages/registry/registry.json');
const PREVIEW_HOOK_PATH = path.join(__dirname, '../packages/ui/src/component-display/hooks/useComponentPreview.ts');
const RENDERER_PATH = path.join(__dirname, '../apps/demo/src/components/react-live-renderer.tsx');

// Load registry
let registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

const fixes = {
  examplesAdded: [],
  examplesConverted: [],
  codeAdded: [],
  handlersAdded: [],
  scopeAdded: []
};

/**
 * Generate example code for a component
 */
function generateExampleCode(componentName, componentInfo) {
  const packageName = componentInfo.package || 
    (componentInfo.import?.includes('@fragment_ui/blocks') ? '@fragment_ui/blocks' : '@fragment_ui/ui');
  
  const componentNamePascal = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Check if it's a compound component
  const normalizedName = componentName.toLowerCase();
  
  // Simple component fallback
  return `import { ${componentNamePascal} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <${componentNamePascal} />
    </div>
  );
}`;
}

/**
 * Fix component examples
 */
function fixComponentExamples(componentName, componentInfo) {
  let fixed = false;

  // Case 1: No examples
  if (!componentInfo.examples) {
    const exampleCode = generateExampleCode(componentName, componentInfo);
    componentInfo.examples = [{
      name: 'default',
      code: exampleCode,
      description: `Default ${componentName} example`
    }];
    fixes.examplesAdded.push(componentName);
    fixed = true;
  }
  // Case 2: Old format (object)
  else if (typeof componentInfo.examples === 'object' && !Array.isArray(componentInfo.examples)) {
    const oldExamples = componentInfo.examples;
    const newExamples = [];
    
    if (oldExamples.tsx) {
      newExamples.push({
        name: 'default',
        code: oldExamples.tsx,
        description: `Default ${componentName} example`
      });
    } else if (oldExamples.code) {
      newExamples.push({
        name: 'default',
        code: oldExamples.code,
        description: `Default ${componentName} example`
      });
    } else {
      // Generate new example
      newExamples.push({
        name: 'default',
        code: generateExampleCode(componentName, componentInfo),
        description: `Default ${componentName} example`
      });
    }
    
    componentInfo.examples = newExamples;
    fixes.examplesConverted.push(componentName);
    fixed = true;
  }
  // Case 3: Array but missing code
  else if (Array.isArray(componentInfo.examples)) {
    if (componentInfo.examples.length === 0) {
      componentInfo.examples = [{
        name: 'default',
        code: generateExampleCode(componentName, componentInfo),
        description: `Default ${componentName} example`
      }];
      fixes.examplesAdded.push(componentName);
      fixed = true;
    } else {
      // Check if first example has code
      const firstExample = componentInfo.examples[0];
      if (!firstExample.code) {
        if (firstExample.tsx) {
          firstExample.code = firstExample.tsx;
          delete firstExample.tsx;
        } else {
          firstExample.code = generateExampleCode(componentName, componentInfo);
        }
        fixes.codeAdded.push(componentName);
        fixed = true;
      }
    }
  }

  return fixed;
}

/**
 * Main fix function
 */
function runAutoFix() {
  console.log('🔧 Starting automated component fixes...\n');

  const components = Object.keys(registry.components || {});
  let totalFixed = 0;

  for (const componentName of components) {
    const componentInfo = registry.components[componentName];
    
    // Skip aliases
    if (registry.aliases?.[componentName]) continue;

    const fixed = fixComponentExamples(componentName, componentInfo);
    if (fixed) {
      totalFixed++;
    }
  }

  // Save updated registry
  if (totalFixed > 0) {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    console.log(`✅ Fixed ${totalFixed} components\n`);
  } else {
    console.log('✅ No fixes needed\n');
  }

  // Report
  console.log('📊 FIX SUMMARY:');
  console.log(`  Examples added: ${fixes.examplesAdded.length}`);
  console.log(`  Examples converted: ${fixes.examplesConverted.length}`);
  console.log(`  Code added: ${fixes.codeAdded.length}`);

  if (fixes.examplesAdded.length > 0) {
    console.log('\n  Examples added to:');
    fixes.examplesAdded.forEach(name => console.log(`    - ${name}`));
  }

  if (fixes.examplesConverted.length > 0) {
    console.log('\n  Examples converted for:');
    fixes.examplesConverted.forEach(name => console.log(`    - ${name}`));
  }

  if (fixes.codeAdded.length > 0) {
    console.log('\n  Code added to examples for:');
    fixes.codeAdded.forEach(name => console.log(`    - ${name}`));
  }

  return fixes;
}

// Run fixes
const fixesApplied = runAutoFix();
console.log('\n✅ Auto-fix complete!');

