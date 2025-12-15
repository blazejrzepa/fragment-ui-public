# Changelog

All notable changes to the Fragment UI Plugin System will be documented in this file.

## [0.1.0] - 2025-01-05

### Added
- Initial release of Plugin System
- Plugin architecture with TypeScript types
- PluginLoader for loading and managing plugins
- Plugin context with registry, logger, fs, and config access
- Support for multiple plugin types:
  - Theme Plugins - Transform themes and provide presets
  - Component Generator Plugins - Generate components from templates
  - Integration Plugins - Integrate with external tools
- Example plugins:
  - Theme Preset Plugin - Provides theme presets (minimal, ocean, forest)
  - Component Generator Plugin - Generates components with tests and stories
  - Figma Integration Plugin - Integrates with Figma
- CLI integration (`ds plugin list`, `ds plugin run`)
- Comprehensive documentation and examples

### Features
- Load plugins from directory
- Filter plugins by capability
- Plugin lifecycle management (initialize, cleanup)
- Type-safe plugin API
- Extensible plugin architecture

