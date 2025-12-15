import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./toast";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Core/Toast",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="space-x-2">
        <Button onClick={() => toast.success("Success message")}>
          Success
        </Button>
        <Button onClick={() => toast.error("Error message")}>Error</Button>
        <Button onClick={() => toast.info("Info message")}>Info</Button>
        <Button onClick={() => toast.warning("Warning message")}>
          Warning
        </Button>
      </div>
    </>
  ),
};

export const WithActions: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="space-y-2">
        <Button
          onClick={() =>
            toast.success("File uploaded successfully!", {
              action: {
                label: "View",
                onClick: () => console.log("View file"),
              },
            })
          }
        >
          Success with Action
        </Button>
        <Button
          onClick={() =>
            toast.error("Failed to save changes", {
              action: {
                label: "Retry",
                onClick: () => console.log("Retry save"),
              },
              cancel: {
                label: "Dismiss",
                onClick: () => console.log("Dismissed"),
              },
            })
          }
        >
          Error with Actions
        </Button>
      </div>
    </>
  ),
};

export const WithTitleAndDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.success("Changes saved", {
            title: "Success",
            description: "Your changes have been saved successfully.",
          })
        }
      >
        With Title & Description
      </Button>
    </>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.5 ? resolve("Success!") : reject("Failed!");
            }, 2000);
          });

          toast.promise(promise, {
            loading: "Saving changes...",
            success: "Changes saved successfully!",
            error: "Failed to save changes",
          });
        }}
      >
        Promise Toast
      </Button>
    </>
  ),
};

export const CustomPosition: Story = {
  render: () => (
    <>
      <Toaster position="bottom-left" />
      <Button onClick={() => toast.success("Toast at bottom-left")}>
        Bottom Left
      </Button>
    </>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <>
      <Toaster duration={10000} />
      <Button onClick={() => toast.info("This toast will show for 10 seconds")}>
        Long Duration
      </Button>
    </>
  ),
};

export const Stacking: Story = {
  render: () => (
    <>
      <Toaster visibleToasts={5} />
      <Button
        onClick={() => {
          toast.success("Item 1 created");
          toast.info("Item 2 processing");
          toast.success("Item 3 completed");
          toast.warning("Item 4 needs attention");
          toast.error("Item 5 failed");
        }}
      >
        Show Stacked Toasts
      </Button>
    </>
  ),
};

