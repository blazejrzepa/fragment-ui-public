import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "./command-palette";
import { Search, Settings, User, File, Folder, Plus } from "lucide-react";

const meta: Meta<typeof CommandPalette> = {
  title: "Core/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const basicActions = [
  {
    id: "search",
    label: "Search",
    icon: <Search className="w-4 h-4" />,
    onSelect: () => console.log("Search"),
    group: "Actions",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    onSelect: () => console.log("Settings"),
    group: "Actions",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="w-4 h-4" />,
    onSelect: () => console.log("Profile"),
    group: "Account",
  },
];

const actionsWithNested = [
  {
    id: "new",
    label: "New",
    icon: <Plus className="w-4 h-4" />,
    group: "File",
    children: [
      {
        id: "new-file",
        label: "File",
        icon: <File className="w-4 h-4" />,
        onSelect: () => console.log("New File"),
        group: "File",
      },
      {
        id: "new-folder",
        label: "Folder",
        icon: <Folder className="w-4 h-4" />,
        onSelect: () => console.log("New Folder"),
        group: "File",
      },
    ],
  },
  {
    id: "search",
    label: "Search",
    icon: <Search className="w-4 h-4" />,
    onSelect: () => console.log("Search"),
    group: "Actions",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    onSelect: () => console.log("Settings"),
    group: "Actions",
  },
];

export const Default: Story = {
  render: () => <CommandPalette actions={basicActions} />,
};

export const WithNestedCommands: Story = {
  render: () => <CommandPalette actions={actionsWithNested} />,
};

export const WithRecentCommands: Story = {
  render: () => (
    <CommandPalette
      actions={basicActions}
      showRecentCommands
      maxRecentCommands={3}
    />
  ),
};

export const WithoutRecentCommands: Story = {
  render: () => (
    <CommandPalette actions={basicActions} showRecentCommands={false} />
  ),
};

export const CustomTrigger: Story = {
  render: () => (
    <CommandPalette
      actions={basicActions}
      trigger={
        <button className="px-4 py-2 rounded bg-brand text-white">
          Open Command Palette
        </button>
      }
    />
  ),
};
