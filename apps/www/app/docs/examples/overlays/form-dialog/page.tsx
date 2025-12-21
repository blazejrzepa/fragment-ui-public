"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  FormFieldEnhanced,
  FormEnhanced,
  Input,
  Button,
  validators,
} from "@fragment_ui/ui";

export default function FormDialogExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Form Dialog</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Form Dialog example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Item</DialogTitle>
            <DialogDescription>Fill in the form to create a new item.</DialogDescription>
            <FormEnhanced
              onSubmit={(data) => {
                alert("Item created!");
              }}
            >
              <div className="space-y-4 mt-4">
                <FormFieldEnhanced
                  name="name"
                  label="Name"
                  rules={validators.required()}
                >
                  <Input placeholder="Item name" />
                </FormFieldEnhanced>
                <FormFieldEnhanced
                  name="description"
                  label="Description"
                >
                  <Input placeholder="Item description" />
                </FormFieldEnhanced>
                <div className="flex gap-2 justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </div>
              </div>
            </FormEnhanced>
          </DialogContent>
        </Dialog>
      </div>
    </DocLayout>
  );
}

