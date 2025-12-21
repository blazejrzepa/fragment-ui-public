#!/usr/bin/env node

/**
 * Script to update all navigation buttons based on left sidebar structure
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

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
  
  // Build navigation buttons HTML
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
  
  // Replace existing navigation buttons div
  const navButtonsPattern = /<div className="flex items-center gap-2">[\s\S]*?<\/div>/;
  if (navButtonsPattern.test(content)) {
    content = content.replace(navButtonsPattern, navButtonsHTML);
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
  const pageMap = {
    'apps/www/app/docs/get-started/introduction/page.tsx': '/docs/get-started/introduction',
    'apps/www/app/docs/get-started/setup/page.tsx': '/docs/get-started/setup',
    'apps/www/app/docs/examples/page.tsx': '/docs/examples',
    'apps/www/app/docs/get-started/studio/page.tsx': '/docs/get-started/studio',
    'apps/www/app/docs/get-started/mcp-server/page.tsx': '/docs/get-started/mcp-server',
    'apps/www/app/docs/changelog/page.tsx': '/docs/changelog',
    'apps/www/app/docs/foundations/tokens/page.tsx': '/docs/foundations/tokens',
    'apps/www/app/docs/foundations/theming/page.tsx': '/docs/foundations/theming',
    'apps/www/app/docs/foundations/dark-mode/page.tsx': '/docs/foundations/dark-mode',
    'apps/www/app/docs/foundations/semantic-colors/page.tsx': '/docs/foundations/semantic-colors',
    'apps/www/app/docs/foundations/spacing/page.tsx': '/docs/foundations/spacing',
    'apps/www/app/docs/foundations/typography/page.tsx': '/docs/foundations/typography',
    'apps/www/app/docs/guides/cli-usage/page.tsx': '/docs/guides/cli-usage',
    'apps/www/app/docs/guides/design-to-code/page.tsx': '/docs/guides/design-to-code',
    'apps/www/app/docs/guides/vscode-extension-usage/page.tsx': '/docs/guides/vscode-extension-usage',
    'apps/www/app/docs/guides/figma-code-connect/page.tsx': '/docs/guides/figma-code-connect',
    'apps/www/app/docs/guides/enterprise-features/page.tsx': '/docs/guides/enterprise-features',
    'apps/www/app/docs/testing/test-guide/page.tsx': '/docs/testing/test-guide',
    'apps/www/app/docs/testing/performance-tests/page.tsx': '/docs/testing/performance-tests',
    'apps/www/app/docs/testing/visual-regression/page.tsx': '/docs/testing/visual-regression',
    'apps/www/app/docs/tools/playground/page.tsx': '/docs/tools/playground',
    'apps/www/app/docs/tools/theme-builder/page.tsx': '/docs/tools/theme-builder',
    'apps/www/app/docs/tools/bundle-tracking/page.tsx': '/docs/tools/bundle-tracking',
    'apps/www/app/docs/tools/component-comparison/page.tsx': '/docs/tools/component-comparison',
  };
  
  console.log(`Updating navigation buttons for ${Object.keys(pageMap).length} pages...\n`);

  let updated = 0;
  for (const [file, path] of Object.entries(pageMap)) {
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

