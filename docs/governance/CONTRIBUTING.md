# Contributing to Fragment UI

Thank you for your interest in contributing to Fragment UI! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow the project's coding standards

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Test your changes: `pnpm test`
7. Submit a pull request

## Development Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development server
pnpm dev

# Start Storybook
pnpm storybook
```

## Contribution Guidelines

### Component Contributions

1. **Check if component exists** - Search existing components first
2. **Follow component structure** - Use existing components as templates
3. **Add tests** - Unit tests and A11y tests required
4. **Add stories** - Storybook stories required
5. **Add documentation** - Documentation page required
6. **Update registry** - Add to registry.json

### Documentation Contributions

1. **Follow documentation structure** - Use existing docs as templates
2. **Include examples** - Code examples required
3. **Test examples** - Ensure examples work
4. **Update links** - Update related documentation

### Bug Reports

1. **Check existing issues** - Search for similar issues
2. **Provide details** - Steps to reproduce, expected vs actual
3. **Include environment** - OS, browser, Node version
4. **Add screenshots** - If applicable

### Feature Requests

1. **Check roadmap** - See if already planned
2. **Create RFC** - For significant features (see RFC_PROCESS.md)
3. **Provide use case** - Explain why it's needed
4. **Propose solution** - Suggest implementation approach

## Pull Request Process

1. **Update CHANGELOG.md** - Add entry for your changes
2. **Update documentation** - If needed
3. **Run tests** - Ensure all tests pass
4. **Check linting** - Fix any linting errors
5. **Request review** - Assign to maintainers

## Review Criteria

Pull requests are reviewed for:
- ✅ Code quality and style
- ✅ Test coverage
- ✅ Documentation completeness
- ✅ Accessibility compliance
- ✅ Performance impact
- ✅ Breaking changes

## Coding Standards

- **TypeScript** - Use TypeScript for all code
- **ESLint** - Follow ESLint rules
- **Prettier** - Use Prettier for formatting
- **Naming** - Use camelCase for variables, PascalCase for components
- **Comments** - Add comments for complex logic
- **Tests** - Write tests for new features

## Component Standards

- **Accessibility** - WCAG 2.1 AA compliance required
- **Performance** - No performance regressions
- **TypeScript** - Full type coverage
- **Documentation** - Complete prop documentation
- **Examples** - Multiple usage examples

## Commit Messages

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

Example:
```
feat: add new Button variant

Adds 'ghost' variant to Button component with updated styling.
Includes tests and documentation.
```

## Questions?

- Open an issue for questions
- Check existing documentation
- Ask in discussions

---

*Last updated: 2025-01-05*

