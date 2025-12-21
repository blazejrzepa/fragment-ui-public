"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
} from "@fragment_ui/ui";
import { saveGitHubConfig, type GitHubConfig } from "@/lib/github-utils";

interface GitHubConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: GitHubConfig) => void;
}

export function GitHubConfigDialog({
  open,
  onOpenChange,
  onSave,
}: GitHubConfigDialogProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [branch, setBranch] = useState("main");

  const handleSave = () => {
    if (!owner || !repo || !token) {
      return;
    }

    const config: GitHubConfig = {
      owner,
      repo,
      token,
      branch,
    };

    saveGitHubConfig(config);
    onSave(config);
    onOpenChange(false);
    
    // Reset form
    setOwner("");
    setRepo("");
    setToken("");
    setBranch("main");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure GitHub</DialogTitle>
          <DialogDescription>
            Enter your GitHub repository details to enable Apply Diff and Open PR features.
            Your token will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="owner" className="text-sm font-medium">
              Repository Owner
            </label>
            <Input
              id="owner"
              type="text"
              placeholder="username or organization"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="repo" className="text-sm font-medium">
              Repository Name
            </label>
            <Input
              id="repo"
              type="text"
              placeholder="repository-name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              GitHub Personal Access Token
            </label>
            <Input
              id="token"
              type="password"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
              Create a token with <code>repo</code> scope at{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                github.com/settings/tokens
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium">
              Base Branch
            </label>
            <Input
              id="branch"
              type="text"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!owner || !repo || !token}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

