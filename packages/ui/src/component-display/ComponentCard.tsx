"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../card";
import { ExternalLink } from "lucide-react";
import { ComponentPreview } from "./ComponentPreview";
import { ComponentMetadata } from "./ComponentMetadata";
import { useComponentPreview } from "./hooks/useComponentPreview";
import type { EnhancedComponentInfo } from "./types";

export interface ComponentCardProps {
  componentName: string;
  componentInfo?: Partial<EnhancedComponentInfo>;
  variant?: string;
  onComponentClick?: (name: string) => void;
  height?: string | number;
  className?: string;
}

/**
 * ComponentCard - Unified card view for components
 * 
 * This component provides a consistent card layout for displaying components
 * in grid views (Library tab, etc.).
 */
export function ComponentCard({
  componentName,
  componentInfo,
  variant,
  onComponentClick,
  height = "300px",
  className = "",
}: ComponentCardProps) {
  // Debug: log componentInfo for Accordion (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && componentName.toLowerCase() === 'accordion') {
    console.log('[ComponentCard] Accordion componentInfo:', {
      hasComponentInfo: !!componentInfo,
      hasExamples: !!(componentInfo?.examples),
      examplesLength: componentInfo?.examples?.length || 0,
      examplesType: Array.isArray(componentInfo?.examples) ? 'array' : typeof componentInfo?.examples,
      componentInfoKeys: componentInfo ? Object.keys(componentInfo) : []
    });
  }
  
  const { previewCode } = useComponentPreview({
    componentName,
    componentInfo,
    variant,
  });
  
  // Debug: log previewCode for Accordion (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && componentName.toLowerCase() === 'accordion') {
    console.log('[ComponentCard] Accordion previewCode (first 200 chars):', previewCode?.substring(0, 200) + '...');
  }

  return (
    <Card
      className={`transition-all hover:shadow-lg relative overflow-hidden ${className}`}
      style={{
        backgroundColor: "var(--color-surface-1)",
        borderColor: "color-mix(in oklab, var(--foreground-primary) 5%, transparent)",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium truncate" title={componentName}>
            {componentName}
          </CardTitle>
          {onComponentClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComponentClick(componentName);
              }}
              className="inline-flex items-center justify-center w-7 h-7 rounded transition-colors flex-shrink-0"
              style={{
                color: "var(--foreground-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--foreground-primary) 5%, transparent)";
                e.currentTarget.style.color = "var(--foreground-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--foreground-secondary)";
              }}
              title="Open in Playground"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        {/* Component Preview */}
        <div 
          className="mb-4 rounded border"
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            width: "calc(100% + 48px)",
            marginLeft: "-24px",
            marginRight: "-24px",
            paddingLeft: "24px",
            paddingRight: "24px",
            backgroundColor: "var(--background-primary)",
            borderColor: "color-mix(in oklab, var(--foreground-primary) 5%, transparent)",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ComponentPreview
            componentName={componentName}
            componentInfo={componentInfo}
            previewCode={previewCode}
            variant={variant}
            height="100%"
            fullSize={true}
          />
        </div>
        
        {/* Metadata */}
        <div className="px-6 pb-6">
          <ComponentMetadata
            componentName={componentName}
            componentInfo={componentInfo}
            showPackage={true}
            showVersion={true}
            compact={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}

