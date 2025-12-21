import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function SetupPage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-[var(--space-1)]">
        <h1 id="setup" className="text-[length:var(--typography-display-md-size)] font-medium">
          {frontmatter.title || "Setup"}
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      <p className="mb-[var(--space-6)] intro-text">
        Install and configure Fragment UI in your React project with our CLI or manual setup.
      </p>

      <div
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </DocLayout>
  );
}
