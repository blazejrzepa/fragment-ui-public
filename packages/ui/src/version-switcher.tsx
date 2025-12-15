"use client";

import * as React from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export interface Version {
  version: string;
  label: string;
  releaseDate?: string;
  status?: "stable" | "beta" | "deprecated";
}

export interface VersionSwitcherProps {
  /**
   * Available versions
   */
  versions: Version[];
  /**
   * Current version
   */
  currentVersion?: string;
  /**
   * Callback when version changes
   */
  onVersionChange?: (version: string) => void;
  /**
   * Current version label (if different from version string)
   */
  currentVersionLabel?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * VersionSwitcher - Component for switching between documentation versions
 * 
 * @example
 * ```tsx
 * <VersionSwitcher
 *   versions={[
 *     { version: "1.0.0", label: "v1.0.0", status: "stable" },
 *     { version: "0.9.0", label: "v0.9.0", status: "deprecated" },
 *   ]}
 *   currentVersion="1.0.0"
 *   onVersionChange={(version) => router.push(`/docs/v${version}`)}
 * />
 * ```
 */
export function VersionSwitcher({
  versions,
  currentVersion,
  onVersionChange,
  currentVersionLabel,
  className,
}: VersionSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const current = currentVersion
    ? versions.find((v) => v.version === currentVersion)
    : versions.find((v) => v.status === "stable") || versions[0];

  const displayLabel = currentVersionLabel || current?.label || "Select version";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className || ""}`}
        >
          <span>{displayLabel}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 border-b border-[color:var(--color-border-base)]">
          <div className="text-xs font-medium text-[color:var(--color-fg-muted)] px-2 py-1">
            Select Version
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {versions.map((version) => {
            const isCurrent = version.version === current?.version;
            return (
              <DropdownMenuItem
                key={version.version}
                onClick={() => {
                  setIsOpen(false);
                  onVersionChange?.(version.version);
                }}
                className={`w-full ${
                  isCurrent ? "bg-[color:var(--color-surface-2)]" : ""
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium text-[color:var(--color-fg-base)]">
                      {version.label}
                    </div>
                    {version.releaseDate && (
                      <div className="text-xs text-[color:var(--color-fg-muted)] mt-0.5">
                        {version.releaseDate}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[color:var(--color-brand-primary)] text-white">
                        Current
                      </span>
                    )}
                    {version.status === "deprecated" && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[color:var(--color-accent-red)]/20 text-[color:var(--color-accent-red)]">
                        Deprecated
                      </span>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

