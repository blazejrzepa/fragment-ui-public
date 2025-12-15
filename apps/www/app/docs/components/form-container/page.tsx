"use client";

import { DocumentContent, CodeBlock } from "@fragment_ui/ui";

import { FormContainer } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function FormContainerPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Form Container</h1>
      </div>
      <p className="mb-6 intro-text">
        Structured layout for forms with actions.
      </p>
      <h2>Overview</h2>
      
      <h2>Install</h2>
      <pre><code>npx shadcn@latest add /r/form-container.json</code></pre>
      
      <h2>Examples</h2>
      
      {/* Form Container */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-2xl">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { FormContainer } from "@fragment_ui/blocks";

// Basic usage with default fields

// With custom fields
<FormContainer
  title="Custom Form"
  description="Fill out this form"
  onSubmit={(data) => {
    console.log(data);
  }}
>
  {/* Custom form fields */}
</FormContainer>`}</CodeBlock>
        </div>
      </div>
      
      <h2>Features</h2>
      <ul>
        <li>Title and description support</li>
        <li>Form submission handler</li>
        <li>Default example fields (Name, Email, Country, Terms checkbox)</li>
        <li>Custom children support</li>
        <li>Reset button included</li>
        <li>Responsive layout</li>
        <li>Accessible form structure</li>
      </ul>
      
      <h2>Props</h2>
      <ul>
        <li><code>title</code> - Form title (default: "Form")</li>
        <li><code>description</code> - Optional form description</li>
        <li><code>onSubmit</code> - Form submission handler (receives FormData)</li>
        <li><code>children</code> - Custom form content (defaults to example fields if not provided)</li>
      </ul>
      
      <h2>Accessibility</h2>
      <p>The form uses semantic HTML elements, proper labels, and is fully keyboard accessible.</p>
      
      <h2>Links</h2>
      <ul>
        <li>
          <StorybookLink>Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

