#!/usr/bin/env node
/**
 * Script to publish Code Connect mappings to Figma using Figma API
 * 
 * Usage:
 *   export FIGMA_TOKEN='your-token'
 *   node scripts/publish-figma-code-connect.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_TOKEN or FIGMA_ACCESS_TOKEN environment variable is required');
  console.error('   Set it with: export FIGMA_TOKEN="your-token"');
  process.exit(1);
}

// Parse button.ts to extract connection info
async function parseCodeConnectFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  
  // Extract figmaNode URL
  const figmaNodeMatch = content.match(/figmaNode:\s*"([^"]+)"/);
  if (!figmaNodeMatch) {
    throw new Error(`Could not find figmaNode in ${filePath}`);
  }
  
  const figmaNodeUrl = figmaNodeMatch[1];
  
  // Extract node ID from URL
  const nodeIdMatch = figmaNodeUrl.match(/node-id=([^&]+)/);
  if (!nodeIdMatch) {
    throw new Error(`Could not extract node-id from ${figmaNodeUrl}`);
  }
  
  const nodeId = decodeURIComponent(nodeIdMatch[1]);
  
  // Extract file key from URL (supports both /file/ and /design/ formats)
  const fileKeyMatch = figmaNodeUrl.match(/(?:file|design)\/([^\/\?]+)/);
  if (!fileKeyMatch) {
    throw new Error(`Could not extract file key from ${figmaNodeUrl}`);
  }
  
  const fileKey = fileKeyMatch[1];
  
  // Extract component name
  const componentNameMatch = content.match(/figmaComponentName:\s*"([^"]+)"/);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'Unknown';
  
  return {
    fileKey,
    nodeId,
    componentName,
    figmaNodeUrl,
  };
}

// Publish dev resource to Figma
async function publishDevResource(fileKey, nodeId, devResource) {
  // Convert node-id format (1304-13481) to Figma format (1304:13481)
  const figmaNodeId = nodeId.replace(/-/g, ':');
  
  // Try different endpoints and methods
  const attempts = [
    // POST with node_id in body
    {
      url: `https://api.figma.com/v1/files/${fileKey}/dev_resources`,
      method: 'POST',
      body: {
        dev_resources: [
          {
            node_id: figmaNodeId,
            ...devResource,
          }
        ]
      }
    },
    // PUT with node_id in path
    {
      url: `https://api.figma.com/v1/files/${fileKey}/nodes/${figmaNodeId}/dev_resources`,
      method: 'PUT',
      body: {
        dev_resources: [devResource]
      }
    },
    // POST with original node_id format
    {
      url: `https://api.figma.com/v1/files/${fileKey}/dev_resources`,
      method: 'POST',
      body: {
        dev_resources: [
          {
            node_id: nodeId,
            ...devResource,
          }
        ]
      }
    }
  ];
  
  for (const attempt of attempts) {
    try {
      console.log(`   Trying: ${attempt.method} ${attempt.url}`);
      console.log(`   Node ID format: ${attempt.body.dev_resources[0].node_id}`);
      
      const response = await fetch(attempt.url, {
        method: attempt.method,
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attempt.body),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Success with ${attempt.method} ${attempt.url}`);
        return result;
      }
      
      const errorText = await response.text();
      console.log(`   ❌ ${attempt.method} ${attempt.url} failed: ${response.status} ${errorText}`);
      
      // If not 404, don't try other methods
      if (response.status !== 404) {
        throw new Error(`Failed to publish dev resource: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      // Continue to next attempt
    }
  }
  
  throw new Error('All attempts to publish dev resource failed');
}

async function main() {
  try {
    console.log('🚀 Publishing Code Connect mappings to Figma...\n');
    
    const codeConnectDir = join(rootDir, 'figma-code-connect');
    const files = await readdir(codeConnectDir);
    const tsFiles = files.filter(f => f.endsWith('.ts') && f !== 'README.md');
    
    if (tsFiles.length === 0) {
      console.log('⚠️  No Code Connect files found in figma-code-connect/');
      return;
    }
    
    for (const file of tsFiles) {
      const filePath = join(codeConnectDir, file);
      console.log(`📄 Processing ${file}...`);
      
      try {
        const info = await parseCodeConnectFile(filePath);
        
        // Skip files with placeholder values
        if (info.fileKey === 'YOUR_FILE_ID' || info.nodeId === 'YOUR_NODE_ID') {
          console.log(`   ⏭️  Skipping ${file} - contains placeholder values`);
          continue;
        }
        
        console.log(`   Component: ${info.componentName}`);
        console.log(`   File Key: ${info.fileKey}`);
        console.log(`   Node ID: ${info.nodeId}`);
        
        // Create dev resource pointing to GitHub
        const githubUrl = `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/${info.componentName.toLowerCase()}.tsx`;
        console.log(`   GitHub URL: ${githubUrl}`);
        
        const devResource = {
          type: 'GITHUB_FILE',
          url: githubUrl,
        };
        
        console.log(`   Publishing dev resource...`);
        await publishDevResource(info.fileKey, info.nodeId, devResource);
        console.log(`   ✅ Published!\n`);
        
      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error.message);
      }
    }
    
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

