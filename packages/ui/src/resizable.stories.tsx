import type { Meta, StoryObj } from "@storybook/react";
import { Resizable, ResizableHandle, ResizablePanel } from "./resizable";

const meta = {
  title: "Core/Resizable",
  component: Resizable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[600px]">
      <Resizable direction="horizontal" className="min-h-[200px] rounded-lg border border-[color:var(--color-fg-muted)]">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 1</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 2</span>
          </div>
        </ResizablePanel>
      </Resizable>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-[600px]">
      <Resizable direction="vertical" className="min-h-[400px] rounded-lg border border-[color:var(--color-fg-muted)]">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Top Panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Bottom Panel</span>
          </div>
        </ResizablePanel>
      </Resizable>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div className="w-[800px]">
      <Resizable direction="horizontal" className="min-h-[200px] rounded-lg border border-[color:var(--color-fg-muted)]">
        <ResizablePanel defaultSize={33}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 1</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={33}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 2</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={34}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 3</span>
          </div>
        </ResizablePanel>
      </Resizable>
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div className="w-[600px]">
      <Resizable direction="horizontal" className="min-h-[200px] rounded-lg border border-[color:var(--color-fg-muted)]">
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Min 20% - Max 80%</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel 2</span>
          </div>
        </ResizablePanel>
      </Resizable>
    </div>
  ),
};

