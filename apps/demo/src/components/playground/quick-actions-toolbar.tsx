"use client";

import React, { useState } from "react";
import { Button } from "@fragment_ui/ui";
import { Save, Download, Share2, Copy, FileDown, MoreVertical, Star } from "lucide-react";
import { toast } from "@fragment_ui/ui";

interface QuickActionsToolbarProps {
  code: string;
  dsl?: any;
  isFavorite?: boolean;
  onSaveToSubmissions?: () => void;
  onExportCode?: () => void;
  onShareLink?: () => void;
  onCopyDSL?: () => void;
  onToggleFavorite?: () => void;
  onDownloadZIP?: () => void;
}

/**
 * Quick Actions Toolbar - floating toolbar with quick actions
 * 
 * Provides quick access to common actions:
 * - Save to Submissions
 * - Export Code
 * - Share Link
 * - Copy DSL
 * - Download as ZIP
 */
export const QuickActionsToolbar = React.memo(function QuickActionsToolbar({
  code,
  dsl,
  isFavorite = false,
  onSaveToSubmissions,
  onExportCode,
  onShareLink,
  onCopyDSL,
  onToggleFavorite,
  onDownloadZIP,
}: QuickActionsToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExportCode = () => {
    if (!code) {
      toast.error("No code to export");
      return;
    }

    if (onExportCode) {
      onExportCode();
      return;
    }

    // Default: download as .tsx file
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.tsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code exported successfully!");
  };

  const handleCopyDSL = () => {
    if (!dsl) {
      toast.error("No DSL available");
      return;
    }

    if (onCopyDSL) {
      onCopyDSL();
      return;
    }

    // Default: copy DSL to clipboard
    const dslString = typeof dsl === 'string' ? dsl : JSON.stringify(dsl, null, 2);
    navigator.clipboard.writeText(dslString);
    toast.success("DSL copied to clipboard!");
  };

  const handleShareLink = () => {
    if (!code) {
      toast.error("No code to share");
      return;
    }

    if (onShareLink) {
      onShareLink();
      return;
    }

    // Default: copy shareable link to clipboard
    // In production, this would generate a shareable URL
    const shareableUrl = `${window.location.origin}/playground?code=${encodeURIComponent(code.substring(0, 1000))}`;
    navigator.clipboard.writeText(shareableUrl);
    toast.success("Shareable link copied to clipboard!");
  };

  const handleDownloadZIP = async () => {
    if (!code) {
      toast.error("No code to download");
      return;
    }

    if (onDownloadZIP) {
      onDownloadZIP();
      return;
    }

    // Fallback: create a simple ZIP with code
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      zip.file("component.tsx", code);
      
      if (dsl) {
        const dslString = typeof dsl === 'string' ? dsl : JSON.stringify(dsl, null, 2);
        zip.file("component.dsl.json", dslString);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "component.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("ZIP file downloaded successfully!");
    } catch (error) {
      console.error("Failed to create ZIP:", error);
      toast.error("Failed to create ZIP file");
    }
  };

  if (!code || code.trim() === "") {
    return null;
  }

  return null; // QuickActionsToolbar is now replaced by PreviewTopBar
});

