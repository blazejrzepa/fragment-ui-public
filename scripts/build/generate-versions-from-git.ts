#!/usr/bin/env tsx

/**
 * Script to generate version definitions from git tags
 * 
 * This script reads git tags, extracts version information,
 * and updates the versions.ts file with version metadata.
 * 
 * Usage: tsx scripts/generate-versions-from-git.ts
 */

import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

interface VersionInfo {
  version: string;
  label: string;
  status: "stable" | "beta" | "deprecated";
  releaseDate: string;
  changelog: string[];
  breakingChanges?: string[];
}

// Parse git tags
function getGitTags(): Array<{ tag: string; date: string; message: string }> {
  try {
    // Get all tags with their dates and messages
    const tagsOutput = execSync("git tag -l --sort=-creatordate", {
      encoding: "utf-8",
    }).trim();

    if (!tagsOutput) {
      console.warn("No git tags found. Using default versions.");
      return [];
    }

    const tags = tagsOutput.split("\n").filter(Boolean);
    const tagInfo = tags.map((tag) => {
      try {
        // Get tag date
        const dateOutput = execSync(`git log -1 --format=%ai ${tag}`, {
          encoding: "utf-8",
        }).trim();
        const date = dateOutput.split(" ")[0]; // Extract YYYY-MM-DD

        // Get tag message (annotation or commit message)
        let message = "";
        try {
          message = execSync(`git tag -l --format="%(contents)" ${tag}`, {
            encoding: "utf-8",
          }).trim();
        } catch {
          // If no annotation, try commit message
          message = execSync(
            `git log -1 --format=%s ${tag}`,
            { encoding: "utf-8" }
          ).trim();
        }

        return { tag, date, message };
      } catch (error) {
        console.warn(`Failed to get info for tag ${tag}:`, error);
        return null;
      }
    });

    return tagInfo.filter((info): info is NonNullable<typeof info> => info !== null);
  } catch (error) {
    console.error("Error reading git tags:", error);
    return [];
  }
}

// Parse version from tag (supports formats: v1.0.0, 1.0.0, v1.0.0-beta)
function parseVersion(tag: string): string | null {
  const match = tag.match(/^v?(\d+\.\d+\.\d+)(?:-(.+))?$/);
  if (!match) return null;

  const version = match[1];
  const preRelease = match[2];

  // If it's a pre-release, you might want to skip it or mark it as beta
  if (preRelease && ["beta", "alpha", "rc"].includes(preRelease.toLowerCase())) {
    return version; // Return version but mark as beta later
  }

  return version;
}

// Determine status based on version and tag
function determineStatus(
  version: string,
  tag: string,
  isLatest: boolean
): "stable" | "beta" | "deprecated" {
  if (tag.includes("beta") || tag.includes("alpha") || tag.includes("rc")) {
    return "beta";
  }

  if (isLatest) {
    return "stable";
  }

  // Mark old versions as deprecated (you can adjust this logic)
  const [major, minor] = version.split(".").map(Number);
  if (major === 0 || (major === 1 && minor < 1)) {
    return "deprecated";
  }

  return "stable";
}

