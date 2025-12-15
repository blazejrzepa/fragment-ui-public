"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
} from "@fragment_ui/ui";
import { useState } from "react";

export default function NestedDialogsExample() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Nested</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Nested example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6">
        <Dialog open={outerOpen} onOpenChange={setOuterOpen}>
          <DialogTrigger asChild>
            <Button>Open Outer Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Outer Dialog</DialogTitle>
            <DialogDescription>
              This is the outer dialog. You can open another dialog from here.
            </DialogDescription>
            <div className="mt-4">
              <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Inner Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Inner Dialog</DialogTitle>
                  <DialogDescription>
                    This nested dialog appears on top of the outer dialog.
                  </DialogDescription>
                  <DialogClose asChild>
                    <Button variant="outline" className="mt-4">Close Inner</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4">Close Outer</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </DocLayout>
  );
}

