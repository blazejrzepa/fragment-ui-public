# 🔄 Workflow: Working with Two Repositories

## 📦 Repository Strategy

### 1. `fragment-ui` (Main Repository)
- **Status**: PRIVATE 🔒
- **Location**: `/Users/blazejrzepa/Dev/fragment-ui`
- **Contents**:
  - ✅ Full monorepo with all packages
  - ✅ Studio/Playground (experimental)
  - ✅ Governance/Submissions
  - ✅ Telemetry
  - ✅ Experimental features
  - ✅ All packages (public and private)
- **Purpose**: 
  - **Main workspace** - where you work daily
  - Private - for development and experimentation
  - Experimental features and testing

### 2. `fragment-ui-public` (Public Repository)
- **Status**: PUBLIC 🌐
- **Location**: `/Users/blazejrzepa/Dev/fragment-ui-public`
- **GitHub**: https://github.com/blazejrzepa/fragment-ui-public
- **Contents**:
  - ✅ Clean design system
  - ✅ `@fragment_ui/ui` - UI components
  - ✅ `@fragment_ui/tokens` - design tokens
  - ✅ `@fragment_ui/blocks` - pre-built blocks
  - ✅ `@fragment_ui/mcp-server` - MCP server
  - ✅ Documentation (`apps/www`)
  - ❌ **Does NOT contain**: Studio/Playground, telemetry, experimental features
- **Purpose**:
  - **Public design system** - stable, production-ready version
  - npm publication
  - Documentation for users
  - Clean version without experimental code

## 🔄 Synchronization Workflow

### Scenario 1: New Feature in UI Component

**When working on a component in `fragment-ui`:**

1. **Work in `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Create new feature, fix bug, etc.
   git add .
   git commit -m "feat(ui): Add new feature to Button"
   ```

2. **When feature is ready and tested**:
   ```bash
   # Copy changes to fragment-ui-public
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   
   # Option A: Copy files manually
   cp -r ../fragment-ui/packages/ui/src/button.tsx packages/ui/src/
   
   # Option B: Use git cherry-pick (if commits are consistent)
   # git remote add upstream ../fragment-ui
   # git fetch upstream
   # git cherry-pick <commit-hash>
   ```

3. **Build and test in public repo**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   pnpm build
   pnpm test
   ```

4. **Update version and publish**:
   ```bash
   # Increment version in package.json
   # Publish to npm
   ./publish.sh
   ```

### Scenario 2: New Component

1. **Create component in `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Create new component
   # Test, develop
   ```

2. **When component is stable**:
   ```bash
   # Copy component to fragment-ui-public
   cp -r ../fragment-ui/packages/ui/src/new-component.tsx packages/ui/src/
   cp -r ../fragment-ui/packages/ui/src/new-component.test.tsx packages/ui/src/
   
   # Update exports
   # packages/ui/src/index.ts
   export * from "./new-component";
   ```

3. **Build, test, publish**:
   ```bash
   pnpm build
   pnpm test
   # Increment version
   ./publish.sh
   ```

### Scenario 3: Documentation Update

1. **Update documentation in `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Edit apps/www
   ```

2. **Copy to `fragment-ui-public`**:
   ```bash
   # Copy documentation changes
   cp -r ../fragment-ui/apps/www/src/app/docs/components/button.mdx \
         apps/www/src/app/docs/components/
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "docs: Update button documentation"
   git push
   ```

### Scenario 4: Design Tokens Update

1. **Change tokens in `fragment-ui`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui
   # Edit packages/tokens/src/...
   pnpm --filter @fragment_ui/tokens build
   ```

2. **Copy to `fragment-ui-public`**:
   ```bash
   cd /Users/blazejrzepa/Dev/fragment-ui-public
   cp -r ../fragment-ui/packages/tokens/src/* packages/tokens/src/
   pnpm --filter @fragment_ui/tokens build
   ```

3. **Update version and publish**:
   ```bash
   # Increment version in packages/tokens/package.json
   ./publish.sh
   ```

## 🛠️ Helper Tools

### Synchronization Script (Optional)

You can create a `sync-to-public.sh` script:

```bash
#!/bin/bash
# Script to sync selected packages from fragment-ui to fragment-ui-public

SOURCE_DIR="/Users/blazejrzepa/Dev/fragment-ui"
TARGET_DIR="/Users/blazejrzepa/Dev/fragment-ui-public"

# Sync UI
echo "Syncing @fragment_ui/ui..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/ui/src/" \
  "$TARGET_DIR/packages/ui/src/"

# Sync tokens
echo "Syncing @fragment_ui/tokens..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/tokens/src/" \
  "$TARGET_DIR/packages/tokens/src/"

# Sync blocks
echo "Syncing @fragment_ui/blocks..."
rsync -av --exclude='node_modules' --exclude='dist' \
  "$SOURCE_DIR/packages/blocks/src/" \
  "$TARGET_DIR/packages/blocks/src/"

echo "✅ Synchronization complete!"
```

## 📋 Pre-Sync Checklist

Before copying changes to `fragment-ui-public`:

- [ ] Code is tested in `fragment-ui`
- [ ] No dependencies on Studio/Playground/telemetry
- [ ] No experimental features
- [ ] Code is production-ready
- [ ] Documentation is updated
- [ ] Tests pass
- [ ] No hardcoded secrets/API keys

## 🎯 When to Sync?

**Sync regularly:**
- After stable changes to UI components
- After design tokens updates
- After adding new blocks
- After documentation updates
- Before publishing to npm

**DO NOT sync:**
- Experimental features
- Studio/Playground changes
- Telemetry changes
- Internal tools

## 🚀 Publishing to npm

After sync and verification:

1. **Increment version** in `package.json`
2. **Build packages**: `pnpm build`
3. **Test**: `pnpm test`
4. **Publish**: `./publish.sh`

## 💡 Best Practices

1. **Work in `fragment-ui`** - this is your main workspace
2. **Sync regularly** - don't wait too long
3. **Test in both repos** - make sure everything works
4. **Use semantic versioning** - increment versions appropriately
5. **Document changes** - this will help with synchronization

## ❓ FAQ

**Q: Can I work directly in `fragment-ui-public`?**
A: Yes, but it's better to work in `fragment-ui` and sync, to have full context.

**Q: How often to sync?**
A: Depends on work pace. Once a week is a good rhythm, but you can do it more often.

**Q: What if I forget to sync?**
A: You can always go back to a commit in `fragment-ui` and copy changes later.

**Q: Can I automate synchronization?**
A: Yes, you can use a script (see above) or GitHub Actions.
