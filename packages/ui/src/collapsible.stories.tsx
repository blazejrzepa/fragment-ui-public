import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
import { Button } from "./button";

const meta = {
  title: "Core/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[350px]">
      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <span className="font-semibold">Can I use this in my project?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Yes. Free to use for personal and commercial projects. No attribution required.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="w-[350px]">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            Toggle Content
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 p-4 rounded-lg border border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)]">
          <p className="text-sm">
            This is the collapsible content. It can contain any React elements.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <div className="w-[350px]">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full text-left">
          <span className="font-semibold">Open by Default</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            This collapsible is open by default.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <div className="w-[350px]">
      <Collapsible>
        <CollapsibleTrigger showIcon={false} className="w-full text-left">
          <span className="font-semibold">Click to expand (no icon)</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            This collapsible doesn't show an icon.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

