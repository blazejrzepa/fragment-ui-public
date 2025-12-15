"use client";

import { useState } from "react";
import { Textarea, DocumentContent, CodeBlock } from "@fragment_ui/ui";

export default function TextareaPage() {
  const [value, setValue] = useState("");

  return (
    <DocumentContent as="article">
      <h1 className="text-3xl font-medium mb-4" id="page">
        Textarea
      </h1>
      <p className="mb-6 intro-text">Multiline text input.</p>

      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[150px] p-10">
          <div className="w-full max-w-md">
            <Textarea
              placeholder="Write your message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full max-w-md"
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Textarea } from "@fragment_ui/ui";
import { useState } from "react";

const [value, setValue] = useState("");

<Textarea
  placeholder="Write your message..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

