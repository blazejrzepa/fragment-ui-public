import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { DocLayout } from "../../../../src/components/doc-layout";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";

// Static generation - markdown is bundled at build time
export const dynamic = 'force-static';

export default async function PolicyBundlesPage() {
  try {
    // Process the imported markdown content
    const { content, frontmatter } = await processMarkdownContent(markdownContent);

    return (
      <DocLayout>
        <h1 id="policy-bundles" className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-6)]">
          {frontmatter.title || "Policy Bundles"}
        </h1>
        {frontmatter.description && (
          <p className="mb-[var(--space-6)] intro-text">
            {frontmatter.description}
          </p>
        )}

        <div
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </DocLayout>
    );
  } catch (error) {
    console.error("Error rendering policy bundles page:", error);
    return (
      <DocLayout>
          <h1 id="policy-bundles" className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-4)]">
            Policy Bundles
          </h1>
        <div className="max-w-none">
          <p>Error loading content. Please try refreshing the page.</p>
        </div>
      </DocLayout>
    );
  }
}

