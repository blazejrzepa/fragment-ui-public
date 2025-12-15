---
title: CLI Usage Guide
---

The Fragment UI CLI (`ds`) is a command-line tool that helps you manage components 
in your project. It provides commands for adding, updating, removing, and checking 
components, making it easy to maintain your design system integration.

## Key Features

- Add components to your project with a single command
- Update components to latest versions
- Check component installation status
- List all available components
- Remove components when no longer needed

## Installation

The CLI is available as a package in the Fragment UI monorepo. To use it locally:

```bash
# Build the CLI
cd packages/cli
pnpm build

# Use directly
node dist/index.js <command>

# Or install globally (when published)
npm install -g @fragment_ui/cli
ds <command>
```

## Commands

### ds add &lt;component&gt;

Add a component to your project.

```bash
ds add button
ds add input
ds add dialog
```

### ds list

List all available components.

```bash
ds list
```

### ds check

Check which components are installed in your project.

```bash
ds check
```

### ds update &lt;component&gt;

Update a component to the latest version.

```bash
ds update button
ds update --all
```

### ds remove &lt;component&gt;

Remove a component from your project.

```bash
ds remove button
```

### ds init

Initialize Fragment UI in your project.

```bash
ds init
```

## Examples

```bash
# Add multiple components
ds add button input dialog

# Check what's installed
ds check

# Update all components
ds update --all

# Remove unused components
ds remove old-component
```

## Learn More

- [CLI Documentation](/docs/guides/cli-usage)
- [Available Components](/components)

