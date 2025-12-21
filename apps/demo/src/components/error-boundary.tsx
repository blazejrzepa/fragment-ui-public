"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@fragment_ui/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[color:var(--foreground-primary)]">
              Something went wrong
            </h2>
            <p className="text-sm text-[color:var(--foreground-secondary)] mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={this.handleReset} variant="outline">
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

