"use client";

import { useState } from "react";
import { TagInput, DocumentContent, CodeBlock } from "@fragment_ui/ui";

export default function TagInputPage() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);

  return (
    <DocumentContent as="article">
      <h1 className="text-3xl font-medium mb-4" id="page">
        Tag Input
      </h1>
      <p className="mb-6 intro-text">Capture multiple tags or keywords.</p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[150px] p-10">
          <div className="w-full max-w-md">
            <TagInput value={tags} onChange={setTags} placeholder="Add tags..." />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { TagInput } from "@fragment_ui/ui";
import { useState } from "react";

const [tags, setTags] = useState<string[]>(["design", "frontend"]);

<TagInput value={tags} onChange={setTags} placeholder="Add tags..." />`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

      