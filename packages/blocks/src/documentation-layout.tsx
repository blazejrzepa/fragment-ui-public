"use client";

import * as React from "react";
import { ContentContainer } from "./content-container";

export interface DocumentationLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  maxWidth?: string;
  contentTopPadding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DocumentationLayout({
  children,
  header,
  sidebar,
  rightSidebar,
  maxWidth = "1536px",
  contentTopPadding = "58px",
  className,
  style,
}: DocumentationLayoutProps) {
  const hasRight = !!rightSidebar;

  return (
    <div
      className={["mx-auto px-1 sm:px-2 lg:px-4 w-full", className].filter(Boolean).join(" ")}
      style={{ maxWidth, width: "100%", ...style }}
    >
      {header}
      <div
        className="w-full"
        style={{
          marginTop: header ? contentTopPadding : "0",
        }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_240px] gap-4 lg:gap-6 items-start">
          {sidebar && (
            <aside className="hidden lg:block sticky top-16 h-[calc(100vh-96px)] overflow-y-auto">
              {sidebar}
            </aside>
          )}
          <main className="min-w-0">
            <ContentContainer maxWidthClass="max-w-[720px]">
              <div
                className="mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 py-6"
                style={{
                  paddingTop: header ? contentTopPadding : "0",
                }}
              >
                {children}
              </div>
            </ContentContainer>
          </main>
          {hasRight && (
            <aside className="hidden lg:block sticky top-16 h-[calc(100vh-96px)] overflow-y-auto pl-1">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

