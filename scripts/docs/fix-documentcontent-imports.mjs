#!/usr/bin/env node

/**
 * Script to add missing DocumentContent imports to documentation pages
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const COMPONENTS_DIR = 'apps/www/app/docs/components';
const BLOCKS_DIR = 'apps/www/app/docs/blocks';

function fixImports(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Skip if DocumentContent is not used
  if (!content.includes('DocumentContent')) {
    return false;
  }
  
  // Skip if import already exists
  if (content.includes('import') && content.match(/import.*DocumentContent/)) {
    return false;
  }
  
  // Find existing @fragment_ui/ui import
  const uiImportRegex = /import\s+{([^}]+)}\s+from\s+["']@fragment\/ui["'];?\n/g;
  const uiImportMatch = content.match(uiImportRegex);
  
  if (uiImportMatch) {
    // Add DocumentContent to existing import
    const importLine = uiImportMatch[0];
    const imports = importLine.match(/{([^}]+)}/)[1];
    const importsList = imports.split(',').map(i => i.trim());
    
    if (!importsList.includes('DocumentContent')) {
      importsList.push('DocumentContent');
      const newImportLine = importLine.replace(
        /{([^}]+)}/,
        `{ ${importsList.join(', ')} }`
      );
      content = content.replace(importLine, newImportLine);
    }
  } else {
    // Add new import after first import or at the top
    const firstImportMatch = content.match(/^import\s+.*\n/);
    if (firstImportMatch) {
      const insertIndex = firstImportMatch.index + firstImportMatch[0].length;
      content = content.slice(0, insertIndex) + 
        "import { DocumentContent } from \"@fragment_ui/ui\";\n" + 
        content.slice(insertIndex);
    } else {
      // Add at the top after "use client"
      const useClientMatch = content.match(/^"use client";\n/);
      if (useClientMatch) {
        const insertIndex = useClientMatch.index + useClientMatch[0].length;
        content = content.slice(0, insertIndex) + 
          "\nimport { DocumentContent } from \"@fragment_ui/ui\";\n" + 
          content.slice(insertIndex);
      } else {
        // Add at the very beginning
        content = "import { DocumentContent } from \"@fragment_ui/ui\";\n" + content;
      }
    }
  }
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const componentFiles = await glob(`${COMPONENTS_DIR}/**/page.tsx`);
  const blockFiles = await glob(`${BLOCKS_DIR}/**/page.tsx`);
  const allFiles = [...componentFiles, ...blockFiles];

  console.log(`Checking ${allFiles.length} files for missing DocumentContent imports...`);

  let fixed = 0;
  for (const file of allFiles) {
    if (fixImports(file)) {
      fixed++;
    }
  }

  console.log(`\nFixed ${fixed} files.`);
}

main().catch(console.error);

