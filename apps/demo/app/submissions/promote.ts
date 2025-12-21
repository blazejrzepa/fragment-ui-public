/**
 * PR-bot for promoting submissions
 * 
 * Creates a GitHub PR with the submission candidate:
 * - Component/block/screen code
 * - Storybook story (if provided)
 * - Registry update
 * - Verification report in PR description
 */

import type { Submission } from "./types";
import { createPullRequest, type GitHubConfig, type CreatePRParams } from "@/lib/github-utils";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Get GitHub config from environment variables
 */
function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // Format: "owner/repo"
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    return null;
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    throw new Error(`Invalid GITHUB_REPO format. Expected "owner/repo", got: ${repo}`);
  }

  return {
    owner,
    repo: repoName,
    token,
    branch,
  };
}

/**
 * Extract component name from TSX code
 */
function extractComponentName(tsx: string): string {
  // Try to find component name from function/const declarations
  const patterns = [
    /export\s+(?:default\s+)?function\s+(\w+)/,
    /export\s+(?:default\s+)?const\s+(\w+)\s*[:=]/,
    /function\s+(\w+)\s*\(/,
    /const\s+(\w+)\s*[:=]/,
  ];

  for (const pattern of patterns) {
    const match = tsx.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return "Component";
}

/**
 * Determine file path based on submission type
 */
function getFilePath(submission: Submission, componentName: string): string {
  const basePath = submission.type === "component" 
    ? "packages/ui/src" 
    : submission.type === "block"
    ? "packages/blocks/src"
    : "packages/blocks/src/screens";

  return join(basePath, `${componentName.toLowerCase()}.tsx`);
}

/**
 * Get story file path
 */
function getStoryPath(submission: Submission, componentName: string): string {
  const basePath = submission.type === "component"
    ? "packages/ui/src"
    : "packages/blocks/src";

  return join(basePath, `${componentName.toLowerCase()}.stories.tsx`);
}

/**
 * Generate PR body with verification report
 */
function generatePRBody(submission: Submission): string {
  const result = submission.result;
  const componentName = extractComponentName(submission.tsx);

  let body = `## ${submission.type === "component" ? "Component" : submission.type === "block" ? "Block" : "Screen"}: ${componentName}\n\n`;
  body += `**Author:** ${submission.author}\n`;
  body += `**Created:** ${new Date(submission.createdAt).toLocaleString()}\n\n`;

  if (result) {
    body += `## Verification Report\n\n`;
    body += `**Score:** ${result.score}/100\n\n`;

    body += `### Lint\n`;
    body += `- **Errors:** ${result.lint.errors}\n`;
    body += `- **Warnings:** ${result.lint.warnings}\n`;
    if (result.lint.errors > 0 && result.lint.issues.length > 0) {
      body += `\n<details>\n<summary>Lint Issues</summary>\n\n`;
      body += result.lint.issues.slice(0, 10).map((issue) => 
        `- Line ${issue.line}: ${issue.message} (${issue.rule})`
      ).join("\n");
      if (result.lint.issues.length > 10) {
        body += `\n... and ${result.lint.issues.length - 10} more\n`;
      }
      body += `\n</details>\n\n`;
    }

    body += `### Accessibility\n`;
    body += `- **Violations:** ${result.a11y.violations}\n`;
    if (result.a11y.violations > 0 && result.a11y.issues.length > 0) {
      body += `\n<details>\n<summary>A11y Issues</summary>\n\n`;
      body += result.a11y.issues.slice(0, 10).map((issue) => 
        `- ${issue.id} (${issue.impact}): ${issue.description}${issue.help ? ` - ${issue.help}` : ""}`
      ).join("\n");
      if (result.a11y.issues.length > 10) {
        body += `\n... and ${result.a11y.issues.length - 10} more\n`;
      }
      body += `\n</details>\n\n`;
    }

    body += `### Design Tokens\n`;
    body += `- **Violations:** ${result.tokens.violations}\n`;
    if (result.tokens.violations > 0 && result.tokens.issues.length > 0) {
      body += `\n<details>\n<summary>Token Issues</summary>\n\n`;
      body += result.tokens.issues.slice(0, 10).map((issue) => 
        `- Line ${issue.line}: ${issue.suggestion}`
      ).join("\n");
      if (result.tokens.issues.length > 10) {
        body += `\n... and ${result.tokens.issues.length - 10} more\n`;
      }
      body += `\n</details>\n\n`;
    }

    body += `### Figma Parity\n`;
    body += `- **Coverage:** ${result.figma.coverage.toFixed(1)}%\n`;
    if (result.figma.coverage < 90) {
      body += `- ⚠️ Coverage below target (90%)\n`;
    }
    if (result.figma.missing.length > 0) {
      body += `\n<details>\n<summary>Missing Variants/Props</summary>\n\n`;
      body += result.figma.missing.slice(0, 10).map((missing) => 
        `- ${missing.variant} (${missing.prop})`
      ).join("\n");
      if (result.figma.missing.length > 10) {
        body += `\n... and ${result.figma.missing.length - 10} more\n`;
      }
      body += `\n</details>\n\n`;
    }

    if (result.suggestions.length > 0) {
      body += `### Actionable Suggestions\n\n`;
      body += result.suggestions.map((suggestion) => `- ${suggestion}`).join("\n");
      body += `\n\n`;
    }
  }

  body += `---\n\n`;
  body += `**Generated by Fragment UI Submissions API**\n`;

  return body;
}

/**
 * Update registry.json (if it exists)
 */
async function updateRegistry(
  componentName: string,
  submission: Submission
): Promise<{ path: string; content: string } | null> {
  try {
    const registryPath = join(process.cwd(), "packages/registry/registry.json");
    const registryContent = await readFile(registryPath, "utf8");
    const registry = JSON.parse(registryContent);

    // Add new entry
    const entry = {
      name: componentName,
      type: submission.type,
      path: getFilePath(submission, componentName).replace(/^packages\//, ""),
      description: `Auto-generated from submission ${submission.id}`,
    };

    if (Array.isArray(registry)) {
      registry.push(entry);
    } else if (registry.components) {
      registry.components.push(entry);
    } else {
      // Registry format unknown, skip
      return null;
    }

    return {
      path: "packages/registry/registry.json",
      content: JSON.stringify(registry, null, 2),
    };
  } catch (error) {
    // Registry file doesn't exist or can't be updated, skip
    console.warn("[Promote] Could not update registry:", error);
    return null;
  }
}

/**
 * Promote a submission by creating a GitHub PR
 */
export async function promoteSubmission(
  submission: Submission
): Promise<{ prUrl: string; prNumber: number }> {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error(
      "GitHub configuration missing. Set GITHUB_TOKEN and GITHUB_REPO environment variables."
    );
  }

  // Extract component name
  const componentName = extractComponentName(submission.tsx);
  const branchName = `feat/submission-${submission.id.substring(0, 8)}`;

  // Prepare files
  const files: CreatePRParams["files"] = [];

  // 1. Component/block/screen file
  files.push({
    path: getFilePath(submission, componentName),
    content: submission.tsx,
  });

  // 2. Story file (if provided)
  if (submission.stories) {
    files.push({
      path: getStoryPath(submission, componentName),
      content: submission.stories,
    });
  }

  // 3. Registry update (if possible)
  const registryUpdate = await updateRegistry(componentName, submission);
  if (registryUpdate) {
    files.push({
      path: registryUpdate.path,
      content: registryUpdate.content,
    });
  }

  // Create PR
  const prTitle = `feat: Add ${submission.type} ${componentName} (submission ${submission.id.substring(0, 8)})`;
  const prBody = generatePRBody(submission);

  const result = await createPullRequest(config, {
    title: prTitle,
    body: prBody,
    head: branchName,
    base: config.branch || "main",
    files,
  });

  return {
    prUrl: result.url,
    prNumber: result.number,
  };
}

