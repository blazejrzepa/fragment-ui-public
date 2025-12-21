#!/bin/bash

# Script to create GitHub Release for v1.8.0
# Usage: ./scripts/create-github-release.sh [GITHUB_TOKEN]

set -e

VERSION="v1.8.0"
REPO="blazejrzepa/fragment-ui"

# Get GitHub token from argument or environment variable
GITHUB_TOKEN="${1:-${GITHUB_TOKEN}}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token is required"
  echo "Usage: $0 [GITHUB_TOKEN]"
  echo "Or set GITHUB_TOKEN environment variable"
  exit 1
fi

# Release notes from CHANGELOG
RELEASE_NOTES=$(cat <<'EOF'
### 🎉 Components & Performance Release

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
- **Documentation:** 24 example pages updated with consistent formatting
EOF
)

# Create release using GitHub API
echo "Creating GitHub Release for $VERSION..."

# Create temporary JSON file
TEMP_JSON=$(mktemp)
cat > "$TEMP_JSON" <<EOF
{
  "tag_name": "$VERSION",
  "name": "$VERSION - Components & Performance Release",
  "body": $(echo "$RELEASE_NOTES" | jq -Rs .),
  "draft": false,
  "prerelease": false,
  "generate_release_notes": true
}
EOF

# Make API request
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/$REPO/releases" \
  -d "@$TEMP_JSON")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

# Cleanup
rm -f "$TEMP_JSON"

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ Successfully created GitHub Release for $VERSION"
  echo "🔗 View release at: https://github.com/$REPO/releases/tag/$VERSION"
elif [ "$HTTP_CODE" -eq 422 ]; then
  echo "⚠️  Release for $VERSION already exists"
  echo "🔗 View release at: https://github.com/$REPO/releases/tag/$VERSION"
  exit 0
else
  echo "❌ Failed to create release (HTTP $HTTP_CODE)"
  echo "$RESPONSE_BODY"
  exit 1
fi

