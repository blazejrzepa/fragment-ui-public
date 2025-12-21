#!/usr/bin/env node

/**
 * Script to update all component documentation pages to match the select page template
 * 
 * Changes:
 * 1. DocLayout -> DocumentContent as="article"
 * 2. mb-4 -> mb-1 in div with h1
 * 3. Inline styles in <p> -> className="mb-6 intro-text"
 * 4. Remove empty "Overview" section
 * 5. min-h-[18.75rem] and other rem values -> min-h-[400px]
 * 6. Add id to h1 if missing
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';

const COMPONENTS_DIR = 'apps/www/app/docs/components';
const BLOCKS_DIR = 'apps/www/app/docs/blocks';

async function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // 1. Replace DocLayout with DocumentContent
  if (content.includes('DocLayout')) {
    content = content.replace(/import.*DocLayout.*from.*["'].*["'];?\n/g, '');
    content = content.replace(/import.*\{[^}]*DocLayout[^}]*\}.*from.*["'].*["'];?\n/g, '');
    content = content.replace(/<DocLayout>/g, '<DocumentContent as="article">');
    content = content.replace(/<\/DocLayout>/g, '</DocumentContent>');
    
    // Add DocumentContent import if not present
    if (!content.includes('DocumentContent')) {
      const importMatch = content.match(/import.*\{[^}]*\}.*from.*["']@fragment\/ui["'];?\n/);
      if (importMatch) {
        const importLine = importMatch[0];
        if (!importLine.includes('DocumentContent')) {
          content = content.replace(
            importLine,
            importLine.replace('}', ', DocumentContent }')
          );
        }
      } else {
        // Add new import
        const firstImport = content.match(/^import.*\n/);
        if (firstImport) {
          content = content.replace(
            firstImport[0],
            firstImport[0] + "import { DocumentContent } from \"@fragment_ui/ui\";\n"
          );
        }
      }
    }
    modified = true;
  }

  // 2. Replace mb-4 with mb-1 in div with h1
  content = content.replace(
    /(<div className="flex items-center gap-4 )mb-4(">[\s\S]*?<h1[^>]*>)/g,
    '$1mb-1$2'
  );
  if (content.match(/<div className="flex items-center gap-4 mb-4">/)) {
    modified = true;
  }

  // 3. Replace inline styles in <p> with intro-text class
  const pWithStyleRegex = /<p\s+className="mb-6[^"]*"[^>]*style=\{\{[^}]*\}\}[^>]*>([^<]+)<\/p>/g;
  const matches = [...content.matchAll(pWithStyleRegex)];
  if (matches.length > 0) {
    matches.forEach(match => {
      const text = match[1].trim();
      const newP = `<p className="mb-6 intro-text">\n        ${text}\n      </p>`;
      content = content.replace(match[0], newP);
    });
    modified = true;
  }

  // 4. Remove empty Overview section
  content = content.replace(/<h2 id="overview">Overview<\/h2>\s*\n\s*$/gm, '');
  content = content.replace(/<h2 id="overview">Overview<\/h2>\s*\n\s*<h2/g, '<h2');

  // 5. Replace min-h values
  content = content.replace(/min-h-\[18\.75rem\]/g, 'min-h-[400px]');
  content = content.replace(/min-h-\[25rem\]/g, 'min-h-[400px]');
  content = content.replace(/min-h-\[12\.5rem\]/g, 'min-h-[400px]');
  content = content.replace(/min-h-\[15\.625rem\]/g, 'min-h-[400px]');
  if (content.match(/min-h-\[(18\.75|25|12\.5|15\.625)rem\]/)) {
    modified = true;
  }

  // 6. Add id to h1 if missing (extract from filename or component name)
  if (content.includes('<h1') && !content.includes('<h1 id=')) {
    const filename = filePath.split('/').pop().replace('.tsx', '');
    content = content.replace(
      /<h1([^>]*)>/,
      `<h1$1 id="${filename}">`
    );
    modified = true;
  }

  // Remove EditOnGitHub if unused
  if (content.includes('EditOnGitHub') && !content.includes('<EditOnGitHub')) {
    content = content.replace(/import.*EditOnGitHub[^;]*;?\n/g, '');
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const componentFiles = await glob(`${COMPONENTS_DIR}/**/page.tsx`);
  const blockFiles = await glob(`${BLOCKS_DIR}/**/page.tsx`);
  const allFiles = [...componentFiles, ...blockFiles];

  console.log(`Found ${allFiles.length} files to check...`);

  let updated = 0;
  for (const file of allFiles) {
    if (await updateFile(file)) {
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} files.`);
}

main().catch(console.error);

