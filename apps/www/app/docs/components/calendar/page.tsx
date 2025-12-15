"use client";

import { Calendar } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { useState } from "react";

export default function CalendarPage() {
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  const [multipleDates, setMultipleDates] = useState<Date[] | undefined>([
    new Date(),
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  ]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="calendar" className="text-3xl font-medium mb-4">Calendar</h1>
      </div>
      <p className="mb-6 intro-text">
        A date field component that allows users to enter and edit date.
      </p>
      
      
      {/* Single Date */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Calendar mode="single" value={singleDate} onChange={setSingleDate} />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar mode="single" value={date} onChange={setDate} />`}</CodeBlock>
        </div>
      </div>

      {/* Date Range */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Calendar mode="range" value={range} onChange={setRange} />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
  from: new Date(),
  to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

<Calendar mode="range" value={range} onChange={setRange} />`}</CodeBlock>
        </div>
      </div>

      {/* Multiple Dates */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Calendar mode="multiple" value={multipleDates} onChange={setMultipleDates} />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

const [dates, setDates] = useState<Date[] | undefined>([
  new Date(),
  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
]);

<Calendar mode="multiple" value={dates} onChange={setDates} />`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/calendar.json`}</CodeBlock>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-calendar--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

