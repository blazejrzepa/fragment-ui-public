"use client";

import { DatePicker, CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { useState } from "react";

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">DatePicker</h1>
      </div>
      <p className="mb-6 intro-text">
        Select a date (or range) quickly.
      </p>
      
      
      {/* Single Date */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <DatePicker
              mode="single"
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
            />
            {date && (
              <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                Selected: {date.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DatePicker } from "@fragment_ui/ui";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>();

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>`}</CodeBlock>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/date-picker.json`}</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        DatePicker uses Radix UI Popover and react-day-picker, both of which are
        fully accessible with keyboard navigation, ARIA attributes, and screen reader support.
      </p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-date-picker--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

