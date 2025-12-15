"use client";

import { DocumentContent, CodeBlock, Timeline } from "@fragment_ui/ui";

const events = [
  { id: "1", title: "Project Kickoff", description: "Initial planning completed", timestamp: "2025-01-05" },
  { id: "2", title: "Design Complete", description: "UI/UX finalized", timestamp: "2025-01-20" },
  { id: "3", title: "MVP Shipped", description: "First release deployed", timestamp: "2025-02-10" },
];

export default function TimelinePage() {
  return (
    <DocumentContent as="article">
      <h1 className="text-3xl font-medium mb-4" id="page">
        Timeline
      </h1>
      <p className="mb-6 intro-text">Show chronological events.</p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-3xl">
            <Timeline events={events} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Timeline } from "@fragment_ui/ui";

const events = [
  { id: "1", title: "Project Kickoff", description: "Initial planning completed", timestamp: "2025-01-05" },
  { id: "2", title: "Design Complete", description: "UI/UX finalized", timestamp: "2025-01-20" },
];

<Timeline events={events} />`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

