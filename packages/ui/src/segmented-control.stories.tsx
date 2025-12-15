import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./segmented-control";
import { List, Grid, Calendar, Filter } from "lucide-react";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "filled"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    multiple: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: "list", label: "List" },
      { value: "grid", label: "Grid" },
      { value: "calendar", label: "Calendar" },
    ],
    defaultValue: "list",
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
      { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
      { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
    ],
    defaultValue: "list",
  },
};

export const Outline: Story = {
  args: {
    options: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
    ],
    variant: "outline",
    defaultValue: "all",
  },
};

export const Filled: Story = {
  args: {
    options: [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ],
    variant: "filled",
    defaultValue: "day",
  },
};

export const Multiple: Story = {
  args: {
    options: [
      { value: "filter1", label: "Filter 1", icon: <Filter className="h-4 w-4" /> },
      { value: "filter2", label: "Filter 2", icon: <Filter className="h-4 w-4" /> },
      { value: "filter3", label: "Filter 3", icon: <Filter className="h-4 w-4" /> },
    ],
    multiple: true,
    defaultValue: ["filter1"],
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
        ]}
        size="sm"
        defaultValue="sm"
      />
      <SegmentedControl
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
        ]}
        size="md"
        defaultValue="sm"
      />
      <SegmentedControl
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
        ]}
        size="lg"
        defaultValue="sm"
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
      { value: "option3", label: "Option 3" },
    ],
    defaultValue: "option1",
  },
};

export const DisabledControl: Story = {
  args: {
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    defaultValue: "option1",
    disabled: true,
  },
};

