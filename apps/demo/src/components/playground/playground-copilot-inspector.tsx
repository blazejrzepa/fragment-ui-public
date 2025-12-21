"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, MessageSquare, Trash, Code2, Package, FileCode, Clock, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Tooltip, type TreeNode, toast } from "@fragment_ui/ui";
import { PlaygroundRightSidebar } from "./playground-right-sidebar";
import { ElementInspector } from "./element-inspector";
import { ChatHistoryView } from "./chat-history-view";
import { GovernanceWarnings } from "./governance-warnings";
import type { Message, ChatSession } from "@/types/chat";

interface PlaygroundCopilotInspectorProps {
  activeTab: "copilot" | "inspector" | "governance";
  onTabChange: (tab: "copilot" | "inspector" | "governance") => void;
  messages: Message[];
  inputMessage: string;
  isGenerating: boolean;
  isCurrentlyGenerating: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onStopGeneration: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedElementId: string | null;
  code: string;
  dsl?: any; // DSL object for Element Inspector
  onCloseInspector: () => void;
  onUpdateInspector: (patch: any) => void;
  hasProjects?: boolean; // Whether there are any projects with generated components
  onNewChat: () => void;
  onClearChat: () => void;
  onPromptClick?: (prompt: string) => void;
  // Chat history props
  chatSessions?: ChatSession[];
  selectedChatIds?: string[];
  expandedChatIds?: string[];
  chatTreeNodes?: TreeNode[];
  onChatExpansionChange?: (ids: string[]) => void;
  onChatNodeClick?: (node: TreeNode) => void;
  onAddToFavourites?: (nodeId: string) => void;
  onDeleteSession?: (nodeId: string) => void;
  onVariantsGenerated?: (variants: any[]) => void; // Callback when variants are generated from document
  onComponentSelect?: (componentName: string) => void | Promise<void>; // Callback to open component as new tab
  shareableLink?: string | null; // Shareable link for the current component
  projectTitle?: string | null; // Title of the current project (for generated components)
  onUpdateProjectName?: (newName: string) => void; // Callback to update project name
  isDSComponent?: boolean; // Whether this is a DS Component (readonly name)
}

