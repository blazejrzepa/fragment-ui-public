"use client";

import { TestimonialsSection } from "@fragment_ui/blocks";
import { DocumentContent, CodeBlock } from "@fragment_ui/ui";

const testimonials = [
  { author: "Jane Doe", role: "Product Manager", quote: "Fragment UI sped up our delivery.", avatar: "https://github.com/shadcn.png" },
  { author: "John Smith", role: "Engineer", quote: "Great DX and accessible components.", avatar: "https://github.com/shadcn.png" },
  { author: "Alex Lee", role: "Designer", quote: "Consistent UI across our apps.", avatar: "https://github.com/shadcn.png" },
];

export default function TestimonialsSectionPage() {
  return (
    <DocumentContent as="article">
      <h1 className="text-3xl font-medium mb-4" id="page">
        Testimonials Section
      </h1>
      <p className="mb-6 intro-text">Showcase customer quotes in a grid.</p>

      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-5xl">
            <TestimonialsSection title="What our customers say" items={testimonials} layout="grid" columns={3} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { TestimonialsSection } from "@fragment_ui/blocks";

const testimonials = [
  { author: "Jane Doe", role: "Product Manager", quote: "Fragment UI sped up our delivery." },
  { author: "John Smith", role: "Engineer", quote: "Great DX and accessible components." },
];

<TestimonialsSection title="What our customers say" items={testimonials} layout="grid" columns={3} />`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

