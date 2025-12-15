# Contributing to Fragment UI

Thank you for your interest in contributing to Fragment UI! This document provides guidelines and instructions for contributing.

## 🎯 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fragment-ui-public.git
   cd fragment-ui-public
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Development Commands

```bash
# Run documentation site
pnpm dev:www

# Build all packages
pnpm build

# Type check
pnpm type-check

# Run tests
pnpm test

# Lint
pnpm lint
```

## 📝 Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Component Development

1. **Create components** in `packages/ui/src/`
2. **Add to registry** in `packages/registry/registry.json`
3. **Update documentation** in `apps/www/app/docs/components/`
4. **Add tests** in `packages/ui/src/**/*.test.tsx`

### Design Tokens

- Add new tokens in `packages/tokens/src/`
- Follow the existing token structure
- Update documentation for new tokens

### Blocks

- Create blocks in `packages/blocks/src/`
- Use Fragment UI components
- Follow existing block patterns

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass: `pnpm test`
- Add accessibility tests where applicable

## 📚 Documentation

- Update README files when adding features
- Add examples to component documentation
- Update CHANGELOG.md for user-facing changes

## 🔍 Pull Request Process

1. **Update CHANGELOG.md** with your changes
2. **Ensure all tests pass**
3. **Update documentation** if needed
4. **Create a pull request** with a clear description

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Build succeeds (`pnpm build`)

## 🎨 Design System Guidelines

### Component Standards

- **Accessibility**: All components must be WCAG 2.1 compliant
- **TypeScript**: Full type safety required
- **Styling**: Use Tailwind CSS and design tokens
- **Testing**: Unit tests and accessibility tests required

### Design Tokens

- Use semantic tokens (e.g., `--color-fg-base` not `--color-gray-500`)
- Follow the token naming conventions
- Support light and dark modes

## 🐛 Reporting Issues

When reporting issues, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node version, OS, browser (if applicable)

## 💡 Feature Requests

Feature requests are welcome! Please:

- Check if the feature already exists
- Open an issue with a clear description
- Explain the use case and benefits
- Consider contributing the feature yourself!

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Thank you for contributing to Fragment UI! Your help makes this project better for everyone.

