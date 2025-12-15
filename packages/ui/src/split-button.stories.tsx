import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./split-button";
import { Download, Save, Share2, Trash2, Edit, Copy } from "lucide-react";

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primaryAction: {
      label: "Save",
      onClick: () => console.log("Save clicked"),
    },
    options: [
      {
        label: "Save As",
        onClick: () => console.log("Save As clicked"),
      },
      {
        label: "Save All",
        onClick: () => console.log("Save All clicked"),
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    primaryAction: {
      label: "Download",
      onClick: () => console.log("Download clicked"),
      icon: <Download className="h-4 w-4" />,
    },
    options: [
      {
        label: "Save",
        onClick: () => console.log("Save clicked"),
        icon: <Save className="h-4 w-4" />,
      },
      {
        label: "Share",
        onClick: () => console.log("Share clicked"),
        icon: <Share2 className="h-4 w-4" />,
      },
    ],
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    primaryAction: {
      label: "Edit",
      onClick: () => console.log("Edit clicked"),
      icon: <Edit className="h-4 w-4" />,
    },
    options: [
      {
        label: "Copy",
        onClick: () => console.log("Copy clicked"),
        icon: <Copy className="h-4 w-4" />,
      },
      {
        label: "Delete",
        onClick: () => console.log("Delete clicked"),
        icon: <Trash2 className="h-4 w-4" />,
      },
    ],
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    primaryAction: {
      label: "Share",
      onClick: () => console.log("Share clicked"),
    },
    options: [
      {
        label: "Copy Link",
        onClick: () => console.log("Copy Link clicked"),
      },
      {
        label: "Email",
        onClick: () => console.log("Email clicked"),
      },
    ],
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-600 mb-2">Small</p>
        <SplitButton
          size="sm"
          primaryAction={{
            label: "Save",
            onClick: () => console.log("Save clicked"),
          }}
          options={[
            { label: "Save As", onClick: () => {} },
            { label: "Save All", onClick: () => {} },
          ]}
        />
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-2">Medium (default)</p>
        <SplitButton
          size="md"
          primaryAction={{
            label: "Save",
            onClick: () => console.log("Save clicked"),
          }}
          options={[
            { label: "Save As", onClick: () => {} },
            { label: "Save All", onClick: () => {} },
          ]}
        />
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-2">Large</p>
        <SplitButton
          size="lg"
          primaryAction={{
            label: "Save",
            onClick: () => console.log("Save clicked"),
          }}
          options={[
            { label: "Save As", onClick: () => {} },
            { label: "Save All", onClick: () => {} },
          ]}
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    primaryAction: {
      label: "Save",
      onClick: () => console.log("Save clicked"),
    },
    options: [
      {
        label: "Save As",
        onClick: () => console.log("Save As clicked"),
      },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    primaryAction: {
      label: "Save",
      onClick: () => console.log("Save clicked"),
    },
    options: [
      {
        label: "Save As",
        onClick: () => console.log("Save As clicked"),
      },
      {
        label: "Save All",
        onClick: () => console.log("Save All clicked"),
        disabled: true,
      },
    ],
  },
};

export const MultipleOptions: Story = {
  args: {
    primaryAction: {
      label: "Export",
      onClick: () => console.log("Export clicked"),
    },
    options: [
      {
        label: "Export as PDF",
        onClick: () => console.log("Export as PDF clicked"),
      },
      {
        label: "Export as CSV",
        onClick: () => console.log("Export as CSV clicked"),
      },
      {
        label: "Export as Excel",
        onClick: () => console.log("Export as Excel clicked"),
      },
      {
        label: "Export as JSON",
        onClick: () => console.log("Export as JSON clicked"),
      },
    ],
  },
};