// Extract changelog from tag message or commit
function extractChangelog(message: string): string[] {
  // Try to parse changelog from message
  // Supports formats like:
  // - "v1.0.0\n\n- Feature 1\n- Feature 2"
  // - "Release v1.0.0: Feature 1, Feature 2"
  
  const lines = message.split("\n").filter(Boolean);
  const changelog: string[] = [];

  for (const line of lines) {
    // Skip version line
    if (line.match(/^v?\d+\.\d+\.\d+/)) continue;

    // Skip headers
    if (line.match(/^(#|Release|Changelog)/i)) continue;

    // Parse bullet points
    if (line.match(/^[-*•]\s+/)) {
      changelog.push(line.replace(/^[-*•]\s+/, "").trim());
    } else if (line.trim()) {
      // Also accept non-bullet lines
      changelog.push(line.trim());
    }
  }

  // If no structured changelog found, use the message itself
  if (changelog.length === 0 && message.trim()) {
    changelog.push(message.trim());
  }

  return changelog;
}

// Generate version info from git tags
function generateVersionsFromTags(): VersionInfo[] {
  const tags = getGitTags();

  if (tags.length === 0) {
    // Return default versions if no tags found
    return [
      {
        version: "1.0.0",
        label: "1.0.0 (Current)",
        status: "stable",
        releaseDate: new Date().toISOString().split("T")[0],
        changelog: ["Initial release"],
      },
    ];
  }

  const versions: VersionInfo[] = [];

  tags.forEach((tagInfo, index) => {
    const version = parseVersion(tagInfo.tag);
    if (!version) return;

    const isLatest = index === 0;
    const status = determineStatus(version, tagInfo.tag, isLatest);
    const changelog = extractChangelog(tagInfo.message);

    versions.push({
      version,
      label: isLatest ? `${version} (Current)` : version,
      status,
      releaseDate: tagInfo.date,
      changelog: changelog.length > 0 ? changelog : [`Release ${version}`],
    });
  });

  return versions;
}

// Update versions.ts file
function updateVersionsFile(versions: VersionInfo[]) {
  const versionsPath = join(
    process.cwd(),
    "apps/www/src/lib/versions.ts"
  );

  // Read current file
  const currentContent = readFileSync(versionsPath, "utf-8");

  // Extract imports and existing code we want to keep
  const importsMatch = currentContent.match(/^import[^]*?from[^;]+;/m);
  const interfaceMatch = currentContent.match(/export interface Version[^}]+}/);
  const currentVersionMatch = currentContent.match(
    /export const CURRENT_VERSION = ["']([^"']+)["']/
  );

  // Determine current version (first one or from CURRENT_VERSION)
  const currentVersion =
    currentVersionMatch?.[1] || versions[0]?.version || "1.0.0";

  // Generate new file content
  const newContent = `${importsMatch?.[0] || "// Version definitions"}

${interfaceMatch?.[0] || "export interface Version { version: string; label: string; status: 'stable' | 'beta' | 'deprecated'; releaseDate: string; changelog: string[]; breakingChanges?: string[]; }"}

// Auto-generated from git tags - run: tsx scripts/generate-versions-from-git.ts
export const VERSIONS: Version[] = ${JSON.stringify(versions, null, 2)};

export const CURRENT_VERSION = "${currentVersion}";

// Helper functions
export function getVersion(version: string): Version | undefined {
  return VERSIONS.find((v) => v.version === version);
}

export function getCurrentVersion(): Version {
  return VERSIONS.find((v) => v.version === CURRENT_VERSION) || VERSIONS[0];
}

export function getStableVersions(): Version[] {
  return VERSIONS.filter((v) => v.status === "stable");
}

export function getLatestVersion(): Version {
  return VERSIONS[0];
}

// Component version history
export interface ComponentVersionChange {
  version: string;
  added?: string;
  changed?: string;
  deprecated?: string;
  fixed?: string;
}

export const COMPONENT_VERSIONS: Record<
  string,
  ComponentVersionChange[]
> = {
  // Component histories will be maintained manually
  // Example:
  // button: [
  //   { version: "1.0.0", added: "Icon support" },
  //   { version: "0.9.0", added: "Initial release" },
  // ],
};

export function getComponentHistory(
  component: string
): ComponentVersionChange[] {
  return COMPONENT_VERSIONS[component] || [];
}
`;

  writeFileSync(versionsPath, newContent, "utf-8");
  console.log(`✅ Updated ${versionsPath}`);
  console.log(`   Generated ${versions.length} versions from git tags`);
}

// Main execution
function main() {
  console.log("🔍 Reading git tags...");
  const versions = generateVersionsFromTags();

  console.log(`📝 Found ${versions.length} versions:`);
  versions.forEach((v) => {
    console.log(`   - ${v.version} (${v.status}) - ${v.releaseDate}`);
  });

  console.log("\n📄 Updating versions.ts...");
  updateVersionsFile(versions);

  console.log("\n✅ Done! Review and commit the changes to versions.ts");
}

main();

