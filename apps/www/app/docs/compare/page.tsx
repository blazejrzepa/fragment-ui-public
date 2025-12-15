"use client";

import { useState } from "react";
import { Button } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";
import { VERSIONS, getVersion } from "../../../src/lib/versions";
import Link from "next/link";

export default function ComparePage() {
  const [version1, setVersion1] = useState("1.0.0");
  const [version2, setVersion2] = useState("0.9.0");

  const v1Info = getVersion(version1);
  const v2Info = getVersion(version2);

  return (
    <DocLayout>
      <h1 id="version-comparison">Version Comparison</h1>
      <p className="text-[color:var(--color-fg-muted)]">
        Compare changes between two documentation versions to see what's new, changed, or deprecated.
      </p>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Version 1 Selector */}
        <div className="p-6 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)]">
          <label htmlFor="version1" className="block text-sm font-semibold mb-2">
            Version 1 (Newer)
          </label>
          <select
            id="version1"
            value={version1}
            onChange={(e) => setVersion1(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[color:var(--color-bg-base)] border border-[color:var(--color-fg-muted)]/30 text-[color:var(--color-fg-base)]"
          >
            {VERSIONS.map((v) => (
              <option key={v.version} value={v.version}>
                {v.label}
              </option>
            ))}
          </select>
          {v1Info && (
            <div className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
              <p>Released: {v1Info.releaseDate}</p>
              <p>Status: <span className="capitalize">{v1Info.status}</span></p>
            </div>
          )}
        </div>

        {/* Version 2 Selector */}
        <div className="p-6 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)]">
          <label htmlFor="version2" className="block text-sm font-semibold mb-2">
            Version 2 (Older)
          </label>
          <select
            id="version2"
            value={version2}
            onChange={(e) => setVersion2(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[color:var(--color-bg-base)] border border-[color:var(--color-fg-muted)]/30 text-[color:var(--color-fg-base)]"
          >
            {VERSIONS.map((v) => (
              <option key={v.version} value={v.version}>
                {v.label}
              </option>
            ))}
          </select>
          {v2Info && (
            <div className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
              <p>Released: {v2Info.releaseDate}</p>
              <p>Status: <span className="capitalize">{v2Info.status}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      {v1Info && v2Info && (
        <div className="space-y-6">
          {/* What's New */}
          {v1Info.changelog && v1Info.changelog.length > 0 && (
            <div className="p-6 rounded-lg border border-[color:var(--color-accent-green)]/30 bg-[color:var(--color-accent-green)]/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-[color:var(--color-accent-green)]">✨</span>
                What&apos;s New in {version1}
              </h2>
              <ul className="space-y-2">
                {v1Info.changelog.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[color:var(--color-accent-green)] mt-1">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Breaking Changes */}
          {v1Info.breakingChanges && v1Info.breakingChanges.length > 0 && (
            <div className="p-6 rounded-lg border border-[color:var(--color-accent-red)]/30 bg-[color:var(--color-accent-red)]/10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-[color:var(--color-accent-red)]">⚠️</span>
                Breaking Changes in {version1}
              </h2>
              <ul className="space-y-2">
                {v1Info.breakingChanges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[color:var(--color-accent-red)] mt-1">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Version Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href={`/docs/v${version1}`}>
              <div className="p-4 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)] hover:border-[color:var(--color-brand-primary)]/50 transition-colors">
                <h3 className="font-semibold mb-1">View {version1} Docs</h3>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Browse full documentation for version {version1}
                </p>
              </div>
            </Link>
            <Link href={`/docs/v${version2}`}>
              <div className="p-4 rounded-lg border border-[color:var(--color-fg-muted)]/30 bg-[color:var(--color-surface-1)] hover:border-[color:var(--color-brand-primary)]/50 transition-colors">
                <h3 className="font-semibold mb-1">View {version2} Docs</h3>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Browse full documentation for version {version2}
                </p>
              </div>
            </Link>
          </div>

          {/* Migration Guide Link */}
          <div className="p-6 rounded-lg border border-[color:var(--color-brand-primary)]/30 bg-[color:var(--color-brand-primary)]/10">
            <h3 className="font-semibold mb-2">Migration Guide</h3>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-4">
              Need help upgrading from {version2} to {version1}? Check out the migration guide.
            </p>
            <Link href="/docs/migrations">
              <Button variant="outline" size="sm">
                View Migration Guide →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </DocLayout>
  );
}

