#!/usr/bin/env node

/**
 * Script to create GitHub Release for v1.8.0
 * Usage: node scripts/create-github-release.mjs [GITHUB_TOKEN]
 */

import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSION = 'v1.8.0';
const REPO = 'blazejrzepa/fragment-ui';

// Get GitHub token from argument or environment variable
const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('Error: GitHub token is required');
  console.error('Usage: node scripts/create-github-release.mjs [GITHUB_TOKEN]');
  console.error('Or set GITHUB_TOKEN environment variable');
  process.exit(1);
}

// Release notes from CHANGELOG
const RELEASE_NOTES = `### 🎉 Components & Performance Release

#### Added

**New Components (5 components):**
- **Segmented Control** - iOS-style segmented control for selecting mutually exclusive options
- **Rating** - Star rating component with half-star support and read-only mode
- **File Upload / Dropzone** - File upload with drag & drop, preview, and validation
- **Split Button** - Button combining primary action with dropdown menu
- **Tag Input** - Input field for multiple tags with autocomplete

**Performance Optimizations:**
- **React.memo** - Applied to 18+ components to prevent unnecessary re-renders
- **useMemo/useCallback** - Optimized expensive calculations and event handlers
- **Loading States** - Consistent loading indicators across components
- **Error States** - Enhanced error handling and validation feedback

**Advanced Features:**
- **Component Usage Analytics Dashboard** - Track component installations, views, and popularity
- **Component Migration Assistant** - Automated migrations between versions using AST transformations
- **Design System Governance Dashboard** - Track compliance, metrics, and issues

**Developer Experience:**
- **Upstream Patches System** - Manage customizations to upstream (shadcn/ui) components
- **Rebase Process** - Documented process for managing upstream updates

**UI Improvements:**
- **Dark Mode as Default** - Dark mode is now the default theme
- **Improved Navigation** - Enhanced sidebar and top navigation with better spacing and layout
- **Table of Contents** - Dynamic table of contents in right sidebar for documentation pages
- **Consistent Headers** - Standardized headers and subtitles across all documentation pages

#### Changed

- **Default Theme** - Changed from "system" to "dark" mode
- **Navigation Layout** - Improved spacing and layout in sidebar and top navigation
- **Documentation Structure** - All example pages now have consistent headers and formatting

#### Technical Details

- **Total Components:** 58 → 63 (added 5 new components)
- **Performance:** 18+ components optimized with React.memo
- **Documentation:** 24 example pages updated with consistent formatting`;

// Create release payload
const payload = JSON.stringify({
  tag_name: VERSION,
  name: `${VERSION} - Components & Performance Release`,
  body: RELEASE_NOTES,
  draft: false,
  prerelease: false,
  generate_release_notes: true,
});

const options = {
  hostname: 'api.github.com',
  path: `/repos/${REPO}/releases`,
  method: 'POST',
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'User-Agent': 'Fragment-UI-Release-Script',
  },
};

console.log(`Creating GitHub Release for ${VERSION}...`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 201) {
        console.log(`✅ Successfully created GitHub Release for ${VERSION}`);
        console.log(`🔗 View release at: https://github.com/${REPO}/releases/tag/${VERSION}`);
        console.log(`📦 Release URL: ${response.html_url}`);
      } else if (res.statusCode === 422) {
        console.log(`⚠️  Release for ${VERSION} already exists`);
        console.log(`🔗 View release at: https://github.com/${REPO}/releases/tag/${VERSION}`);
      } else {
        console.error(`❌ Failed to create release (HTTP ${res.statusCode})`);
        console.error(response.message || data);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to parse response');
      console.error(data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(payload);
req.end();

