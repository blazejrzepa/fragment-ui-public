import type { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./hover-card";
import { Avatar } from "./avatar";

const meta: Meta<typeof HoverCard> = {
  title: "Core/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-[color:var(--color-brand-primary)] hover:underline">
          @username
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-4">
          <Avatar />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@username</h4>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Full name
            </p>
            <p className="text-sm">
              A brief description of the user goes here.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar className="cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-4">
          <Avatar />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">John Doe</h4>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              @johndoe
            </p>
            <p className="text-sm">
              Software engineer passionate about design systems.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};


