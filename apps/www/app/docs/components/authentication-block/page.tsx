"use client";

import { useState } from "react";
import { AuthenticationBlock } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function AuthenticationBlockPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Authentication Block</h1>
      </div>
      <p className="mb-6 intro-text">
        Login/signup UI ready to drop in.
      </p>
      
      
      {/* Login Form */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <AuthenticationBlock
              key="login-example"
              mode="login"
              title="Sign in to your account"
              onSubmit={async (data) => {
                console.log("Login:", data);
                alert(`Login: ${data.email}`);
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { AuthenticationBlock } from "@fragment_ui/blocks";

<AuthenticationBlock
  mode="login"
  title="Sign in to your account"
  onSubmit={async (data) => {
    await signIn(data.email, data.password);
  }}
/>`}</CodeBlock>
        </div>
      </div>

      {/* Signup Form */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <AuthenticationBlock
              key="signup-example"
              mode="signup"
              title="Create an account"
              onSubmit={async (data) => {
                console.log("Signup:", data);
                alert(`Signup: ${data.email}`);
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { AuthenticationBlock } from "@fragment_ui/blocks";

<AuthenticationBlock
  mode="signup"
  title="Create an account"
  onSubmit={async (data) => {
    await signUp(data.email, data.password);
  }}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>mode</code> - "login" | "signup" | "reset" (optional, default: "login")
        </li>
        <li>
          <code>onModeChange</code> - Callback when switching modes (optional)
        </li>
        <li>
          <code>onSubmit</code> - Form submission handler (optional)
        </li>
        <li>
          <code>onSocialLogin</code> - Social login handler (optional)
        </li>
        <li>
          <code>socialProviders</code> - Array of social login providers (optional)
        </li>
        <li>
          <code>showSocialLogin</code> - Show social login buttons (optional, default: true)
        </li>
        <li>
          <code>title</code> - Custom title (optional)
        </li>
        <li>
          <code>description</code> - Custom description (optional)
        </li>
        <li>
          <code>error</code> - Error message to display (optional)
        </li>
        <li>
          <code>loading</code> - Loading state (optional)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/authentication-block.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Authentication block uses semantic HTML, proper form labels, ARIA
        attributes, and keyboard navigation. Form validation errors are
        announced to screen readers. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>


    </DocumentContent>
  );
}

