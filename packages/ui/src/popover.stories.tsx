import type { Meta, StoryObj } from "@storybook/react";
import { PopoverWrapper, PopoverContent, PopoverTrigger, Popover } from "./popover";
import { Button } from "./button";
import { useState } from "react";

const meta: Meta<typeof PopoverWrapper> = {
  title: "Overlay/Popover",
  component: PopoverWrapper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PopoverWrapper>;

export const Default: Story = {
  render: () => (
    <PopoverWrapper trigger={<Button>Open Popover</Button>}>
      <div className="space-y-2">
        <h4 className="font-medium">Popover Title</h4>
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          This is the popover content. You can put anything here.
        </p>
      </div>
    </PopoverWrapper>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <PopoverWrapper
        trigger={<Button onClick={() => setOpen(!open)}>Open Popover</Button>}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="space-y-2">
          <h4 className="font-medium">Controlled Popover</h4>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            This popover is controlled by state.
          </p>
        </div>
      </PopoverWrapper>
    );
  },
};

export const Positioning: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button>Top</Button>
          </PopoverTrigger>
          <PopoverContent side="top">Popover on top</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Right</Button>
          </PopoverTrigger>
          <PopoverContent side="right">Popover on right</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Bottom</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom">Popover on bottom</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Left</Button>
          </PopoverTrigger>
          <PopoverContent side="left">Popover on left</PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button>Align Start</Button>
          </PopoverTrigger>
          <PopoverContent align="start">Aligned to start</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Align Center</Button>
          </PopoverTrigger>
          <PopoverContent align="center">Aligned to center</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Align End</Button>
          </PopoverTrigger>
          <PopoverContent align="end">Aligned to end</PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

export const WithCollisionDetection: Story = {
  render: () => (
    <div className="flex justify-end p-20">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Near Edge</Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          collisionPadding={20}
        >
          This popover will automatically flip if it would go off-screen
        </PopoverContent>
      </Popover>
    </div>
  ),
};

