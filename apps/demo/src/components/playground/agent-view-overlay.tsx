"use client";

import React, { useEffect, useRef, useState } from "react";
import type { UiDsl, ActionContract } from "../../../app/studio/dsl/types";

interface AgentViewOverlayProps {
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  dsl?: UiDsl | null;
}

interface ACLAnnotation {
  element: HTMLElement;
  type: "section-role" | "action-id" | "compare-key" | "missing-acl";
  value: string;
  actionContract?: ActionContract;
  rect: DOMRect;
}

/**
 * Agent View Overlay - Shows ACL semantics and Action Contracts in preview
 * 
 * Scans DOM for:
 * - [data-section-role] - Section roles
 * - [data-action-id] - Action IDs with contracts
 * - [data-compare-key] - Compare keys for decision patterns
 * - Missing ACL warnings (Buttons without data-action-id)
 */
export function AgentViewOverlay({ enabled, containerRef, dsl }: AgentViewOverlayProps) {
  const [annotations, setAnnotations] = useState<ACLAnnotation[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Extract Action Contracts from DSL
  const actionContracts = React.useMemo(() => {
    if (!dsl) return new Map<string, ActionContract>();
    
    const contracts = new Map<string, ActionContract>();
    
    // Extract from actions array
    if ("actions" in dsl && Array.isArray(dsl.actions)) {
      dsl.actions.forEach((contract: ActionContract) => {
        contracts.set(contract.id, contract);
      });
    }
    
    return contracts;
  }, [dsl]);

  // Scan DOM for ACL attributes
  useEffect(() => {
    if (!enabled || !containerRef.current) {
      setAnnotations([]);
      return;
    }

    const scanDOM = () => {
      const container = containerRef.current;
      if (!container) return;

      const newAnnotations: ACLAnnotation[] = [];

      // Find all elements with ACL attributes
      const sectionRoles = container.querySelectorAll('[data-section-role]');
      sectionRoles.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const role = htmlEl.getAttribute('data-section-role');
        if (role) {
          const rect = htmlEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // Account for container scroll position
          newAnnotations.push({
            element: htmlEl,
            type: "section-role",
            value: role,
            rect: new DOMRect(
              rect.left - containerRect.left + container.scrollLeft,
              rect.top - containerRect.top + container.scrollTop,
              rect.width,
              rect.height
            ),
          });
        }
      });

      // Find all action IDs
      const actionIds = container.querySelectorAll('[data-action-id]');
      actionIds.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const actionId = htmlEl.getAttribute('data-action-id');
        if (actionId) {
          const rect = htmlEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const contract = actionContracts.get(actionId);
          // Account for container scroll position
          newAnnotations.push({
            element: htmlEl,
            type: "action-id",
            value: actionId,
            actionContract: contract,
            rect: new DOMRect(
              rect.left - containerRect.left + container.scrollLeft,
              rect.top - containerRect.top + container.scrollTop,
              rect.width,
              rect.height
            ),
          });
        }
      });

      // Find compare keys (for decision patterns)
      const compareKeys = container.querySelectorAll('[data-compare-key]');
      compareKeys.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const key = htmlEl.getAttribute('data-compare-key');
        if (key) {
          const rect = htmlEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // Account for container scroll position
          newAnnotations.push({
            element: htmlEl,
            type: "compare-key",
            value: key,
            rect: new DOMRect(
              rect.left - containerRect.left + container.scrollLeft,
              rect.top - containerRect.top + container.scrollTop,
              rect.width,
              rect.height
            ),
          });
        }
      });

      // Find missing ACL warnings (Buttons without data-action-id)
      const buttons = container.querySelectorAll('button, [role="button"], a[href]');
      buttons.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const hasActionId = htmlEl.hasAttribute('data-action-id');
        const isInteractive = htmlEl.tagName === 'BUTTON' || 
                             htmlEl.getAttribute('role') === 'button' ||
                             (htmlEl.tagName === 'A' && htmlEl.hasAttribute('href'));
        
        if (isInteractive && !hasActionId) {
          const rect = htmlEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // Account for container scroll position
          newAnnotations.push({
            element: htmlEl,
            type: "missing-acl",
            value: "Missing data-action-id",
            rect: new DOMRect(
              rect.left - containerRect.left + container.scrollLeft,
              rect.top - containerRect.top + container.scrollTop,
              rect.width,
              rect.height
            ),
          });
        }
      });

      setAnnotations(newAnnotations);
    };

    // Initial scan
    scanDOM();

    // Watch for DOM changes
    const observer = new MutationObserver(scanDOM);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-section-role', 'data-action-id', 'data-compare-key'],
      });
    }

    // Rescan on scroll/resize
    const handleResize = () => scanDOM();
    window.addEventListener('resize', handleResize);
    containerRef.current?.addEventListener('scroll', scanDOM);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('scroll', scanDOM);
    };
  }, [enabled, containerRef, actionContracts]);

  if (!enabled || annotations.length === 0) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {annotations.map((annotation, idx) => {
        const { rect, type, value, actionContract } = annotation;
        
        // Determine color based on type
        let bgColor: string;
        let borderColor: string;
        let textColor: string;
        let label: string;
        
        switch (type) {
          case "section-role":
            bgColor = "rgba(59, 130, 246, 0.1)"; // blue
            borderColor = "rgba(59, 130, 246, 0.5)";
            textColor = "rgb(59, 130, 246)";
            label = `Section: ${value}`;
            break;
          case "action-id":
            bgColor = actionContract?.kind === "hard" 
              ? "rgba(239, 68, 68, 0.1)" // red for hard actions
              : "rgba(34, 197, 94, 0.1)"; // green for soft actions
            borderColor = actionContract?.kind === "hard"
              ? "rgba(239, 68, 68, 0.5)"
              : "rgba(34, 197, 94, 0.5)";
            textColor = actionContract?.kind === "hard"
              ? "rgb(239, 68, 68)"
              : "rgb(34, 197, 94)";
            label = `Action: ${value}`;
            if (actionContract) {
              label += ` (${actionContract.kind})`;
              if (actionContract.riskLevel) {
                label += ` [${actionContract.riskLevel} risk]`;
              }
              if (actionContract.requiresConfirmation) {
                label += " [requires confirmation]";
              }
            }
            break;
          case "compare-key":
            bgColor = "rgba(168, 85, 247, 0.1)"; // purple
            borderColor = "rgba(168, 85, 247, 0.5)";
            textColor = "rgb(168, 85, 247)";
            label = `Compare: ${value}`;
            break;
          case "missing-acl":
            bgColor = "rgba(245, 158, 11, 0.1)"; // yellow/orange
            borderColor = "rgba(245, 158, 11, 0.5)";
            textColor = "rgb(245, 158, 11)";
            label = "⚠ Missing ACL";
            break;
          default:
            bgColor = "rgba(156, 163, 175, 0.1)";
            borderColor = "rgba(156, 163, 175, 0.5)";
            textColor = "rgb(156, 163, 175)";
            label = value;
        }

        return (
          <div
            key={idx}
            className="absolute"
            style={{
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              border: `2px dashed ${borderColor}`,
              backgroundColor: bgColor,
              pointerEvents: "none",
              zIndex: 1000,
            }}
          >
            {/* Label badge */}
            <div
              className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                color: textColor,
                fontSize: "11px",
                lineHeight: "1.2",
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

