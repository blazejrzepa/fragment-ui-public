"use client";

import React from "react";
import { Box } from "lucide-react";
import { Spinner } from "@fragment_ui/ui";

interface PlaygroundWelcomeProps {
  onPromptClick: (prompt: string) => void;
  showGrid?: boolean; // Show grid background when there's an active component tab
  isGenerating?: boolean; // Show loading spinner when generating
}

export const PlaygroundWelcome = React.memo(function PlaygroundWelcome({ onPromptClick, showGrid = false, isGenerating = false }: PlaygroundWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        className="flex-1 overflow-hidden p-4 relative"
        style={showGrid ? {
          backgroundColor: "var(--background-primary)",
          backgroundImage: `
            radial-gradient(circle, color-mix(in srgb, var(--foreground-primary) 8%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
        } : undefined}
      >
        {!showGrid && (
          <div className="flex items-center justify-center h-full">
            <Box 
              className="w-32 h-32"
              style={{ 
                color: "#18181b" // zinc-900
              }}
            />
          </div>
        )}
        
        {/* Loading spinner when generating */}
        {isGenerating && showGrid && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" style={{ color: "var(--foreground-primary)" }} />
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Generating component...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

