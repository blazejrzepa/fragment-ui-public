"use client";

import { FileUpload, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { useState } from "react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function FileUploadPage() {
  const [files1, setFiles1] = useState<File[]>([]);
  const [files2, setFiles2] = useState<File[]>([]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">File Upload</h1>
      </div>
      <p className="mb-6 intro-text">
        Select and upload files with drag & drop support, validation, and preview.
      </p>
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <FileUpload
              onUpload={(files) => {
                console.log("Uploaded files:", files);
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { FileUpload } from "@fragment_ui/ui";

<FileUpload
  onUpload={(files) => {
    console.log("Uploaded files:", files);
  }}
/>`}</CodeBlock>
        </div>
      </div>

      {/* Image Only with Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <FileUpload
              accept="image/*"
              multiple
              showPreview
              onUpload={(files) => {
                console.log("Uploaded images:", files);
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { FileUpload } from "@fragment_ui/ui";

<FileUpload
  accept="image/*"
  multiple
  showPreview
  onUpload={(files) => {
    console.log("Uploaded images:", files);
  }}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/file-upload.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>FileUpload</code> is a component for selecting and uploading files with drag & drop support, validation, and preview capabilities.<br />
            Use it when you need to allow users to upload files, images, documents, or any other file types. The component provides a user-friendly interface with visual feedback, validation, and error handling.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Profile picture or avatar uploads</li>
            <li>Document or file attachments in forms</li>
            <li>Image galleries or media uploads</li>
            <li>Bulk file uploads with validation</li>
            <li>File sharing or transfer features</li>
            <li>Content management systems (CMS)</li>
            <li>Any scenario requiring file selection and upload</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "FileUpload"</code>.
          </p>
          <p>Props for <code>FileUpload</code>:</p>
          <ul>
            <li><code>onUpload?</code> – Callback when files are uploaded: <code>(files: File[]) =&gt; void | Promise&lt;void&gt;</code> (optional)</li>
            <li><code>onFileChange?</code> – Callback when file list changes: <code>(files: FileUploadFile[]) =&gt; void</code> (optional)</li>
            <li><code>accept?</code> – Accepted file types: <code>string | string[]</code> (optional, e.g., "image/*", ".pdf", ["image/*", ".pdf"])</li>
            <li><code>multiple?</code> – Allow multiple file selection: <code>boolean</code> (optional, default: false)</li>
            <li><code>maxSize?</code> – Maximum file size in bytes: <code>number</code> (optional)</li>
            <li><code>maxFiles?</code> – Maximum number of files: <code>number</code> (optional)</li>
            <li><code>disabled?</code> – Disable interaction: <code>boolean</code> (optional, default: false)</li>
            <li><code>showPreview?</code> – Show image preview thumbnails: <code>boolean</code> (optional, default: true)</li>
            <li><code>showProgress?</code> – Show upload progress indicator: <code>boolean</code> (optional, default: false)</li>
            <li><code>className?</code> – Additional CSS classes: <code>string</code> (optional)</li>
          </ul>
          <p><code>FileUploadFile</code> interface:</p>
          <ul>
            <li><code>file</code> – The File object (required)</li>
            <li><code>id</code> – Unique identifier (required)</li>
            <li><code>preview?</code> – Preview URL for images (optional)</li>
            <li><code>progress?</code> – Upload progress 0-100 (optional)</li>
            <li><code>error?</code> – Error message if upload failed (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "FileUpload",
  "props": {
    "accept": "image/*",
    "multiple": true,
    "maxSize": 5242880,
    "maxFiles": 5,
    "showPreview": true,
    "onUpload": "handleFileUpload"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-file-upload--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
