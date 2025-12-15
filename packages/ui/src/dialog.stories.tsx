import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const meta: Meta<typeof Dialog> = {
  title: "Core/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Fullscreen: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Fullscreen Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="fullscreen">
        <DialogTitle>Fullscreen Dialog</DialogTitle>
        <DialogDescription>
          This is a fullscreen dialog that takes up the entire viewport.
        </DialogDescription>
        <div className="mt-4">
          <p>Fullscreen dialogs are useful for complex forms or detailed content.</p>
        </div>
        <DialogClose asChild>
          <Button variant="outline" className="mt-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  ),
};

export const Nested: Story = {
  render: () => {
    const [outerOpen, setOuterOpen] = React.useState(false);
    const [innerOpen, setInnerOpen] = React.useState(false);

    return (
      <>
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
                    This is a nested dialog. It appears on top of the outer dialog.
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
      </>
    );
  },
};

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogDescription>This is a dialog description.</DialogDescription>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the item.
        </DialogDescription>
        <div className="flex gap-2 mt-4 justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="solid" className="bg-[color:var(--color-accent-red)]">
              Delete
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create New Item</DialogTitle>
        <DialogDescription>Fill in the form to create a new item.</DialogDescription>
        <form className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input placeholder="Item name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input placeholder="Item description" />
          </div>
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="solid">Create</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ),
};

