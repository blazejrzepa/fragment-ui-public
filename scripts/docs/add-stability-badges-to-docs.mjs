#!/usr/bin/env node

/**
 * Script to add StabilityBadge to all component documentation pages
 * 
 * Usage: node scripts/add-stability-badges-to-docs.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsPath = join(__dirname, '../apps/www/app/docs/components');
const registryPath = join(__dirname, '../packages/registry/registry.json');

// Read registry
const registryContent = readFileSync(registryPath, 'utf-8');
const registry = JSON.parse(registryContent);

// Component name mapping (registry name -> page name)
function getRegistryName(pageName) {
  // Convert kebab-case to PascalCase
  const pascalCase = pageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Try exact match first
  if (registry.components[pascalCase]) {
    return pascalCase;
  }
  
  // Try with first letter lowercase
  const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
  if (registry.components[camelCase]) {
    return camelCase;
  }
  
  // Try exact page name
  if (registry.components[pageName]) {
    return pageName;
  }
  
  // Try with first letter uppercase
  const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  if (registry.components[capitalized]) {
    return capitalized;
  }
  
  return null;
}

function getStabilityFromRegistry(pageName) {
  const registryName = getRegistryName(pageName);
  if (!registryName || !registry.components[registryName]) {
    return null;
  }
  return registry.components[registryName].stability || null;
}

// Read all component pages
function getAllComponentPages(dir) {
  const pages = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Check if it's a component directory (not [component] or other special dirs)
      if (!entry.name.startsWith('[') && !entry.name.startsWith('.')) {
        const pageFile = join(fullPath, 'page.tsx');
        try {
          if (statSync(pageFile).isFile()) {
            pages.push({
              name: entry.name,
              path: pageFile
            });
          }
        } catch (e) {
          // File doesn't exist, skip
        }
      }
    }
  }
  
  return pages;
}

const pages = getAllComponentPages(docsPath);
console.log(`📖 Found ${pages.length} component pages`);

let updated = 0;
let skipped = 0;
let errors = [];

for (const page of pages) {
  try {
    const content = readFileSync(page.path, 'utf-8');
    
    // Skip if already has StabilityBadge
    if (content.includes('StabilityBadge')) {
      skipped++;
      continue;
    }
    
    // Get stability from registry
    const stability = getStabilityFromRegistry(page.name);
    if (!stability) {
      console.log(`⚠️  No stability found for ${page.name}, skipping`);
      errors.push(`${page.name}: no stability in registry`);
      continue;
    }
    
    // Check if it's a client component
    const isClient = content.includes('"use client"');
    
    // Find the h1 tag
    const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/;
    const h1Match = content.match(h1Regex);
    
    if (!h1Match) {
      console.log(`⚠️  No h1 found in ${page.name}, skipping`);
      errors.push(`${page.name}: no h1 tag found`);
      continue;
    }
    
    // Add import if not present
    let newContent = content;
    if (!newContent.includes('import { StabilityBadge }')) {
      // Find the last import statement
      const importRegex = /^import .+ from .+;$/gm;
      const imports = newContent.match(importRegex) || [];
      const lastImport = imports[imports.length - 1];
      
      if (lastImport) {
        const lastImportIndex = newContent.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        newContent = newContent.slice(0, insertIndex) + 
          '\nimport { StabilityBadge } from "../../../../src/components/stability-badge";' +
          newContent.slice(insertIndex);
      } else {
        // Add at the beginning if no imports
        newContent = 'import { StabilityBadge } from "../../../../src/components/stability-badge";\n' + newContent;
      }
    }
    
    // Replace h1 with h1 + badge
    const h1Tag = h1Match[0];
    const h1Content = h1Match[1];
    
    // Check if h1 is already in a flex container
    if (h1Tag.includes('flex') || content.includes(`<h1[^>]*>${h1Content}</h1>`)) {
      // Try to find if there's already a wrapper
      const wrapperRegex = new RegExp(`(<div[^>]*>\\s*${h1Tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 's');
      const wrapperMatch = newContent.match(wrapperRegex);
      
      if (wrapperMatch && wrapperMatch[0].includes('flex')) {
        // Already in flex container, just add badge
        newContent = newContent.replace(
          h1Tag,
          `${h1Tag}\n        <StabilityBadge stability="${stability}" />`
        );
      } else {
        // Wrap h1 in flex container
        newContent = newContent.replace(
          h1Tag,
          `<div className="flex items-center gap-4 mb-4">\n        ${h1Tag}\n        <StabilityBadge stability="${stability}" />\n      </div>`
        );
      }
    } else {
      // Wrap h1 in flex container
      newContent = newContent.replace(
        h1Tag,
        `<div className="flex items-center gap-4 mb-4">\n        ${h1Tag}\n        <StabilityBadge stability="${stability}" />\n      </div>`
      );
    }
    
    writeFileSync(page.path, newContent, 'utf-8');
    updated++;
    console.log(`✅ Updated ${page.name} (${stability})`);
    
  } catch (error) {
    console.error(`❌ Error processing ${page.name}:`, error.message);
    errors.push(`${page.name}: ${error.message}`);
  }
}

console.log(`\n✅ Updated ${updated} pages`);
console.log(`⏭️  Skipped ${skipped} pages (already have StabilityBadge)`);
if (errors.length > 0) {
  console.log(`\n⚠️  Errors (${errors.length}):`);
  errors.forEach(e => console.log(`   - ${e}`));
}

