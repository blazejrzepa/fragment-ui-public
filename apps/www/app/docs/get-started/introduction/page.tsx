import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, Button } from "@fragment_ui/ui";
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
        <div className="flex items-center gap-2">
          <Link href={"/docs/get-started/setup"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Build dashboards fast with a code-first design system.
      </p>

        <div
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <EditOnGitHub filePath="apps/www/app/docs/get-started/introduction/content.md" />
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
        <div className="flex items-center gap-2">
          
          <Link href={"/docs/get-started/setup"}>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
        </div>
      </div>
        <div className="max-w-none">
          <p>Error loading content. Please try refreshing the page.</p>
        </div>
      </DocLayout>
    );
  }
}

