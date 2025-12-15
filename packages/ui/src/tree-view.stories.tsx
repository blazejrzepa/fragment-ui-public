import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TreeView, TreeNode } from "./tree-view";
import { Folder, File, Image, Music, Video, FileText } from "lucide-react";

const { useState } = React;

const meta: Meta<typeof TreeView> = {
  title: "Core/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const sampleTree: TreeNode[] = [
  {
    id: "1",
    label: "Documents",
    icon: <Folder className="h-4 w-4" />,
    children: [
      {
        id: "1-1",
        label: "Projects",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "1-1-1", label: "project-1.pdf", icon: <FileText className="h-4 w-4" /> },
          { id: "1-1-2", label: "project-2.pdf", icon: <FileText className="h-4 w-4" /> },
        ],
      },
      {
        id: "1-2",
        label: "Reports",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "1-2-1", label: "report-2024.pdf", icon: <FileText className="h-4 w-4" /> },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Media",
    icon: <Folder className="h-4 w-4" />,
    children: [
      {
        id: "2-1",
        label: "Images",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "2-1-1", label: "photo-1.jpg", icon: <Image className="h-4 w-4" /> },
          { id: "2-1-2", label: "photo-2.png", icon: <Image className="h-4 w-4" /> },
        ],
      },
      {
        id: "2-2",
        label: "Music",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "2-2-1", label: "song-1.mp3", icon: <Music className="h-4 w-4" /> },
          { id: "2-2-2", label: "song-2.mp3", icon: <Music className="h-4 w-4" /> },
        ],
      },
      {
        id: "2-3",
        label: "Videos",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "2-3-1", label: "video-1.mp4", icon: <Video className="h-4 w-4" /> },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "Other",
    icon: <Folder className="h-4 w-4" />,
    children: [
      { id: "3-1", label: "readme.txt", icon: <File className="h-4 w-4" /> },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    return (
      <div className="p-4">
        <TreeView
          nodes={sampleTree}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    );
  },
};

export const WithCheckboxes: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    return (
      <div className="p-4">
        <TreeView
          nodes={sampleTree}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
          showCheckboxes
        />
        <div className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
          Selected: {selectedIds.join(", ") || "None"}
        </div>
      </div>
    );
  },
};

export const DefaultExpanded: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    return (
      <div className="p-4">
        <TreeView
          nodes={sampleTree}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          defaultExpanded
        />
      </div>
    );
  },
};

export const WithoutIcons: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    return (
      <div className="p-4">
        <TreeView
          nodes={sampleTree}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
          showIcons={false}
        />
      </div>
    );
  },
};

export const WithCallbacks: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [lastClicked, setLastClicked] = useState<string>("");
    const [lastDoubleClicked, setLastDoubleClicked] = useState<string>("");

    return (
      <div className="p-4 space-y-4">
        <TreeView
          nodes={sampleTree}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
          onNodeClick={(node) => setLastClicked(node.label)}
          onNodeDoubleClick={(node) => setLastDoubleClicked(node.label)}
        />
        <div className="text-sm space-y-1">
          <div>Last clicked: {lastClicked || "None"}</div>
          <div>Last double-clicked: {lastDoubleClicked || "None"}</div>
        </div>
      </div>
    );
  },
};

export const LargeTree: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const largeTree: TreeNode[] = Array.from({ length: 10 }, (_, i) => ({
      id: `folder-${i}`,
      label: `Folder ${i + 1}`,
      icon: <Folder className="h-4 w-4" />,
      children: Array.from({ length: 5 }, (_, j) => ({
        id: `folder-${i}-file-${j}`,
        label: `File ${i + 1}-${j + 1}.txt`,
        icon: <File className="h-4 w-4" />,
      })),
    }));

    return (
      <div className="p-4">
        <TreeView
          nodes={largeTree}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
          showCheckboxes
        />
      </div>
    );
  },
};

export const DisabledNodes: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const treeWithDisabled: TreeNode[] = [
      {
        id: "1",
        label: "Enabled Folder",
        icon: <Folder className="h-4 w-4" />,
        children: [
          { id: "1-1", label: "Enabled File", icon: <File className="h-4 w-4" /> },
          { id: "1-2", label: "Disabled File", icon: <File className="h-4 w-4" />, disabled: true },
        ],
      },
      {
        id: "2",
        label: "Disabled Folder",
        icon: <Folder className="h-4 w-4" />,
        disabled: true,
        children: [
          { id: "2-1", label: "Child File", icon: <File className="h-4 w-4" /> },
        ],
      },
    ];

    return (
      <div className="p-4">
        <TreeView
          nodes={treeWithDisabled}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          onExpansionChange={setExpandedIds}
          onSelectionChange={setSelectedIds}
          showCheckboxes
        />
      </div>
    );
  },
};

