import * as React from "react";

// Simple Link component that works in both Next.js and non-Next.js environments
// Uses anchor tag by default, but can be replaced with Next.js Link in Next.js apps
export const Link: React.ComponentType<{ href: string; children: React.ReactNode; className?: string; [key: string]: any }> = 
  ({ href, children, className, ...props }) => (
    <a href={href} className={className} {...props}>{children}</a>
  );

