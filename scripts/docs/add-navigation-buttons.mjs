#!/usr/bin/env node

/**
 * Script to add navigation buttons and update styling for documentation pages
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Map page names to file paths
const PAGE_MAP = {
  'Introduction': 'apps/www/app/docs/get-started/introduction/page.tsx',
  'Setup': 'apps/www/app/docs/get-started/setup/page.tsx',
  'Examples': 'apps/www/app/docs/examples/page.tsx',
  'Studio': 'apps/www/app/docs/get-started/studio/page.tsx',
  'MCP Server': 'apps/www/app/docs/get-started/mcp-server/page.tsx',
  'Changelog': 'apps/www/app/docs/changelog/page.tsx',
  'Foundations': null, // This might be an index page
  'Design Tokens': 'apps/www/app/docs/foundations/tokens/page.tsx',
  'Theming': 'apps/www/app/docs/foundations/theming/page.tsx',
  'Dark Mode': 'apps/www/app/docs/foundations/dark-mode/page.tsx',
  'Semantic Colors': 'apps/www/app/docs/foundations/semantic-colors/page.tsx',
  'Spacing': 'apps/www/app/docs/foundations/spacing/page.tsx',
  'Typography': 'apps/www/app/docs/foundations/typography/page.tsx',
  'CLI Usage': 'apps/www/app/docs/guides/cli-usage/page.tsx',
  'Design to Code': 'apps/www/app/docs/guides/design-to-code/page.tsx',
  'VS Code Extension': 'apps/www/app/docs/guides/vscode-extension-usage/page.tsx',
  'Enterprise Features': 'apps/www/app/docs/guides/enterprise-features/page.tsx',
  'Test Guide': 'apps/www/app/docs/testing/test-guide/page.tsx',
  'Performance Tests': 'apps/www/app/docs/testing/performance-tests/page.tsx',
  'Visual Regression': 'apps/www/app/docs/testing/visual-regression/page.tsx',
  'Component Playground': 'apps/www/app/docs/tools/playground/page.tsx',
  'Theme Builder': 'apps/www/app/docs/tools/theme-builder/page.tsx',
  'Bundle Tracking': 'apps/www/app/docs/tools/bundle-tracking/page.tsx',
  'Component Comparison': 'apps/www/app/docs/tools/component-comparison/page.tsx',
};

// Navigation order for each section
const NAVIGATION_ORDER = {
  'get-started': ['introduction', 'setup', 'studio', 'mcp-server'],
  'foundations': ['tokens', 'theming', 'dark-mode', 'semantic-colors', 'spacing', 'typography'],
  'guides': ['cli-usage', 'design-to-code', 'vscode-extension-usage', 'enterprise-features'],
  'testing': ['test-guide', 'performance-tests', 'visual-regression'],
  'tools': ['playground', 'theme-builder', 'bundle-tracking', 'component-comparison'],
};

function getNavigationForPage(filePath) {
  // Extract section and page name from path
  const pathParts = filePath.split('/');
  const sectionIndex = pathParts.indexOf('docs');
  if (sectionIndex === -1) return { prev: null, next: null };
  
  const section = pathParts[sectionIndex + 1]; // e.g., 'get-started', 'foundations'
  const page = pathParts[pathParts.length - 2]; // e.g., 'introduction', 'setup'
  
  const order = NAVIGATION_ORDER[section];
  if (!order) return { prev: null, next: null };
  
  const currentIndex = order.indexOf(page);
  if (currentIndex === -1) return { prev: null, next: null };
  
  const prevPage = currentIndex > 0 ? order[currentIndex - 1] : null;
  const nextPage = currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
  
  return {
    prev: prevPage ? `/${section}/${prevPage}` : null,
    next: nextPage ? `/${section}/${nextPage}` : null,
  };
}

function updatePage(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Skip if already has navigation buttons
  if (content.includes('ArrowLeft') && content.includes('ArrowRight')) {
    return false;
  }
  
  // Get navigation paths
  const nav = getNavigationForPage(filePath);
  
  // Add imports if needed
  if (!content.includes('import Link from')) {
    // Find first import line
    const importMatch = content.match(/^import.*\n/);
    if (importMatch) {
      const insertIndex = importMatch.index + importMatch[0].length;
      content = content.slice(0, insertIndex) + 
        "import Link from \"next/link\";\n" + 
        content.slice(insertIndex);
    }
  }
  
  if (!content.includes('ArrowLeft') || !content.includes('ArrowRight')) {
    // Find lucide-react import or add new
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
      // Add new import
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
    // Find @fragment_ui/ui import
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
      // Add new import
      const firstImport = content.match(/^import.*\n/);
      if (firstImport) {
        const insertIndex = firstImport.index + firstImport[0].length;
        content = content.slice(0, insertIndex) + 
          "import { Button } from \"@fragment_ui/ui\";\n" + 
          content.slice(insertIndex);
      }
    }
  }
  
  // Update h1 to include navigation buttons
  // Pattern 1: <h1 id="..." className="text-3xl font-medium mb-4">Title</h1>
  const h1Pattern1 = /<h1\s+id="([^"]+)"\s+className="text-3xl font-medium mb-4">([^<]+)<\/h1>/;
  // Pattern 2: <h1 id="..." className="text-3xl font-medium mb-6">Title</h1>
  const h1Pattern2 = /<h1\s+id="([^"]+)"\s+className="text-3xl font-medium mb-6">([^<]+)<\/h1>/;
  // Pattern 3: <h1 id="..." className="text-3xl font-medium mb-2">Title</h1>
  const h1Pattern3 = /<h1\s+id="([^"]+)"\s+className="text-3xl font-medium mb-2">([^<]+)<\/h1>/;
  // Pattern 4: <h1 id="..." className="text-3xl font-medium">Title</h1>
  const h1Pattern4 = /<h1\s+id="([^"]+)"\s+className="text-3xl font-medium">([^<]+)<\/h1>/;
  
  const h1Match = content.match(h1Pattern1) || content.match(h1Pattern2) || content.match(h1Pattern3) || content.match(h1Pattern4);
  
  if (h1Match) {
    const h1Id = h1Match[1];
    const h1Title = h1Match[2];
    const navButtons = `
        <div className="flex items-center gap-2">
          ${nav.prev ? `<Link href={"/docs${nav.prev}"}>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>` : ''}
          ${nav.next ? `<Link href={"/docs${nav.next}"}>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>` : ''}
        </div>`;
    
    const newH1 = `<div className="flex items-center justify-between mb-1">
        <h1 id="${h1Id}" className="text-3xl font-medium mb-4">${h1Title}</h1>${navButtons}
      </div>`;
    
    content = content.replace(h1Match[0], newH1);
  }
  
  // Update paragraph after h1 to use intro-text class
  // Pattern: <p className="mb-6" style={...}> or <p className="mb-6 text-[color:var(--color-fg-muted)]" style={...}>
  const pPattern = /<p\s+className="mb-6[^"]*"[^>]*style=\{\{[\s\S]*?\}\}[^>]*>([^<]+)<\/p>/;
  const pMatch = content.match(pPattern);
  
  if (pMatch) {
    const pText = pMatch[1].trim();
    const newP = `<p className="mb-6 intro-text">
        ${pText}
      </p>`;
    content = content.replace(pMatch[0], newP);
  }
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const files = Object.values(PAGE_MAP).filter(Boolean);
  
  console.log(`Updating ${files.length} pages with navigation buttons...\n`);

  let updated = 0;
  for (const file of files) {
    try {
      if (await updatePage(file)) {
        updated++;
      }
    } catch (error) {
      console.error(`Error updating ${file}:`, error.message);
    }
  }

  console.log(`\nUpdated ${updated} pages.`);
}

main().catch(console.error);

