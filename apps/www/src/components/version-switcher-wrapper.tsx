"use client";

import * as React from "react";
import { VersionSwitcher as DSVersionSwitcher, type Version } from "@fragment_ui/ui";
import { VERSIONS, getCurrentVersion, CURRENT_VERSION } from "../lib/versions";
import { useRouter } from "next/navigation";

/**
 * Wrapper component that uses VersionSwitcher from @fragment_ui/ui
 * with portal-specific configuration (telemetry, Next.js router)
 */
export function VersionSwitcherWrapper({
  currentVersion,
  onVersionChange,
}: {
  currentVersion?: string;
  onVersionChange?: (version: string) => void;
}) {
  const router = useRouter();
  const versions: Version[] = VERSIONS;
  const current = currentVersion
    ? versions.find((v) => v.version === currentVersion)
    : getCurrentVersion();

  const handleVersionChange = (version: string) => {
    if (onVersionChange) {
      onVersionChange(version);
      return;
    }

    // Store version preference
    if (typeof window !== "undefined") {
      localStorage.setItem("fragment-ui-version", version);
    }

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    // Navigate to versioned docs if not current version
    if (version !== CURRENT_VERSION) {
      // Remove existing version prefix if present
      let cleanPath = currentPath.replace(/^\/docs\/v[\d.]+/, "/docs");

      // If cleanPath is just /docs, remove trailing slash
      if (cleanPath === "/docs") {
        cleanPath = "";
      }

      // Extract the doc path (everything after /docs/)
      const docPath = cleanPath.replace(/^\/docs\/?/, "");

      // Build new URL with selected version
      if (docPath) {
        router.push(`/docs/v${version}/${docPath}`);
      } else {
        router.push(`/docs/v${version}`);
      }
    } else {
      // If current version, redirect to non-versioned docs
      let docPath = currentPath.replace(/^\/docs\/v[\d.]+/, "/docs");

      // If we're at /docs/vX.X.X (no subpath), redirect to /docs
      if (docPath === "/docs") {
        docPath = "/docs";
      }

      router.push(docPath || "/docs");
    }
  };

  return (
    <DSVersionSwitcher
      versions={versions}
      currentVersion={currentVersion || current?.version}
      currentVersionLabel={current?.label}
      onVersionChange={handleVersionChange}
    />
  );
}

