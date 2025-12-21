"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";

export default function ResponsiveLayoutExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Responsive</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Responsive example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This layout adapts to screen size.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p>1 column on mobile, 2 on tablet, 3 on desktop.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fully responsive design.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2>Breakpoints</h2>
      <ul>
        <li><strong>Mobile:</strong> &lt; 768px (1 column)</li>
        <li><strong>Tablet:</strong> 768px - 1024px (2 columns)</li>
        <li><strong>Desktop:</strong> &gt; 1024px (3 columns)</li>
      </ul>
    </DocLayout>
  );
}

