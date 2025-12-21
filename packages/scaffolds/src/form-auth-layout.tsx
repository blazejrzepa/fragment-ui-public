"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@fragment_ui/ui";
import clsx from "clsx";

export interface FormAuthLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

/**
 * FormAuthLayout - Scaffold for authentication forms
 * 
 * Provides a centered card layout with title and description,
 * suitable for login, signup, and password reset forms.
 */
export function FormAuthLayout({
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: FormAuthLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className={clsx("w-full mx-auto", maxWidthClasses[maxWidth], className)}>
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

