import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";
import { DocumentContent } from "@fragment_ui/ui";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function TokensPage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="design-tokens" className="text-3xl font-medium mb-4">
          {frontmatter.title || "Design Tokens"}
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      <p className="mb-6 intro-text">
        Comprehensive design token system for colors, spacing, typography, density, motion, and more.
      </p>

      <DocumentContent
        as="div"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </DocLayout>
  );
}
