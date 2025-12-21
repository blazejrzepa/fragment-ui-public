"use client";

import React, { useMemo } from "react";
import { Clock, User, Bot, Settings, GitBranch, Edit, FileCode } from "lucide-react";

interface CodeCommit {
  id: string;
  code: string;
  timestamp: number;
  message?: string;
  author?: "user" | "ai" | "system";
  type?: "generation" | "edit" | "patch" | "manual";
}

interface CodeHistoryViewProps {
  history: {
    past: CodeCommit[];
    present: CodeCommit | null;
    future: CodeCommit[];
  };
  currentCommitId?: string;
  onSelectCommit: (commitId: string) => void;
}

/**
 * Format timestamp to relative time
 */
function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Get icon for commit type
 */
function getTypeIcon(type?: string) {
  switch (type) {
    case "generation":
      return <Bot className="w-3.5 h-3.5" />;
    case "edit":
      return <Edit className="w-3.5 h-3.5" />;
    case "patch":
      return <GitBranch className="w-3.5 h-3.5" />;
    default:
      return <FileCode className="w-3.5 h-3.5" />;
  }
}

/**
 * Get icon for author
 */
function getAuthorIcon(author?: string) {
  switch (author) {
    case "ai":
      return <Bot className="w-3.5 h-3.5" />;
    case "system":
      return <Settings className="w-3.5 h-3.5" />;
    default:
      return <User className="w-3.5 h-3.5" />;
  }
}

/**
 * Code History View - displays commit history with metadata
 */
export const CodeHistoryView = React.memo(function CodeHistoryView({
  history,
  currentCommitId,
  onSelectCommit,
}: CodeHistoryViewProps) {
  // Combine all commits in chronological order
  const allCommits = useMemo(() => {
    const commits: (CodeCommit & { position: "past" | "current" | "future" })[] = [];
    
    // Past commits (oldest first)
    history.past.forEach(commit => {
      commits.push({ ...commit, position: "past" });
    });
    
    // Current commit
    if (history.present) {
      commits.push({ ...history.present, position: "current" });
    }
    
    // Future commits (newest first, but we'll reverse them)
    history.future.forEach(commit => {
      commits.push({ ...commit, position: "future" });
    });
    
    return commits;
  }, [history]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {allCommits.length === 0 ? (
          <div className="flex items-center justify-center py-8" style={{ color: "var(--foreground-tertiary)" }}>
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          allCommits.map((commit, index) => {
            const isCurrent = commit.id === currentCommitId || commit.position === "current";
            
            return (
              <button
                key={commit.id}
                onClick={() => onSelectCommit(commit.id)}
                className="w-full text-left px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: isCurrent 
                    ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)"
                    : "transparent",
                  border: isCurrent 
                    ? "1px solid color-mix(in srgb, var(--foreground-primary) 10%, transparent)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 3%, transparent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isCurrent 
                          ? "var(--color-brand-primary)"
                          : "color-mix(in srgb, var(--foreground-primary) 20%, transparent)",
                        border: isCurrent 
                          ? "2px solid var(--color-brand-primary)"
                          : "2px solid transparent",
                      }}
                    />
                    {index < allCommits.length - 1 && (
                      <div
                        className="w-0.5 flex-1 mt-1"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                          minHeight: "20px",
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Commit content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(commit.type)}
                        {getAuthorIcon(commit.author)}
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--foreground-primary)" }}>
                        {commit.message || `${commit.type || "edit"} change`}
                      </span>
                      {isCurrent && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{
                          backgroundColor: "var(--color-brand-primary)",
                          color: "var(--color-fg-on-brand)",
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--foreground-tertiary)" }}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(commit.timestamp)}</span>
                      {commit.position === "future" && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{
                          backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                        }}>
                          Redo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
});

