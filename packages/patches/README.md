# @fragment_ui/patches

Overlay patches system for managing upstream (shadcn/ui) modifications in Fragment UI.

## Overview

This package provides tools for:
- Creating and managing patches for upstream components
- Applying patches after upstream updates
- Detecting and resolving conflicts
- Managing rebase process

## Installation

```bash
pnpm install @fragment_ui/patches
```

## Usage

### List Patches

```bash
pnpm --filter @fragment_ui/patches list
```

### Apply Patch

```bash
pnpm --filter @fragment_ui/patches apply <patch-id>
```

### Check Patch

```bash
pnpm --filter @fragment_ui/patches check <patch-id>
```

### Start Rebase

```bash
pnpm --filter @fragment_ui/patches rebase <from-version> <to-version>
```

### Generate Report

```bash
pnpm --filter @fragment_ui/patches report
```

## Patch Structure

Patches are stored in `packages/patches/` directory as JSON files. Each patch contains:

- **Metadata** - ID, component name, versions, description
- **Target File** - Path to file in `packages/ui/src`
- **Changes** - Array of modifications (insert, delete, replace)

## Documentation

See [Upstream Rebase Process](../../docs/guides/upstream-rebase-process.md) for detailed documentation.

## License

MIT

