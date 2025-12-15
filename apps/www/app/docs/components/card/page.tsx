"use client";

import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  DocumentContent, 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent,
  Button,
  Input,
  Label,
  CodeBlock
} from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

const LoginCardExample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="font-medium">Login to your account</CardTitle>
        <CardDescription>
          Enter your e-mail address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
            size="md"
          />
        </div>
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a className="text-sm hover:underline" href="#">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            size="md"
          />
        </div>
        <Button className="w-full" style={{ marginTop: "1.5rem" }}>Login</Button>
        <Button className="w-full" variant="outline">
          Login with Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          Don't have an account?{" "}
          <a className="underline" href="#">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default function CardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="card" className="text-3xl font-medium mb-4">Card</h1>
      </div>
      <p className="mb-6 intro-text">
        Group related content in a container.
      </p>
      
      {/* Card without Footer */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Card className="w-96">
            <CardHeader>
              <CardTitle id="simple-card">Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can place any content.</p>
            </CardContent>
          </Card>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fragment_ui/ui";

<Card className="w-96">
  <CardHeader>
    <CardTitle className="font-medium">Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the card content area where you can place any content.</p>
  </CardContent>
</Card>`}</CodeBlock>
        </div>
      </div>

      {/* Standard Card with Actions */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can place any content.</p>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t-0">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Button } from "@fragment_ui/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@fragment_ui/ui";

<Card className="w-96">
  <CardHeader>
    <CardTitle className="font-medium">Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the card content area where you can place any content.</p>
  </CardContent>
  <CardFooter className="justify-end gap-3 border-t-0">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </CardFooter>
</Card>`}</CodeBlock>
        </div>
      </div>

      {/* Login Card */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[500px] p-10">
          <LoginCardExample />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@fragment_ui/ui";
import { Button, Input, Label } from "@fragment_ui/ui";

function LoginCardExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="font-medium">Login to your account</CardTitle>
        <CardDescription>
          Enter your e-mail address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
          />
        </div>
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a className="text-sm hover:underline" href="#">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </div>
        <Button className="w-full">Login</Button>
        <Button className="w-full" variant="outline">
          Login with Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          Don't have an account?{" "}
          <a className="underline" href="#">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/card.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Card</code> is a container component for grouping related content together.<br />
            Use it when you need to visually separate and organize content into distinct sections, such as product cards, feature highlights, dashboard widgets, or content blocks.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Product or item cards in grids</li>
            <li>Dashboard widgets and metrics</li>
            <li>Feature highlights and showcases</li>
            <li>Content blocks and sections</li>
            <li>Any grouped, related information that needs visual separation</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Card"</code>. Card is a composable component with sub-components:
          </p>
          <ul>
            <li><code>Card</code> – main container (required)</li>
            <li><code>CardHeader?</code> – header section (optional)</li>
            <li><code>CardTitle?</code> – title within header (optional)</li>
            <li><code>CardDescription?</code> – description within header (optional)</li>
            <li><code>CardContent?</code> – main content area (optional)</li>
            <li><code>CardFooter?</code> – footer section with border (optional)</li>
          </ul>
          <p>All sub-components accept <code>className?</code> for custom styling.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Card",
  "props": {
    "className": "w-96"
  },
  "children": [
    {
      "type": "component",
      "component": "CardHeader",
      "children": [
        {
          "type": "component",
          "component": "CardTitle",
          "children": "Product Name"
        },
        {
          "type": "component",
          "component": "CardDescription",
          "children": "Product description"
        }
      ]
    },
    {
      "type": "component",
      "component": "CardContent",
      "children": "Product details and information"
    },
    {
      "type": "component",
      "component": "CardFooter",
      "children": {
        "type": "component",
        "component": "Button",
        "children": "Add to Cart"
      }
    }
  ]
}`}</CodeBlock>
          <p className="mt-6"><strong>Simple card without footer:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Card",
  "children": [
    {
      "type": "component",
      "component": "CardHeader",
      "children": {
        "type": "component",
        "component": "CardTitle",
        "children": "Title"
      }
    },
    {
      "type": "component",
      "component": "CardContent",
      "children": "Content text"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/display-card--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
