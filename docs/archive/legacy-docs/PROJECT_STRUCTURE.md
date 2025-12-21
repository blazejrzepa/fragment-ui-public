# Fragment UI - Project Structure

**Last Updated:** 2025-01-XX

---

## 📁 Root Directory Structure

```
fragment-ui/
├── apps/                    # Applications
│   ├── demo/               # Demo app with Playground
│   └── www/                # Design System Portal
├── packages/               # Library packages
│   ├── ui/                 # UI components (63+ components)
│   ├── blocks/             # Pre-built screen compositions
│   ├── tokens/             # Design tokens
│   ├── cli/                # CLI tool
│   ├── telemetry/          # Telemetry & analytics
│   ├── mcp-server/         # MCP Server for AI workflows
│   ├── vscode-extension/   # VS Code Extension
│   └── ...                 # Other packages
├── docs/                   # Documentation (see below)
├── scripts/                # Build & utility scripts
├── .github/                # GitHub workflows
└── [config files]          # Root config files
```

---

## 📚 Documentation Structure

### `/docs` - Main Documentation

```
docs/
├── README.md                          # Documentation index
├── QUICK_START.md                     # Quick start guide
├── USER_GUIDE.md                      # Complete user guide
│
├── api/                               # Component API documentation
│   └── [component-name].md           # Individual component APIs
│
├── copilot/                           # Copilot for Fragment AI Studio
│   ├── README.md                      # Copilot overview
│   ├── contract.md                    # Full specification
│   └── implementation-plan.md         # Implementation plan
│
├── deployment/                         # Deployment & releases
│   ├── deployment.md                  # Deployment guide
│   ├── release-checklist.md          # Release process
│   └── pr-v*.md                       # PR descriptions
│
├── development/                        # Development guides
│   ├── component-implementation-guide.md
│   └── start-implementation.md
│
├── foundations/                        # Design foundations
│   ├── dark-mode.md
│   └── semantic-colors.md
│
├── governance/                        # Governance & processes
│   ├── CONTRIBUTING.md
│   ├── DEPRECATION_POLICY.md
│   ├── RACI_MATRIX.md
│   ├── RFC_PROCESS.md
│   └── RFC_TEMPLATE.md
│
├── guides/                            # How-to guides
│   ├── cli-usage.md
│   ├── mcp-server-setup.md
│   ├── vscode-extension-usage.md
│   ├── figma-*.md                     # Figma integration guides
│   └── ...                            # Other guides
│
├── migrations/                         # Migration guides
│   └── v*.md                          # Version migration guides
│
├── roadmap/                           # Project roadmap & planning
│   ├── project-status.md              # Current project status
│   ├── NEXT_STEPS.md                  # Next steps
│   ├── CRITICAL_GAPS_ANALYSIS.md      # Gap analysis
│   └── v*.md                          # Version-specific plans
│
├── setup/                             # Setup guides
│   └── [setup-guides].md
│
├── testing/                           # Testing documentation
│   ├── component-testing-standards.md # Main testing guide
│   ├── test-guide.md
│   ├── visual-regression.md
│   └── ...                            # Other testing docs
│
├── tools/                             # Tool documentation
│   └── [tool-name]/                   # Per-tool documentation
│
└── troubleshooting/                   # Troubleshooting guides
    └── [issue].md
```

---

## 📄 Root-Level Documentation Files

### Status & Planning
- `STATUS_AND_NEXT_STEPS.md` - Current project status and next steps
- `REMAINING_TASKS_SUMMARY.md` - Comprehensive task list
- `PROJECT_COMPREHENSIVE_SUMMARY.md` - Complete project overview

### Main Documentation
- `README.md` - Main project README
- `CHANGELOG.md` - Version changelog

### Legacy/Archive (to be moved)
- `CO_PILOT_ACTION_PLAN.md` - Legacy plan (superseded by `docs/copilot/`)
- `RAPORT_BLEDOW_RENDEROWANIA.md` - Legacy report (to archive)
- `DEVELOPMENT_ROADMAP.md` - Legacy roadmap (superseded by `docs/roadmap/`)

---

## 🗂️ Apps Documentation

### `/apps/demo/docs/`
- Implementation status documents
- Session summaries
- Playground-specific documentation

**Note:** These should be reviewed and potentially moved to main `/docs` if they're still relevant.

---

## 📦 Package Documentation

Each package should have:
- `README.md` - Package overview and usage
- Package-specific documentation in `/docs` if needed

---

## 🔄 Migration Plan

### Phase 1: Consolidate Status Files
- Move `STATUS_AND_NEXT_STEPS.md` → Keep in root (main status)
- Move `REMAINING_TASKS_SUMMARY.md` → Keep in root (main task list)
- Move `PROJECT_COMPREHENSIVE_SUMMARY.md` → `docs/PROJECT_OVERVIEW.md`

### Phase 2: Archive Legacy Files
- `CO_PILOT_ACTION_PLAN.md` → Archive (superseded by `docs/copilot/`)
- `DEVELOPMENT_ROADMAP.md` → Archive (superseded by `docs/roadmap/`)
- `RAPORT_BLEDOW_RENDEROWANIA.md` → Archive (legacy report)

### Phase 3: Organize Roadmap
- Consolidate roadmap files in `docs/roadmap/`
- Keep only current/active plans
- Archive completed version plans

### Phase 4: Clean Up Apps/Demo/Docs
- Review `apps/demo/docs/` files
- Move relevant docs to main `/docs`
- Archive session summaries

---

## 📝 Documentation Standards

### File Naming
- Use kebab-case: `component-name.md`
- Use descriptive names: `how-to-do-x.md`
- Version-specific: `v1.8.0-feature.md`

### Structure
- Each major section should have a README.md
- Use consistent headers and structure
- Include table of contents for long documents

### Maintenance
- Keep documentation up to date
- Remove obsolete files
- Archive instead of delete (move to `docs/archive/` if needed)

---

**See Also:**
- [Documentation Index](./README.md)
- [User Guide](./USER_GUIDE.md)
- [Contributing Guide](./governance/CONTRIBUTING.md)

