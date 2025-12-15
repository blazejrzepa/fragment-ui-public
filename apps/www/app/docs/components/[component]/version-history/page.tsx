"use client";

import { DocumentContent } from "@fragment_ui/ui";

import { use } from "react";
import { getComponentHistory } from "../../../../../src/lib/versions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ component: string }>;
}

export default function ComponentVersionHistoryPage({ params }: PageProps) {
  const { component } = use(params);
  const history = getComponentHistory(component);

  if (history.length === 0) {
    return notFound();
  }

  const componentName =
    component.charAt(0).toUpperCase() + component.slice(1).replace(/-/g, " ");

  return (
    <DocumentContent as="article">
      <h1 id="page">{componentName} - Version History</h1>
      <p className="text-[color:var(--color-fg-muted)]">
        Track changes and evolution of the {componentName} component across versions.
      </p>

      <div className="mt-8 space-y-8">
        {history.map((versionInfo, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">v{versionInfo.version}</h2>
              {idx === 0 && (
                <span className="px-2 py-1 text-xs rounded bg-[color:var(--color-brand-primary)] text-white">
                  Latest
                </span>
              )}
            </div>

            {versionInfo.added && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[color:var(--color-accent-green)] mb-1">
                  Added
                </h3>
                <p className="text-[color:var(--color-fg-muted)]">{versionInfo.added}</p>
              </div>
            )}

            {versionInfo.changed && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[color:var(--color-brand-primary)] mb-1">
                  Changed
                </h3>
                <p className="text-[color:var(--color-fg-muted)]">{versionInfo.changed}</p>
              </div>
            )}

            {versionInfo.deprecated && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[color:var(--color-accent-red)] mb-1">
                  Deprecated
                </h3>
                <p className="text-[color:var(--color-fg-muted)]">{versionInfo.deprecated}</p>
              </div>
            )}

            {versionInfo.removed && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[color:var(--color-accent-red)] mb-1">
                  Removed
                </h3>
                <p className="text-[color:var(--color-fg-muted)]">{versionInfo.removed}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={`/docs/components/${component}`}
          className="text-[color:var(--color-brand-primary)] hover:underline"
        >
          ← Back to {componentName} documentation
        </a>
      </div>


    </DocumentContent>
  );
}

