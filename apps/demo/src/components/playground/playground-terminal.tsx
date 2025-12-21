"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { X, ListX } from "lucide-react";
import type { LogEntry, A11yResults } from "@/types/chat";
import { A11yQuickFix } from "@/components/playground/a11y-quick-fix";
import type { A11yFix } from "@/components/playground/a11y-quick-fix";
import { Tooltip } from "@fragment_ui/ui";

interface PlaygroundTerminalProps {
  activeTab: "terminal" | "accessibility";
  logs: LogEntry[];
  a11yResults: A11yResults | null;
  onTabChange: (tab: "terminal" | "accessibility") => void;
  onLogsViewed: (count: number) => void;
  onA11yResultsViewed: (results: A11yResults | null) => void;
  onHideTerminal?: () => void;
  onA11yFix?: (violationId: string, fix: A11yFix) => void;
  onClearOutput?: () => void;
}

export const PlaygroundTerminal = React.memo(function PlaygroundTerminal({
  activeTab,
  logs,
  a11yResults,
  onTabChange,
  onLogsViewed,
  onA11yResultsViewed,
  onHideTerminal,
  onA11yFix,
  onClearOutput,
}: PlaygroundTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) {
      return logs;
    }
    const query = searchQuery.toLowerCase();
    return logs.filter((log) => {
      return (
        log.message.toLowerCase().includes(query) ||
        log.step.toLowerCase().includes(query) ||
        log.status.toLowerCase().includes(query)
      );
    });
  }, [logs, searchQuery]);

  // Auto-scroll terminal to bottom when new logs or a11y results arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, a11yResults]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ borderTop: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
      <div className="px-2 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {
                onTabChange("terminal");
                onLogsViewed(logs.length);
              }}
              className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                activeTab === "terminal"
                  ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                  : "hover:text-[color:var(--color-fg-base)]"
              }`}
              style={activeTab !== "terminal" 
                ? { color: "var(--foreground-secondary)", borderRadius: "var(--radius-sm)", padding: "6px 8px" } 
                : { borderRadius: "4px", padding: "6px 8px" }
              }
              onMouseEnter={(e) => {
                if (activeTab !== "terminal") {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "terminal") {
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                }
              }}
            >
              Terminal
            </button>
            <button
              onClick={() => {
                onTabChange("accessibility");
                onA11yResultsViewed(a11yResults);
              }}
              className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                activeTab === "accessibility"
                  ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                  : "hover:text-[color:var(--color-fg-base)]"
              }`}
              style={activeTab !== "accessibility" 
                ? { color: "var(--foreground-secondary)", borderRadius: "var(--radius-sm)", padding: "6px 8px" } 
                : { borderRadius: "4px", padding: "6px 8px" }
              }
              onMouseEnter={(e) => {
                if (activeTab !== "accessibility") {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "accessibility") {
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                }
              }}
            >
              Accessibility
            </button>
          </div>
          {activeTab === "terminal" && (
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="pr-3 text-xs rounded border transition-colors focus:outline-none terminal-search-input"
                  style={{
                    width: "260px",
                    height: "28px",
                    paddingLeft: "8px",
                    paddingRight: searchQuery ? "2rem" : "8px",
                    borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
                    color: "var(--foreground-tertiary)",
                    fontSize: "11px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                    e.currentTarget.style.color = "var(--foreground-primary)";
                    e.currentTarget.style.outline = "none";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 3%, transparent)";
                    e.currentTarget.style.color = "var(--foreground-tertiary)";
                    e.currentTarget.style.outline = "none";
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded transition-colors z-10"
                    style={{
                      color: "var(--foreground-tertiary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--foreground-primary)";
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--foreground-tertiary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {onClearOutput && (
                <Tooltip content="Clear terminal output">
                  <button
                    onClick={onClearOutput}
                    className="inline-flex items-center justify-center w-6 h-6 rounded transition-colors"
                    style={{
                      color: "var(--foreground-secondary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--foreground-primary)";
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--foreground-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <ListX className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
              {onHideTerminal && (
                <Tooltip content="Hide terminal">
                <button
                  onClick={onHideTerminal}
                  className="inline-flex items-center justify-center w-6 h-6 rounded transition-colors"
                  style={{
                    color: "var(--foreground-secondary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--foreground-primary)";
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--foreground-secondary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
                </Tooltip>
              )}
            </div>
          )}
          {activeTab === "accessibility" && (
            <div className="flex items-center gap-2">
              {onClearOutput && (
                <Tooltip content="Clear accessibility results">
                  <button
                    onClick={onClearOutput}
                    className="inline-flex items-center justify-center w-6 h-6 rounded transition-colors"
                    style={{
                      color: "var(--foreground-secondary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--foreground-primary)";
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--foreground-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <ListX className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
              {onHideTerminal && (
                <Tooltip content="Hide terminal">
              <button
                onClick={onHideTerminal}
                className="inline-flex items-center justify-center w-6 h-6 rounded transition-colors"
                style={{
                  color: "var(--foreground-secondary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X className="w-4 h-4" />
              </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>

      {activeTab === "terminal" && (
        <div className="flex-1 overflow-y-auto overflow-x-auto font-mono text-xs min-h-0 pt-2 pl-2" ref={terminalRef}>
          <div className="space-y-0 pb-0" style={{ lineHeight: "1.2", minWidth: "100%", maxWidth: "100%" }}>
            {filteredLogs.length === 0 ? (
              <p className="px-4" style={{ color: "var(--foreground-tertiary)" }}>
                {logs.length === 0 
                  ? "No logs yet. Start generating to see the process."
                  : "No logs match your search."}
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`py-0.5 px-4 rounded ${
                    log.status === "success"
                      ? "text-[color:var(--color-status-success-base)]"
                      : log.status === "error"
                      ? "text-[color:var(--color-status-error-base)]"
                      : "text-[color:var(--color-fg-muted)]"
                  }`}
                >
                  <span className="text-[color:var(--foreground-tertiary)]">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className="ml-2 font-semibold uppercase">
                    [{log.step}]
                  </span>
                  <span className={`ml-2 ${
                    log.status === "success"
                      ? "text-[color:var(--color-status-success-base)]"
                      : log.status === "error"
                      ? "text-[color:var(--color-status-error-base)]"
                      : "text-[color:var(--color-fg-muted)]"
                  }`}>
                    {log.status}
                  </span>
                  <span className="ml-2 text-[color:var(--color-fg-base)]">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "accessibility" && (
        <div className="flex-1 overflow-y-auto overflow-x-auto font-mono text-xs min-h-0 pt-2 pl-5" style={{ fontSize: "11px" }}>
          {!a11yResults ? (
            <div className="py-0.5 px-4 rounded" style={{ fontSize: "12px" }}>
              <span className="text-[color:var(--foreground-tertiary)]">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="ml-2 font-semibold uppercase">
                [a11y]
              </span>
              <span className="ml-2 text-[color:var(--color-fg-muted)]">
                pending
              </span>
              <span className="ml-2 text-[color:var(--color-fg-base)]">
                No accessibility check performed yet. Generate a component to see results.
              </span>
            </div>
          ) : a11yResults.violations.length > 0 ? (
            <div className="space-y-3">
              {a11yResults.violations.map((violation, idx) => (
                <div
                  key={idx}
                  className="pt-2 pb-2 pr-2 rounded"
                  style={{ paddingLeft: "20px" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[color:var(--color-status-error-base)] text-white font-semibold flex-shrink-0" style={{ fontSize: "10px" }}>
                      {violation.nodes.length}
                    </div>
                    <div className="flex-1">
                      <div className="text-[color:var(--color-fg-base)] font-medium mb-1" style={{ fontSize: "12px" }}>
                        {violation.help}
                      </div>
                      <div className="text-[color:var(--color-fg-muted)] mb-1" style={{ fontSize: "11px" }}>
                        {violation.description}
                      </div>
                      {violation.helpUrl && (
                        <a
                          href={violation.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--color-fg-base)] hover:underline mt-1 inline-block underline"
                          style={{ fontSize: "10px", textUnderlineOffset: "2px" }}
                        >
                          Learn more →
                        </a>
                      )}
                      {/* Quick Fix Suggestions */}
                      <A11yQuickFix
                        violation={violation}
                        onFix={onA11yFix}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[color:var(--color-status-success-base)]" style={{ fontSize: "11px" }}>
              ✅ No accessibility violations found ({a11yResults.passes} checks passed)
            </div>
          )}
        </div>
      )}
    </div>
  );
});

