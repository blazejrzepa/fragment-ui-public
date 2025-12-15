"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@fragment_ui/ui";
import { generateBreadcrumbsFromPath } from "../lib/breadcrumbs";

interface BreadcrumbsWrapperProps {
  items?: BreadcrumbItem[];
  version?: string;
  className?: string;
}

/**
 * Wrapper component that uses Breadcrumbs from @fragment_ui/ui
 * with automatic pathname generation support
 */
export function BreadcrumbsWrapper({ items, version, className }: BreadcrumbsWrapperProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || generateBreadcrumbsFromPath(pathname || "", version);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumbs 
      items={breadcrumbs} 
      className={className || "mb-6 text-left"}
    />
  );
}

