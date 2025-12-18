import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function VSCodeExtensionUsagePage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);
  
  // Extract first paragraph as subtitle
  const subtitleMatch = content.match(/<p[^>]*>(.*?)<\/p>/);
  const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>/g, '') : undefined;

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="vscode-extension-usage" className="text-3xl font-medium mb-4">
          {frontmatter.title || "VS Code Extension Usage Guide"}
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      {subtitle && (
        <p className="mb-6 intro-text">
          {subtitle}
        </p>
      )}

      <div
        className="max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </DocLayout>
  );
}
