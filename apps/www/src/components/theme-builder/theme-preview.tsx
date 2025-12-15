"use client";

import * as React from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Input } from "@fragment_ui/ui";

export interface ThemePreviewProps {
  customStyles?: React.CSSProperties;
}

export function ThemePreview({ customStyles }: ThemePreviewProps) {
  return (
    <div className="space-y-6" style={customStyles}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Buttons</h4>
            <div className="flex gap-2 flex-wrap">
              <Button variant="solid">Solid Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Badges</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="solid">Solid</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="subtle">Subtle</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Card</h4>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Sample Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  This is a preview card showing how your theme changes affect components.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Input</h4>
            <Input placeholder="Enter text..." />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Colors</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]">
                <div className="text-xs text-[color:var(--color-fg-muted)] mb-1">Surface 1</div>
                <div className="text-sm">Background</div>
              </div>
              <div className="p-3 rounded bg-[color:var(--color-surface-2)] border border-[color:var(--color-border-base)]">
                <div className="text-xs text-[color:var(--color-fg-muted)] mb-1">Surface 2</div>
                <div className="text-sm">Background</div>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: "var(--color-brand-primary)" }}>
                <div className="text-xs text-white/70 mb-1">Brand Primary</div>
                <div className="text-sm text-white">Primary Color</div>
              </div>
              <div className="p-3 rounded bg-[color:var(--color-accent-green)]">
                <div className="text-xs text-white/70 mb-1">Accent Green</div>
                <div className="text-sm text-white">Success</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

