# Fragment UI CLI

Command-line interface for Fragment UI design system.

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

### `ds add <name>`

Create/verify documentation page for a component (internal use).

```bash
ds add button
```

### `ds plugin list`

List all installed plugins.

```bash
ds plugin list
```

### `ds plugin run <id> [action]`

Run a plugin action.

```bash
ds plugin run theme-preset default
```

### `ds patch list`

List all overlay patches for managing upstream (shadcn/ui) customizations.

```bash
ds patch list
```

**Output:**
- Lists all available patches
- Shows component name, description, and reason for each patch

### `ds patch apply <patch-id>`

Apply a patch to a component.

```bash
ds patch apply button-loading-state-example
```

**What it does:**
- Applies the patch to the target component
- Checks for conflicts before applying
- Updates patch metadata

### `ds patch check <patch-id>`

Check if a patch can be applied (dry-run).

```bash
ds patch check button-loading-state-example
```

**What it does:**
- Checks if patch can be applied without conflicts
- Shows any conflicts if they exist
- Does not modify any files

## Examples

```bash
# List all available components
ds list

# Initialize Fragment UI in your project
ds init

# Check what's installed
ds check

# Remove a component
ds remove button

# Update a component
ds update button
```

## Integration with shadcn CLI

Fragment UI components are installed using the `shadcn` CLI:

```bash
# Install a component
npx shadcn@latest add https://fragmentui.com/r/button.json

# Install a block
npx shadcn@latest add https://fragmentui.com/r/dashboard-layout.json
```

The `ds` CLI helps you:
- Discover available components (`ds list`)
- Check your installation (`ds check`)
- Manage components (`ds update`, `ds remove`)
- Initialize projects (`ds init`)
- Manage plugins (`ds plugin list`, `ds plugin run`)
- Manage patches (`ds patch list`, `ds patch apply`, `ds patch check`)

## Development

```bash
# Build
pnpm --filter @fragment_ui/cli build

# Test locally
node packages/cli/dist/index.js list
```

## Roadmap

- [x] List components
- [x] Check installation
- [x] Initialize project
- [x] Remove components
- [x] Plugin management
- [x] Patch management
- [ ] Full update functionality (smart diffing)
- [ ] Dependency checking per component
- [ ] Version management
- [ ] Batch operations (install/remove multiple components)

## License

[Add your license here]

