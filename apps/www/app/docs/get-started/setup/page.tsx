import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, Button } from "@fragment_ui/ui";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function SetupPage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="setup" className="text-3xl font-medium mb-4">
        {frontmatter.title || "Setup"}
      </h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/get-started/introduction"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/examples"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Install and configure Fragment UI in your React project with our CLI or manual setup.
      </p>

      <div
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <EditOnGitHub filePath="apps/www/app/docs/get-started/setup/content.md" />
    </DocLayout>
  );
}
