"use client";

import { Calendar, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const calendarSingleCode = `import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

export function CalendarSingleDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Calendar mode="single" value={date} onChange={setDate} />
  );
}`;

const calendarRangeCode = `import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

export function CalendarRangeDemo() {
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  
  return (
    <Calendar mode="range" value={range} onChange={setRange} />
  );
}`;

const calendarMultipleCode = `import { Calendar } from "@fragment_ui/ui";
import { useState } from "react";

export function CalendarMultipleDemo() {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(),
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  ]);
  
  return (
    <Calendar mode="multiple" value={dates} onChange={setDates} />
  );
}`;

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
        <h1 id="calendar">Calendar</h1>
      </div>
      <p className="mb-6 intro-text">Display dates and schedule at-a-glance.</p>
      
      <ExampleSection
        id="calendar-single"
        title="Single Date"
        code={calendarSingleCode}
      >
        <div className="flex justify-center items-center w-full">
          <Calendar mode="single" value={singleDate} onChange={setSingleDate} />
        </div>
      </ExampleSection>

      <ExampleSection
        id="calendar-range"
        title="Date Range"
        code={calendarRangeCode}
        marginTop="mt-8"
      >
        <div className="flex justify-center items-center w-full">
          <Calendar mode="range" value={range} onChange={setRange} />
        </div>
      </ExampleSection>

      <ExampleSection
        id="calendar-multiple"
        title="Multiple Dates"
        code={calendarMultipleCode}
        marginTop="mt-8"
      >
        <div className="flex justify-center items-center w-full">
          <Calendar mode="multiple" value={multipleDates} onChange={setMultipleDates} />
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add calendar`}
      </CodeBlock>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Calendar</code> is a date field component that allows users to enter and edit dates.<br />
            Use it when you need to provide date selection functionality, date range selection, or multiple date selection in forms, filters, or scheduling interfaces.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Date input fields in forms</li>
            <li>Date range filters and pickers</li>
            <li>Scheduling and booking interfaces</li>
            <li>Event date selection</li>
            <li>Any interface requiring date selection</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Calendar"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>mode</code> – <code>"single"</code>, <code>"range"</code>, or <code>"multiple"</code> (required)</li>
            <li><code>value</code> – selected date(s) (required)</li>
            <li><code>onChange</code> – callback when date changes (required)</li>
            <li><code>disabled?</code> – disable date selection (optional)</li>
            <li><code>minDate?</code> – minimum selectable date (optional)</li>
            <li><code>maxDate?</code> – maximum selectable date (optional)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Calendar",
  "props": {
    "mode": "single",
    "value": "2025-01-15",
    "onChange": "handleDateChange"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
