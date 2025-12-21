#!/usr/bin/env node

/**
 * Script to refactor examples pages - remove inline styles and replace hardcoded values with tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const EXAMPLES_DIR = path.join(ROOT, 'apps/www/app/docs/examples');

// Patterns to replace
const REPLACEMENTS = [
  // Inline styles with fontFamily, fontSize, etc.
  {
    pattern: /style=\{\{\s*fontFamily:\s*["']Geist,\s*sans-serif["'],\s*fontSize:\s*"var\(--typography-size-md\)",\s*fontStyle:\s*"normal",\s*lineHeight:\s*"160%",\s*color:\s*"var\(--foreground-secondary\)",?\s*\}\}/g,
    replacement: 'className="mb-[var(--space-6)] intro-text"'
  },
  // text-3xl -> text-[length:var(--typography-display-md-size)]
  {
    pattern: /className="text-3xl font-medium mb-4"/g,
    replacement: 'className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]"'
  },
  // mb-4 -> mb-[var(--space-1)]
  {
    pattern: /\bmb-4\b/g,
    replacement: 'mb-[var(--space-1)]'
  },
  // mb-6 -> mb-[var(--space-6)]
  {
    pattern: /\bmb-6\b/g,
    replacement: 'mb-[var(--space-6)]'
  },
  // my-6 -> my-[var(--space-6)]
  {
    pattern: /\bmy-6\b/g,
    replacement: 'my-[var(--space-6)]'
  },
  // p-4 -> p-[var(--space-4)]
  {
    pattern: /\bp-4\b/g,
    replacement: 'p-[var(--space-4)]'
  },
  // rounded-lg -> rounded-[var(--radius-md)]
  {
    pattern: /\brounded-lg\b/g,
    replacement: 'rounded-[var(--radius-md)]'
  },
];

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const { pattern, replacement } of REPLACEMENTS) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

function findPageFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'page.tsx') {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const files = findPageFiles(EXAMPLES_DIR);
let changed = 0;

console.log(`Found ${files.length} example page.tsx files to check...`);

for (const file of files) {
  if (refactorFile(file)) {
    changed++;
    console.log(`✅ Refactored: ${path.relative(ROOT, file)}`);
  }
}

console.log(`\n✨ Refactoring complete! Changed ${changed} files.`);

