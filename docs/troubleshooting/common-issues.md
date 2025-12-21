# Common Issues & Troubleshooting

## Installation Issues

### Problem: `pnpm install` fails
**Solution:**
- Clear node_modules: `rm -rf node_modules pnpm-lock.yaml`
- Reinstall: `pnpm install`
- Check Node.js version (requires 18+)

### Problem: TypeScript errors after installation
**Solution:**
- Ensure TypeScript 5.0+ is installed
- Check `tsconfig.json` includes proper module resolution
- Restart TypeScript server in your IDE

## Styling Issues

### Problem: Styles not applying
**Solution:**
- Ensure CSS is imported: `import "@fragment_ui/ui/styles.css"`
- Check that Tailwind CSS is configured correctly
- Verify PostCSS configuration

### Problem: Dark mode not working
**Solution:**
- Ensure `data-theme` attribute is set on root element
- Check theme provider is configured
- Verify CSS variables are loaded

## Component Issues

### Problem: Dialog not closing
**Solution:**
- Ensure `DialogClose` is used correctly
- Check for event handler conflicts
- Verify Radix UI Dialog is properly installed

### Problem: Form validation not working
**Solution:**
- Use `FormEnhanced` for advanced validation
- Check validation rules are properly configured
- Ensure `onSubmit` handler is provided

## Performance Issues

### Problem: Slow initial load
**Solution:**
- Use lazy loading for components
- Enable code splitting
- Check bundle size with Bundle Size Tracking tool

### Problem: Large bundle size
**Solution:**
- Use tree-shaking
- Import only needed components
- Check for duplicate dependencies

## Build Issues

### Problem: Build fails in production
**Solution:**
- Check for environment-specific code
- Verify all dependencies are in `dependencies` (not `devDependencies`)
- Check for missing environment variables

## TypeScript Issues

### Problem: Type errors with component props
**Solution:**
- Update to latest TypeScript version
- Check component prop types match imports
- Verify `@types/react` is installed

## Getting Help

- Check [GitHub Issues](https://github.com/your-repo/issues)
- Review [Documentation](/docs)
- Check [Changelog](/docs/changelog) for known issues

