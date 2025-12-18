"use client";

import { DocumentContent, CodeBlock, Timeline, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const timelineCode = `import { Timeline } from "@fragment_ui/ui";

const events = [
  { id: "1", title: "Project Kickoff", description: "Initial planning completed", timestamp: "2025-01-05" },
  { id: "2", title: "Design Complete", description: "UI/UX finalized", timestamp: "2025-01-20" },
  { id: "3", title: "MVP Shipped", description: "First release deployed", timestamp: "2025-02-10" },
];

<Timeline events={events} />`;

const events = [
  { id: "1", title: "Project Kickoff", description: "Initial planning completed", timestamp: "2025-01-05" },
  { id: "2", title: "Design Complete", description: "UI/UX finalized", timestamp: "2025-01-20" },
  { id: "3", title: "MVP Shipped", description: "First release deployed", timestamp: "2025-02-10" },
];

export default function TimelinePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="timeline">Timeline</h1>
      </div>
      <p className="mb-6 intro-text">Show events ordered over time.</p>
      
      <ExampleSection
        id="timeline-example"
        title="Example"
        code={timelineCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-3xl">
            <Timeline events={events} />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add timeline`}
      </CodeBlock>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code>events</code></td>
              <td className="py-2 px-4"><code>TimelineEvent[]</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Array of event objects (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>orientation?</code></td>
              <td className="py-2 px-4"><code>"vertical" | "horizontal"</code></td>
              <td className="py-2 px-4">"vertical"</td>
              <td className="py-2 px-4 text-sm">Timeline orientation (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>showTimestamps?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">true</td>
              <td className="py-2 px-4 text-sm">Show timestamp for each event (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes (optional)</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-[color:var(--color-border-base)]">
          <p className="text-sm font-semibold mb-2">TimelineEvent interface:</p>
          <ul className="text-sm space-y-1">
            <li><code>id</code> – string. Unique identifier (required)</li>
            <li><code>title</code> – string. Event title (required)</li>
            <li><code>description?</code> – string. Event description (optional)</li>
            <li><code>timestamp?</code> – string. Event timestamp (optional)</li>
            <li><code>status?</code> – "completed" | "current" | "upcoming" | "error". Event status (optional)</li>
            <li><code>icon?</code> – ReactNode. Custom icon (optional)</li>
          </ul>
        </div>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>Timeline</code> is a component for showing chronological events. Use it when you need to display a sequence of events in chronological order, such as project milestones, activity history, or process steps. The component provides a visual timeline with connecting lines and event markers.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Project milestones or history</li>
            <li>Activity feeds</li>
            <li>Process tracking</li>
            <li>Event history</li>
            <li>Any scenario requiring chronological event display</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Timeline"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>events</code> – array. Array of event objects (required). Each event should have:
              <ul>
                <li><code>id</code> – string. Unique identifier (required)</li>
                <li><code>title</code> – string. Event title (required)</li>
                <li><code>description?</code> – string. Event description (optional)</li>
                <li><code>timestamp?</code> – string. Event timestamp (optional)</li>
                <li><code>status?</code> – string. Event status: "completed" | "current" | "upcoming" | "error" (optional)</li>
                <li><code>icon?</code> – ReactNode. Custom icon (optional)</li>
              </ul>
            </li>
            <li><code>orientation?</code> – string. Orientation: "horizontal" | "vertical" (optional, default: "vertical")</li>
            <li><code>showTimestamps?</code> – boolean. Show timestamp for each event (optional, default: true)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Timeline",
  "props": {
    "events": [
      {
        "id": "1",
        "title": "Project Kickoff",
        "description": "Initial planning completed",
        "timestamp": "2025-01-05"
      },
      {
        "id": "2",
        "title": "Design Complete",
        "description": "UI/UX finalized",
        "timestamp": "2025-01-20"
      },
      {
        "id": "3",
        "title": "MVP Shipped",
        "description": "First release deployed",
        "timestamp": "2025-02-10"
      }
    ]
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
