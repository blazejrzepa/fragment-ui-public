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
import { ExampleSection } from "../../../../src/components/example-section";

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

const simpleCardCode = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fragment_ui/ui";

export function SimpleCardDemo() {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="font-medium">Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
    </Card>
  );
}`;

const variantsCode = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fragment_ui/ui";

export function CardVariantsDemo() {
  return (
    <div className="flex gap-[var(--space-4)]">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="font-medium">Default</CardTitle>
          <CardDescription>Card with background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a background color.</p>
        </CardContent>
      </Card>
      <Card className="w-96 bg-transparent">
        <CardHeader>
          <CardTitle className="font-medium">Outline</CardTitle>
          <CardDescription>Card with border only</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has only a border, no background.</p>
        </CardContent>
      </Card>
    </div>
  );
}`;

const cardWithFooterCode = `import { Button } from "@fragment_ui/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@fragment_ui/ui";

export function CardWithFooterDemo() {
  return (
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
    </Card>
  );
}`;

const loginCardCode = `"use client";

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
}`;

export default function CardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="card" className="text-[length:var(--typography-display-md-size)] font-medium">Card</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Group related content in a container.</p>
      
      <ExampleSection
        id="simple-card"
        title="Example"
        code={simpleCardCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="font-medium">Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can place any content.</p>
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="card-variants"
        title="Variants"
        code={variantsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-4)] items-center justify-center w-full">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="font-medium">Default</CardTitle>
              <CardDescription>Card with background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a background color.</p>
            </CardContent>
          </Card>
          <Card className="w-96 bg-transparent">
            <CardHeader>
              <CardTitle className="font-medium">Outline</CardTitle>
              <CardDescription>Card with border only</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has only a border, no background.</p>
            </CardContent>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="card-with-footer"
        title="Card with Footer"
        code={cardWithFooterCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="font-medium">Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can place any content.</p>
            </CardContent>
            <CardFooter className="justify-end gap-[var(--space-3)] border-t-0">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </div>
      </ExampleSection>

      <ExampleSection
        id="login-card"
        title="Login Card"
        code={loginCardCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <LoginCardExample />
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add card`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Card</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Card content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Card</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardHeader</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Header content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardHeader</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardTitle</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Title text (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardTitle</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardDescription</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Description text (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardDescription</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Main content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardFooter</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Footer content (required)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CardFooter</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <p><strong>Intent</strong></p>
          <p>
            <code>Card</code> is a container component for grouping related content together. Use it when you need to visually separate and organize content into distinct sections, such as product cards, feature highlights, dashboard widgets, or content blocks.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Product or item cards in grids</li>
            <li>Dashboard widgets and metrics</li>
            <li>Feature highlights and showcases</li>
            <li>Content blocks and sections</li>
            <li>Any grouped, related information that needs visual separation</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Card"</code>. Card is a composable component with sub-components.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>children</code> – React.ReactNode. Card content (required)</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>Card sub-components:</p>
          <ul>
            <li><code>CardHeader</code> – header section container</li>
            <li><code>CardTitle</code> – title within header</li>
            <li><code>CardDescription</code> – description within header</li>
            <li><code>CardContent</code> – main content area</li>
            <li><code>CardFooter</code> – footer section</li>
          </ul>
          <p>All sub-components accept <code>children</code> (required) and <code>className?</code> (optional) for custom styling.</p>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
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
    }
  ]
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Footer</h3>
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
    },
    {
      "type": "component",
      "component": "CardFooter",
      "children": {
        "type": "component",
        "component": "Button",
        "children": "Action"
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
