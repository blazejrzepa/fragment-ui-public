#!/usr/bin/env node

/**
 * Script to refactor API table headers in documentation pages
 * Replaces inline style={{ fontWeight: ... }} with Tailwind font-semibold class
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const DOCS_DIR = path.join(ROOT, 'apps/www/app/docs/components');

// Pattern to match: style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}
const FONT_WEIGHT_PATTERN = /\s+style=\{\{\s*fontWeight:\s*"var\(--typography-weight-semibold,\s*600\)"\s*\}\}/g;

function refactorFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  if (!FONT_WEIGHT_PATTERN.test(content)) {
    return false; // No changes needed
  }
  
  // Replace the pattern
  const newContent = content.replace(FONT_WEIGHT_PATTERN, ' font-semibold');
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  return true;
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
const files = findPageFiles(DOCS_DIR);
let changed = 0;

console.log(`Found ${files.length} page.tsx files to check...`);

for (const file of files) {
  if (refactorFile(file)) {
    changed++;
    console.log(`✅ Refactored: ${path.relative(ROOT, file)}`);
  }
}

console.log(`\n✨ Refactoring complete! Changed ${changed} files.`);

