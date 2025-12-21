# Documentation Structure Proposal

**Date:** 2025-01-XX  
**Status:** Proposal  
**Author:** Principal Software Architect

---

## 📋 Repository Discovery Summary

### Architecture Shape
- **Type:** Modular Monorepo (pnpm workspaces + Turborepo)
- **Pattern:** Domain-Driven Design with clear module boundaries
- **Distribution:** Code-first registry (shadcn-style)

### Runtime Topology
- **Applications:**
  - `apps/www` - Design System Portal (Next.js, public-facing)
  - `apps/demo` - Demo/Studio Application (Next.js, AI-powered UI generation)
- **Packages:** 15+ packages (UI components, blocks, tokens, CLI, telemetry, MCP server, VS Code extension, etc.)
- **Build System:** Turborepo with task caching
- **Deployment:** Vercel (inferred from vercel.json)

### Tech Stack
- **Languages:** TypeScript, JavaScript
- **Frameworks:** React, Next.js 15
- **Build Tools:** Turborepo, esbuild, Vite
- **Package Manager:** pnpm 9.0.0
- **Testing:** Vitest (unit), Playwright (E2E), Chromatic (visual)
- **Linting:** ESLint 9, custom Design System rules
- **CI/CD:** GitHub Actions

### Dev Workflow
- **Scripts:** `pnpm dev` (parallel dev servers), `pnpm build`, `pnpm test`, `pnpm lint:ds`
- **Pre-commit:** Husky hooks for lint:ds
- **CI:** Build, test, lint, bundle analysis, Lighthouse CI
- **Release:** Semantic versioning, CHANGELOG, GitHub releases

### Infrastructure
- **Deployment:** Vercel (Next.js apps)
- **Storybook:** Static hosting
- **Registry:** Public JSON endpoints (`/r/*.json`)
- **No Docker/K8s:** Serverless deployment model

### API Surface
- **Public APIs:**
  - Registry endpoints: `/r/{component}.json`
  - Studio APIs: `/api/dsl/generate`, `/api/dsl/patch`, `/api/code/gen`
  - Quality APIs: `/api/quality/run`
  - Submissions APIs: `/api/submissions/*`
- **Internal APIs:** Next.js API routes in apps
- **MCP Server:** Model Context Protocol for AI agents
- **VS Code Extension:** Language server protocol

---

## 🏗️ Proposed Documentation Structure

### Navigation Tree

