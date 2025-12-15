# Publishing Packages to npm

## 📦 Packages to Publish

1. `@fragment_ui/ui` - UI components library
2. `@fragment_ui/tokens` - Design tokens
3. `@fragment_ui/blocks` - Layout blocks
4. `@fragment_ui/mcp-server` - MCP server

## 🔐 Step 1: Log in to npm

```bash
npm login
```

Enter:
- Username
- Password
- Email
- OTP (if you have 2FA)

Check if you're logged in:
```bash
npm whoami
```

## 📝 Step 2: Check Package Versions

```bash
cd fragment-ui-public

# Check versions
cat packages/ui/package.json | grep '"version"'
cat packages/tokens/package.json | grep '"version"'
cat packages/blocks/package.json | grep '"version"'
cat packages/mcp-server/package.json | grep '"version"'
```

## 🏗️ Step 3: Build All Packages

```bash
pnpm build
```

## 📤 Step 4: Publish Packages

### Option A: Publish All at Once

```bash
# From repository root
pnpm --filter @fragment_ui/ui publish --access public
pnpm --filter @fragment_ui/tokens publish --access public
pnpm --filter @fragment_ui/blocks publish --access public
pnpm --filter @fragment_ui/mcp-server publish --access public
```

### Option B: Publish Individually (Recommended for First Publication)

```bash
# 1. UI
cd packages/ui
pnpm publish --access public

# 2. Tokens
cd ../tokens
pnpm publish --access public

# 3. Blocks
cd ../blocks
pnpm publish --access public

# 4. MCP Server
cd ../mcp-server
pnpm publish --access public
```

## ✅ Step 5: Verify Publication

Check on npm:
- https://www.npmjs.com/package/@fragment_ui/ui
- https://www.npmjs.com/package/@fragment_ui/tokens
- https://www.npmjs.com/package/@fragment_ui/blocks
- https://www.npmjs.com/package/@fragment_ui/mcp-server

## ⚠️ Important Notes

1. **Versioning**: After publication, each subsequent change requires version increment
2. **Dry run**: You can test first with `--dry-run`:
   ```bash
   pnpm --filter @fragment_ui/ui publish --dry-run
   ```
3. **OTP**: If you have 2FA, you'll need OTP for each publication
4. **Registry**: Make sure you're publishing to the correct registry (npmjs.org)

## 🔄 Version Update

After changes, update version in `package.json`:
- Patch: `1.0.0` → `1.0.1` (bug fixes)
- Minor: `1.0.0` → `1.1.0` (new features)
- Major: `1.0.0` → `2.0.0` (breaking changes)

Or use Changesets (better for monorepo):
```bash
pnpm add -D @changesets/cli
pnpm changeset init
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

## 🎯 After Publication

1. Update README with links to npm
2. Create GitHub Release
3. Update documentation with installation instructions
