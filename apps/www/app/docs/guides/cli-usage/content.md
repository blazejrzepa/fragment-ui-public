---
title: CLI Usage Guide
---

The Fragment UI CLI (`fragmentui`, alias `ds`) helps you install and manage Fragment UI
components and blocks in your project. It installs files from the registry into your repo
(code-first distribution, similar to shadcn).

## Key Features

- Install components/blocks from the registry into your codebase
- Initialize a project (`components/ui`, `components/blocks`, `components.json`)
- Check component installation status
- List all available components
- Remove installed components
- Patch & plugin utilities (advanced)

## Installation

### Use without installing (recommended)

```bash
npx fragmentui@latest --help
```

### Install globally (optional)

```bash
npm install -g fragmentui
# or: pnpm add -g fragmentui

fragmentui --help
# alias:
ds --help
```

### Develop locally (monorepo)

```bash
# Build the CLI
pnpm --filter fragmentui build

# Use directly
node packages/cli/dist/index.js <command>
```

## Commands

The primary entrypoint is `fragmentui`, and `ds` is an alias.

### fragmentui add &lt;name&gt; [path] [--overwrite]

Install a component (or block) from the registry into your project.

Registry URL pattern: `https://fragmentui.com/r/[name].json`

```bash
npx fragmentui@latest add button
npx fragmentui@latest add dashboard-layout

# Overwrite existing files
npx fragmentui@latest add button --overwrite

# Target a specific project directory
npx fragmentui@latest add button ./my-app
```

### fragmentui list

List all available components.

```bash
npx fragmentui@latest list
```

### fragmentui check [path]

Check which components are installed in your project.

```bash
npx fragmentui@latest check
npx fragmentui@latest check ./my-app
```

### fragmentui init [path]

Initialize Fragment UI in a project (creates `components/ui`, `components/blocks`, and `components.json`).

```bash
npx fragmentui@latest init
npx fragmentui@latest init ./my-app
```

### fragmentui update &lt;name&gt; [path]

Update is currently **instructional**: it tells you how to reinstall the component (full smart updates are coming).

```bash
npx fragmentui@latest update button
```

### fragmentui remove &lt;name&gt; [path]

Remove a component from your project.

```bash
npx fragmentui@latest remove button
```

### fragmentui plugin list / fragmentui plugin run

Plugin management (advanced).

```bash
npx fragmentui@latest plugin list
npx fragmentui@latest plugin run theme-preset default
```

### fragmentui patch list / patch apply / patch check

Overlay patch utilities (advanced).

```bash
npx fragmentui@latest patch list
npx fragmentui@latest patch check <patch-id>
npx fragmentui@latest patch apply <patch-id>
```

## Examples

```bash
# Initialize Fragment UI in the current project
npx fragmentui@latest init

# Install a component
npx fragmentui@latest add button

# Check what's installed
npx fragmentui@latest check

# Remove a component
npx fragmentui@latest remove button
```

## Learn More

- [CLI Documentation](/docs/cli-usage)
- [Available Components](/components)

