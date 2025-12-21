"use client";

import React, { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Eye, Code2, ZoomIn, ZoomOut, Copy, MoreHorizontal, Download, Share2, FileDown } from "lucide-react";
import { Tabs, TabsContent, Spinner, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Tooltip } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import { PreviewTopBar } from "@/components/playground/preview-top-bar";
import type { A11yResults } from "@/types/preview";
import { SelectionToolbar } from "@/components/playground/selection-toolbar";
import { AgentViewOverlay } from "@/components/playground/agent-view-overlay";
import { useTheme } from "@/lib/theme";
import { foregroundMix } from "@/lib/styles";

interface PlaygroundPreviewCodeProps {
  code: string;
  activePreviewTab: "preview" | "code" | "inspect";
  previewZoom: number;
  isGenerating: boolean;
  onPreviewTabChange: (tab: "preview" | "code" | "inspect") => void;
  onZoomChange: (zoom: number) => void;
  onCopyCode: () => void;
  onPreviewError: (error: Error) => void;
  onA11yResults: (results: A11yResults) => void;
  selectedElementId?: string | null;
  onSelectionChange?: (id: string | null) => void;
  onEditElement?: (elementId: string) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  onUpdateText?: (elementId: string, newText: string, path: string) => void;
  dsl?: any;
  onExportCode?: () => void;
  onCopyDSL?: () => void;
  onShareLink?: () => void;
  onDownloadZIP?: () => void;
  onSubmit?: () => void; // Submit to Submissions (Milestone 6.3)
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isFromProjects?: boolean; // Whether this component is from Projects (not DS Components)
  isDSComponent?: boolean; // Whether this component is a DS Component
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

/**
 * Remove data-ui-id attributes from code string
 */
function removeDataUiIds(code: string): string {
  // Remove data-ui-id="..." or data-ui-id='...' from code
  return code.replace(/\s+data-ui-id=["'][^"']*["']/g, '');
}

export const PlaygroundPreviewCode = React.memo(function PlaygroundPreviewCode({
  code,
  activePreviewTab,
  previewZoom,
  isGenerating,
  onPreviewTabChange,
  onZoomChange,
  onCopyCode,
  onPreviewError,
  onA11yResults,
  selectedElementId,
  onSelectionChange,
  onEditElement,
  onDeleteElement,
  onDuplicateElement,
  onUpdateText,
  dsl,
  onExportCode,
  onCopyDSL,
  onShareLink,
  onDownloadZIP,
  onSubmit,
  isFavorite = false,
  onToggleFavorite,
  isFromProjects = false,
  isDSComponent = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: PlaygroundPreviewCodeProps) {
  const { effectiveTheme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [showDataUiIds, setShowDataUiIds] = useState(false);
  const [agentViewEnabled, setAgentViewEnabled] = useState(false);

  // Memoize theme to avoid re-renders
  const highlightTheme = useMemo(() => {
    return effectiveTheme === "dark" ? "vsDark" : "github";
  }, [effectiveTheme]);

  // Extract component name from selected element
  const componentName = useMemo(() => {
    if (!selectedElementId || !code) return null;
    
    // Try React components (capitalized)
    const reactComponentRegex = new RegExp(`<([A-Z]\\w+)[\\s\\S]*?data-ui-id=["']${selectedElementId}["']`, 'g');
    const reactMatch = code.match(reactComponentRegex);
    if (reactMatch) {
      const componentMatch = reactMatch[0].match(/<([A-Z]\w+)/);
      if (componentMatch) return componentMatch[1];
    }
    
    // Try HTML elements (lowercase)
    const htmlElementRegex = new RegExp(`<([a-z]+)[\\s\\S]*?data-ui-id=["']${selectedElementId}["']`, 'g');
    const htmlMatch = code.match(htmlElementRegex);
    if (htmlMatch) {
      const elementMatch = htmlMatch[0].match(/<([a-z]+)/);
      if (elementMatch) {
        const tagName = elementMatch[1];
        return tagName.charAt(0).toUpperCase() + tagName.slice(1);
      }
    }
    
    return null;
  }, [selectedElementId, code]);

  // Auto-scroll terminal to bottom when new logs or a11y results arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [code]);
  
  // Update selected element highlighting and enable text editing
  useEffect(() => {
    // Only run if we're in preview tab
    if (activePreviewTab !== "preview") {
      // Clear highlighting when not in preview tab
      if (previewContentRef.current) {
        const allElements = previewContentRef.current.querySelectorAll('[data-ui-id]');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.removeAttribute('data-selected');
        });
      }
      return;
    }
    if (!previewContentRef.current) return;
    
    let textUpdateTimeouts: Map<HTMLElement, NodeJS.Timeout> = new Map();
    const eventHandlers: Map<HTMLElement, { input: () => void; blur: () => void }> = new Map();
    let retryCount = 0;
    const maxRetries = 10;
    
    // Function to update selection and enable text editing
    const updateSelection = () => {
      // Remove previous selection and contentEditable
      const allElements = previewContentRef.current?.querySelectorAll('[data-ui-id]');
      allElements?.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeAttribute('data-selected');
        htmlEl.removeAttribute('contenteditable');
        htmlEl.style.cursor = '';
        htmlEl.style.outline = '';
        
        // Cleanup event listeners
        const handlers = eventHandlers.get(htmlEl);
        if (handlers) {
          htmlEl.removeEventListener('input', handlers.input);
          htmlEl.removeEventListener('blur', handlers.blur);
          eventHandlers.delete(htmlEl);
        }
        
        // Clear timeout
        const timeout = textUpdateTimeouts.get(htmlEl);
        if (timeout) {
          clearTimeout(timeout);
          textUpdateTimeouts.delete(htmlEl);
        }
      });
      
      // Add selection to current element
      if (selectedElementId && previewContentRef.current) {
        const selectedElement = previewContentRef.current.querySelector(`[data-ui-id="${selectedElementId}"]`) as HTMLElement;
        if (selectedElement) {
          selectedElement.setAttribute('data-selected', 'true');
          retryCount = 0; // Reset retry count on success
          
          // Enable text editing for text elements
          const tagName = selectedElement.tagName.toLowerCase();
          const isTextElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'button'].includes(tagName) ||
            selectedElement.classList.contains('card-title') ||
            selectedElement.classList.contains('card-description') ||
            (selectedElement.textContent?.trim().length || 0) > 0;
          
          if (isTextElement && onUpdateText && dsl) {
            // Store original text to compare later
            const originalText = selectedElement.textContent || '';
            
            selectedElement.setAttribute('contenteditable', 'true');
            selectedElement.style.cursor = 'text';
            selectedElement.style.outline = 'none';
            
            // Determine path based on element type
            const getPath = () => {
              if (tagName.startsWith('h')) {
                return 'title';
              } else if (tagName === 'button') {
                return 'label';
              } else if (selectedElement.classList.contains('card-title')) {
                return 'title';
              } else if (selectedElement.classList.contains('card-description')) {
                return 'description';
              }
              return 'copy';
            };
            
            // Track if text was actually edited
            let textWasEdited = false;
            
            // Handle text changes with debounce
            const handleTextChange = () => {
              const newText = selectedElement.textContent || '';
              const elementId = selectedElementId;
              const path = getPath();
              
              // Mark that text was edited
              textWasEdited = true;
              
              // Clear previous timeout
              const existingTimeout = textUpdateTimeouts.get(selectedElement);
              if (existingTimeout) {
                clearTimeout(existingTimeout);
              }
              
              // Debounce text updates
              const timeout = setTimeout(() => {
                // Only update if text actually changed
                if (newText !== originalText && onUpdateText) {
                  onUpdateText(elementId, newText, path);
                }
                textUpdateTimeouts.delete(selectedElement);
              }, 500);
              
              textUpdateTimeouts.set(selectedElement, timeout);
            };
            
            // Handle blur (save on blur only if text was edited)
            const handleBlur = () => {
              const newText = selectedElement.textContent || '';
              const elementId = selectedElementId;
              const path = getPath();
              
              // Clear timeout
              const timeout = textUpdateTimeouts.get(selectedElement);
              if (timeout) {
                clearTimeout(timeout);
                textUpdateTimeouts.delete(selectedElement);
              }
              
              // Only update if text was actually edited and changed
              if (textWasEdited && newText !== originalText && onUpdateText) {
                onUpdateText(elementId, newText, path);
              }
              
              // Reset flag
              textWasEdited = false;
            };
            
            // Store handlers
            eventHandlers.set(selectedElement, { input: handleTextChange, blur: handleBlur });
            
            // Add event listeners
            selectedElement.addEventListener('input', handleTextChange);
            selectedElement.addEventListener('blur', handleBlur);
          }
        }
      }
    };
    
    // Update immediately
    updateSelection();
    
    // Retry logic: if element not found, retry with exponential backoff
    // Only retry if we're in preview tab and element should be visible
    const retryInterval = setInterval(() => {
      if (activePreviewTab !== "preview") {
        clearInterval(retryInterval);
        return;
      }
      if (selectedElementId && previewContentRef.current) {
        const selectedElement = previewContentRef.current.querySelector(`[data-ui-id="${selectedElementId}"]`) as HTMLElement;
        if (selectedElement) {
          // Element found, apply highlighting and stop retrying
          selectedElement.setAttribute('data-selected', 'true');
          clearInterval(retryInterval);
          retryCount = 0;
        } else if (retryCount < maxRetries) {
          retryCount++;
          // Try to find and highlight again
          updateSelection();
        } else {
          // Max retries reached, stop
          clearInterval(retryInterval);
        }
      } else {
        clearInterval(retryInterval);
      }
    }, 200);
    
    // Also update after a short delay to catch elements that might be rendered asynchronously
    const timeoutId = setTimeout(updateSelection, 100);
    
    // Use MutationObserver to watch for new elements being added to the DOM
    // But only observe childList changes, not attribute changes to avoid loops
    const observer = new MutationObserver((mutations) => {
      // Only update if it's a structural change (new elements), not attribute changes
      const hasStructuralChanges = mutations.some(m => m.type === 'childList');
      if (hasStructuralChanges) {
        updateSelection();
      }
    });
    
    if (previewContentRef.current) {
      observer.observe(previewContentRef.current, {
        childList: true,
        subtree: true,
        attributes: false, // Don't observe attributes to avoid loops
        characterData: false,
      });
    }
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(retryInterval);
      observer.disconnect();
      
      // Cleanup all timeouts
      textUpdateTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      textUpdateTimeouts.clear();
      
      // Cleanup all event listeners
      eventHandlers.forEach((handlers, element) => {
        element.removeEventListener('input', handlers.input);
        element.removeEventListener('blur', handlers.blur);
      });
      eventHandlers.clear();
    };
  }, [selectedElementId, code, onUpdateText, dsl, activePreviewTab]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative" style={{ minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
      <Tabs 
        value={activePreviewTab === "preview" || activePreviewTab === "inspect" ? "preview" : "code"}
        onValueChange={(value) => {
          if (value === "preview") {
            // Default to "preview" when switching from code
            onPreviewTabChange("preview");
          } else {
            onPreviewTabChange("code");
          }
        }}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{ minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}
      >

        <TabsContent 
          value="preview" 
          className="flex-1 flex flex-col min-h-0 overflow-hidden mt-0 p-0 m-0"
          style={{ marginTop: 0, margin: 0, padding: 0, display: (activePreviewTab === "preview" || activePreviewTab === "inspect") ? "flex" : "none" }}
        >
          <div 
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
            style={{ margin: 0, padding: 0 }}
          >
            
          <div 
            ref={previewContainerRef} 
            className="flex-1 overflow-hidden min-h-0 relative w-full h-full m-0 p-0 flex items-center justify-center" 
            style={{ 
              margin: 0,
              padding: 0,
              marginTop: 0,
              backgroundColor: "var(--background-primary)",
              backgroundImage: `
                radial-gradient(circle, color-mix(in srgb, var(--foreground-primary) 8%, transparent) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0",
            }}
          >
            
            {/* Selection Toolbar - only show in inspect mode */}
            {selectedElementId && activePreviewTab === "inspect" && (
              <SelectionToolbar
                selectedElementId={selectedElementId}
                componentName={componentName}
                onEdit={() => onEditElement?.(selectedElementId)}
                onDelete={() => onDeleteElement?.(selectedElementId)}
                onDuplicate={() => onDuplicateElement?.(selectedElementId)}
                onClear={() => onSelectionChange?.(null)}
              />
            )}
            <div 
              ref={previewContentRef}
              className="flex-1 overflow-auto flex items-center justify-center p-8"
              style={{ 
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'center center',
                minHeight: '100%',
              }}
              onClick={(e) => {
                // Only handle element selection in "inspect" mode
                // In "preview" mode, allow normal UI interactions without selection
                if (activePreviewTab !== "inspect") {
                  return;
                }
                
                // Handle element selection
                const target = e.target as HTMLElement;
                const elementWithId = target.closest('[data-ui-id]');
                const uiId = elementWithId?.getAttribute('data-ui-id');
                if (uiId && onSelectionChange) {
                  onSelectionChange(uiId);
                } else if (!uiId && onSelectionChange) {
                  onSelectionChange(null);
                }
              }}
            >
              {/* Add CSS for selected element highlighting - only in inspect mode */}
              {activePreviewTab === "inspect" && (
                <style dangerouslySetInnerHTML={{__html: `
                  [data-ui-id] {
                    position: relative;
                    transition: all 0.2s ease;
                  }
                  [data-ui-id][data-selected="true"] {
                    outline: 2px solid var(--color-brand-primary, #3b82f6);
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px var(--color-brand-primary, #3b82f6);
                  }
                  [data-ui-id]:hover {
                    outline: 1px dashed var(--color-brand-primary, #3b82f6);
                    outline-offset: 1px;
                    cursor: pointer;
                  }
                  [data-ui-id][data-selected="true"]:hover {
                    outline: 2px solid var(--color-brand-primary, #3b82f6);
                    outline-offset: 2px;
                  }
                `}} />
              )}
              <ReactLiveRenderer code={code} onError={onPreviewError} />
              {/* Agent View Overlay */}
              {agentViewEnabled && (
                <AgentViewOverlay
                  enabled={agentViewEnabled}
                  containerRef={previewContentRef}
                  dsl={dsl}
                />
              )}
            </div>
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 dark:bg-zinc-950/70 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-3">
                  <Spinner size="lg" className="text-zinc-600 dark:text-zinc-400" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Generating component...
                  </p>
                </div>
              </div>
            )}
            
            {/* Zoom controls in top right (only in Preview tab) */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-[color:var(--color-surface-base)] border rounded-lg shadow-lg z-40" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
              <Tooltip content="Zoom out">
              <button
                onClick={() => onZoomChange(Math.max(25, previewZoom - 25))}
                className="p-2 transition-colors rounded-l-lg"
                disabled={previewZoom <= 25}
                style={{
                  opacity: previewZoom <= 25 ? 0.5 : 1,
                  cursor: previewZoom <= 25 ? "not-allowed" : "pointer",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (previewZoom > 25) {
                    e.currentTarget.style.backgroundColor = foregroundMix(5);
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ZoomOut className="w-4 h-4" style={{ color: "var(--foreground-primary)" }} />
              </button>
              </Tooltip>
              <div className="px-3 py-2 text-sm font-medium border-x" style={{ 
                borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                color: "var(--foreground-primary)",
                minWidth: "60px",
                textAlign: "center",
              }}>
                {previewZoom}%
              </div>
              <Tooltip content="Zoom in">
              <button
                onClick={() => onZoomChange(Math.min(200, previewZoom + 25))}
                className="p-2 transition-colors rounded-r-lg"
                disabled={previewZoom >= 200}
                style={{
                  opacity: previewZoom >= 200 ? 0.5 : 1,
                  cursor: previewZoom >= 200 ? "not-allowed" : "pointer",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (previewZoom < 200) {
                    e.currentTarget.style.backgroundColor = foregroundMix(5);
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <ZoomIn className="w-4 h-4" style={{ color: "var(--foreground-primary)" }} />
              </button>
              </Tooltip>
            </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent 
          value="code" 
          className="flex-1 flex flex-col min-h-0 overflow-hidden mt-0 p-0 m-0"
          style={{ marginTop: 0, margin: 0, padding: 0, display: activePreviewTab === "code" ? "flex" : "none", height: "100%", backgroundColor: "#18181b" }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            /* Responsive code view styles */
            .code-view-container {
              width: 100%;
              height: 100%;
              overflow: hidden;
              margin: 0;
              padding: 0;
              min-width: 0;
              max-width: 100%;
              box-sizing: border-box;
            }
            
            .code-toolbar {
              position: absolute;
              top: 8px;
              right: 8px;
              z-index: 10;
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;
            }
            
            .code-toolbar-label {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              border-radius: 6px;
              transition: background-color 0.2s;
              cursor: pointer;
              font-size: 0.75rem;
            }
            
            .code-toolbar-label-text {
              white-space: nowrap;
            }
            
            .code-toolbar-button {
              padding: 8px;
              border-radius: 6px;
              transition: background-color 0.2s;
            }
            
            .code-highlight-container {
              width: 100%;
              height: 100%;
              overflow: auto;
              margin: 0;
              padding: 0;
              min-width: 0;
              max-width: 100%;
              box-sizing: border-box;
            }
            
            /* Responsive adjustments for smaller screens */
            @media (max-width: 768px) {
              .code-toolbar {
                top: 4px;
                right: 4px;
                gap: 4px;
              }
              
              .code-toolbar-label {
                padding: 4px 8px;
                gap: 6px;
                font-size: 0.7rem;
              }
              
              .code-toolbar-label-text {
                display: none;
              }
              
              .code-toolbar-button {
                padding: 6px;
              }
              
              .code-highlight-container {
                font-size: 0.75rem !important;
              }
            }
            
            @media (max-width: 480px) {
              .code-toolbar {
                top: 2px;
                right: 2px;
                gap: 2px;
              }
              
              .code-toolbar-label {
                padding: 3px 6px;
                gap: 4px;
                font-size: 0.65rem;
              }
              
              .code-toolbar-button {
                padding: 4px;
              }
              
              .code-highlight-container {
                font-size: 0.7rem !important;
              }
            }
          `}} />
          <div className="flex-1 overflow-hidden relative w-full h-full m-0 p-0 code-view-container" style={{ minWidth: 0, maxWidth: "100%", boxSizing: "border-box", height: "100%", minHeight: "100%", backgroundColor: "#18181b" }}>
            {/* Toolbar with toggle and copy button */}
            <div className="code-toolbar">
              {/* Toggle to show/hide data-ui-id */}
              <label className="code-toolbar-label" style={{
                backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                color: "var(--foreground-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
              }}
              >
                <input
                  type="checkbox"
                  checked={showDataUiIds}
                  onChange={(e) => setShowDataUiIds(e.target.checked)}
                  className="w-3.5 h-3.5 cursor-pointer"
                  style={{ accentColor: "var(--color-brand-primary)" }}
                />
                <span className="code-toolbar-label-text">Show data-ui-id</span>
              </label>
              {/* Copy button */}
              <Tooltip content={showDataUiIds ? "Copy code (with data-ui-id)" : "Copy code (without data-ui-id)"}>
                <button
                  onClick={() => {
                    const codeToCopy = showDataUiIds ? code : removeDataUiIds(code);
                    navigator.clipboard.writeText(codeToCopy);
                    onCopyCode();
                  }}
                  className="code-toolbar-button"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    color: "var(--foreground-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  }}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
            <div className="w-full h-full overflow-auto m-0 p-0 code-highlight-container" style={{ width: "100%", height: "100%", minHeight: "100%", margin: 0, padding: 0, paddingTop: "24px", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", backgroundColor: "#18181b", flex: "1 1 0%" }}>
              <Suspense fallback={<div className="p-4 text-sm text-[color:var(--foreground-secondary)]">Loading syntax highlighter...</div>}>
                <CodeHighlight code={showDataUiIds ? code : removeDataUiIds(code)} theme={highlightTheme} />
              </Suspense>
            </div>
          </div>
          
        </TabsContent>
      </Tabs>
      
      {/* PreviewTopBar at bottom of Main container (for Projects and DS Components) */}
      {(isFromProjects || isDSComponent) && code && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          style={{
            pointerEvents: "auto",
          }}
        >
          <PreviewTopBar
            activePreviewTab={activePreviewTab}
            onPreviewTabChange={onPreviewTabChange}
            onExportCode={onExportCode}
            onShareLink={onShareLink}
            onToggleFavorite={onToggleFavorite}
            onDownloadZIP={onDownloadZIP}
            onSubmit={onSubmit}
            isFavorite={isFavorite}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            agentViewEnabled={agentViewEnabled}
            onAgentViewChange={setAgentViewEnabled}
          />
        </div>
      )}
    </div>
  );
});

// Separate component for code highlighting using react-syntax-highlighter
function CodeHighlight({ code, theme }: { code: string; theme: string }) {
  const [SyntaxHighlighter, setSyntaxHighlighter] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Lazy load react-syntax-highlighter
    (async () => {
      try {
        // Import react-syntax-highlighter dynamically
        const module = await import("react-syntax-highlighter");
        // @ts-ignore - react-syntax-highlighter types are incomplete
        const prismLanguagesModule = await import("react-syntax-highlighter/dist/esm/languages/prism");
        const stylesModule = await import("react-syntax-highlighter/dist/esm/styles/prism");
        
        if (!isMounted) return;
        
        const PrismHighlighter = prismLanguagesModule.Prism;
        const { vscDarkPlus } = stylesModule;
        // Use a different style if github is not available - use type assertion
        const github = (stylesModule as any).github || vscDarkPlus;
        
        // Register TypeScript/TSX language
        if (PrismHighlighter && typeof PrismHighlighter.registerLanguage === "function") {
          try {
            const tsx = await import("react-syntax-highlighter/dist/esm/languages/prism/tsx");
            if (tsx.default) {
              PrismHighlighter.registerLanguage("tsx", tsx.default);
            }
          } catch (e) {
            // Fallback to typescript if tsx is not available
            try {
              const ts = await import("react-syntax-highlighter/dist/esm/languages/prism/typescript");
              if (ts.default) {
                PrismHighlighter.registerLanguage("tsx", ts.default);
              }
            } catch (e2) {
              console.warn("Failed to register TSX language:", e2);
            }
          }
        }
        
        // TypeScript workaround for Prism import
        const SyntaxHighlighterComponent = module.Prism || (module.default as any)?.Prism || module.default;
        setSyntaxHighlighter({
          Component: SyntaxHighlighterComponent,
          themes: { vscDarkPlus, github },
        });
        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load react-syntax-highlighter:", err);
        setError(err instanceof Error ? err.message : "Failed to load syntax highlighter");
        setIsLoading(false);
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[color:var(--foreground-secondary)] flex items-center gap-2">
        <Spinner size="sm" />
        <span>Loading syntax highlighter...</span>
      </div>
    );
  }

  if (error || !SyntaxHighlighter) {
    // Fallback: render plain code
    return (
      <pre 
        style={{
          margin: 0,
          padding: 0,
            backgroundColor: "#18181b",
          fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
          lineHeight: "1.75",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          display: "flex",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          color: "var(--foreground-primary)",
          overflow: "auto",
        }}
      >
        <div style={{ 
          paddingRight: "1rem", 
          textAlign: "right", 
          userSelect: "none",
          color: "var(--foreground-tertiary)",
          minWidth: "3rem",
          flexShrink: 0,
        }}>
          {code.split('\n').map((_, i) => (
            <div key={i} style={{ lineHeight: "1.75" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <code style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {code}
          </code>
        </div>
      </pre>
    );
  }

  const selectedTheme = theme === "vsDark" ? SyntaxHighlighter.themes.vscDarkPlus : SyntaxHighlighter.themes.github;
  const Highlighter = SyntaxHighlighter.Component;

  // Get foreground-tertiary color based on theme
  // vsDark (dark mode): #3F3F46, github (light mode): #A3A3A3
  const lineNumberColor = theme === "vsDark" ? "#3F3F46" : "#A3A3A3";

  try {
    return (
      <div className="playground-code-highlight" style={{ position: "relative", width: "100%", height: "100%", overflow: "auto", margin: 0, padding: 0, minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
        <Highlighter
          language="tsx"
          style={selectedTheme}
          customStyle={{
            margin: 0,
            padding: 0,
            backgroundColor: "#18181b",
            fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
            lineHeight: "1.75",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
            },
          }}
          showLineNumbers
          lineNumberStyle={{
            paddingRight: "1rem",
            textAlign: "right",
            userSelect: "none",
            color: lineNumberColor,
            minWidth: "3rem",
          }}
        >
          {code}
        </Highlighter>
      </div>
    );
  } catch (err) {
    console.error("Error rendering code highlight:", err);
    // Fallback to plain code
    return (
      <pre 
        style={{
          margin: 0,
          padding: 0,
            backgroundColor: "#18181b",
          fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
          lineHeight: "1.75",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          display: "flex",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          color: "var(--foreground-primary)",
          overflow: "auto",
        }}
      >
        <div style={{ 
          paddingRight: "1rem", 
          textAlign: "right", 
          userSelect: "none",
          color: "var(--foreground-tertiary)",
          minWidth: "3rem",
          flexShrink: 0,
        }}>
          {code.split('\n').map((_, i) => (
            <div key={i} style={{ lineHeight: "1.75" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <code style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {code}
          </code>
        </div>
      </pre>
    );
  }
}

