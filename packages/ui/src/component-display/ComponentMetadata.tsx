"use client";

import * as React from "react";
import { Package, Info, CheckCircle2, ExternalLink } from "lucide-react";
import { EnhancedComponentInfo } from "./types";

export interface ComponentMetadataProps {
  componentName: string;
  componentInfo?: Partial<EnhancedComponentInfo>;
  showPackage?: boolean;
  showVersion?: boolean;
  showDescription?: boolean;
  showFeatures?: boolean;
  showAccessibility?: boolean;
  compact?: boolean;
  className?: string;
}

export function ComponentMetadata({
  componentName,
  componentInfo,
  showPackage = true,
  showVersion = true,
  showDescription = false,
  showFeatures = false,
  showAccessibility = false,
  compact = false,
  className = "",
}: ComponentMetadataProps) {
  if (!componentInfo) {
    return null;
  }

  const packageName = componentInfo.package || "@fragment_ui/ui";
  const version = (componentInfo as any).version || "1.0.0";

  return (
    <div className={`component-metadata ${className}`} style={{ width: "100%" }}>
      {/* Package & Version (always shown if enabled) */}
      {(showPackage || showVersion) && (
        <div 
          className={`space-y-2 ${compact ? "text-xs" : "text-xs"}`}
          style={{ color: "var(--foreground-secondary)" }}
        >
          {showPackage && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>Package:</span>
              </span>
              <span className="font-medium" style={{ color: "var(--foreground-primary)" }}>
                {packageName}
              </span>
            </div>
          )}
          {showVersion && (
            <div className="flex items-center justify-between gap-2">
              <span>Version:</span>
              <span className="font-medium" style={{ color: "var(--foreground-primary)" }}>
                {version}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {showDescription && componentInfo.description && (
        <div className="mt-3">
          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
            {componentInfo.description}
          </p>
        </div>
      )}

      {/* Note */}
      {componentInfo.note && (
        <div className="mt-2">
          <p className={`${compact ? "text-xs" : "text-xs"} italic`} style={{ color: "var(--color-fg-muted)" }}>
            {componentInfo.note}
          </p>
        </div>
      )}

      {/* Features */}
      {showFeatures && componentInfo.features && componentInfo.features.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2" style={{ color: "var(--foreground-primary)" }}>
            Features
          </h4>
          <ul className="space-y-1">
            {componentInfo.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accessibility */}
      {showAccessibility && componentInfo.accessibility && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: "var(--foreground-primary)" }}>
            <Info className="w-4 h-4" />
            Accessibility
          </h4>
          {componentInfo.accessibility.role && (
            <div className="text-sm mb-2" style={{ color: "var(--foreground-secondary)" }}>
              <span className="font-medium">Role: </span>
              <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--color-surface-2)" }}>
                {componentInfo.accessibility.role}
              </code>
            </div>
          )}
          {componentInfo.accessibility.notes && (
            <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
              {componentInfo.accessibility.notes}
            </p>
          )}
          {componentInfo.accessibility.wcag && componentInfo.accessibility.wcag.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-medium" style={{ color: "var(--color-fg-muted)" }}>
                WCAG: {componentInfo.accessibility.wcag.join(", ")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Related Components */}
      {componentInfo.related && componentInfo.related.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2" style={{ color: "var(--foreground-primary)" }}>
            Related
          </h4>
          <div className="flex flex-wrap gap-2">
            {componentInfo.related.map((related) => (
              <a
                key={related}
                href={`/docs/components/${related}`}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{
                  color: "var(--foreground-secondary)",
                  backgroundColor: "var(--color-surface-2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                  e.currentTarget.style.backgroundColor = "var(--color-surface-3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                  e.currentTarget.style.backgroundColor = "var(--color-surface-2)";
                }}
              >
                {related}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

