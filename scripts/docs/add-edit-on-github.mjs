import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const componentsDir = path.join(rootDir, 'apps/www/app/docs/components');

function addEditOnGitHub(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if EditOnGitHub is used in JSX (not in code blocks)
  const hasEditOnGitHubInJSX = /<EditOnGitHub\s/.test(content);
  
  // Find the import section (everything before first export or function declaration)
  const importSectionMatch = content.match(/^([\s\S]*?)(?=^export|^function|^const|^let|^var|^class)/m);
  const importSection = importSectionMatch ? importSectionMatch[1] : '';
  
  // Check if import exists in the import section (not in code blocks)
  const hasImportInSection = /^import\s+.*EditOnGitHub.*from/m.test(importSection);
  
  // Skip if already has EditOnGitHub component AND import
  if (hasEditOnGitHubInJSX && hasImportInSection) {
    console.log(`✓ Already has EditOnGitHub: ${path.relative(rootDir, filePath)}`);
    return false;
  }
  
  // Skip if doesn't have DocLayout or article (not a documentation page)
  if (!content.includes('DocLayout') && !content.includes('<article')) {
    console.log(`⊘ Skipping (no DocLayout/article): ${path.relative(rootDir, filePath)}`);
    return false;
  }
  
  let newContent = content;
  
  // Add import if not present in import section
  if (!hasImportInSection) {
    // Find the last import statement
    const importRegex = /^import .+ from .+;$/gm;
    const imports = content.match(importRegex) || [];
    const lastImport = imports[imports.length - 1];
    
    if (lastImport) {
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      newContent = 
        content.slice(0, insertIndex) + 
        '\nimport { EditOnGitHub } from "../../../../src/components/edit-on-github";' +
        content.slice(insertIndex);
    } else {
      // If no imports, add at the beginning after "use client" if present
      if (content.startsWith('"use client";')) {
        newContent = content.replace(
          '"use client";',
          '"use client";\n\nimport { EditOnGitHub } from "../../../../src/components/edit-on-github";'
        );
      } else {
        newContent = 'import { EditOnGitHub } from "../../../../src/components/edit-on-github";\n' + content;
      }
    }
  }
  
  // Add EditOnGitHub component before closing DocLayout or article (only if not already present)
  if (!hasEditOnGitHubInJSX) {
    // Find the closing </DocLayout> or </article> tag
    let closeRegex = /(\s*)<\/DocLayout>/;
    let match = newContent.match(closeRegex);
    
    if (!match) {
      closeRegex = /(\s*)<\/article>/;
      match = newContent.match(closeRegex);
    }
    
    if (match) {
      const indent = match[1];
      const relativePath = path.relative(rootDir, filePath);
      const editOnGitHub = `\n${indent}<EditOnGitHub filePath="${relativePath}" />`;
      
      newContent = newContent.replace(
        closeRegex,
        editOnGitHub + '\n' + match[0]
      );
    } else {
      console.log(`✗ Could not find </DocLayout> or </article> in: ${path.relative(rootDir, filePath)}`);
      return false;
    }
  }
  
  // Write file if we made changes
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Added/fixed EditOnGitHub: ${path.relative(rootDir, filePath)}`);
    return true;
  } else {
    console.log(`⊘ No changes needed: ${path.relative(rootDir, filePath)}`);
    return false;
  }
}

// Find all page.tsx files in components directory
function findPageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const pageFiles = findPageFiles(componentsDir);
console.log(`Found ${pageFiles.length} page.tsx files\n`);

let added = 0;
let skipped = 0;

for (const file of pageFiles) {
  const result = addEditOnGitHub(file);
  if (result) {
    added++;
  } else {
    skipped++;
  }
}

console.log(`\n✓ Added EditOnGitHub to ${added} files`);
console.log(`⊘ Skipped ${skipped} files (already have it or not applicable)`);

