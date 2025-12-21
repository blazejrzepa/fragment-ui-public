#!/usr/bin/env node

/**
 * Script to convert all component/block documentation pages to use Preview + CodeBlock pattern
 * 
 * This script:
 * 1. Finds all page.tsx files in apps/www/app/docs/components/ and apps/www/app/docs/blocks/
 * 2. Converts Examples sections to use the Preview + CodeBlock pattern
 * 3. Maintains existing structure for other sections
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../apps/www/app/docs');
const COMPONENTS_DIR = path.join(DOCS_DIR, 'components');
const BLOCKS_DIR = path.join(DOCS_DIR, 'blocks');

/**
 * Extract code from existing CodeBlock or generate from component JSX
 */
function extractCodeFromExample(exampleHtml, componentName) {
  // Try to find existing CodeBlock content
  const codeBlockMatch = exampleHtml.match(/<CodeBlock[^>]*>{\`([\s\S]*?)\`}<\/CodeBlock>/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // Try to find code in <pre><code>
  const preCodeMatch = exampleHtml.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
  if (preCodeMatch) {
    return preCodeMatch[1].trim();
  }
  
  // Generate basic code from component JSX
  // This is a fallback - manual review will be needed
  return `import { ${componentName} } from "@fragment_ui/ui";

<${componentName} />`;
}

/**
 * Convert a single example div to Preview + CodeBlock pattern
 */
function convertExampleToPreviewPattern(exampleHtml, componentName) {
  // Extract the preview content (everything inside the example div)
  const previewMatch = exampleHtml.match(/<div[^>]*>([\s\S]*?)<\/div>/);
  if (!previewMatch) return exampleHtml;
  
  const previewContent = previewMatch[1];
  
  // Extract code (try multiple patterns)
  let code = extractCodeFromExample(exampleHtml, componentName);
  
  // Generate the new structure
  return `<div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[18.75rem] p-10">
          ${previewContent.trim()}
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{\`${code}\`}</CodeBlock>
        </div>
      </div>`;
}

/**
 * Convert Examples section in a file
 */
function convertFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Find Examples section
  const examplesMatch = content.match(/(<h2[^>]*id=["']examples["'][^>]*>Examples<\/h2>)([\s\S]*?)(?=<h2|$)/);
  if (!examplesMatch) {
    console.log(`  No Examples section found, skipping`);
    return false;
  }
  
  const examplesSection = examplesMatch[2];
  
  // Check if already converted (has Preview pattern)
  if (examplesSection.includes('group relative mt-4 mb-0 flex flex-col gap-0')) {
    console.log(`  Already converted, skipping`);
    return false;
  }
  
  // Extract component name from file path
  const componentName = path.basename(path.dirname(filePath));
  
  // For now, we'll mark files that need manual conversion
  // This is safer than trying to automatically parse all JSX patterns
  console.log(`  Needs manual conversion - component: ${componentName}`);
  
  return false; // Return false to indicate manual conversion needed
}

/**
 * Main function
 */
function main() {
  console.log('Starting documentation conversion...\n');
  
  const filesToProcess = [];
  
  // Find all component files
  if (fs.existsSync(COMPONENTS_DIR)) {
    const componentFiles = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    for (const dir of componentFiles) {
      if (dir.isDirectory()) {
        const pageFile = path.join(COMPONENTS_DIR, dir.name, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          filesToProcess.push(pageFile);
        }
      }
    }
  }
  
  // Find all block files
  if (fs.existsSync(BLOCKS_DIR)) {
    const blockFiles = fs.readdirSync(BLOCKS_DIR, { withFileTypes: true });
    for (const dir of blockFiles) {
      if (dir.isDirectory()) {
        const pageFile = path.join(BLOCKS_DIR, dir.name, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          filesToProcess.push(pageFile);
        }
      }
    }
  }
  
  console.log(`Found ${filesToProcess.length} files to process\n`);
  
  const converted = [];
  const skipped = [];
  const needsManual = [];
  
  for (const file of filesToProcess) {
    const result = convertFile(file);
    if (result) {
      converted.push(file);
    } else {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('group relative mt-4 mb-0 flex flex-col gap-0')) {
        skipped.push(file);
      } else {
        needsManual.push(file);
      }
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`  Converted: ${converted.length}`);
  console.log(`  Already converted: ${skipped.length}`);
  console.log(`  Needs manual conversion: ${needsManual.length}`);
  
  if (needsManual.length > 0) {
    console.log(`\nFiles needing manual conversion:`);
    needsManual.forEach(file => console.log(`  - ${file}`));
  }
}

main();

