import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, DocumentContent, Button } from "@fragment_ui/ui";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function CLIUsagePage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="cli-usage" className="text-3xl font-medium mb-4">
          {frontmatter.title || "CLI Usage Guide"}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/foundations/typography"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/guides/design-to-code"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <DocumentContent
        as="div"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <EditOnGitHub filePath="apps/www/app/docs/guides/cli-usage/content.md" />
    </DocLayout>
  );
}
