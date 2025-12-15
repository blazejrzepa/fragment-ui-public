import type { Meta, StoryObj } from "@storybook/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "Core/Menubar",
  component: Menubar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘N">New File</MenubarItem>
          <MenubarItem shortcut="⌘O">Open</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘S">Save</MenubarItem>
          <MenubarItem shortcut="⌘⇧S">Save As...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
          <MenubarItem shortcut="⌘⇧Z">Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘X">Cut</MenubarItem>
          <MenubarItem shortcut="⌘C">Copy</MenubarItem>
          <MenubarItem shortcut="⌘V">Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Theme</MenubarLabel>
          <MenubarRadioGroup value="light">
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithSubmenus: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘N">New File</MenubarItem>
          <MenubarItem shortcut="⌘O">Open</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Recent Files</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>document1.txt</MenubarItem>
              <MenubarItem>document2.txt</MenubarItem>
              <MenubarItem>document3.txt</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘S">Save</MenubarItem>
          <MenubarItem shortcut="⌘⇧S">Save As...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
          <MenubarItem shortcut="⌘⇧Z">Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem shortcut="⌘F">Find...</MenubarItem>
              <MenubarItem shortcut="⌘⇧F">Find in Files...</MenubarItem>
              <MenubarItem shortcut="⌘G">Find Next</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘X">Cut</MenubarItem>
          <MenubarItem shortcut="⌘C">Copy</MenubarItem>
          <MenubarItem shortcut="⌘V">Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Minimap</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarItem shortcut="⌘+">Zoom In</MenubarItem>
          <MenubarItem shortcut="⌘-">Zoom Out</MenubarItem>
          <MenubarItem shortcut="⌘0">Reset Zoom</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const ApplicationMenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘N">New</MenubarItem>
          <MenubarItem shortcut="⌘O">Open...</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>project-1</MenubarItem>
              <MenubarItem>project-2</MenubarItem>
              <MenubarItem>project-3</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘S">Save</MenubarItem>
          <MenubarItem shortcut="⌘⇧S">Save As...</MenubarItem>
          <MenubarItem shortcut="⌘W">Close</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘P">Print...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Quit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
          <MenubarItem shortcut="⌘⇧Z">Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘X">Cut</MenubarItem>
          <MenubarItem shortcut="⌘C">Copy</MenubarItem>
          <MenubarItem shortcut="⌘V">Paste</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘A">Select All</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem shortcut="⌘F">Find...</MenubarItem>
              <MenubarItem shortcut="⌘⇧F">Find and Replace...</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Minimap</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Appearance</MenubarLabel>
          <MenubarRadioGroup value="dark">
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarItem shortcut="⌘+">Zoom In</MenubarItem>
          <MenubarItem shortcut="⌘-">Zoom Out</MenubarItem>
          <MenubarItem shortcut="⌘0">Reset Zoom</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

