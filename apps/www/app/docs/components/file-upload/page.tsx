"use client";

import { FileUpload, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const fileUploadCode = `import { FileUpload } from "@fragment_ui/ui";

export function FileUploadDemo() {
  return (
    <FileUpload
      onUpload={(files) => {
        console.log("Uploaded files:", files);
      }}
    />
  );
}`;

const fileUploadImageCode = `import { FileUpload } from "@fragment_ui/ui";

export function FileUploadImageDemo() {
  return (
    <FileUpload
      accept="image/*"
      multiple
      showPreview
      onUpload={(files) => {
        console.log("Uploaded images:", files);
      }}
    />
  );
}`;

export default function FileUploadPage() {
  const [files1, setFiles1] = useState<File[]>([]);
  const [files2, setFiles2] = useState<File[]>([]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="file-upload">File Upload</h1>
      </div>
      <p className="mb-6 intro-text">Let users upload files from their device.</p>
      
      <ExampleSection
        id="file-upload-example"
        title="File Upload Example"
        code={fileUploadCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <FileUpload
              onUpload={(files) => {
                setFiles1(files);
                console.log("Uploaded files:", files);
              }}
            />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="file-upload-image"
        title="Image Upload with Preview"
        code={fileUploadImageCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <FileUpload
              accept="image/*"
              multiple
              showPreview
              onUpload={(files) => {
                setFiles2(files);
                console.log("Uploaded images:", files);
              }}
            />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add file-upload`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
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
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>onUpload</code></td>
              <td className="py-2 px-4"><code>(files: File[]) {'=>'} void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback function called when files are selected</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>accept</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">File types to accept (e.g., <code>"image/*"</code>, <code>".pdf"</code>)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>multiple</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Allow multiple file selection</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>maxSize</code></td>
              <td className="py-2 px-4"><code>number</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Maximum file size in bytes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>showPreview</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Show file preview after selection</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>disabled</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Disable file upload</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>FileUpload</code> is a component for selecting and uploading files with drag & drop support, validation, and preview. Use it when you need to allow users to upload files, images, or documents. The component provides a user-friendly interface with drag-and-drop functionality, file validation, and optional preview capabilities.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>File upload forms</li>
            <li>Image upload with preview</li>
            <li>Document upload interfaces</li>
            <li>Profile picture uploads</li>
            <li>Any scenario requiring file selection and upload</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "FileUpload"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>onUpload</code> – Callback function that receives an array of selected files when files are chosen (required)</li>
            <li><code>accept?</code> – File types to accept, specified as MIME types or file extensions (e.g., <code>"image/*"</code> for all images, <code>".pdf"</code> for PDF files) (optional)</li>
            <li><code>multiple?</code> – Boolean to allow multiple file selection in a single operation (optional, default: <code>false</code>)</li>
            <li><code>maxSize?</code> – Maximum file size in bytes that can be uploaded (files exceeding this size will be rejected) (optional)</li>
            <li><code>showPreview?</code> – Boolean to display file preview after selection (useful for images) (optional, default: <code>false</code>)</li>
            <li><code>disabled?</code> – Boolean to disable file upload and prevent user interaction (optional)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the component (optional)</li>
          </ul>

          <h3>Basic File Upload</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "FileUpload",
  "props": {
    "onUpload": "handleFileUpload"
  }
}`}</CodeBlock>

          <h3>Image Upload with Preview</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "FileUpload",
  "props": {
    "accept": "image/*",
    "multiple": true,
    "showPreview": true,
    "onUpload": "handleFileUpload"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
