import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio, AspectRatioPresets } from "./aspect-ratio";

const meta = {
  title: "Core/AspectRatio",
  component: AspectRatio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=600&fit=crop"
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={AspectRatioPresets.square}>
        <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)]">
          <span className="text-4xl">1:1</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Video: Story = {
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={AspectRatioPresets.video}>
        <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)]">
          <span className="text-2xl">16:9 Video</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Photo: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={AspectRatioPresets.photo}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={AspectRatioPresets.portrait}>
        <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)]">
          <span className="text-2xl">3:4 Portrait</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const CustomRatio: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={2.5}>
        <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)]">
          <span className="text-2xl">Custom 2.5:1</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[color:var(--color-brand-primary)] to-purple-600">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold">Hero Section</h2>
            <p className="mt-2">Content maintains aspect ratio</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

