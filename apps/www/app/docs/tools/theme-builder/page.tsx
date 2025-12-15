"use client";

import * as React from "react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { TokenEditor, TokenValue } from "../../../../src/components/theme-builder/token-editor";
import { ThemePreview } from "../../../../src/components/theme-builder/theme-preview";
import { ThemeExporter } from "../../../../src/components/theme-builder/theme-exporter";
import {
  THEME_TOKENS,
  getDefaultTokenValues,
  tokensToCSS,
  applyThemeToDocument,
  resetTheme as resetThemeToDefaults,
} from "../../../../src/lib/theme-tokens";
import { Separator, Button } from "@fragment_ui/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function ThemeBuilderPage() {
  const [tokenValues, setTokenValues] = React.useState<Record<string, TokenValue>>(
    getDefaultTokenValues
  );
  const [exportFormat, setExportFormat] = React.useState<"json" | "css">("json");

  // Apply theme changes to document
  React.useEffect(() => {
    const css = tokensToCSS(tokenValues);
    applyThemeToDocument(css);
  }, [tokenValues]);

  const handleTokenChange = (path: string, value: TokenValue) => {
    setTokenValues((prev) => ({
      ...prev,
      [path]: value,
    }));
  };

  const handleReset = () => {
    const defaults = getDefaultTokenValues();
    setTokenValues(defaults);
    resetThemeToDefaults();
  };

  return (
    <DocLayout>
      <h1>Theme Builder</h1>
      <h2 id="overview">Overview</h2>
      <p>
        Interactive theme builder for customizing Fragment UI design tokens. Adjust colors,
        spacing, typography, and other design tokens with live preview. Export your custom theme
        as JSON or CSS.
      </p>

      <div className="my-8 space-y-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Token Editor</h3>
                <div className="max-h-[600px] overflow-y-auto pr-4">
                  <TokenEditor
                    tokens={THEME_TOKENS}
                    values={tokenValues}
                    onChange={handleTokenChange}
                    onReset={handleReset}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="max-h-[600px] overflow-y-auto">
                  <ThemePreview />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <ThemePreview />
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <div className="space-y-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setExportFormat("json")}
                  className={`px-4 py-2 rounded ${
                    exportFormat === "json"
                      ? "bg-[color:var(--color-brand-primary)] text-white"
                      : "bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]"
                  }`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setExportFormat("css")}
                  className={`px-4 py-2 rounded ${
                    exportFormat === "css"
                      ? "bg-[color:var(--color-brand-primary)] text-white"
                      : "bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]"
                  }`}
                >
                  CSS
                </button>
              </div>
              <ThemeExporter tokens={tokenValues} format={exportFormat} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <h2 id="features">Features</h2>
      <ul>
        <li>✅ Live preview of theme changes</li>
        <li>✅ Edit colors, spacing, typography, and more</li>
        <li>✅ Export as JSON or CSS</li>
        <li>✅ Copy to clipboard or download</li>
        <li>✅ Reset to default values</li>
      </ul>

      <h2 id="usage">Usage</h2>
      <ol>
        <li>Use the Editor tab to customize design tokens</li>
        <li>See changes instantly in the live preview</li>
        <li>Switch to Preview tab for a full-screen view</li>
        <li>Export your theme in the Export tab</li>
        <li>Copy the code or download the file</li>
      </ol>

      <h2 id="limitations">Limitations</h2>
      <p>
        Theme changes are applied only to this page during your session. To use a custom theme
        in your application, export the theme and integrate it into your project following the
        Fragment UI theming guide.
      </p>
    </DocLayout>
  );
}

