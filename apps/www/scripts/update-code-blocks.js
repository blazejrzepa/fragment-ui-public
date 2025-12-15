#!/usr/bin/env node

/**
 * Script to update all component/block pages to use CodeBlock component
 * This script finds all <pre><code> blocks and replaces them with CodeBlock
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const componentsDir = path.join(__dirname, '../app/docs/components');

// Find all page.tsx files
const files = glob.sync('**/page.tsx', { cwd: componentsDir });

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if CodeBlock is already imported
  const hasCodeBlockImport = content.includes('from "../../../../src/components/code-block"') ||
                             content.includes("from '../../../../src/components/code-block'");

  // Add import if not present
  if (!hasCodeBlockImport && (content.includes('<pre') || content.includes('<code'))) {
    // Find the last import statement
    const importMatch = content.match(/(import .+ from .+;\n)+/);
    if (importMatch) {
      const lastImport = importMatch[0].trim().split('\n').pop();
      const importLine = lastImport.replace(/from ['"].+['"];/, '');
      const newImport = `import { CodeBlock } from "../../../../src/components/code-block";`;
      
      // Add after last import
      content = content.replace(importMatch[0], importMatch[0] + newImport + '\n');
      modified = true;
    }
  }

  // Replace Install section: <pre><code>command</code></pre> -> <CodeBlock language="bash">command</CodeBlock>
  content = content.replace(
    /<h2[^>]*>Install<\/h2>\s*<pre>\s*<code>([^<]+)<\/code>\s*<\/pre>/gi,
    (match, code) => {
      modified = true;
      return `<h2 id="install">Install</h2>\n      <CodeBlock language="bash">${code.trim()}</CodeBlock>`;
    }
  );

  // Replace Install section: <pre><code>command</code></pre> (single line)
  content = content.replace(
    /<h2[^>]*>Install<\/h2>\s*<pre><code>([^<]+)<\/code><\/pre>/gi,
    (match, code) => {
      modified = true;
      return `<h2 id="install">Install</h2>\n      <CodeBlock language="bash">${code.trim()}</CodeBlock>`;
    }
  );

  // Replace Code/Code Examples sections with className
  content = content.replace(
    /<h2[^>]*(?:id="code"|id="code-examples")[^>]*>Code(?: Examples)?<\/h2>\s*<pre[^>]*className="[^"]*"[^>]*>\s*<code>\{`([^`]+)`\}\}<\/code>\s*<\/pre>/gs,
    (match, code) => {
      modified = true;
      return `<h2 id="code">Code</h2>\n      <CodeBlock language="typescript">{\`${code}\`}</CodeBlock>`;
    }
  );

  // Replace Code sections without className
  content = content.replace(
    /<h2[^>]*(?:id="code"|id="code-examples")[^>]*>Code(?: Examples)?<\/h2>\s*<pre>\s*<code>\{`([^`]+)`\}\}<\/code>\s*<\/pre>/gs,
    (match, code) => {
      modified = true;
      return `<h2 id="code">Code</h2>\n      <CodeBlock language="typescript">{\`${code}\`}</CodeBlock>`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(componentsDir, filePath)}`);
    return true;
  }
  return false;
}

let updatedCount = 0;
files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (updateFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files.`);

