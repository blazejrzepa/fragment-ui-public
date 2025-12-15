"use client";

import { ActivityFeed, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
export default function ActivityFeedPage() {
  const sampleActivities = [
    {
      id: "1",
      type: "action" as const,
      title: "John Doe created a new project",
      description: "Project 'Marketing Campaign 2024' was created",
      timestamp: new Date(Date.now() - 5 * 60000),
      user: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    },
    {
      id: "2",
      type: "update" as const,
      title: "Jane Smith updated settings",
      description: "Changed notification preferences",
      timestamp: new Date(Date.now() - 30 * 60000),
      user: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
    },
    {
      id: "3",
      type: "comment" as const,
      title: "Mike Johnson commented",
      description: "Great work on the dashboard design!",
      timestamp: new Date(Date.now() - 2 * 3600000),
      user: {
        name: "Mike Johnson",
      },
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="activity-feed" className="text-3xl font-medium mb-4">Activity Feed</h1>
      </div>
      <p className="mb-6 intro-text">
        A ready-made activity feed section.
      </p>
      
      {/* Default Activity Feed */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <ActivityFeed items={sampleActivities} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { ActivityFeed } from "@fragment_ui/ui";

const activities = [
  {
    id: "1",
    type: "action",
    title: "John Doe created a new project",
    description: "Project 'Marketing Campaign 2024' was created",
    timestamp: new Date(),
    user: {
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
    },
  },
  {
    id: "2",
    type: "update",
    title: "Jane Smith updated settings",
    description: "Changed notification preferences",
    timestamp: new Date(),
    user: {
      name: "Jane Smith",
      avatar: "https://example.com/avatar2.jpg",
    },
  },
  {
    id: "3",
    type: "comment",
    title: "Mike Johnson commented",
    description: "Great work on the dashboard design!",
    timestamp: new Date(),
    user: {
      name: "Mike Johnson",
    },
  },
];

<ActivityFeed items={activities} />`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/activity-feed.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>ActivityFeed</code> is a ready-made component for displaying chronological activity streams.<br />
            Use it when you need to show a list of user actions, updates, comments, or system events with timestamps.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Activity feeds and timelines</li>
            <li>Notification / updates list</li>
            <li>User action history</li>
            <li>Audit logs or system events</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "ActivityFeed"</code> and provide an <code>items</code> array.
          </p>
          <p>Each item should include:</p>
          <ul>
            <li><code>id</code> – unique identifier (string)</li>
            <li><code>type</code> – <code>"action" | "update" | "comment" | "system"</code></li>
            <li><code>title</code> – short description of the event</li>
            <li><code>description?</code> – optional longer text</li>
            <li><code>timestamp</code> – ISO string or Date</li>
            <li><code>user?</code> – optional object with <code>name: string</code> and optional <code>avatar?: string</code></li>
            <li><code>icon?</code> – optional icon name if no user is present</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "ActivityFeed",
  "props": {
    "items": [
      {
        "id": "evt-1",
        "type": "action",
        "title": "Invoice #2025 sent to ACME Inc.",
        "description": "Net 14 days • $1,200",
        "timestamp": "2025-01-12T09:34:00Z",
        "user": {
          "name": "Alex Nowak",
          "avatar": "/avatars/alex.png"
        }
      },
      {
        "id": "evt-2",
        "type": "comment",
        "title": "Comment added on deal "Q1 Expansion"",
        "timestamp": "2025-01-12T09:12:00Z"
      }
    ]
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-activity-feed--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}

