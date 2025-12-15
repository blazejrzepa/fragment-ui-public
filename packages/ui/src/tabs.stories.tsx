import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Input } from "./input";

const meta: Meta<typeof Tabs> = {
  title: "Core/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  ),
};

export const WithForms: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="space-y-2">
          <Input placeholder="Name" />
          <Input placeholder="Email" type="email" />
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="space-y-2">
          <p>Settings content</p>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="space-y-2">
          <p>Security settings</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList className="overflow-x-auto">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Details</TabsTrigger>
        <TabsTrigger value="tab3">Reviews</TabsTrigger>
        <TabsTrigger value="tab4">Settings</TabsTrigger>
        <TabsTrigger value="tab5">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Overview content</TabsContent>
      <TabsContent value="tab2">Details content</TabsContent>
      <TabsContent value="tab3">Reviews content</TabsContent>
      <TabsContent value="tab4">Settings content</TabsContent>
      <TabsContent value="tab5">Advanced content</TabsContent>
    </Tabs>
  ),
};

export const Pills: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="pills">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="underline">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  ),
};

export const Boxed: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="boxed">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tabs defaultValue="tab1" className="flex gap-4">
        <TabsList variant="default" orientation="vertical">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <div>
          <TabsContent value="tab1">Content for tab 1</TabsContent>
          <TabsContent value="tab2">Content for tab 2</TabsContent>
          <TabsContent value="tab3">Content for tab 3</TabsContent>
        </div>
      </Tabs>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1" icon="📊">Overview</TabsTrigger>
        <TabsTrigger value="tab2" icon="⚙️">Settings</TabsTrigger>
        <TabsTrigger value="tab3" icon="🔒">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Overview content</TabsContent>
      <TabsContent value="tab2">Settings content</TabsContent>
      <TabsContent value="tab3">Security content</TabsContent>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1" badge={<span className="rounded-full bg-[color:var(--color-brand-primary)] text-white text-xs px-1.5 py-0.5">3</span>}>
          Inbox
        </TabsTrigger>
        <TabsTrigger value="tab2" badge={<span className="rounded-full bg-[color:var(--color-brand-primary)] text-white text-xs px-1.5 py-0.5">12</span>}>
          Messages
        </TabsTrigger>
        <TabsTrigger value="tab3">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Inbox content with 3 new messages</TabsContent>
      <TabsContent value="tab2">Messages content with 12 unread</TabsContent>
      <TabsContent value="tab3">Archive content</TabsContent>
    </Tabs>
  ),
};

