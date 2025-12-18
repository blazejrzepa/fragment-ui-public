---
title: CLI
description: The CLI is available as a package in the Fragment UI monorepo.
---

The Fragment UI CLI provides utilities around the registry-driven install flow (shadcn-style) and a few maintainer helpers.

## What it's for

- **For app projects**: initialize a local structure, list available components, check what you have installed, and get the correct install/update commands.
- **For maintainers of this repo**: generate or verify documentation pages for components.

## Run it locally (from this repo)

This repo contains the CLI package at `packages/cli`.

```bash
# Build the CLI
pnpm --filter @fragment_ui/cli build

# Run via node
node packages/cli/dist/index.js help

# If you have it on PATH as a bin, you can also run:
# ds help
```

## Install components into your app

The CLI does **not** directly install components. Use the registry URL with shadcn:

```bash
npx shadcn@latest add https://fragmentui.com/r/button.json
```

## Commands

### ds init [path]

Initializes a project for Fragment UI by creating `components/ui` and `components/blocks` (plus a basic `components.json` if missing).

```bash
ds init
# or

ds init /absolute/path/to/your-app
```

### ds list

Lists all available components from the registry.

```bash
ds list
```

### ds check [path]

Checks which components are installed in a project.

```bash
ds check
# or

ds check /absolute/path/to/your-app
```

### ds update <name> [path]

At the moment, update is implemented as a **reinstall hint** (it prints the correct command to rerun with `--overwrite`).

```bash
ds update button
```

### ds remove <name> [path]

Removes a component from a project.

```bash
ds remove button
```

### ds add <name>

**Maintainer command**: generates or verifies a documentation page for a component in this repository.

```bash
ds add button
```

### ds plugin list / ds plugin run <id> [action]

Lists installed plugins, or runs a plugin action.

```bash
ds plugin list

ds plugin run your-plugin-id
```

### ds patch list / ds patch apply <id> / ds patch check <id>

Work with overlay patches.

```bash
ds patch list

ds patch check example-patch

ds patch apply example-patch
```
