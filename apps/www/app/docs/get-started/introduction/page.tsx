import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";

// Static generation - markdown is bundled at build time
export const dynamic = 'force-static';

export default async function IntroductionPage() {
  try {
    // Process the imported markdown content
    const { content, frontmatter } = await processMarkdownContent(markdownContent);

    return (
      <DocLayout>
        <div className="flex items-center justify-between mb-1">
          <h1 id="introduction" className="text-3xl font-medium mb-4">
            {frontmatter.title || "Introduction"}
          </h1>
          <DocPager placement="top" align="end" variant="icon" dense />
        </div>
        <p className="mb-6 intro-text">
          Build dashboards fast with a code-first design system.
        </p>

        <div
          className="max-w-none mt-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </DocLayout>
    );
  } catch (error) {
    console.error("Error rendering introduction page:", error);
    return (
      <DocLayout>
        <div className="flex items-center justify-between mb-1">
          <h1 id="introduction" className="text-3xl font-medium mb-4">
            Introduction
          </h1>
          <DocPager placement="top" align="end" variant="icon" dense />
        </div>
        <div className="max-w-none">
          <p>Error loading content. Please try refreshing the page.</p>
        </div>
      </DocLayout>
    );
  }
}

