#!/usr/bin/env node

/**
 * Script to fix navigation buttons based on left sidebar structure
 */

import { readFileSync, writeFileSync } from 'fs';

// Full navigation order from left sidebar
const NAVIGATION_ORDER = [
  // Get Started
  '/docs/get-started/introduction',
  '/docs/get-started/setup',
  '/docs/examples',
  '/docs/get-started/studio',
  '/docs/get-started/mcp-server',
  '/docs/changelog',
  // Foundations
  '/docs/foundations/tokens',
  '/docs/foundations/theming',
  '/docs/foundations/dark-mode',
  '/docs/foundations/semantic-colors',
  '/docs/foundations/spacing',
  '/docs/foundations/typography',
  // Guides
  '/docs/guides/cli-usage',
  '/docs/guides/design-to-code',
  '/docs/guides/vscode-extension-usage',
  '/docs/guides/figma-code-connect',
  '/docs/guides/enterprise-features',
  // Testing
  '/docs/testing/test-guide',
  '/docs/testing/performance-tests',
  '/docs/testing/visual-regression',
  // Tools
  '/docs/tools/playground',
  '/docs/tools/theme-builder',
  '/docs/tools/bundle-tracking',
  '/docs/tools/component-comparison',
];

function getNavigation(path) {
  const index = NAVIGATION_ORDER.indexOf(path);
  if (index === -1) return { prev: null, next: null };
  
  return {
    prev: index > 0 ? NAVIGATION_ORDER[index - 1] : null,
    next: index < NAVIGATION_ORDER.length - 1 ? NAVIGATION_ORDER[index + 1] : null,
  };
}

function updatePage(filePath, pagePath) {
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  const nav = getNavigation(pagePath);
  
  // Update navigation buttons
  // Pattern: <div className="flex items-center gap-2">...</div>
  const navButtonsPattern = /<div className="flex items-center gap-2">[\s\S]*?<\/div>/;
  
  let navButtonsHTML = '<div className="flex items-center gap-2">';
  if (nav.prev) {
    navButtonsHTML += `
          <Link href={"${nav.prev}"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>`;
  }
  if (nav.next) {
    navButtonsHTML += `
          <Link href={"${nav.next}"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>`;
  }
  navButtonsHTML += '\n        </div>';
  
  // Replace existing navigation buttons
  if (content.includes('flex items-center gap-2')) {
    content = content.replace(navButtonsPattern, navButtonsHTML);
  } else {
    // Add navigation buttons if h1 exists but no buttons
    const h1Pattern = /(<h1[^>]*>[\s\S]*?<\/h1>)/;
    const h1Match = content.match(h1Pattern);
    if (h1Match) {
      // Check if there's already a wrapper div
      const wrapperPattern = /<div className="flex items-center justify-between mb-1">[\s\S]*?<\/div>/;
      if (wrapperPattern.test(content)) {
        // Replace the empty buttons div
        content = content.replace(navButtonsPattern, navButtonsHTML);
      } else {
        // Wrap h1 and add buttons
        const newWrapper = `<div className="flex items-center justify-between mb-1">
        ${h1Match[0]}${navButtonsHTML}
      </div>`;
        content = content.replace(h1Match[0], newWrapper);
      }
    }
  }
  
  // Ensure imports are present
  if (!content.includes('import Link from')) {
    const firstImport = content.match(/^import.*\n/);
    if (firstImport) {
      const insertIndex = firstImport.index + firstImport[0].length;
      content = content.slice(0, insertIndex) + 
        "import Link from \"next/link\";\n" + 
        content.slice(insertIndex);
    }
  }
  
  if (!content.includes('ArrowLeft') || !content.includes('ArrowRight')) {
    const lucideMatch = content.match(/import.*from.*["']lucide-react["'];?\n/);
    if (lucideMatch) {
      const imports = lucideMatch[0].match(/{([^}]+)}/)?.[1] || '';
      const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
      if (!importList.includes('ArrowLeft')) importList.push('ArrowLeft');
      if (!importList.includes('ArrowRight')) importList.push('ArrowRight');
      content = content.replace(
        lucideMatch[0],
        `import { ${importList.join(', ')} } from "lucide-react";\n`
      );
    } else {
      const firstImport = content.match(/^import.*\n/);
      if (firstImport) {
        const insertIndex = firstImport.index + firstImport[0].length;
        content = content.slice(0, insertIndex) + 
          "import { ArrowLeft, ArrowRight } from \"lucide-react\";\n" + 
          content.slice(insertIndex);
      }
    }
  }
  
  if (!content.includes('Button') || !content.includes('from "@fragment_ui/ui"')) {
    const uiImportMatch = content.match(/import.*from.*["']@fragment\/ui["'];?\n/);
    if (uiImportMatch) {
      const imports = uiImportMatch[0].match(/{([^}]+)}/)?.[1] || '';
      const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
      if (!importList.includes('Button')) importList.push('Button');
      content = content.replace(
        uiImportMatch[0],
        `import { ${importList.join(', ')} } from "@fragment_ui/ui";\n`
      );
    } else {
      const firstImport = content.match(/^import.*\n/);
      if (firstImport) {
        const insertIndex = firstImport.index + firstImport[0].length;
        content = content.slice(0, insertIndex) + 
          "import { Button } from \"@fragment_ui/ui\";\n" + 
          content.slice(insertIndex);
      }
    }
  }
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const pages = [
    { file: 'apps/www/app/docs/get-started/studio/page.tsx', path: '/docs/get-started/studio' },
    { file: 'apps/www/app/docs/get-started/mcp-server/page.tsx', path: '/docs/get-started/mcp-server' },
    { file: 'apps/www/app/docs/changelog/page.tsx', path: '/docs/changelog' },
  ];
  
  console.log(`Fixing navigation buttons for ${pages.length} pages...\n`);

  let updated = 0;
  for (const { file, path } of pages) {
    try {
      if (await updatePage(file, path)) {
        updated++;
      }
    } catch (error) {
      console.error(`Error updating ${file}:`, error.message);
    }
  }

  console.log(`\nUpdated ${updated} pages.`);
}

main().catch(console.error);

