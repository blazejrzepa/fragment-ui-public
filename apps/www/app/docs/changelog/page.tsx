import { DocLayout } from "../../../src/components/doc-layout";
import { DocPager } from "../../../src/components/doc-pager";
import { processMarkdownContent } from "../../../src/lib/markdown-loader";
import markdownContent from "./content.md?raw";
import { ComponentPreviews } from "./component-previews";

export const dynamic = "force-static";

export default async function ChangelogPage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-[var(--space-1)]">
        <h1 id="changelog" className="text-[length:var(--typography-display-md-size)] font-medium">
          {frontmatter.title || "Changelog"}
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      {frontmatter.description && (
        <p className="mb-[var(--space-6)] intro-text">{frontmatter.description}</p>
      )}

      <div className="max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      
      <ComponentPreviews />
    </DocLayout>
  );
}

