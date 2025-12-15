"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, Button } from "@fragment_ui/ui";
import { useTheme } from "../../../../src/lib/theme";

export default function DarkModePage() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="dark-mode" className="text-3xl font-medium mb-4">Dark Mode</h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/foundations/theming"}>
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
        Automatic dark mode with system preference detection and theme persistence.
      </p>

      <h2 id="overview">Overview</h2>
      <p>
        Dark mode is implemented using CSS custom properties (CSS variables) that change based on
        the <code>data-theme</code> attribute on the <code>&lt;html&gt;</code> element. The system
        automatically detects the user's system preference and applies the appropriate theme.
      </p>

      <h2 id="theme-options">Theme Options</h2>
      <p>Fragment UI supports four theme modes:</p>
      <ol>
        <li>
          <strong>Dark</strong> - Dark color scheme (default)
        </li>
        <li>
          <strong>Light</strong> - Light color scheme
        </li>
        <li>
          <strong>System</strong> - Automatically follows system preference
        </li>
        <li>
          <strong>High Contrast</strong> - High contrast theme for accessibility
        </li>
      </ol>

      <h2 id="usage">Usage</h2>

      <h3>Automatic Theme Detection</h3>
      <p>By default, Fragment UI automatically detects the system preference:</p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`// No setup required - theme is automatically applied
import { ThemeProvider } from "@fragment_ui/ui";

function App() {
  return (
    <ThemeProvider>
      {/* Your app */}
    </ThemeProvider>
  );
}`}</code>
      </pre>

      <h3>Manual Theme Switching</h3>
      <p>Use the <code>useTheme</code> hook to programmatically switch themes:</p>
      <div className="my-6 p-4 border border-[color:var(--color-border-base)] rounded-lg">
        <p className="mb-4">
          Current theme: <strong>{theme}</strong> (Effective: <strong>{effectiveTheme}</strong>)
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setTheme("light")} size="sm">
            Light
          </Button>
          <Button onClick={() => setTheme("dark")} size="sm">
            Dark
          </Button>
          <Button onClick={() => setTheme("system")} size="sm">
            System
          </Button>
          <Button onClick={() => setTheme("high-contrast")} size="sm">
            High Contrast
          </Button>
        </div>
      </div>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { useTheme } from "@/lib/theme";

function MyComponent() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <button onClick={() => setTheme("dark")}>
      Switch to Dark Mode
    </button>
  );
}`}</code>
      </pre>

      <h3>ThemeProvider Component</h3>
      <p>
        The <code>ThemeProvider</code> component manages theme state and persistence:
      </p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { ThemeProvider } from "@fragment_ui/ui";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fragment-ui-theme">
      {/* Your app */}
    </ThemeProvider>
  );
}`}</code>
      </pre>

      <h2 id="implementation">Implementation Details</h2>

      <h3>CSS Variables</h3>
      <p>
        Dark mode works by switching CSS variables based on the <code>data-theme</code> attribute:
      </p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`/* Light theme (default) */
[data-theme="light"] {
  --color-bg-base: #FFFFFF;
  --color-fg-base: #0B0B0C;
  /* ... other light theme colors */
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg-base: #0B0B0C;
  --color-fg-base: #EDEDF0;
  /* ... other dark theme colors */
}

/* System preference (when no data-theme is set) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Dark theme colors */
  }
}`}</code>
      </pre>

      <h3>Theme Persistence</h3>
      <p>
        The selected theme is automatically saved to <code>localStorage</code> and restored on page
        load. This ensures users' theme preferences persist across sessions.
      </p>

      <h2 id="system-preference">System Preference Detection</h2>
      <p>
        When theme is set to "system", Fragment UI uses the <code>prefers-color-scheme</code> media
        query to detect the user's system preference:
      </p>
      <ul>
        <li>
          <strong>Light mode:</strong> Applied when system preference is light
        </li>
        <li>
          <strong>Dark mode:</strong> Applied when system preference is dark
        </li>
        <li>
          <strong>Dynamic updates:</strong> Theme automatically switches when system preference
          changes
        </li>
      </ul>

      <h2 id="high-contrast">High Contrast Mode</h2>
      <p>
        High contrast mode provides maximum contrast for better accessibility. It uses bold colors
        and high contrast ratios:
      </p>
      <ul>
        <li>Black background (#000000)</li>
        <li>White text (#FFFFFF)</li>
        <li>Bright accent colors</li>
        <li>Maximum contrast ratios (WCAG AAA)</li>
      </ul>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>
          <strong>Always use CSS variables:</strong> Never hardcode colors - use design tokens
        </li>
        <li>
          <strong>Test all themes:</strong> Ensure components work in light, dark, and
          high-contrast modes
        </li>
        <li>
          <strong>Respect user preference:</strong> Default to "system" to respect user's OS
          settings
        </li>
        <li>
          <strong>Provide theme toggle:</strong> Allow users to manually override system preference
        </li>
        <li>
          <strong>Persist theme choice:</strong> Save user's theme preference in localStorage
        </li>
      </ul>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <h3>Theme not switching</h3>
      <ul>
        <li>Ensure <code>ThemeProvider</code> is wrapping your app</li>
        <li>Check that CSS variables are loaded from <code>@fragment_ui/tokens</code></li>
        <li>Verify <code>data-theme</code> attribute is being set on <code>&lt;html&gt;</code></li>
      </ul>

      <h3>System preference not working</h3>
      <ul>
        <li>Ensure no explicit <code>data-theme</code> is set (remove it for system mode)</li>
        <li>Check browser supports <code>prefers-color-scheme</code> media query</li>
        <li>Verify CSS variables have media query fallbacks</li>
      </ul>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <a href="/docs/foundations/tokens" className="underline text-[color:var(--color-brand-primary)]">
            Design Tokens
          </a>
        </li>
        <li>
          <a href="/docs/foundations/semantic-colors" className="underline text-[color:var(--color-brand-primary)]">
            Semantic Colors
          </a>
        </li>
      </ul>

      <EditOnGitHub filePath="apps/www/app/docs/foundations/dark-mode/page.tsx" />
    </DocLayout>
  );
}

