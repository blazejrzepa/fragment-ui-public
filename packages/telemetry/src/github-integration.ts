/**
 * GitHub Integration for Telemetry
 * 
 * Tracks PR metrics:
 * - Lead time from Figma to PR
 * - Component usage in PRs
 * - Reuse rate tracking
 */

import { trackLeadTime, trackReuseRate, type LeadTimeMetric, type ReuseRateMetric } from "./roi-metrics.js";

export interface GitHubPR {
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    patch?: string;
  }>;
}

export interface FigmaLink {
  url: string;
  createdAt?: string; // ISO timestamp from Figma API or extracted from URL
}

/**
 * Extract Figma links from PR description
 */
export function extractFigmaLinks(prBody: string): FigmaLink[] {
  const figmaUrlPattern = /https?:\/\/(?:www\.)?(?:figma\.com|figma\.io)\/[^\s\)]+/gi;
  const matches = prBody.match(figmaUrlPattern) || [];
  
  return matches.map(url => ({
    url: url.trim(),
  }));
}

/**
 * Extract Fragment UI component imports from PR files
 */
export function extractComponentUsage(prFiles: GitHubPR["files"] = []): string[] {
  const componentImports = new Set<string>();
  
  // Pattern: import { Component } from "@fragment_ui/ui"
  const importPattern = /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+["']@fragment\/ui["']/g;
  
  // Pattern: from "@/components/ui/component-name"
  const localImportPattern = /from\s+["']@\/components\/ui\/(\w+)["']/g;
  
  for (const file of prFiles) {
    if (!file.patch) continue;
    
    // Check for @fragment_ui/ui imports
    const fragmentImports = file.patch.match(importPattern);
    if (fragmentImports) {
      // Extract component names from imports
      fragmentImports.forEach(imp => {
        const componentMatch = imp.match(/\{([^}]+)\}/);
        if (componentMatch) {
          const components = componentMatch[1]
            .split(",")
            .map(c => c.trim().split(/\s+as\s+/)[0].trim());
          components.forEach(c => componentImports.add(c));
        }
      });
    }
    
    // Check for local component imports
    let localMatch;
    while ((localMatch = localImportPattern.exec(file.patch)) !== null) {
      componentImports.add(localMatch[1]);
    }
  }
  
  return Array.from(componentImports);
}

/**
 * Calculate lead time from Figma link to PR creation
 * 
 * Note: This requires Figma API to get actual creation time.
 * For now, we estimate based on PR creation time minus average design time.
 */
export function calculateLeadTime(
  figmaLinks: FigmaLink[],
  prCreatedAt: string
): LeadTimeMetric | null {
  if (figmaLinks.length === 0) {
    return null;
  }
  
  // Use first Figma link
  const figmaLink = figmaLinks[0];
  
  // If we have creation time from Figma, use it
  // Otherwise, estimate (assume design was created 1 day before PR)
  const figmaCreatedAt = figmaLink.createdAt 
    ? new Date(figmaLink.createdAt).getTime()
    : new Date(prCreatedAt).getTime() - (24 * 60 * 60 * 1000); // 1 day before
  
  const prCreatedAtTime = new Date(prCreatedAt).getTime();
  
  return trackLeadTime(
    figmaCreatedAt,
    prCreatedAtTime,
    {
      figmaUrl: figmaLink.url,
      prUrl: "", // Will be set by caller
    }
  );
}

/**
 * Process GitHub PR webhook event
 */
export async function processPRWebhook(pr: GitHubPR): Promise<{
  leadTime?: LeadTimeMetric;
  componentUsage: string[];
  reuseMetrics?: ReuseRateMetric[];
}> {
  // Extract Figma links
  const figmaLinks = extractFigmaLinks(pr.body || "");
  
  // Calculate lead time if Figma link exists
  const leadTimeResult = figmaLinks.length > 0
    ? calculateLeadTime(figmaLinks, pr.created_at)
    : undefined;
  
  const leadTime = leadTimeResult || undefined;
  if (leadTime) {
    leadTime.prUrl = pr.html_url;
  }
  
  // Extract component usage
  const componentUsage = extractComponentUsage(pr.files);
  
  // Calculate reuse metrics (would need repository data)
  // For now, just return component usage
  
  return {
    leadTime,
    componentUsage,
  };
}

/**
 * Fetch PR files from GitHub API
 */
export async function fetchPRFiles(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<GitHubPR["files"]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  
  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }
  
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch PR details from GitHub API
 */
export async function fetchPR(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<GitHubPR> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  
  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }
  
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Verify GitHub webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

