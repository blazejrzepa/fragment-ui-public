#!/usr/bin/env node

/**
 * Script to reorder sections in documentation pages to match select page template
 * 
 * Order should be:
 * 1. h1 + intro-text
 * 2. Examples (all Preview/CodeBlock)
 * 3. Install
 * 4. Accessibility
 * 5. Links
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const COMPONENTS_DIR = 'apps/www/app/docs/components';
const BLOCKS_DIR = 'apps/www/app/docs/blocks';

function reorderSections(content) {
  // Skip if already in correct order (Examples before Install)
  const installIndex = content.indexOf('<h2 id="install">');
  const examplesIndex = content.indexOf('<h2 id="examples">');
  
  // If Install comes before Examples, we need to reorder
  if (installIndex !== -1 && examplesIndex !== -1 && installIndex < examplesIndex) {
    // Extract Install section (from <h2 id="install"> to next <h2>)
    const installMatch = content.match(/<h2 id="install">Install<\/h2>[\s\S]*?(?=<h2|$)/);
    if (!installMatch) return content;
    
    const installSection = installMatch[0];
    
    // Remove Install section from current position
    content = content.replace(installSection, '');
    
    // Find the end of all Examples (last Preview/CodeBlock group before next h2)
    // Look for the last </div> that closes a preview group before next h2
    const examplesEndRegex = /(<\/div>\s*<\/div>\s*<\/div>\s*)(?=<h2[^>]*id="(?!examples)[^"]*">)/;
    const examplesEndMatch = content.match(examplesEndRegex);
    
    if (examplesEndMatch) {
      // Insert Install section after Examples
      const insertIndex = examplesEndMatch.index + examplesEndMatch[1].length;
      content = content.slice(0, insertIndex) + '\n      \n      ' + installSection.trim() + '\n      ' + content.slice(insertIndex);
    } else {
      // Fallback: insert before Accessibility or Links
      const accessibilityIndex = content.indexOf('<h2 id="accessibility">');
      const linksIndex = content.indexOf('<h2 id="links">');
      const insertIndex = accessibilityIndex !== -1 ? accessibilityIndex : (linksIndex !== -1 ? linksIndex : content.length);
      content = content.slice(0, insertIndex) + '\n      \n      ' + installSection.trim() + '\n      ' + content.slice(insertIndex);
    }
  }
  
  return content;
}

async function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  content = reorderSections(content);
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Reordered: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const componentFiles = await glob(`${COMPONENTS_DIR}/**/page.tsx`);
  const blockFiles = await glob(`${BLOCKS_DIR}/**/page.tsx`);
  const allFiles = [...componentFiles, ...blockFiles];

  console.log(`Checking ${allFiles.length} files for section reordering...`);

  let updated = 0;
  for (const file of allFiles) {
    if (await updateFile(file)) {
      updated++;
    }
  }

  console.log(`\nReordered ${updated} files.`);
}

main().catch(console.error);

