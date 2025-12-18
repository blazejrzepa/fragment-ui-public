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
        <h1 id="policy-bundles" className="text-3xl font-medium mb-6">
          {frontmatter.title || "Policy Bundles"}
        </h1>
        {frontmatter.description && (
          <p 
            className="mb-6 text-[color:var(--color-fg-muted)]"
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "var(--typography-size-md)",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "160%",
            }}
          >
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
          <h1 id="policy-bundles" className="text-3xl font-medium mb-4">
            Policy Bundles
          </h1>
        <div className="max-w-none">
          <p>Error loading content. Please try refreshing the page.</p>
        </div>
      </DocLayout>
    );
  }
}

