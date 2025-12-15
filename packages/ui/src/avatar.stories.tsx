import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: "User",
    fallback: "U",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "User",
  },
};

export const WithFallback: Story = {
  args: {
    alt: "John Doe",
    fallback: "JD",
  },
};

