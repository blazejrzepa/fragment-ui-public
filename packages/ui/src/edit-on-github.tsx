"use client";

import * as React from "react";

export interface EditOnGitHubProps {
  /**
   * File path relative to repository root
   */
  filePath: string;
  /**
   * Repository owner
   * @default "blazejrzepa"
   */
  owner?: string;
  /**
   * Repository name
   * @default "fragment-ui"
   */
  repo?: string;
  /**
   * Git branch
   * @default "main"
   */
  branch?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * EditOnGitHub - Component that displays a link to edit the page on GitHub
 * 
 * @example
 * ```tsx
 * <EditOnGitHub filePath="apps/www/app/docs/components/button/page.tsx" />
 * ```
 */
export function EditOnGitHub({
  filePath,
  owner = "blazejrzepa",
  repo = "fragment-ui",
  branch = "main",
  className,
}: EditOnGitHubProps) {
  // Disabled: docs site no longer shows "Edit this page on GitHub" footer.
  // Keep the component for backward compatibility in case other packages still import it.
  return null;

  const editUrl = `https://github.com/${owner}/${repo}/edit/${branch}/${filePath}`;
  const viewUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`;

  return (
    <div
      className={`mt-16 border-t border-[color:var(--color-border-base)] ${className || ""}`}
      style={{ paddingTop: "3rem" }}
    >
      <div className="flex items-center gap-2 text-sm text-[color:var(--color-fg-muted)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span>Edit this page on GitHub:</span>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[color:var(--color-brand-primary)] hover:opacity-80"
        >
          Edit
        </a>
        <span>or</span>
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[color:var(--color-brand-primary)] hover:opacity-80"
        >
          View source
        </a>
      </div>
    </div>
  );
}

