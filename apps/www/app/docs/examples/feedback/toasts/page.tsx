"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Button, toast, Toaster } from "@fragment_ui/ui";

export default function ToastNotificationsExample() {
  return (
    <DocLayout>
      <Toaster />
      <h1 className="text-3xl font-medium mb-4">Toasts</h1>
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
        Toasts example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-4 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Toast</h3>
          <Button
            onClick={() => {
              toast.message("Toast Title", {
                description: "This is a toast notification",
              });
            }}
          >
            Show Toast
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Success Toast</h3>
          <Button
            onClick={() => {
              toast.success("Operation completed successfully", {
                title: "Success!",
              });
            }}
          >
            Show Success
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Error Toast</h3>
          <Button
            onClick={() => {
              toast.error("Something went wrong", {
                title: "Error",
              });
            }}
          >
            Show Error
          </Button>
        </div>
      </div>
    </DocLayout>
  );
}

