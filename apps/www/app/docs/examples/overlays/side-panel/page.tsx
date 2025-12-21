"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
} from "@fragment_ui/ui";

export default function SidePanelExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Side Panel</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Side Panel example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-4 my-[var(--space-6)]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Right Side Panel</h3>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Right Panel</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Right Panel</SheetTitle>
                <SheetDescription>Content in right side panel</SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <p>Panel content goes here.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Left Side Panel</h3>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Left Panel</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Left Panel</SheetTitle>
                <SheetDescription>Content in left side panel</SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <p>Panel content goes here.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </DocLayout>
  );
}

