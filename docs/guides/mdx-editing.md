# 📝 Editing Documentation Pages with MDX

This guide explains how to edit documentation pages using MDX format, which allows you to edit pages directly from GitHub.

---

## 🎯 What is MDX?

MDX combines Markdown with React components, allowing you to:
- Write content in Markdown (easy to edit in GitHub)
- Use React components for interactive elements
- Maintain styling and functionality

---

## 📍 Where are MDX Pages?

MDX documentation pages are located in:
```
apps/www/app/docs/**/page.mdx
```

**Example:**
- `apps/www/app/docs/get-started/introduction/page.mdx`

---

## ✏️ How to Edit

### Option 1: Edit in GitHub (Recommended)

1. **Navigate to the file in GitHub:**
   - Go to: `apps/www/app/docs/get-started/introduction/page.mdx`
   - Click the **pencil icon** (✏️) to edit

2. **Make your changes:**
   - Edit the Markdown content
   - Save your changes

3. **Create a Pull Request:**
   - GitHub will automatically create a PR
   - Preview your changes
   - Request review

### Option 2: Edit Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/blazejrzepa/fragment-ui.git
   cd fragment-ui
   ```

2. **Edit the MDX file:**
   ```bash
   # Edit with your favorite editor
   code apps/www/app/docs/get-started/introduction/page.mdx
   ```

3. **Test locally:**
   ```bash
   cd apps/www
   pnpm dev
   # Visit http://localhost:3000/docs/get-started/introduction
   ```

4. **Commit and push:**
   ```bash
   git add apps/www/app/docs/get-started/introduction/page.mdx
   git commit -m "docs: Update introduction page"
   git push
   ```

---

## 📝 MDX Syntax

### Basic Markdown

```mdx
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2

[Link text](/path)
```

### React Components

You can use React components directly in MDX:

```mdx
import { DocLayout } from "../../../../src/components/doc-layout";

export default function MyPage() {
  return (
    <DocLayout>
      <h1>My Page</h1>
      <p>Content here</p>
    </DocLayout>
  );
}
```

### Inline Styles

You can use inline styles just like in React:

```mdx
<p
  style={{
    color: "var(--Zinc-300, #D4D4D8)",
    fontFamily: "Geist, sans-serif",
    fontSize: "16px",
    lineHeight: "160%",
  }}
>
  Styled paragraph
</p>
```

### Available Components

These components are available in all MDX files:

- `<DocLayout>` - Wrapper for documentation pages
- `<StorybookLink>` - Link to Storybook stories

---

## 📋 Page Structure

Every MDX page should follow this structure:

```mdx
import { DocLayout } from "../../../../src/components/doc-layout";

export default function PageName() {
  return (
    <DocLayout>
      <h1>Page Title</h1>
      
      <p>Introduction paragraph...</p>
      
      <h2 id="section-1">Section 1</h2>
      <p>Content...</p>
      
      <h2 id="section-2">Section 2</h2>
      <p>Content...</p>
    </DocLayout>
  );
}
```

---

## 🎨 Styling Guidelines

### Headings

Use consistent heading styles:

```mdx
<h1 className="scroll-m-20 text-4xl font-medium tracking-tight sm:text-3xl xl:text-4xl mb-4">
  Main Title
</h1>

<h2 id="section-id">Section Title</h2>
```

### Paragraphs

For styled paragraphs, use inline styles:

```mdx
<p
  style={{
    color: "var(--Zinc-300, #D4D4D8)",
    fontFamily: "Geist, sans-serif",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "160%",
  }}
>
  Styled paragraph text
</p>
```

### Links

Use consistent link styling:

```mdx
<a href="/docs/path" className="underline text-[color:var(--color-brand-primary)]">
  Link text
</a>
```

---

## ✅ Best Practices

1. **Use semantic HTML:**
   - Use proper heading hierarchy (h1 → h2 → h3)
   - Add `id` attributes to headings for anchor links

2. **Keep it simple:**
   - Use Markdown for simple content
   - Use React components only when needed

3. **Test your changes:**
   - Always test locally before pushing
   - Check that links work
   - Verify styling looks correct

4. **Follow existing patterns:**
   - Look at existing MDX pages for examples
   - Maintain consistency with other pages

---

## 🔄 Migrating from TSX to MDX

If you want to convert an existing TSX page to MDX:

1. **Copy the content:**
   ```bash
   cp apps/www/app/docs/path/page.tsx apps/www/app/docs/path/page.mdx
   ```

2. **Remove "use client" directive:**
   - MDX files don't need this

3. **Simplify where possible:**
   - Convert JSX to Markdown where applicable
   - Keep React components for interactive elements

4. **Test:**
   ```bash
   pnpm dev
   # Visit the page and verify it works
   ```

5. **Delete old TSX file:**
   ```bash
   rm apps/www/app/docs/path/page.tsx
   ```

---

## 🐛 Troubleshooting

### Build Errors

If you get build errors:

1. **Check syntax:**
   - Ensure all JSX is properly closed
   - Verify imports are correct

2. **Check file extension:**
   - File must be `.mdx` (not `.md` or `.tsx`)

3. **Check imports:**
   - Verify component paths are correct
   - Ensure components are exported

### Styling Issues

If styles don't apply:

1. **Check inline styles:**
   - Verify style object syntax
   - Check CSS variable names

2. **Check className:**
   - Ensure Tailwind classes are correct
   - Verify custom classes exist

---

## 📚 Examples

### Simple Page

```mdx
import { DocLayout } from "../../../../src/components/doc-layout";

export default function SimplePage() {
  return (
    <DocLayout>
      <h1>Simple Page</h1>
      <p>This is a simple page with just text.</p>
    </DocLayout>
  );
}
```

### Page with Styled Content

```mdx
import { DocLayout } from "../../../../src/components/doc-layout";

export default function StyledPage() {
  return (
    <DocLayout>
      <h1>Styled Page</h1>
      
      <p
        style={{
          color: "var(--Zinc-300, #D4D4D8)",
          fontFamily: "Geist, sans-serif",
          fontSize: "16px",
          lineHeight: "160%",
        }}
      >
        This paragraph has custom styling.
      </p>
      
      <h2 id="section">Section</h2>
      <p>Regular paragraph with default styling.</p>
    </DocLayout>
  );
}
```

---

## 🔗 Related Documentation

- [MDX Documentation](https://mdxjs.com/)
- [Next.js MDX Guide](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [Markdown Editing Proposal](../technical/markdown-editing-proposal.md)

---

**Last Updated:** 2025-01-05

