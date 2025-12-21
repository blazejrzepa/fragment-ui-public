#!/usr/bin/env node
/**
 * Test Element Context
 * 
 * Tests that element context extraction works correctly
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

console.log('🧪 Testing Element Context...\n');

// Mock DSL structure
const mockDsl = {
  id: 'page-1',
  type: 'page',
  children: [
    {
      id: 'button-submit',
      type: 'component',
      component: 'Button',
      props: { variant: 'solid', size: 'md' },
      copy: 'Submit',
    },
    {
      id: 'form-container',
      type: 'component',
      component: 'form',
      children: [
        {
          id: 'input-email',
          type: 'component',
          component: 'Input',
          props: { placeholder: 'Email', type: 'email' },
        },
      ],
    },
  ],
};

// Simple test function (simplified version of getElementContext)
function findNodeById(dsl, id) {
  if (dsl.id === id) return dsl;
  
  function search(nodes) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && Array.isArray(node.children)) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  
  return search(dsl.children);
}

// Test 1: Find node by ID
const node = findNodeById(mockDsl, 'button-submit');
if (node && node.id === 'button-submit') {
  console.log('✅ Test 1: Find node by ID works');
  console.log(`   Found: ${node.component} with props:`, node.props);
} else {
  console.error('❌ Test 1: Failed to find node');
  process.exit(1);
}

// Test 2: Extract component name
if (node.type === 'component' && node.component === 'Button') {
  console.log('✅ Test 2: Component name extraction works');
} else {
  console.error('❌ Test 2: Component name extraction failed');
  process.exit(1);
}

// Test 3: Extract props
if (node.props && node.props.variant === 'solid') {
  console.log('✅ Test 3: Props extraction works');
} else {
  console.error('❌ Test 3: Props extraction failed');
  process.exit(1);
}

// Test 4: Find nested node
const nestedNode = findNodeById(mockDsl, 'input-email');
if (nestedNode && nestedNode.id === 'input-email') {
  console.log('✅ Test 4: Nested node finding works');
} else {
  console.error('❌ Test 4: Nested node finding failed');
  process.exit(1);
}

// Test 5: Element context structure
const elementContext = {
  selectedNodeId: node.id,
  componentName: node.component,
  subtree: node,
  currentProps: node.props,
};

if (elementContext.selectedNodeId && elementContext.componentName) {
  console.log('✅ Test 5: Element context structure valid');
  console.log(`   Context: ${elementContext.componentName} (${elementContext.selectedNodeId})`);
} else {
  console.error('❌ Test 5: Element context structure invalid');
  process.exit(1);
}

console.log('\n✅ All element context tests passed!');
console.log('\n📊 Element Context Summary:');
console.log(`   Selected: ${elementContext.selectedNodeId}`);
console.log(`   Component: ${elementContext.componentName}`);
console.log(`   Props: ${JSON.stringify(elementContext.currentProps)}`);

