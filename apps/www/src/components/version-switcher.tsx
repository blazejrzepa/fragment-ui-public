"use client";

import { useState, useEffect } from "react";
import { VERSIONS, getCurrentVersion, CURRENT_VERSION, type Version } from "../lib/versions";
import { Button } from "@fragment_ui/ui";

interface VersionSwitcherProps {
  currentVersion?: string;
  onVersionChange?: (version: string) => void;
}

export function VersionSwitcher({ currentVersion, onVersionChange }: VersionSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const versions = VERSIONS; // Show all versions, not just stable
  const current = currentVersion 
    ? versions.find(v => v.version === currentVersion) 
    : getCurrentVersion();

  useEffect(() => {
    // Close dropdown when clicking outside
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-version-switcher]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleVersionSelect = (version: Version) => {
    setIsOpen(false);
    
    if (onVersionChange) {
      onVersionChange(version.version);
    } else {
      // Store version preference
      localStorage.setItem('fragment-ui-version', version.version);
      
      const currentPath = window.location.pathname;
      
      // Navigate to versioned docs if not current version
      if (version.version !== CURRENT_VERSION) {
        // Remove existing version prefix if present (e.g., /docs/v0.9.0/changelog -> /docs/changelog)
        let cleanPath = currentPath.replace(/^\/docs\/v[\d.]+/, '/docs');
        
        // If cleanPath is just /docs, remove trailing slash
        if (cleanPath === '/docs') {
          cleanPath = '';
        }
        
        // Extract the doc path (everything after /docs/)
        const docPath = cleanPath.replace(/^\/docs\/?/, '');
        
        // Build new URL with selected version
        if (docPath) {
          window.location.href = `/docs/v${version.version}/${docPath}`;
        } else {
          window.location.href = `/docs/v${version.version}`;
        }
      } else {
        // If current version, redirect to non-versioned docs
        // Remove version prefix if present (e.g., /docs/v0.9.0/changelog -> /docs/changelog)
        let docPath = currentPath.replace(/^\/docs\/v[\d.]+/, '/docs');
        
        // If we're at /docs/vX.X.X (no subpath), redirect to /docs
        if (docPath === '/docs') {
          docPath = '/docs';
        }
        
        window.location.href = docPath || '/docs';
      }
    }
  };

  return (
    <div className="relative" data-version-switcher>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span>{current?.label || "Select version"}</span>
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

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[color:var(--color-surface-1)] border border-[color:var(--color-fg-muted)] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-[color:var(--color-fg-muted)]">
            <div className="text-xs font-medium text-[color:var(--color-fg-muted)] px-2 py-1">
              Select Version
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {versions.map((version) => {
              const isCurrent = version.version === current?.version;
              return (
                <button
                  key={version.version}
                  onClick={() => handleVersionSelect(version)}
                  className={`w-full text-left px-4 py-2 hover:bg-[color:var(--color-surface-2)] transition-colors ${
                    isCurrent ? "bg-[color:var(--color-surface-2)]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[color:var(--color-fg-base)]">
                        {version.label}
                      </div>
                      <div className="text-xs text-[color:var(--color-fg-muted)] mt-0.5">
                        {version.releaseDate}
                      </div>
                    </div>
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
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

