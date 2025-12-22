# Fragment UI Documentation

**Purpose:** Complete technical and architecture documentation  
**Audience:** Engineers, architects, maintainers  
**Last Updated:** 2025-01-XX

---

## 📋 Quick Navigation

### 🚀 Getting Started
- **[Installation](./getting-started/installation.md)** - Set up development environment
- **[Quick Start](./getting-started/quick-start.md)** - Build your first component
- **[Architecture Overview](./getting-started/architecture-overview.md)** - High-level system understanding

### 🏗️ Architecture
- **[System Overview](./architecture/system-overview.md)** - C4 diagrams, high-level architecture
- **[Monorepo Structure](./architecture/monorepo-structure.md)** - Package organization
- **[Domain Model](./architecture/domain-model.md)** - Core entities (Asset, Revision, Patch)
- **[Module Boundaries](./architecture/module-boundaries.md)** - Studio module responsibilities
- **[Data Flow](./architecture/data-flow.md)** - How data flows through system
- **[Architecture Decisions](./architecture/decisions/README.md)** - ADRs for key decisions

### 💻 Development
- **[Development Guide](./development/README.md)** - Development workflows
- **[Component Implementation](./development/component-implementation.md)** - Build production components
- **[How to Edit DS Components](./HOW_TO_EDIT_DS_COMPONENTS.md)** - Guide for editing Design System components
- **[Testing](./development/testing.md)** - Testing strategy and standards

### 🎨 Studio
- **[Studio Overview](./studio/README.md)** - AI-powered UI generation
- **[DSL Documentation](./studio/dsl/)** - UI-DSL v2 specification
- **[Patch System](./studio/patching/)** - Conversational editing
- **[Submissions](./studio/submissions/)** - Review workflow
- **[Experiments](./studio/experiments/)** - A/B testing with PostHog
- **[Copilot](./studio/copilot/)** - Full Copilot specification
- **[Blocks & Templates Plan](./copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md)** - Public DS adoption pack

### 🌐 Public Design System
- **[Public DS Guidelines](./OSS_PUBLIC_DS_GUIDELINES.md)** - Guidelines for public release
- **[Public Scope](../PUBLIC_SCOPE.md)** - What's included in public release (main document)
- **[OSS FAQ](./OSS_FAQ.md)** - Frequently asked questions

### 🔗 Ecosystem
- **[Combined Changelog](../CHANGELOG_COMBINED.md)** - Unified changelog for all projects

### 🚢 Operations
- **[Deployment](./operations/deployment.md)** - Production deployment
- **[Release Process](./operations/release-process.md)** - Release workflow
- **[Monitoring](./operations/monitoring.md)** - Logging and metrics
- **[Troubleshooting](./operations/troubleshooting.md)** - Common issues
- **[Runbooks](./operations/runbooks/)** - Operational procedures

### 📚 Reference
- **[Component APIs](./api/)** - Complete API documentation
- **[Design Tokens](./reference/design-tokens.md)** - Token system
- **[Registry Format](./reference/registry-format.md)** - Registry JSON schema
- **[UI-DSL Schema](./reference/ui-dsl-schema.md)** - UI-DSL v2 JSON Schema

### 🗺️ Roadmap & Planning
- **[Ecosystem Roadmap](../ROADMAP.md)** - Development roadmap for all projects
- **[Current Plan](./roadmap/FRAGMENT_UI_STUDIO_PLAN.md)** - Main development plan (includes Phase DS-Public)
- **[Next Steps](./NEXT_STEPS.md)** - Consolidated next steps and priorities
- **[Planning Documents](./planning/README.md)** - Strategic planning documents
- **[Implementation Iterations](./roadmap/IMPLEMENTATION_ITERATIONS.md)** - Iteration breakdown
- **[A/B Testing Plan](./roadmap/AB_TESTING_STRATEGIC_PLAN.md)** - PostHog integration
- **[Blocks & Templates Implementation](./copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md)** - Public DS adoption pack plan
- **[Documentation Consolidation Plan](./DOCUMENTATION_CONSOLIDATION_PLAN.md)** - Documentation cleanup plan and analysis

### 📖 Guides
- **[Figma Integration](./guides/figma/)** - Figma setup and workflows
- **[CLI Usage](./guides/cli-usage.md)** - CLI commands
- **[MCP Server](./guides/mcp-server-setup.md)** - MCP server setup
- **[VS Code Extension](./guides/vscode-extension-usage.md)** - VS Code integration

---

## 🎯 Documentation Structure

```
docs/
├── getting-started/      # Quick onboarding
├── architecture/         # System design and ADRs
├── development/          # Development workflows
├── studio/               # Studio-specific features
├── operations/           # Production operations
├── reference/            # Technical specifications
├── roadmap/              # Planning and priorities
├── guides/               # How-to guides
├── api/                  # Component APIs
└── archive/              # Historical documents
```

---

## 📝 Documentation Standards

### Each Document Includes

- **Purpose:** What the document is for
- **Audience:** Who should read it
- **When to read:** When to read it
- **Gotchas:** Common pitfalls

### Quality Rules

- ✅ Actionable content at top
- ✅ Code examples included
- ✅ Links to related docs
- ✅ Checklists for procedures
- ✅ Diagrams when helpful (Mermaid)

---

## 🔄 Maintenance

See [Documentation Maintenance Policy](./DOCUMENTATION_MAINTENANCE_POLICY.md) for:
- When to update docs
- How to add ADRs
- How to keep diagrams in sync
- Translation policy (English only)

See [Documentation Audit Report](./DOCUMENTATION_AUDIT_REPORT.md) for:
- Documentation quality analysis
- Duplicates and contradictions found
- Recommendations for improvement
- Consolidation plan

---

## 🆘 Getting Help

- **Questions:** Ask in team channel
- **Broken Links:** Create issue or fix immediately
- **Suggestions:** Create issue or PR

---

**See Also:**
- [Main Project README](../README.md)
- [Quick Start Guide](./getting-started/quick-start.md)
