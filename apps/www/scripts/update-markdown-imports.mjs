#!/usr/bin/env node
/**
 * Script to update all markdown page.tsx files to use static imports
 * instead of filesystem reads
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');

// Find all page.tsx files that use readMarkdown
const docsDir = path.join(appRoot, 'app/docs');

function findPageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (entry.name === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('readMarkdown')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

const pageFiles = findPageFiles(docsDir);

console.log(`Found ${pageFiles.length} page files to update`);

for (const filePath of pageFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the path from readMarkdown call
  const match = content.match(/readMarkdown\s*\(\s*["']([^"']+)["']\s*\)/);
  if (!match) continue;
  
  const markdownPath = match[1];
  // Convert "docs/get-started/introduction/content.md" to "./content.md"
  const relativePath = markdownPath.split('/').pop();
  
  // Get directory of page.tsx
  const pageDir = path.dirname(filePath);
  const relativeToApp = path.relative(path.join(appRoot, 'app'), pageDir);
  
  console.log(`Updating ${filePath}`);
  console.log(`  Markdown path: ${markdownPath}`);
  console.log(`  Relative path: ./${relativePath}`);
  
  // Update imports
  let updated = content
    .replace(
      /import\s+\{\s*readMarkdown\s*\}\s+from\s+["'][^"']+["'];?/,
      `import { processMarkdownContent } from "../../../../src/lib/markdown-loader";\n// Import markdown as raw string - webpack will bundle it\nimport markdownContent from "./${relativePath}?raw";`
    )
    .replace(
      /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"];?/,
      "export const dynamic = 'force-static';"
    )
    .replace(
      /export\s+const\s+revalidate\s*=\s*0;?/,
      ""
    )
    .replace(
      /const\s+\{\s*content,\s*frontmatter\s*\}\s*=\s*await\s+readMarkdown\s*\(\s*["'][^"']+["']\s*\);?/,
      `const { content, frontmatter } = await processMarkdownContent(markdownContent);`
    );
  
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`  ✓ Updated\n`);
}

console.log('Done!');

