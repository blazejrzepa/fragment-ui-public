import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Core/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" />
      <label htmlFor="notifications" className="text-sm">
        Enable notifications
      </label>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Email notifications</label>
          <p className="text-xs text-[color:var(--color-fg-muted)]">Receive email updates</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Push notifications</label>
          <p className="text-xs text-[color:var(--color-fg-muted)]">Receive push updates</p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Dark mode</label>
          <p className="text-xs text-[color:var(--color-fg-muted)]">Use dark theme</p>
        </div>
        <Switch />
      </div>
    </div>
  ),
};