```
docs/
├── README.md                          # Landing page with navigation
│
├── getting-started/                   # NEW - Quick onboarding
│   ├── README.md                      # Overview: Purpose, Audience, When to read
│   ├── installation.md                # Setup, dependencies, first run
│   ├── quick-start.md                 # 5-minute tutorial
│   └── architecture-overview.md        # High-level system overview
│
├── architecture/                      # EXISTING - Enhanced
│   ├── README.md                      # Architecture index
│   ├── system-overview.md             # NEW - C4 Context diagram
│   ├── monorepo-structure.md          # Package organization, dependencies
│   ├── domain-model.md                # EXISTING - STUDIO_DOMAIN_MODEL.md
│   ├── module-boundaries.md           # EXISTING - MODULES_BOUNDARIES.md
│   ├── data-flow.md                   # NEW - How data flows through system
│   └── decisions/                     # NEW - ADRs
│       ├── README.md                  # ADR index
│       ├── 0001-record-architecture-decisions.md
│       └── ...
│
├── development/                       # EXISTING - Enhanced
│   ├── README.md                      # Development guide index
│   ├── setup.md                       # Local development setup
│   ├── component-implementation.md    # EXISTING - component-implementation-guide.md
│   ├── testing.md                     # Testing strategy, unit/E2E/visual
│   ├── code-generation.md             # AI code generation workflow
│   └── contributing.md                # EXISTING - governance/CONTRIBUTING.md
│
├── api/                               # EXISTING - Component APIs
│   ├── README.md                      # API index
│   └── [component-name].md            # Individual component docs
│
├── studio/                            # NEW - Studio-specific docs
│   ├── README.md                      # Studio overview
│   ├── dsl/                           # EXISTING - dsl/
│   │   ├── overview.md                # DSL introduction
│   │   ├── complex-screens.md         # EXISTING - DSL_COMPLEX_SCREENS.md
│   │   └── versions.md                # EXISTING - technical/ui-dsl-versions.md
│   ├── patching/                      # EXISTING - patching/
│   │   └── patch-system.md            # EXISTING - PATCH_SYSTEM.md
│   ├── submissions/                   # EXISTING - submissions/
│   │   └── workflow.md                # EXISTING - SUBMISSIONS_FLOW.md
│   ├── experiments/                   # EXISTING - experiments/
│   │   └── posthog-integration.md     # EXISTING - POSTHOG_EXPERIMENTS.md
│   └── copilot/                       # EXISTING - copilot/
│       ├── README.md                  # EXISTING
│       ├── contract.md                # EXISTING
│       ├── implementation-plan.md     # EXISTING
│       └── ab-testing-spec.md         # EXISTING
│
├── operations/                        # NEW - Production operations
│   ├── README.md                      # Operations guide index
│   ├── deployment.md                  # EXISTING - deployment/deployment.md
│   ├── release-process.md             # EXISTING - deployment/release-checklist.md
│   ├── monitoring.md                  # Logging, metrics, dashboards
│   ├── troubleshooting.md             # EXISTING - troubleshooting/common-issues.md
│   └── runbooks/                      # NEW - Operational runbooks
│       ├── incident-response.md
│       └── migration-procedures.md
│
├── guides/                            # EXISTING - Reorganized
│   ├── README.md                      # Guides index
│   ├── figma/                         # NEW - All Figma guides
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   ├── code-connect.md
│   │   └── ...
│   ├── tools/                         # EXISTING - tools/ reorganized
│   │   ├── cli.md
│   │   ├── mcp-server.md
│   │   ├── vscode-extension.md
│   │   └── ...
│   └── integrations/                 # NEW
│       ├── github.md
│       └── ...
│
├── reference/                         # NEW - Technical reference
│   ├── README.md
│   ├── design-tokens.md               # EXISTING - foundations/
│   ├── registry-format.md             # Registry JSON schema
│   ├── ui-dsl-schema.md              # UI-DSL JSON Schema
│   └── api-contracts.md               # API endpoint contracts
│
├── roadmap/                           # EXISTING - Cleaned up
│   ├── README.md                      # Roadmap index
│   ├── current-plan.md                # EXISTING - FRAGMENT_UI_STUDIO_PLAN.md
│   ├── iterations.md                  # EXISTING - IMPLEMENTATION_ITERATIONS.md
│   ├── ab-testing.md                  # EXISTING - AB_TESTING_STRATEGIC_PLAN.md
│   └── archive/                       # NEW - Old roadmaps
│       └── ...
│
└── archive/                           # EXISTING - Enhanced
    ├── README.md                      # Archive index
    ├── cleanup/                       # NEW - Cleanup reports
    ├── old-roadmaps/                  # EXISTING
    └── legacy-docs/                   # NEW - Deprecated docs
```

---

## 📊 Must-Have vs Nice-to-Have

### Must-Have (P0)
1. **Getting Started** - Installation, quick start, architecture overview
2. **Architecture** - System overview, domain model, module boundaries
3. **Development** - Setup, component implementation, testing
4. **Studio** - DSL, patching, submissions, experiments
5. **Operations** - Deployment, release process, troubleshooting
6. **API Reference** - Component APIs, registry format

### Nice-to-Have (P1)
1. **ADRs** - Architecture decision records
2. **Runbooks** - Detailed operational procedures
3. **Integration Guides** - Third-party integrations
4. **Advanced Guides** - Figma, MCP, VS Code extension

---

## 🎯 Structure Rationale

### Mapping to Repository

| Doc Section | Repository Location | Purpose |
|-------------|---------------------|---------|
| `getting-started/` | Root README, setup guides | Onboard new engineers |
| `architecture/` | `docs/architecture/`, `packages/*` | Understand system design |
| `development/` | `docs/development/`, `packages/*/README.md` | Development workflow |
| `studio/` | `apps/demo/app/studio/`, `docs/copilot/` | Studio-specific features |
| `operations/` | `.github/workflows/`, `docs/deployment/` | Production operations |
| `guides/` | `docs/guides/`, `docs/tools/` | How-to guides |
| `reference/` | `packages/registry/`, `packages/ui-dsl/` | Technical specifications |
| `roadmap/` | `docs/roadmap/` | Planning and priorities |

### Principles
1. **Engineer-First:** Structure matches how engineers work (setup → develop → deploy)
2. **Domain-Driven:** Studio docs grouped by domain (DSL, patching, submissions)
3. **Progressive Disclosure:** Start simple (getting-started), go deep (reference)
4. **Maintainability:** Clear separation, easy to find and update

---

## ✅ Next Steps

1. **Create new structure** - Set up directories
2. **Reorganize existing docs** - Move and rename files
3. **Translate Polish content** - Convert to English
4. **Create missing docs** - ADRs, runbooks, system overview
5. **Update all links** - Fix internal references
6. **Create README files** - Index pages for each section

---

**Status:** Ready for execution  
**Estimated Time:** 4-6 hours

