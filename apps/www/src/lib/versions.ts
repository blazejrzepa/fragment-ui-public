/**
 * Version configuration for Fragment UI documentation
 * Each version tracks API changes, deprecations, and migration paths
 */

export interface Version {
  version: string;
  label: string;
  releaseDate: string;
  status: "stable" | "beta" | "deprecated";
  changelog?: string[];
  breakingChanges?: string[];
  migrationGuide?: string;
}

export interface ComponentVersionInfo {
  version: string;
  added?: string;
  changed?: string;
  deprecated?: string;
  removed?: string;
}

// Current version (pre-1.0)
export const CURRENT_VERSION = "0.1.0";

// Version history (pre-1.0)
export const VERSIONS: Version[] = [
  {
    version: "0.1.0",
    label: "0.1.0 (Beta)",
    releaseDate: "2025-12-11",
    status: "beta",
    changelog: [
      "Initial public beta of Fragment UI",
      "Foundations: tokens, theming, layouts, blocks",
      "Docs site with get-started, tokens, admin demo, changelog",
    ],
  },
];

// Component version tracking
export const COMPONENT_VERSIONS: Record<string, ComponentVersionInfo[]> = {
  button: [
    {
      version: "1.0.0",
      added: "Initial component with solid, outline, ghost variants",
    },
  ],
  input: [
    {
      version: "1.0.0",
      added: "Initial component with validation states",
    },
  ],
  dialog: [
    {
      version: "1.0.0",
      added: "Initial component with accessibility features",
    },
  ],
  tabs: [
    {
      version: "1.0.0",
      added: "Initial component with keyboard navigation",
    },
  ],
  table: [
    {
      version: "1.0.0",
      added: "Initial component with semantic HTML",
    },
  ],
  select: [
    {
      version: "1.0.0",
      added: "Initial component with search support",
    },
  ],
  checkbox: [
    {
      version: "1.0.0",
      added: "Initial component with label support",
    },
  ],
  switch: [
    {
      version: "1.0.0",
      added: "Initial component with accessibility",
    },
  ],
  toast: [
    {
      version: "1.0.0",
      added: "Initial component with multiple variants",
    },
  ],
};

/**
 * Get version info by version string
 */
export function getVersion(version: string): Version | undefined {
  return VERSIONS.find((v) => v.version === version);
}

/**
 * Get current stable version
 */
export function getCurrentVersion(): Version {
  return VERSIONS.find((v) => v.version === CURRENT_VERSION) || VERSIONS[0];
}

/**
 * Get all stable versions
 */
export function getStableVersions(): Version[] {
  return VERSIONS.filter((v) => v.status === "stable");
}

/**
 * Get component history for a specific component
 */
export function getComponentHistory(componentName: string): ComponentVersionInfo[] {
  return COMPONENT_VERSIONS[componentName] || [];
}

/**
 * Check if a version is deprecated
 */
export function isVersionDeprecated(version: string): boolean {
  const versionInfo = getVersion(version);
  return versionInfo?.status === "deprecated" || false;
}

/**
 * Get migration guide path between versions
 */
export function getMigrationPath(from: string, to: string): string | null {
  const fromVersion = getVersion(from);
  if (!fromVersion?.migrationGuide) return null;
  
  return `/docs/migrations/${from}-to-${to}`;
}