export const PlaygroundCopilotInspector = React.memo(function PlaygroundCopilotInspector({
  activeTab,
  onTabChange,
  messages,
  inputMessage,
  isGenerating,
  isCurrentlyGenerating,
  onInputChange,
  onSendMessage,
  onStopGeneration,
  onKeyPress,
  selectedElementId,
  code,
  dsl,
  onCloseInspector,
  onUpdateInspector,
  hasProjects = false,
  onNewChat,
  onClearChat,
  onPromptClick,
  chatSessions = [],
  selectedChatIds = [],
  expandedChatIds = [],
  chatTreeNodes = [],
  onChatExpansionChange,
  onChatNodeClick,
  onAddToFavourites,
  onDeleteSession,
  onVariantsGenerated,
  onComponentSelect,
  shareableLink,
  projectTitle,
  onUpdateProjectName,
  isDSComponent = false,
}: PlaygroundCopilotInspectorProps) {
  // Determine if Inspector tab should be visible
  // Inspector should be visible if:
  // 1. There are projects with generated components (hasProjects), OR
  // 2. This is a DS Component (isDSComponent) with code
  const showInspectorTab = (hasProjects || isDSComponent) && code && code.trim() !== "";
  
  // Governance tab should be visible when Inspector is visible (same conditions)
  const showGovernanceTab = showInspectorTab;
  
  // Copilot tab should be hidden for DS Components (they are already complete, no need to generate/modify)
  // Copilot is only for generating new components and experimenting with variants
  const showCopilotTab = !isDSComponent;
  
  // State for Chat History visibility
  const [isChatHistoryVisible, setIsChatHistoryVisible] = React.useState(false);
  
  // Track if user manually switched to Copilot (to prevent auto-switch back to Inspector)
  const manuallySwitchedToCopilotRef = React.useRef(false);
  
  // Auto-switch to Inspector when element is selected (only if currently on Copilot tab and component exists)
  // BUT: Don't auto-switch if user manually clicked Copilot button
  useEffect(() => {
    // If user manually switched to Copilot, don't auto-switch to Inspector
    if (manuallySwitchedToCopilotRef.current) {
      manuallySwitchedToCopilotRef.current = false; // Reset after one check
      return;
    }
    
    if (selectedElementId && activeTab === "copilot" && showInspectorTab) {
      onTabChange("inspector");
    }
    // If Inspector or Governance tab becomes unavailable and we're on it, switch to available tab
    if ((activeTab === "inspector" || activeTab === "governance") && !showInspectorTab) {
      // If Copilot is available, switch to it; otherwise stay on current tab
      if (showCopilotTab) {
      onTabChange("copilot");
      }
    }
    // If Copilot becomes unavailable (e.g., DS Component opened) and we're on it, switch to Inspector
    if (activeTab === "copilot" && !showCopilotTab && showInspectorTab) {
      onTabChange("inspector");
    }
  }, [selectedElementId, activeTab, showInspectorTab, showCopilotTab, onTabChange]);

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 overflow-hidden" 
      style={{ 
        borderLeftWidth: (activeTab === "copilot" || activeTab === "inspector" || activeTab === "governance") ? "1px" : "0px",
        borderLeftColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
      }}
    >
      <div 
        className="border-b px-2 flex-shrink-0 bg-[color:var(--color-surface-base)]" 
        style={{ 
          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
          height: "40px",
        }}
      >
        <div className="flex items-center justify-between gap-2 h-full">
          <div className="flex items-center gap-0.5 flex-1">
            {showCopilotTab && (
            <Tooltip content="AI Copilot - Chat with AI to generate and modify components">
            <button
              onClick={() => {
                // Mark that user manually switched to Copilot
                manuallySwitchedToCopilotRef.current = true;
                onTabChange("copilot");
                // Keep selection when switching to Copilot - don't clear it
                // This allows users to chat about the selected element
              }}
              className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                activeTab === "copilot"
                  ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                  : "hover:text-[color:var(--color-fg-base)]"
              }`}
              style={activeTab !== "copilot" 
                ? { color: "var(--foreground-secondary)", borderRadius: "var(--radius-sm)", padding: "6px 8px" } 
                : { borderRadius: "4px", padding: "6px 8px" }
              }
            >
              Copilot
            </button>
            </Tooltip>
            )}
            {showInspectorTab && (
              <>
                <Tooltip content="Inspect selected element">
                <button
                  onClick={() => onTabChange("inspector")}
                  className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    activeTab === "inspector"
                      ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                      : "hover:text-[color:var(--color-fg-base)]"
                  }`}
                  style={activeTab !== "inspector" 
                    ? { color: "var(--foreground-secondary)", borderRadius: "var(--radius-sm)", padding: "6px 8px" } 
                    : { borderRadius: "4px", padding: "6px 8px" }
                  }
                >
                  Inspector
                </button>
                </Tooltip>
                {showGovernanceTab && (
                  <Tooltip content="Governance Results">
                  <button
                    onClick={() => onTabChange("governance")}
                    className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      activeTab === "governance"
                        ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                        : "hover:text-[color:var(--color-fg-base)]"
                    }`}
                    style={activeTab !== "governance" 
                      ? { color: "var(--foreground-secondary)", borderRadius: "var(--radius-sm)", padding: "6px 8px" } 
                      : { borderRadius: "4px", padding: "6px 8px" }
                    }
                  >
                    Governance
                  </button>
                  </Tooltip>
                )}
              </>
            )}
          </div>
          {activeTab === "copilot" && (
            <div className="flex items-center gap-1">
              <Tooltip content="Chat history">
                <button
                  onClick={() => setIsChatHistoryVisible(prev => !prev)}
                  className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    isChatHistoryVisible 
                      ? "bg-[color:var(--color-surface-2)]" 
                      : "hover:bg-[color:var(--color-surface-2)]"
                  }`}
                  aria-label="Chat history"
                >
                  <Clock 
                    className="w-4 h-4" 
                    style={{ 
                      color: isChatHistoryVisible 
                        ? "var(--foreground-primary)" 
                        : "var(--foreground-secondary)" 
                    }} 
                  />
                </button>
              </Tooltip>
              <DropdownMenu>
                <Tooltip content="More options">
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
                  </button>
                </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent 
                  align="end"
                  className="border-0 rounded-[6px] min-w-[180px]"
                  style={{ border: "none", borderRadius: "6px", minWidth: "180px" }}
                >
                  <DropdownMenuItem 
                    onClick={onNewChat}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" style={{ color: "var(--foreground-secondary)" }} />
                    New Chat
                  </DropdownMenuItem>
                  {messages.length > 0 && (
                    <DropdownMenuItem 
                      onClick={onClearChat}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Clear Chat
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {activeTab === "copilot" && (
          <>
            {isChatHistoryVisible && (
              <div className="absolute inset-0 z-10 bg-[color:var(--background-primary)]">
                <ChatHistoryView
                  chatSessions={chatSessions}
                  selectedIds={selectedChatIds}
                  expandedChatIds={expandedChatIds}
                  treeNodes={chatTreeNodes}
                  onExpansionChange={onChatExpansionChange || (() => {})}
                  onNodeClick={(node) => {
                    // Close history when clicking on a session
                    if (node.data?.session) {
                      setIsChatHistoryVisible(false);
                    }
                    onChatNodeClick?.(node);
                  }}
                  onNewChat={() => {
                    setIsChatHistoryVisible(false);
                    onNewChat();
                  }}
                  onAddToFavourites={onAddToFavourites}
                  onDeleteSession={onDeleteSession}
                />
              </div>
            )}
            {!isChatHistoryVisible && (
              <PlaygroundRightSidebar
                messages={messages}
                inputMessage={inputMessage}
                isGenerating={isGenerating}
                isCurrentlyGenerating={isCurrentlyGenerating}
                onInputChange={onInputChange}
                onSendMessage={onSendMessage}
                onStopGeneration={onStopGeneration}
                onKeyPress={onKeyPress}
                onPromptClick={onPromptClick}
                onVariantsGenerated={onVariantsGenerated}
              />
            )}
          </>
        )}

        {activeTab === "inspector" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {selectedElementId ? (
              <ElementInspector
                selectedElementId={selectedElementId}
                code={code}
                dsl={dsl}
                onClose={onCloseInspector}
                onUpdate={onUpdateInspector}
              />
            ) : (
              <ComponentInfoView 
                code={code} 
                dsl={dsl} 
                onComponentSelect={onComponentSelect} 
                shareableLink={shareableLink}
                projectTitle={projectTitle}
                onUpdateProjectName={onUpdateProjectName}
                isDSComponent={isDSComponent}
              />
            )}
          </div>
        )}

        {activeTab === "governance" && (
          <div 
            className="flex-1 flex flex-col min-h-0 overflow-hidden overflow-y-auto"
          >
            {code && code.trim() !== "" ? (
              <div className="p-4">
                <GovernanceWarnings
                  code={code}
                  dsl={dsl}
                  className="always-show"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-sm text-center" style={{ color: "var(--foreground-secondary)" }}>
                  No code available. Generate or open a component to see governance results.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Extract main component name from code
 */
function extractMainComponentName(code: string): string | null {
  if (!code) return null;
  
  // Try to find export default function ComponentName or export function ComponentName
  const exportDefaultMatch = code.match(/export\s+default\s+function\s+(\w+)/);
  if (exportDefaultMatch) return exportDefaultMatch[1];
  
  const exportFunctionMatch = code.match(/export\s+function\s+(\w+)/);
  if (exportFunctionMatch) return exportFunctionMatch[1];
  
  // Try const ComponentName = () => or const ComponentName: React.FC
  const constMatch = code.match(/const\s+(\w+)\s*[:=]/);
  if (constMatch) return constMatch[1];
  
  return null;
}

/**
 * Extract imports from code
 */
function extractImports(code: string): string[] {
  if (!code) return [];
  
  const imports: string[] = [];
  const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from\s+["']([^"']+)["']/g;
  let match;
  
  // Track which packages we've seen to avoid repeating "from ..."
  const seenPackages = new Set<string>();
  
  while ((match = importRegex.exec(code)) !== null) {
    const namedImports = match[1];
    const namespaceImport = match[2];
    const defaultImport = match[3];
    const fromPath = match[4];
    
    // For @fragment packages, only show component names without "from ..."
    const isFragmentPackage = fromPath.startsWith("@fragment_ui/");
    
    if (namedImports) {
      const names = namedImports.split(',').map(n => n.trim());
      if (isFragmentPackage) {
        // For fragment packages, just show component names
        imports.push(...names);
      } else {
        // For other packages, show full import with "from ..." only once per package
        if (!seenPackages.has(fromPath)) {
          seenPackages.add(fromPath);
          imports.push(...names.map(n => `${n} from "${fromPath}"`));
        } else {
          imports.push(...names);
        }
      }
    } else if (namespaceImport) {
      if (isFragmentPackage) {
        imports.push(`* as ${namespaceImport}`);
      } else {
        imports.push(`* as ${namespaceImport} from "${fromPath}"`);
      }
    } else if (defaultImport) {
      if (isFragmentPackage) {
        imports.push(defaultImport);
      } else {
        imports.push(`${defaultImport} from "${fromPath}"`);
      }
    }
  }
  
  return imports;
}

/**
 * Count elements in code
 */
function countElements(code: string): { total: number; fragmentComponents: number; htmlElements: number } {
  if (!code) return { total: 0, fragmentComponents: 0, htmlElements: 0 };
  
  // Count React components (capitalized)
  const fragmentComponentRegex = /<([A-Z]\w+)/g;
  const fragmentMatches = code.match(fragmentComponentRegex) || [];
  
  // Count HTML elements (lowercase)
  const htmlElementRegex = /<([a-z]+)(?:\s|>)/g;
  const htmlMatches = code.match(htmlElementRegex) || [];
  
  return {
    total: fragmentMatches.length + htmlMatches.length,
    fragmentComponents: fragmentMatches.length,
    htmlElements: htmlMatches.length,
  };
}

/**
 * Component Info View - displays basic information about the component when no element is selected
 */
function ComponentInfoView({ 
  code, 
  dsl, 
  onComponentSelect, 
  shareableLink,
  projectTitle,
  onUpdateProjectName,
  isDSComponent = false,
}: { 
  code: string; 
  dsl?: any; 
  onComponentSelect?: (componentName: string) => void | Promise<void>; 
  shareableLink?: string | null;
  projectTitle?: string | null;
  onUpdateProjectName?: (newName: string) => void;
  isDSComponent?: boolean;
}) {
  const componentName = useMemo(() => extractMainComponentName(code || ""), [code]);
  const imports = useMemo(() => extractImports(code || ""), [code]);
  const elementCounts = useMemo(() => countElements(code || ""), [code]);
  
  const parsedDsl = useMemo(() => {
    if (!dsl) return null;
    return typeof dsl === 'string' ? JSON.parse(dsl) : dsl;
  }, [dsl]);
  
  // For generated components, use projectTitle; for DS Components, use componentName
  const displayName = isDSComponent ? componentName : (projectTitle || componentName || "Component");
  const [nameValue, setNameValue] = useState(displayName);
  
  // Update nameValue when displayName changes
  useEffect(() => {
    setNameValue(displayName);
  }, [displayName]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };
  
  const handleNameBlur = () => {
    if (!isDSComponent && onUpdateProjectName && nameValue && nameValue.trim()) {
      onUpdateProjectName(nameValue.trim());
    } else if (!nameValue || !nameValue.trim()) {
      // Reset to original if empty
      setNameValue(displayName);
    }
  };
  
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setNameValue(displayName);
      e.currentTarget.blur();
    }
  };
  
  if (!code || code.trim() === "") {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-center" style={{ color: "var(--foreground-tertiary)" }}>
          No component code available. Generate a component to see its information.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
      <div className="space-y-3 pb-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
        <div className="space-y-2">
          {/* Name Input */}
          <div className="space-y-1.5">
            <span className="text-xs text-[color:var(--foreground-secondary)]">Name:</span>
            <input
              type="text"
              value={nameValue ?? ""}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              readOnly={isDSComponent}
              className="w-full text-xs px-2 rounded border"
              style={{
                backgroundColor: isDSComponent ? "var(--color-surface-1)" : "var(--background-primary)",
                color: "var(--foreground-primary)",
                borderRadius: "8px",
                borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                cursor: isDSComponent ? "not-allowed" : "text",
                height: "36px",
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
              placeholder="Component name"
            />
          </div>
          
          {/* Shareable Link */}
          {shareableLink && (
            <div className="space-y-1.5">
              <span className="text-xs text-[color:var(--foreground-secondary)]">Shareable Link:</span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 text-xs px-2 rounded border font-mono"
                  style={{
                    backgroundColor: "var(--color-surface-1)",
                    color: "var(--foreground-primary)",
                    borderRadius: "6px",
                    borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    height: "36px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="flex items-center justify-center px-2 rounded border hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: "var(--color-surface-1)",
                    borderRadius: "6px",
                    borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    height: "36px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5" style={{ color: "var(--foreground-primary)" }} />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-[color:var(--foreground-secondary)]">Total Elements:</span>
            <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{elementCounts.total}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-[color:var(--foreground-secondary)]">Fragment UI Components:</span>
            <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{elementCounts.fragmentComponents}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-[color:var(--foreground-secondary)]">HTML Elements:</span>
            <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{elementCounts.htmlElements}</span>
          </div>
          
          {code && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--foreground-secondary)]">Code Size:</span>
              <span className="text-xs font-medium text-[color:var(--foreground-primary)]">
                {code.length.toLocaleString()} characters
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Imports */}
      {imports.length > 0 && (
        <div className="space-y-2 pb-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
          <div className="mb-2">
            <h3 className="text-xs font-semibold" style={{ color: "var(--foreground-primary)" }}>
              Imports ({imports.length})
            </h3>
          </div>
          <div className="space-y-1">
            {imports.slice(0, 10).map((imp, idx) => {
              // Extract component name (remove "from ..." part if present)
              const componentName = imp.includes(' from ') ? imp.split(' from ')[0].trim() : imp.trim();
              const isClickable = onComponentSelect && componentName && !componentName.startsWith('*');
              
              return (
                <code
                  key={idx}
                  onClick={isClickable ? () => {
                    onComponentSelect?.(componentName);
                  } : undefined}
                  className={`text-xs font-mono block p-2 rounded bg-[color:var(--color-surface-1)] transition-colors ${
                    isClickable ? 'cursor-pointer hover:bg-[color:var(--color-surface-2)]' : ''
                  }`}
                  style={{ color: "var(--foreground-secondary)" }}
                  title={isClickable ? `Click to open ${componentName} in a new tab` : undefined}
                >
                  {imp}
                </code>
              );
            })}
            {imports.length > 10 && (
              <p className="text-xs" style={{ color: "var(--foreground-tertiary)" }}>
                + {imports.length - 10} more imports
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* DSL Info */}
      {parsedDsl && (
        <div className="space-y-2 pb-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
            <h3 className="text-xs font-semibold" style={{ color: "var(--foreground-primary)" }}>
              DSL Structure
            </h3>
          </div>
          <div className="space-y-1">
            {parsedDsl.type && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--foreground-secondary)]">Type:</span>
                <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{parsedDsl.type}</span>
              </div>
            )}
            {parsedDsl.fields && Array.isArray(parsedDsl.fields) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--foreground-secondary)]">Fields:</span>
                <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{parsedDsl.fields.length}</span>
              </div>
            )}
            {parsedDsl.actions && Array.isArray(parsedDsl.actions) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--foreground-secondary)]">Actions:</span>
                <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{parsedDsl.actions.length}</span>
              </div>
            )}
            {parsedDsl.sections && Array.isArray(parsedDsl.sections) && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--foreground-secondary)]">Sections:</span>
                <span className="text-xs font-medium text-[color:var(--foreground-primary)]">{parsedDsl.sections.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="pt-2">
        <p className="text-xs text-center" style={{ color: "var(--foreground-tertiary)" }}>
          Click on an element in the preview to inspect its properties.
        </p>
      </div>
    </div>
  );
}
