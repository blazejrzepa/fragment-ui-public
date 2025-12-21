# Fragment UI CLI - Usage Guide

Complete guide for using the Fragment UI CLI tool.

## Installation

The CLI is included in the Fragment UI monorepo. To use it locally:

```bash
# Build the CLI
pnpm --filter @fragment_ui/cli build

# Use directly
node packages/cli/dist/index.js <command>
```

Or install globally (when published):

```bash
npm install -g @fragment_ui/cli
# or
pnpm add -g @fragment_ui/cli
```

## Commands

### `ds help`

Show help message with all available commands.

```bash
ds help
```

### `ds list`

List all available components and blocks in the Fragment UI registry.

```bash
ds list
```

**Output:**
- Total component count
- UI Components (sorted alphabetically)
- Blocks (sorted alphabetically)
- Installation instructions

**Example:**
```
📦 Fragment UI Components

Total: 49 components

🎨 UI Components:
  • accordion              (1 file)
  • alert                  (1 file)
  • avatar                 (1 file)
  • badge                  (1 file)
  • button                 (2 files)
  ...

🧩 Blocks:
  • authentication-block   (1 file)
  • card-grid              (1 file)
  • dashboard-layout       (1 file)
  ...

💡 Install a component:
   npx shadcn@latest add https://fragment-ui.dev/r/<component>.json
```

### `ds check [path]`

Check installed components in a project and verify dependencies.

```bash
# Check current directory
ds check

# Check specific project
ds check /path/to/project
```

**Features:**
- Lists installed components
- Lists available components
- Checks for required dependencies (react, react-dom)
- Shows missing dependencies if any

**Example:**
```
🔍 Fragment UI Component Check

Project: /path/to/project

✅ Installed (5):
   • button
   • input
   • dialog
   • card
   • select

📦 Available (44):
   • accordion
   • alert
   • avatar
   ...

✅ All required dependencies installed
```

### `ds init [path]`

Initialize Fragment UI in a project.

```bash
# Initialize in current directory
ds init

# Initialize in specific directory
ds init /path/to/project
```

**What it does:**
- Creates `components/ui/` directory
- Creates `components/blocks/` directory
- Creates `components.json` if it doesn't exist
- Sets up basic configuration

### `ds update <component> [path]`

Update a component to the latest version.

```bash
# Update button component
ds update button

# Update in specific project
ds update button /path/to/project
```

**Note:** Full update functionality is coming soon. For now, it provides instructions to reinstall the component.

### `ds remove <component> [path]`

Remove a component from a project.

```bash
# Remove button component
ds remove button

# Remove from specific project
ds remove button /path/to/project
```

**What it does:**
- Removes component files
- Cleans up empty directories
- Provides instructions for manual cleanup (imports, dependencies)

### `ds plugin list [path]`

List all installed plugins.

```bash
# List plugins in current directory
ds plugin list

# List plugins in specific directory
ds plugin list /path/to/project
```

**Output:**
- Total plugin count
- Plugin details (name, version, capabilities)
- Plugin directory location

### `ds plugin run <plugin-id> [action]`

Run a plugin action.

```bash
# Run plugin action
ds plugin run theme-preset-plugin transform
```

## Examples

### Complete Workflow

```bash
# 1. Initialize project
ds init

# 2. List available components
ds list

# 3. Install components (using shadcn CLI)
npx shadcn@latest add https://fragment-ui.dev/r/button.json
npx shadcn@latest add https://fragment-ui.dev/r/input.json

# 4. Check installation
ds check

# 5. Update a component
ds update button

# 6. Remove a component
ds remove input

# 7. List plugins
ds plugin list
```

## Integration with shadcn CLI

Fragment UI components are installed using the `shadcn` CLI:

```bash
# Install a component
npx shadcn@latest add https://fragment-ui.dev/r/button.json

# Install a block
npx shadcn@latest add https://fragment-ui.dev/r/dashboard-layout.json
```

The `ds` CLI helps you:
- Discover available components (`ds list`)
- Check your installation (`ds check`)
- Manage components (`ds update`, `ds remove`)
- Initialize projects (`ds init`)
- Manage plugins (`ds plugin`)

## Troubleshooting

### Component not found

If `ds check` doesn't find installed components:

1. Ensure components are in `components/ui/` or `components/blocks/`
2. Check file naming matches component name
3. Verify files have `.tsx` extension

### Missing dependencies

If `ds check` reports missing dependencies:

```bash
# Install missing dependencies
npm install react react-dom
# or
pnpm add react react-dom
```

### Plugin not found

If `ds plugin list` doesn't find plugins:

1. Ensure plugins are in `.fragment/plugins/` directory
2. Check each plugin has `plugin.json` file
3. Verify plugin entry point exists

---

*Last updated: 2025-01-05*

