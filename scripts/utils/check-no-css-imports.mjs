#!/usr/bin/env node
/**
 * CI Check: Verify no CSS imports in ESM bundles
 * 
 * This script checks that no CSS imports exist in:
 * 1. Build artifacts (packages/ui/dist)
 * 2. Source files (packages/ui/src) - warnings only
 * 
 * Exit code: 1 if CSS imports found in build, 0 otherwise
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const buildDir = path.resolve(rootDir, 'packages/ui/dist');
const srcDir = path.resolve(rootDir, 'packages/ui/src');
const blocksBuildDir = path.resolve(rootDir, 'packages/blocks/dist');
const blocksSrcDir = path.resolve(rootDir, 'packages/blocks/src');

let hasErrors = false;
let hasWarnings = false;

// CSS import patterns
const cssImportPatterns = [
  /import\s+.*from\s+["'][^"']*\.css["']/g,
  /import\s+["'][^"']*\.css["']/g,
  /require\(["'][^"']*\.css["']\)/g,
];

function checkFile(filePath, isBuild = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    
    // Skip Next.js build artifacts and app-specific files
    if (relativePath.includes('.next/') || 
        relativePath.includes('node_modules/') ||
        relativePath.includes('apps/demo/app/layout.tsx') ||
        relativePath.includes('apps/demo/src/components/orb.tsx')) {
      return false;
    }
    
    // Remove comments and strings to avoid false positives
    // Remove single-line comments
    let cleanContent = content.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    cleanContent = cleanContent.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove template literals (backticks)
    cleanContent = cleanContent.replace(/`[\s\S]*?`/g, '');
    // Remove single-quoted strings
    cleanContent = cleanContent.replace(/'[^']*'/g, '');
    // Remove double-quoted strings
    cleanContent = cleanContent.replace(/"[^"]*"/g, '');
    
    for (const pattern of cssImportPatterns) {
      const matches = cleanContent.match(pattern);
      if (matches) {
        if (isBuild) {
          console.error(`❌ [ERROR] Found CSS import in build artifact: ${relativePath}`);
          console.error(`   Matches: ${matches.slice(0, 3).join(', ')}`);
          hasErrors = true;
        } else {
          console.warn(`⚠️  [WARNING] Found CSS import in source: ${relativePath}`);
          console.warn(`   Matches: ${matches.slice(0, 3).join(', ')}`);
          hasWarnings = true;
        }
        return true;
      }
    }
    return false;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading ${filePath}:`, error.message);
    }
    return false;
  }
}

function walkDir(dir, callback, isBuild = false) {
  if (!fs.existsSync(dir)) {
    return;
  }
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      walkDir(fullPath, callback, isBuild);
    } else if (file.isFile()) {
      if (file.name.endsWith('.js') || file.name.endsWith('.mjs') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        callback(fullPath, isBuild);
      }
    }
  }
}

console.log('🔍 Checking for CSS imports in ESM bundles...\n');

// Check build artifacts (errors)
if (fs.existsSync(buildDir)) {
  console.log('📦 Checking build artifacts...');
  walkDir(buildDir, checkFile, true);
} else {
  console.log('⚠️  Build directory not found, skipping build check');
  console.log(`   Expected: ${path.relative(rootDir, buildDir)}`);
}

// Check source files (warnings only)
if (fs.existsSync(srcDir)) {
  console.log('\n📝 Checking packages/ui/src (warnings only)...');
  walkDir(srcDir, checkFile, false);
}

// Check packages/blocks build artifacts (errors)
if (fs.existsSync(blocksBuildDir)) {
  console.log('\n📦 Checking packages/blocks/dist...');
  walkDir(blocksBuildDir, checkFile, true);
}

// Check packages/blocks source files (warnings only)
if (fs.existsSync(blocksSrcDir)) {
  console.log('\n📝 Checking packages/blocks/src (warnings only)...');
  walkDir(blocksSrcDir, checkFile, false);
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.error('\n❌ FAILED: CSS imports found in build artifacts!');
  console.error('   This violates the CSS policy: zero CSS imports in ESM.');
  console.error('   CSS should be loaded via <link> tags, not ESM imports.');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  WARNINGS: CSS imports found in source files.');
  console.warn('   These should be removed before building.');
  console.log('\n✅ Build artifacts are clean (no CSS imports)');
  process.exit(0);
} else {
  console.log('\n✅ SUCCESS: No CSS imports found in build artifacts or source files!');
  process.exit(0);
}

