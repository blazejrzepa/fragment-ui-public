"use client";

import { DocumentContent, CodeBlock, VirtualTable } from "@fragment_ui/ui";

const data = Array.from({ length: 1000 }, (_, i) => ({
  id: `${i}`,
  name: `Row ${i + 1}`,
  value: Math.round(Math.random() * 1000),
}));

type Row = (typeof data)[number];

const columns = [
  { id: "name", header: "Name", accessor: (row: Row) => row.name },
  { id: "value", header: "Value", accessor: (row: Row) => row.value },
];

export default function VirtualScrollingPage() {
  return (
    <DocumentContent as="article">
      <h1 className="text-3xl font-medium mb-4" id="page">
        Virtual Scrolling
      </h1>
      <p className="mb-6 intro-text">Render large lists efficiently.</p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-4xl">
            <VirtualTable data={data} columns={columns} containerHeight={300} rowHeight={36} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { VirtualTable } from "@fragment_ui/ui";

const data = Array.from({ length: 1000 }, (_, i) => ({ id: \`\${i}\`, name: \`Row \${i + 1}\`, value: Math.random() * 1000 }));
const columns = [
  { id: "name", header: "Name", accessor: (row: typeof data[number]) => row.name },
  { id: "value", header: "Value", accessor: (row: typeof data[number]) => row.value },
];

<VirtualTable data={data} columns={columns} containerHeight={300} rowHeight={36} />`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

