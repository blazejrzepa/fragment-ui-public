import { processMarkdownContent } from "../../../src/lib/markdown-loader";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../src/components/doc-layout";
import { DocPager } from "../../../src/components/doc-pager";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function CLIUsagePage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);
  
  // Subtitle: prefer frontmatter.description, fallback to first paragraph (and avoid duplicating it in body)
  const firstParagraphRegex = /<p[^>]*>(.*?)<\/p>/;
  const subtitleMatch = content.match(firstParagraphRegex);
  const subtitleFromContent = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>/g, "") : undefined;
  const subtitle = (frontmatter?.description as string | undefined) ?? subtitleFromContent;
  const contentWithoutSubtitleParagraph =
    subtitle && !frontmatter?.description && subtitleMatch
      ? content.replace(firstParagraphRegex, "")
      : content;

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="cli-usage" className="text-3xl font-medium mb-4">
          {frontmatter.title || "CLI"}
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
        dangerouslySetInnerHTML={{ __html: contentWithoutSubtitleParagraph }}
      />
    </DocLayout>
  );
}


