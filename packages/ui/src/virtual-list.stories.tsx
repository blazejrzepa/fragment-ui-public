import type { Meta, StoryObj } from "@storybook/react";
import { VirtualList } from "./virtual-list";
import { Card, CardContent } from "./card";

const meta = {
  title: "Core/VirtualList",
  component: VirtualList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VirtualList<number>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate large dataset
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => i + 1);
};

export const Default: Story = {
  render: () => {
    const items = generateItems(1000);
    return (
      <div className="w-[400px]">
        <VirtualList
          items={items}
          itemHeight={40}
          containerHeight={400}
          renderItem={(item, index) => (
            <div className="p-2 border-b border-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)]">
              Item {item} (index {index})
            </div>
          )}
        />
      </div>
    );
  },
};

export const WithCards: Story = {
  render: () => {
    const items = generateItems(500);
    return (
      <div className="w-[600px]">
        <VirtualList
          items={items}
          itemHeight={120}
          containerHeight={500}
          renderItem={(item) => (
            <Card className="m-2">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Card {item}</h3>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  This is a virtualized card item. Only visible items are rendered.
                </p>
              </CardContent>
            </Card>
          )}
        />
      </div>
    );
  },
};

export const VariableHeight: Story = {
  render: () => {
    const items = generateItems(1000);
    return (
      <div className="w-[400px]">
        <VirtualList
          items={items}
          itemHeight={(index) => {
            // Variable height: every 5th item is taller
            return index % 5 === 0 ? 80 : 40;
          }}
          containerHeight={400}
          renderItem={(item, index) => (
            <div
              className={`p-2 border-b border-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)] ${
                index % 5 === 0 ? "h-20" : "h-10"
              }`}
            >
              Item {item} {index % 5 === 0 && "(Tall item)"}
            </div>
          )}
        />
      </div>
    );
  },
};

export const Performance: Story = {
  render: () => {
    const items = generateItems(10000);
    return (
      <div className="w-[500px]">
        <div className="mb-4 text-sm text-[color:var(--color-fg-muted)]">
          Rendering 10,000 items with virtual scrolling
        </div>
        <VirtualList
          items={items}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div className="p-3 border-b border-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)]">
              <div className="font-medium">Item {item}</div>
              <div className="text-sm text-[color:var(--color-fg-muted)]">
                Only visible items are rendered
              </div>
            </div>
          )}
        />
      </div>
    );
  },
};

