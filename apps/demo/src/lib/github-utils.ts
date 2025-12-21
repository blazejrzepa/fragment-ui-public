/**
 * GitHub API utilities for Apply Diff and Open PR features
 */

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

export interface CreatePRParams {
  title: string;
  body: string;
  head: string; // branch name
  base: string; // base branch (usually 'main' or 'master')
  files: Array<{
    path: string;
    content: string;
    mode?: '100644' | '100755' | '040000' | '160000' | '120000';
  }>;
}

/**
 * Check if GitHub configuration is available
 */
export function hasGitHubConfig(): boolean {
  if (typeof window === 'undefined') return false;
  
  const config = localStorage.getItem('fragment-ui-github-config');
  return config !== null;
}

/**
 * Get GitHub configuration from localStorage
 */
export function getGitHubConfig(): GitHubConfig | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const config = localStorage.getItem('fragment-ui-github-config');
    if (!config) return null;
    return JSON.parse(config);
  } catch {
    return null;
  }
}

/**
 * Save GitHub configuration to localStorage
 */
export function saveGitHubConfig(config: GitHubConfig): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('fragment-ui-github-config', JSON.stringify(config));
}

/**
 * Create a new branch in GitHub repository
 */
export async function createBranch(
  config: GitHubConfig,
  branchName: string,
  baseBranch: string = 'main'
): Promise<void> {
  const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${baseBranch}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get base branch: ${response.statusText}`);
  }
  
  const baseRef = await response.json();
  const sha = baseRef.object.sha;
  
  const createResponse = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/git/refs`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: sha,
    }),
  });
  
  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(`Failed to create branch: ${error.message || createResponse.statusText}`);
  }
}

/**
 * Create or update a file in GitHub repository
 */
export async function createOrUpdateFile(
  config: GitHubConfig,
  path: string,
  content: string,
  message: string,
  branch: string = 'main'
): Promise<void> {
  // Get existing file SHA if it exists
  let sha: string | undefined;
  try {
    const getResponse = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
        },
      }
    );
    
    if (getResponse.ok) {
      const file = await getResponse.json();
      sha = file.sha;
    }
  } catch {
    // File doesn't exist, that's okay
  }
  
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
        branch,
        ...(sha && { sha }), // Include SHA if updating existing file
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create/update file: ${error.message || response.statusText}`);
  }
}

/**
 * Create a pull request
 */
export async function createPullRequest(
  config: GitHubConfig,
  params: CreatePRParams
): Promise<{ url: string; number: number }> {
  // First, create branch if it doesn't exist
  try {
    await createBranch(config, params.head, params.base);
  } catch (error: any) {
    // Branch might already exist, that's okay
    if (!error.message?.includes('already exists')) {
      throw error;
    }
  }
  
  // Create/update files
  for (const file of params.files) {
    await createOrUpdateFile(
      config,
      file.path,
      file.content,
      `Add ${file.path}`,
      params.head
    );
  }
  
  // Create PR
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls`,
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: params.title,
        body: params.body,
        head: params.head,
        base: params.base,
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create PR: ${error.message || response.statusText}`);
  }
  
  const pr = await response.json();
  return {
    url: pr.html_url,
    number: pr.number,
  };
}

