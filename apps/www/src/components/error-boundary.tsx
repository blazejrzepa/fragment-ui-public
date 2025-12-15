"use client";

import React from "react";
import { Button } from "@fragment_ui/ui";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

/**
 * Error boundary component for catching and displaying errors
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <DefaultErrorFallback error={this.state.error} reset={this.reset} />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
  error,
  reset,
}: {
  error?: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6 rounded-lg border border-[color:var(--color-accent-red)]/30 bg-[color:var(--color-accent-red)]/10">
      <h2 className="text-xl font-semibold mb-2 text-[color:var(--color-accent-red)]">
        ⚠️ Something went wrong
      </h2>
      <p className="text-[color:var(--color-fg-muted)] mb-4">
        {error?.message || "An unexpected error occurred while loading this content."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={reset}>
          Try Again
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && error && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-[color:var(--color-fg-muted)]">
            Error details (dev only)
          </summary>
          <pre className="mt-2 p-3 bg-[color:var(--color-surface-1)] rounded text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

