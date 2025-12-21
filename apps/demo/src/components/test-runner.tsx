"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@fragment_ui/ui";
// Simple icon components (no external dependency)
const CheckIcon = () => <span className="text-green-500">✓</span>;
const XIcon = () => <span className="text-red-500">✗</span>;
const AlertIcon = () => <span className="text-yellow-500">⚠</span>;
const LoaderIcon = () => <span className="animate-spin">⟳</span>;

interface TestResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    codeValid: boolean;
    propsValid: boolean;
  };
}

interface TestRunnerProps {
  code: string;
  onTestComplete?: (result: TestResult) => void;
}

export function TestRunner({ code, onTestComplete }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const runTests = async () => {
    if (!code.trim()) {
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Failed to run tests");
      }

      const testResult: TestResult = await response.json();
      setResult(testResult);
      onTestComplete?.(testResult);
    } catch (error) {
      setResult({
        success: false,
        errors: [
          error instanceof Error ? error.message : "Failed to run tests",
        ],
        warnings: [],
        checks: {
          codeValid: false,
          propsValid: false,
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Code Tests</CardTitle>
            <CardDescription className="mt-1">
              Validate generated code for syntax errors and missing props
            </CardDescription>
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning || !code.trim()}
            variant="outline"
            size="sm"
            data-action-id="test-runner-run"
            data-action-kind="action"
          >
            {isRunning ? (
              <>
                <LoaderIcon />
                <span className="ml-2">Running...</span>
              </>
            ) : (
              "Run Tests"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {result && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckIcon />
                  <span className="font-semibold text-green-500">
                    All tests passed
                  </span>
                </>
              ) : (
                <>
                  <XIcon />
                  <span className="font-semibold text-red-500">
                    Tests failed
                  </span>
                </>
              )}
            </div>

            {/* Checks */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.checks.codeValid ? (
                  <CheckIcon />
                ) : (
                  <XIcon />
                )}
                <span className="text-sm">Code Syntax</span>
                <span
                  className={`ml-auto text-xs px-2 py-1 rounded ${
                    result.checks.codeValid
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {result.checks.codeValid ? "Valid" : "Invalid"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {result.checks.propsValid ? (
                  <CheckIcon />
                ) : (
                  <AlertIcon />
                )}
                <span className="text-sm">Component Props</span>
                <span
                  className={`ml-auto text-xs px-2 py-1 rounded ${
                    result.checks.propsValid
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {result.checks.propsValid ? "Valid" : "Issues"}
                </span>
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XIcon />
                  <span className="font-semibold text-red-500">
                    Errors ({result.errors.length})
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertIcon />
                  <span className="font-semibold text-yellow-500">
                    Warnings ({result.warnings.length})
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                  {result.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!result && !isRunning && (
          <div className="text-center py-8 text-[color:var(--color-fg-muted)]">
            <p className="text-sm">
              Click "Run Tests" to validate the generated code
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

