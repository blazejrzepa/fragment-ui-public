import { processMarkdownContent } from "../../../../src/lib/markdown-loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
// Import markdown as raw string - webpack will bundle it
import markdownContent from "./content.md?raw";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, DocumentContent, Button } from "@fragment_ui/ui";

// Disable caching for markdown content - always read fresh from filesystem
export const dynamic = 'force-static';


export default async function VSCodeExtensionUsagePage() {
  const { content, frontmatter } = await processMarkdownContent(markdownContent);

  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">
        {frontmatter.title || "VS Code Extension Usage Guide"}
      </h1>

      <DocumentContent
        as="div"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <EditOnGitHub filePath="apps/www/app/docs/guides/vscode-extension-usage/content.md" />
    </DocLayout>
  );
}
