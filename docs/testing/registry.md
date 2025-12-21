# Test Registry

This document describes how to test the Fragment UI registry.

## Local Test with shadcn CLI

1. **Prepare a test project** (optional, if you want to test in a clean environment):

```bash
mkdir test-project
cd test-project
npm init -y
npm install react react-dom next
npx shadcn@latest init
```

2. **Test adding component from local registry**:

If the DS portal is running locally (http://localhost:3001), you can use:

```bash
npx shadcn@latest add http://localhost:3001/r/button.json
```

Or copy the JSON file content and use it locally:

```bash
# Copy contents of apps/www/public/r/button.json to a local file
npx shadcn@latest add ./button.json
```

## Test JSON Structure

Each file in `apps/www/public/r/` should have the following structure:

```json
{
  "name": "button",
  "type": "registry:component",
  "dependencies": ["react", "react-dom"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "content": "..."
    }
  ]
}
```

## Check Generated Files

Run:

```bash
pnpm registry:generate
```

This will generate/update all JSON files in `apps/www/public/r/`.

## Manual Test

1. Open `apps/www/public/r/button.json`
2. Check if it contains the correct structure
3. Check if `content` in each file is correct (not empty)
4. Check if paths are correct

## Test with Real Project

The best test is to use it in a real Next.js project:

```bash
# In another project
npx shadcn@latest add https://your-domain.com/r/button.json
```

## Troubleshooting

- **Error "Cannot find module"**: Check if the JSON file has the correct structure
- **Import error**: Check if dependencies are defined in `dependencies`
- **Empty files**: Run `pnpm registry:generate` again

