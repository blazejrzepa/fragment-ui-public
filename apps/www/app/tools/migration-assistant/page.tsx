"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";
import { Button } from "@fragment_ui/ui";
import { Upload, Download, FileCode, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface MigrationRule {
  fromVersion: string;
  toVersion: string;
  componentName: string;
  description: string;
}

interface MigrationResult {
  file: string;
  success: boolean;
  changes: string[];
  error?: string;
}

export default function MigrationAssistantPage() {
  const [fromVersion, setFromVersion] = React.useState("1.0.0");
  const [toVersion, setToVersion] = React.useState("1.7.0");
  const [selectedComponent, setSelectedComponent] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [results, setResults] = React.useState<MigrationResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Mock migration rules
  const migrationRules: MigrationRule[] = [
    {
      fromVersion: "1.0.0",
      toVersion: "1.1.0",
      componentName: "Button",
      description: "Migrate Button variant prop from 'default' to 'solid'",
    },
    {
      fromVersion: "1.1.0",
      toVersion: "1.2.0",
      componentName: "Input",
      description: "Add error prop support to Input component",
    },
    {
      fromVersion: "1.2.0",
      toVersion: "1.3.0",
      componentName: "FormField",
      description: "Update FormField error prop to accept string or boolean",
    },
    {
      fromVersion: "1.3.0",
      toVersion: "1.4.0",
      componentName: "Dialog",
      description: "Add fullscreen variant to Dialog component",
    },
    {
      fromVersion: "1.4.0",
      toVersion: "1.5.0",
      componentName: "Tabs",
      description: "Add iconOnly prop for icon-only tabs",
    },
    {
      fromVersion: "1.5.0",
      toVersion: "1.6.0",
      componentName: "MultiSelect",
      description: "Add loading state support",
    },
    {
      fromVersion: "1.6.0",
      toVersion: "1.7.0",
      componentName: "Button",
      description: "Add loading and loadingText props",
    },
  ];

  const availableVersions = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0"];
  const components = ["Button", "Input", "FormField", "Dialog", "Tabs", "MultiSelect", "All"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleMigrate = async () => {
    if (files.length === 0) {
      alert("Please upload files to migrate");
      return;
    }

    setLoading(true);
    setResults([]);

    // Simulate migration (in production, this would call the API)
    setTimeout(() => {
      const mockResults: MigrationResult[] = files.map((file) => {
        const applicableRules = migrationRules.filter(
          (rule) =>
            rule.fromVersion === fromVersion &&
            rule.toVersion === toVersion &&
            (selectedComponent === "All" || rule.componentName === selectedComponent)
        );

        return {
          file: file.name,
          success: true,
          changes: applicableRules.map((r) => r.description),
        };
      });

      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  const applicableRules = migrationRules.filter(
    (rule) =>
      rule.fromVersion === fromVersion &&
      rule.toVersion === toVersion &&
      (selectedComponent === "All" || rule.componentName === selectedComponent || selectedComponent === "")
  );

  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Migration Assistant</h1>
        <p className="text-[color:var(--color-fg-muted)]">
          Automatically migrate Fragment UI components between versions using AST transformations
        </p>
      </div>

      {/* Migration Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Migration Configuration</CardTitle>
          <CardDescription>Select source and target versions, and components to migrate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Version</label>
              <select
                value={fromVersion}
                onChange={(e) => setFromVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]"
              >
                {availableVersions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Version</label>
              <select
                value={toVersion}
                onChange={(e) => setToVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]"
              >
                {availableVersions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Component (Optional)</label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]"
              >
                <option value="">All Components</option>
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicable Rules */}
      {applicableRules.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Applicable Migration Rules</CardTitle>
            <CardDescription>
              The following transformations will be applied to your code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {applicableRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md bg-[color:var(--color-surface-2)]"
                >
                  <FileCode className="h-5 w-5 mt-0.5 text-[color:var(--color-brand-primary)]" />
                  <div className="flex-1">
                    <div className="font-medium">{rule.componentName}</div>
                    <div className="text-sm text-[color:var(--color-fg-muted)]">{rule.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Select files or directories to migrate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-[color:var(--color-border-base)] rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-[color:var(--color-fg-muted)]" />
            <input
              type="file"
              multiple
              accept=".tsx,.ts,.jsx,.js"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-[color:var(--color-brand-primary)] text-white rounded-md hover:opacity-90"
            >
              Select Files
            </label>
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
                  {files.length} file(s) selected:
                </p>
                <ul className="text-sm space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-[color:var(--color-fg-base)]">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Migrate Button */}
      <div className="mb-6">
        <Button onClick={handleMigrate} disabled={loading || files.length === 0} loading={loading}>
          {loading ? "Migrating..." : "Start Migration"}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
            <CardDescription>
              {results.filter((r) => r.success).length} of {results.length} files migrated successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 rounded-md border border-[color:var(--color-border-base)]"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-[color:var(--color-status-success-fg)] mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[color:var(--color-status-error-fg)] mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{result.file}</div>
                      {result.error && (
                        <div className="text-sm text-[color:var(--color-status-error-fg)] mt-1">{result.error}</div>
                      )}
                      {result.changes.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Changes applied:</div>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            {result.changes.map((change, i) => (
                              <li key={i} className="text-[color:var(--color-fg-muted)]">
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Migrated Files
              </Button>
              <Button variant="outline">View Diff</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Select Versions</h3>
              <p className="text-[color:var(--color-fg-muted)]">
                Choose the source version (current) and target version (desired) for migration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Upload Files</h3>
              <p className="text-[color:var(--color-fg-muted)]">
                Upload TypeScript/JavaScript files containing Fragment UI components.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Review Changes</h3>
              <p className="text-[color:var(--color-fg-muted)]">
                The assistant will show you all applicable migration rules before processing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Migrate</h3>
              <p className="text-[color:var(--color-fg-muted)]">
                Click "Start Migration" to automatically transform your code using AST transformations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Review & Download</h3>
              <p className="text-[color:var(--color-fg-muted)]">
                Review the migration results and download the updated files.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DocLayout>
  );
}

