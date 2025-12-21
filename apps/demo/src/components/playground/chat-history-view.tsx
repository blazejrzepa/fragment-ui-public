"use client";

import React from "react";
import { Plus, Star, MoreHorizontal, Trash, MessageSquare } from "lucide-react";
import { TreeView, type TreeNode, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Tooltip } from "@fragment_ui/ui";
import type { ChatSession } from "@/types/chat";

interface ChatHistoryViewProps {
  chatSessions: ChatSession[];
  selectedIds: string[];
  expandedChatIds: string[];
  treeNodes: TreeNode[];
  onExpansionChange: (ids: string[]) => void;
  onNodeClick: (node: TreeNode) => void;
  onNewChat: () => void;
  onFavourites?: () => void;
  showFavourites?: boolean;
  onAddToFavourites?: (nodeId: string) => void;
  onDeleteSession?: (nodeId: string) => void;
}

export const ChatHistoryView = React.memo(function ChatHistoryView({
  chatSessions,
  selectedIds,
  expandedChatIds,
  treeNodes,
  onExpansionChange,
  onNodeClick,
  onNewChat,
  onFavourites,
  showFavourites = false,
  onAddToFavourites,
  onDeleteSession,
}: ChatHistoryViewProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header with New Chat button */}
      <div 
        className="border-b px-4 py-2 flex-shrink-0 bg-[color:var(--color-surface-base)]" 
        style={{ 
          borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground-primary)" }}>
            Chat History
          </h3>
          <Tooltip content="New Chat">
            <button
              onClick={onNewChat}
              className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
              aria-label="New Chat"
            >
              <Plus className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Tree View */}
      <div 
        className="flex-1 overflow-y-auto pl-3 pr-1 pt-2 pb-2 chat-history-tree-view" 
        style={{ scrollbarWidth: "thin" }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          /* Base responsive styles */
          .chat-history-tree-view .tree-node > div {
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            min-width: 0;
            max-width: 100%;
            overflow: visible;
            width: 100%;
          }
          .chat-history-tree-view .tree-node > div > span {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            min-width: 0 !important;
            flex: 1 1 0% !important;
            max-width: 100% !important;
          }
          .chat-history-tree-view .tree-node-actions {
            flex-shrink: 0 !important;
            flex-grow: 0 !important;
            min-width: 24px !important;
            width: 24px !important;
            margin-left: 4px !important;
          }
        `}} />
        {treeNodes.length > 0 ? (
          <TreeView
            nodes={treeNodes}
            selectedIds={selectedIds}
            expandedIds={expandedChatIds}
            onExpansionChange={onExpansionChange}
            onNodeClick={onNodeClick}
            showCheckboxes={false}
            showIcons={true}
            className="border-0 bg-transparent p-0"
            indentSize={16}
            renderNodeActions={(node) => {
              // Only show actions for session nodes (not date nodes)
              if (!node.data?.session) {
                return null;
              }
              
              return (
                <DropdownMenu>
                  <Tooltip content="More options">
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors opacity-0 group-hover:opacity-100"
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
                    {onAddToFavourites && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToFavourites(node.id);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" style={{ color: "var(--foreground-secondary)" }} />
                        Add to Favourites
                      </DropdownMenuItem>
                    )}
                    {onDeleteSession && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(node.id);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--foreground-tertiary)" }} />
              <p className="text-sm" style={{ color: "var(--foreground-tertiary)" }}>
                No chat history yet
              </p>
              <button
                onClick={onNewChat}
                className="mt-4 text-xs px-3 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                  color: "var(--foreground-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                }}
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

