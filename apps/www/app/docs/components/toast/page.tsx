"use client";

import { Toaster, toast, Button, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const toastBasicCode = `import { toast, Button } from "@fragment_ui/ui";

export function ToastBasicDemo() {
  return (
    <div className="flex gap-2">
      <Button onClick={() => toast.success("Operation successful!")}>Success</Button>
      <Button onClick={() => toast.error("Something went wrong")}>Error</Button>
      <Button onClick={() => toast.info("Here's some information")}>Info</Button>
      <Button onClick={() => toast.warning("Please be careful")}>Warning</Button>
    </div>
  );
}`;

const toastActionsCode = `import { toast, Button } from "@fragment_ui/ui";

export function ToastActionsDemo() {
  return (
    <>
      <Button
        onClick={() =>
          toast.success("File uploaded successfully!", {
            action: {
              label: "View",
              onClick: () => console.log("View file"),
            },
          })
        }
      >
        Success with Action
      </Button>
      <Button
        onClick={() =>
          toast.error("Failed to save changes", {
            action: {
              label: "Retry",
              onClick: () => console.log("Retry"),
            },
            cancel: {
              label: "Dismiss",
              onClick: () => console.log("Dismissed"),
            },
          })
        }
      >
        Error with Actions
      </Button>
    </>
  );
}`;

export default function ToastPage() {
  return (
    <DocumentContent as="article">
      <Toaster />
      <div className="flex items-center gap-4 mb-1">
        <h1 id="toast">Toast</h1>
      </div>
      <p className="mb-6 intro-text">Brief, dismissible notification messages.</p>

      <ExampleSection
        id="toast-basic"
        title="Example"
        code={toastBasicCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex gap-[var(--space-2)] flex-wrap justify-center items-center">
            <Button onClick={() => toast.success("Operation successful!")}>Success</Button>
            <Button onClick={() => toast.error("Something went wrong")}>Error</Button>
            <Button onClick={() => toast.info("Here's some information")}>Info</Button>
            <Button onClick={() => toast.warning("Please be careful")}>Warning</Button>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add toast`}
      </CodeBlock>

      <ExampleSection
        id="toast-actions"
        title="With Actions"
        code={toastActionsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex gap-[var(--space-2)] flex-wrap justify-center items-center">
            <Button
              onClick={() =>
                toast.success("File uploaded successfully!", {
                  action: {
                    label: "View",
                    onClick: () => console.log("View file"),
                  },
                })
              }
            >
              Success with Action
            </Button>
            <Button
              onClick={() =>
                toast.error("Failed to save changes", {
                  action: {
                    label: "Retry",
                    onClick: () => console.log("Retry"),
                  },
                  cancel: {
                    label: "Dismiss",
                    onClick: () => console.log("Dismissed"),
                  },
                })
              }
            >
              Error with Actions
            </Button>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component/Function</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props/Options</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code>Toaster</code></td>
              <td className="py-2 px-4"><code>position?, richColors?, closeButton?, expand?, duration?, visibleToasts?, toastOptions?, theme?, className?</code></td>
              <td className="py-2 px-4">position: "top-right", richColors: true, closeButton: true, expand: true, duration: 4000, visibleToasts: 3, theme: "dark"</td>
              <td className="py-2 px-4 text-sm">Toast container component (required in app layout)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>toast.success()</code></td>
              <td className="py-2 px-4"><code>message, options?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Show success toast</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>toast.error()</code></td>
              <td className="py-2 px-4"><code>message, options?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Show error toast</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>toast.info()</code></td>
              <td className="py-2 px-4"><code>message, options?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Show info toast</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>toast.warning()</code></td>
              <td className="py-2 px-4"><code>message, options?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Show warning toast</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>toast.message()</code></td>
              <td className="py-2 px-4"><code>message, options?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Show default toast</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-[color:var(--color-border-base)]">
          <p className="text-sm font-semibold mb-2">Toast options:</p>
          <ul className="text-sm space-y-1">
            <li><code>title?</code> – string. Toast title (optional)</li>
            <li><code>description?</code> – string. Toast description (optional)</li>
            <li><code>action?</code> – object. Action button: <code>{'{'} label: ReactNode, onClick: (event) {'=>'} void {'}'}</code> (optional)</li>
            <li><code>cancel?</code> – object. Cancel button: <code>{'{'} label: ReactNode, onClick: (event) {'=>'} void {'}'}</code> (optional)</li>
            <li><code>duration?</code> – number. Display duration in milliseconds (optional)</li>
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
            <code>Toast</code> is a component for showing brief, non-blocking messages. Use it when you need to provide feedback to users about actions, errors, or information without interrupting their workflow. The component supports different types (success, error, info, warning) and can include action buttons.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Success or error notifications</li>
            <li>Action confirmations</li>
            <li>Information messages</li>
            <li>Warning alerts</li>
            <li>Any scenario requiring non-blocking feedback</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Toast is typically triggered programmatically using the <code>toast</code> function, not as a component in the UI-DSL. However, you need to include <code>Toaster</code> component in your app layout.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>Toaster</code> – Component to include in app layout (required):
              <ul>
                <li><code>position?</code> – string. Position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" (optional, default: "top-right")</li>
                <li><code>richColors?</code> – boolean. Enable rich colors (optional, default: true)</li>
                <li><code>closeButton?</code> – boolean. Show close button (optional, default: true)</li>
                <li><code>expand?</code> – boolean. Expand toasts on hover (optional, default: true)</li>
                <li><code>duration?</code> – number. Default duration in milliseconds (optional, default: 4000)</li>
                <li><code>visibleToasts?</code> – number. Maximum visible toasts (optional, default: 3)</li>
                <li><code>theme?</code> – string. Theme: "light" | "dark" | "system" (optional, default: "dark")</li>
              </ul>
            </li>
            <li>Toast functions:
              <ul>
                <li><code>toast.success(message, options?)</code> – Show success toast</li>
                <li><code>toast.error(message, options?)</code> – Show error toast</li>
                <li><code>toast.info(message, options?)</code> – Show info toast</li>
                <li><code>toast.warning(message, options?)</code> – Show warning toast</li>
                <li><code>toast.message(message, options?)</code> – Show default toast</li>
              </ul>
            </li>
            <li>Toast options:
              <ul>
                <li><code>title?</code> – string. Toast title (optional)</li>
                <li><code>description?</code> – string. Toast description (optional)</li>
                <li><code>action?</code> – object. Action button: <code>{'{'} label: ReactNode, onClick: (event) {'=>'} void {'}'}</code> (optional)</li>
                <li><code>cancel?</code> – object. Cancel button: <code>{'{'} label: ReactNode, onClick: (event) {'=>'} void {'}'}</code> (optional)</li>
                <li><code>duration?</code> – number. Display duration in milliseconds (optional)</li>
              </ul>
            </li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "onClick": "() => toast.success('Operation successful!')"
  },
  "children": "Show Success Toast"
}`}</CodeBlock>
          <p className="mt-6"><strong>Note:</strong> Make sure to include <code>Toaster</code> component in your app layout:</p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Toaster"
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
