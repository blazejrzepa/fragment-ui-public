"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, Button, CodeBlock } from "@fragment_ui/ui";

export default function ThemingPage() {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system" | "high-contrast">("dark");
  const [density, setDensity] = useState<"compact" | "normal" | "comfortable">("normal");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="theming" className="text-3xl font-medium mb-4">Theming &amp; Modes</h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/foundations/tokens"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/foundations/semantic-colors"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Customize themes, density modes, and text directions through data attributes.
      </p>
      
      <h2 id="theme-switching">Theme Switching</h2>
      <p>Switch between themes using the <code>data-theme</code> attribute:</p>
      
      <div className="space-y-4 my-6">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={themeMode === "dark" ? "solid" : "outline"}
            onClick={() => {
              setThemeMode("dark");
              document.documentElement.setAttribute("data-theme", "dark");
            }}
          >
            Dark Theme
          </Button>
          <Button 
            variant={themeMode === "light" ? "solid" : "outline"}
            onClick={() => {
              setThemeMode("light");
              document.documentElement.setAttribute("data-theme", "light");
            }}
          >
            Light Theme
          </Button>
          <Button 
            variant={themeMode === "system" ? "solid" : "outline"}
            onClick={() => {
              setThemeMode("system");
              document.documentElement.removeAttribute("data-theme");
            }}
          >
            System
          </Button>
          <Button 
            variant={themeMode === "high-contrast" ? "solid" : "outline"}
            onClick={() => {
              setThemeMode("high-contrast");
              document.documentElement.setAttribute("data-theme", "high-contrast");
            }}
          >
            High Contrast
          </Button>
        </div>
      </div>

      <CodeBlock language="html" highlightApiUrl="/api/highlight-code">{`<html data-theme="dark">      <!-- Dark theme (default) -->
<html data-theme="light">     <!-- Light theme -->
<html data-theme="high-contrast">  <!-- High contrast theme -->
<!-- System: remove data-theme attribute -->`}</CodeBlock>
      
      <h3 id="using-themeprovider">Using ThemeProvider</h3>
      <p>For React applications, use the <code>ThemeProvider</code> component and <code>useTheme</code> hook:</p>
      <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/lib/theme";

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
<html data-density="normal">  <!-- default -->
<html data-density="comfortable">`}</CodeBlock>

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
  dir="rtl"
  lang="ar"
>
  <!-- High contrast, comfortable density, RTL layout -->
</html>`}</CodeBlock>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li><strong>Theme</strong>: Set at the root level for consistent theming across the app</li>
        <li><strong>Density</strong>: Can be set per-page or per-section for different contexts</li>
        <li><strong>Direction</strong>: Should match the primary language of your content</li>
        <li><strong>High Contrast</strong>: Automatically improves accessibility for users with vision impairments</li>
        <li><strong>Logical Properties</strong>: Always use logical properties (start/end) instead of left/right</li>
      </ul>

      <EditOnGitHub filePath="apps/www/app/docs/foundations/theming/page.tsx" />
    </DocLayout>
  );
}
