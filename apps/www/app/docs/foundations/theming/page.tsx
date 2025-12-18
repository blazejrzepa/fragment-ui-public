"use client";

import { useState } from "react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";
import { Button, CodeBlock } from "@fragment_ui/ui";
import { useTheme } from "../../../../src/lib/theme";

export default function ThemingPage() {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState<"compact" | "normal" | "comfortable">("normal");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [motion, setMotion] = useState<"normal" | "reduced">("normal");

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="theming" className="text-3xl font-medium mb-4">Theming &amp; Modes</h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      <p className="mb-6 intro-text">
        Customize themes, density modes, and text directions through data attributes.
      </p>
      
      <h2 id="theme-switching">Theme Switching</h2>
      <p>Switch between themes using the <code>data-theme</code> attribute:</p>
      
      <div className="space-y-4 my-6">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={theme === "dark" ? "solid" : "outline"}
            onClick={() => {
              setTheme("dark");
            }}
          >
            Dark Theme
          </Button>
          <Button 
            variant={theme === "light" ? "solid" : "outline"}
            onClick={() => {
              setTheme("light");
            }}
          >
            Light Theme
          </Button>
          <Button 
            variant={theme === "system" ? "solid" : "outline"}
            onClick={() => {
              setTheme("system");
            }}
          >
            System
          </Button>
          <Button 
            variant={theme === "high-contrast" ? "solid" : "outline"}
            onClick={() => {
              setTheme("high-contrast");
            }}
          >
            High Contrast
          </Button>
        </div>
      </div>

      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html data-theme="light">          <!-- Light theme -->
<html data-theme="dark">           <!-- Dark theme -->
<html data-theme="high-contrast">  <!-- High contrast theme -->
<!-- System: remove data-theme attribute -->`}</CodeBlock>
      
      <h3 id="using-themeprovider">Using ThemeProvider</h3>
      <p>For React applications, persist theme choice (e.g. localStorage) and set <code>data-theme</code> on the root element. This portal includes a simple implementation:</p>
      <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`import { ThemeProvider } from "@/src/components/theme-provider";
import { useTheme } from "@/src/lib/theme";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme("dark")}>
      Switch to Dark
    </button>
  );
}`}</CodeBlock>

      <h2 id="density-modes">Density Modes</h2>
      <p>Control the spacing and sizing of components:</p>
      
      <div className="space-y-4 my-6">
        <div className="flex gap-2">
          <Button 
            variant={density === "compact" ? "solid" : "outline"}
            onClick={() => {
              setDensity("compact");
              document.documentElement.setAttribute("data-density", "compact");
            }}
          >
            Compact
          </Button>
          <Button 
            variant={density === "normal" ? "solid" : "outline"}
            onClick={() => {
              setDensity("normal");
              document.documentElement.removeAttribute("data-density");
            }}
          >
            Normal
          </Button>
          <Button 
            variant={density === "comfortable" ? "solid" : "outline"}
            onClick={() => {
              setDensity("comfortable");
              document.documentElement.setAttribute("data-density", "comfortable");
            }}
          >
            Comfortable
          </Button>
        </div>
      </div>

      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html data-density="compact">
<html data-density="comfortable">
<!-- Default (normal): remove data-density attribute -->`}</CodeBlock>

      <h3 id="density-effects">Density Effects</h3>
      <ul>
        <li><strong>Compact</strong>: 75% spacing, smaller fonts - perfect for data tables and dashboards</li>
        <li><strong>Normal</strong>: Standard spacing - default for most interfaces</li>
        <li><strong>Comfortable</strong>: 125% spacing, larger fonts - ideal for touch devices and accessibility</li>
      </ul>

      <h2 id="rtl-support">RTL (Right-to-Left) Support</h2>
      <p>Enable RTL mode for languages like Arabic, Hebrew, and Urdu:</p>
      
      <div className="space-y-4 my-6">
        <div className="flex gap-2">
          <Button 
            variant={direction === "ltr" ? "solid" : "outline"}
            onClick={() => {
              setDirection("ltr");
              document.documentElement.setAttribute("dir", "ltr");
            }}
          >
            LTR (Left-to-Right)
          </Button>
          <Button 
            variant={direction === "rtl" ? "solid" : "outline"}
            onClick={() => {
              setDirection("rtl");
              document.documentElement.setAttribute("dir", "rtl");
            }}
          >
            RTL (Right-to-Left)
          </Button>
        </div>
      </div>

      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html dir="ltr" lang="en">  <!-- English -->
<html dir="rtl" lang="ar">  <!-- Arabic -->
<html dir="rtl" lang="he">  <!-- Hebrew -->`}</CodeBlock>

      <h3 id="using-logical-properties">Using Logical Properties</h3>
      <p>Components automatically adapt to RTL when using logical properties:</p>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`/* Instead of left/right, use logical properties */
padding-inline-start: var(--space-4);
margin-inline-end: var(--space-2);

/* These automatically flip in RTL */`}</CodeBlock>

      <h2 id="combined-usage">Combined Usage</h2>
      <p>You can combine multiple attributes:</p>
      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html
  data-theme="high-contrast"
  data-density="comfortable"
  data-motion="reduced"
  dir="rtl"
  lang="ar"
>
  <!-- High contrast, comfortable density, reduced motion, RTL layout -->
</html>`}</CodeBlock>

      <h2 id="motion-modes">Motion Modes</h2>
      <p>Disable motion with <code>data-motion="reduced"</code> (tokens also respect <code>prefers-reduced-motion</code> by default):</p>

      <div className="space-y-4 my-6">
        <div className="flex gap-2">
          <Button
            variant={motion === "normal" ? "solid" : "outline"}
            onClick={() => {
              setMotion("normal");
              document.documentElement.setAttribute("data-motion", "normal");
            }}
          >
            Normal Motion
          </Button>
          <Button
            variant={motion === "reduced" ? "solid" : "outline"}
            onClick={() => {
              setMotion("reduced");
              document.documentElement.setAttribute("data-motion", "reduced");
            }}
          >
            Reduced Motion
          </Button>
        </div>
      </div>

      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html data-motion="reduced">
<html data-motion="normal">
<!-- Default: follows prefers-reduced-motion unless overridden -->`}</CodeBlock>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li><strong>Theme</strong>: Set at the root level for consistent theming across the app</li>
        <li><strong>Density</strong>: Can be set per-page or per-section for different contexts</li>
        <li><strong>Direction</strong>: Should match the primary language of your content</li>
        <li><strong>High Contrast</strong>: Automatically improves accessibility for users with vision impairments</li>
        <li><strong>Logical Properties</strong>: Always use logical properties (start/end) instead of left/right</li>
      </ul>
    </DocLayout>
  );
}
