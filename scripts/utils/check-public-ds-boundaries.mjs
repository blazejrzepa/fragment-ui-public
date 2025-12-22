#!/usr/bin/env node
/**
 * Script to check dependency boundaries for public packages
 * 
 * Verifies that public packages (@fragment_ui/ui, @fragment_ui/tokens, @fragment_ui/blocks)
 * do not import from:
 * - apps/* (internal apps)
 * - internal packages marked private: true
 * 
 * Based on OSS_PUBLIC_DS_GUIDELINES.md §4: Dependency Boundaries
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Script is in scripts/utils/, so go up two levels to get to project root
const rootDir = join(__dirname, "../..");

const PUBLIC_PACKAGES = [
  "packages/ui",
  "packages/tokens",
  "packages/blocks",
];

const INTERNAL_PACKAGES = [
  "@fragment_ui/mcp-server",
  "@fragment_ui/patches",
  "@fragment_ui/plugin-system",
  "@fragment_ui/scaffolds",
  "@fragment_ui/studio-core",
  "@fragment_ui/telemetry",
  "@fragment_ui/ui-dsl",
  "@fragment_ui/blocks-recipes",
  "@fragment_ui/registry",
  "@fragment_ui/utils",
  "@fragment_ui/cli",
  "@fragment_ui/ui-native",
  "fragment-ui",
];

const INTERNAL_PATTERNS = [
  /^apps\//,
  /^@fragment\/(mcp-server|patches|plugin-system|scaffolds|studio-core|telemetry|ui-dsl|blocks-recipes|registry|utils|cli|ui-native)/,
  /^fragment-ui$/,
];

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, .git, etc.
      if (!file.startsWith(".") && file !== "node_modules" && file !== "dist") {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".jsx")) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath, packageName) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const errors = [];
  
  lines.forEach((line, index) => {
    // Match import statements
    const importMatch = line.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      const source = importMatch[1];
      
      // Skip relative imports
      if (source.startsWith(".")) {
        return;
      }
      
      // Check if it's an internal import
      const isInternal = INTERNAL_PACKAGES.some(pkg => 
        source === pkg || source.startsWith(pkg + "/")
      ) || INTERNAL_PATTERNS.some(pattern => pattern.test(source));
      
      if (isInternal) {
        errors.push({
          line: index + 1,
          source,
          file: relative(rootDir, filePath),
        });
      }
    }
  });
  
  return errors;
}

function main() {
  let hasErrors = false;
  
  for (const packagePath of PUBLIC_PACKAGES) {
    const fullPath = join(rootDir, packagePath);
    const srcPath = join(fullPath, "src");
    
    if (!statSync(srcPath).isDirectory()) {
      continue;
    }
    
    const files = getAllFiles(srcPath);
    const packageName = packagePath.split("/")[1];
    
    console.log(`\nChecking ${packageName}...`);
    
    for (const file of files) {
      const errors = checkFile(file, packageName);
      
      if (errors.length > 0) {
        hasErrors = true;
        errors.forEach((error) => {
          console.error(
            `❌ ${error.file}:${error.line} - Public package cannot import from internal '${error.source}'`
          );
        });
      }
    }
  }
  
  if (hasErrors) {
    console.error("\n❌ Dependency boundary violations found!");
    console.error("Public packages must not import from internal packages or apps/*");
    process.exit(1);
  } else {
    console.log("\n✅ All dependency boundaries are correct!");
  }
}

main();

