"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ActivityFeed,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Carousel,
  Checkbox,
  Label,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Combobox,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  FileUpload,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Input,
  Kbd,
  KbdGroup,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
  MetricCard,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@fragment_ui/ui";
import { Search, Check, Users, TrendingUp } from "lucide-react";

const Slide = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div className="h-64 flex items-center justify-center text-white text-2xl font-normal rounded-lg" style={{ backgroundColor: color }}>
    {children}
  </div>
);

export function ComponentPreviews() {
  const [comboboxValue, setComboboxValue] = useState<string>();
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const sampleActivities = [
    {
      id: "1",
      type: "action" as const,
      title: "John Doe created a new project",
      description: "Project 'Marketing Campaign 2024' was created",
      timestamp: new Date(),
      user: {
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
      },
    },
    {
      id: "2",
      type: "update" as const,
      title: "Jane Smith updated settings",
      description: "Changed notification preferences",
      timestamp: new Date(),
      user: {
        name: "Jane Smith",
        avatar: "https://example.com/avatar2.jpg",
      },
    },
    {
      id: "3",
      type: "comment" as const,
      title: "Mike Johnson commented",
      description: "Great work on the dashboard design!",
      timestamp: new Date(),
      user: {
        name: "Mike Johnson",
      },
    },
  ];

  return (
    <div className="mt-8 space-y-8">
      <h3 className="text-xl font-semibold">Component Previews</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Accordion */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="w-full max-w-md" suppressHydrationWarning>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The Accordion component fully adheres to the WAI-ARIA design pattern, ensuring proper keyboard navigation, focus management, and screen reader support. It includes appropriate ARIA attributes such as <code>aria-expanded</code> and <code>aria-controls</code> to communicate state changes to assistive technologies.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The Accordion comes with carefully crafted default styles that match the Fragment UI design system aesthetic. It uses design tokens for colors, spacing, and typography, ensuring consistent appearance across light and dark themes. The component automatically adapts to your theme settings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The Accordion features smooth, performant animations by default using CSS transitions. The expand and collapse animations are optimized for 60fps performance and follow motion design principles. You can customize or disable animations if needed through CSS overrides or component props.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="w-full max-w-md">
              <ActivityFeed items={sampleActivities} />
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Open Alert</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Avatar */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex gap-4">
              <Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
              <div className="flex gap-2 items-center justify-center">
                <Badge variant="solid" size="sm">Small</Badge>
                <Badge variant="solid" size="md">Medium</Badge>
                <Badge variant="solid" size="lg">Large</Badge>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Badge variant="outline" size="sm">Small</Badge>
                <Badge variant="outline" size="md">Medium</Badge>
                <Badge variant="outline" size="lg">Large</Badge>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Badge variant="subtle" size="sm">Small</Badge>
                <Badge variant="subtle" size="md">Medium</Badge>
                <Badge variant="subtle" size="lg">Large</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
              <div className="flex justify-center">
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Components", href: "/components" },
                    { label: "Breadcrumbs" },
                  ]}
                />
              </div>
              <div className="flex justify-center">
                <Breadcrumbs
                  variant="arrow"
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Documentation", href: "/docs" },
                    { label: "Components", href: "/docs/components" },
                    { label: "Breadcrumbs" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Button variant="solid" size="sm">Small</Button>
                <Button variant="solid" size="md">Medium</Button>
                <Button variant="solid" size="lg">Large</Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="md">Medium</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="font-medium">Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area where you can place any content.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carousel */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="w-full max-w-2xl">
              <Carousel>
                <Slide color="#71717a">Slide 1</Slide>
                <Slide color="#52525b">Slide 2</Slide>
                <Slide color="#3f3f46">Slide 3</Slide>
              </Carousel>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="terms-2" defaultChecked />
                <div className="grid gap-2">
                  <Label htmlFor="terms-2">Accept terms and conditions</Label>
                  <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                    By clicking this checkbox, you agree to the terms and conditions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="toggle" disabled />
                <Label htmlFor="toggle">Enable notifications</Label>
              </div>
              <Label className="hover:bg-[color:var(--color-surface-2)]/50 flex items-start gap-3 rounded-lg border border-[color:var(--color-border-base)] p-3 cursor-pointer">
                <Checkbox id="toggle-2" defaultChecked />
                <div className="grid gap-1.5 font-normal">
                  <Label htmlFor="toggle-2" className="text-sm font-medium leading-none">
                    Enable notifications
                  </Label>
                  <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                    You can enable or disable notifications at any time.
                  </p>
                </div>
              </Label>
            </div>
          </div>
        </div>

        {/* Collapsible */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <Collapsible className="w-full max-w-md">
              <CollapsibleTrigger className="w-full text-left">
                <span className="font-medium">Can I use this in my project?</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Yes. Free to use for personal and commercial projects. No attribution required.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Combobox */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <Combobox
              options={frameworks}
              value={comboboxValue}
              onValueChange={setComboboxValue}
              placeholder="Select framework..."
              searchPlaceholder="Search framework..."
              emptyText="No framework found."
              className="w-[200px]"
            />
          </div>
        </div>

        {/* Command Palette */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <p className="text-sm text-[color:var(--color-fg-muted)] mt-2">
              Click the button or press Cmd+K (Ctrl+K on Windows) to open
            </p>
          </div>
        </div>

        {/* Context Menu */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <ContextMenu>
                  <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
                    Right click here
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Back</ContextMenuItem>
                    <ContextMenuItem disabled>Forward</ContextMenuItem>
                    <ContextMenuItem>Reload</ContextMenuItem>
                    <ContextMenuItem>
                      Print
                      <ContextMenuShortcut>⌘P</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@johndoe" defaultValue="@johndoe" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem disabled>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="w-full max-w-md">
              <FileUpload
                onUpload={(files) => {
                  console.log("Uploaded files:", files);
                }}
              />
            </div>
          </div>
        </div>

        {/* Hover Card */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-4 items-center">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button 
                      type="button"
                      className="text-[color:var(--color-fg-base)] underline"
                    >
                      @fragmentui
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold !mt-0">Fragment UI</h4>
                        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                          @fragmentui
                        </p>
                        <p className="text-sm">
                          Components, icons, colors, and templates for building high-quality, accessible UI. Free and open-source.
                        </p>
                        <div className="flex gap-4 mt-2">
                          <div className="flex gap-1">
                            <span className="text-sm font-semibold">0</span>
                            <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Following</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-sm font-semibold">2,900</span>
                            <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Followers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-8 w-full max-w-md">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <div className="space-y-2">
                  <Input placeholder="Enter your name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <Input placeholder="Disabled input" disabled />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Sizes</p>
                <div className="space-y-2">
                  <Input size="sm" placeholder="Small" />
                  <Input size="md" placeholder="Medium" />
                  <Input size="lg" placeholder="Large" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Icons</p>
                <div className="space-y-2">
                  <Input size="sm" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
                  <Input size="sm" trailingIcon={<Check className="h-4 w-4" />} placeholder="With trailing icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kbd */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-4 items-center">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <div className="flex items-center gap-4">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>B</Kbd>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Group</p>
                <div className="flex flex-col gap-4">
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <span>+</span>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <span>+</span>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-6 w-full max-w-md">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" type="text" defaultValue="Pedro Duarte" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Required</p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-[color:var(--color-status-error-fg)]">*</span>
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Disabled</p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="disabled">Disabled field</Label>
                  <Input id="disabled" type="text" defaultValue="Disabled input" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menubar */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem shortcut="⌘N">New File</MenubarItem>
                  <MenubarItem shortcut="⌘O">Open</MenubarItem>
                  <MenubarItem shortcut="⌘S">Save</MenubarItem>
                  <MenubarItem shortcut="⌘⇧S">Save As...</MenubarItem>
                  <MenubarItem>Exit</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
                  <MenubarItem shortcut="⌘⇧Z">Redo</MenubarItem>
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
                  <MenubarLabel>Theme</MenubarLabel>
                  <MenubarRadioGroup value="light">
                    <MenubarRadioItem value="light">Light</MenubarRadioItem>
                    <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                    <MenubarRadioItem value="system">System</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        {/* Metric Card */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
            <div className="flex flex-col gap-8 w-full max-w-md">
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
                <MetricCard title="Total Revenue" value="$45,231" description="From last month" />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Trend Badge</p>
                <MetricCard
                  title="New Subscriptions"
                  value="4,682"
                  description="Since Last week"
                  trend="up"
                  trendValue="+15.54%"
                  icon={<Users className="h-4 w-4" />}
                  footerPlacement="content"
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Icon</p>
                <MetricCard
                  title="Total Revenue"
                  value="$15,231.89"
                  description="Since Last week"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="group relative flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
          <div className="preview flex w-full justify-center items-start min-h-[400px] pt-8 px-10 pb-10">
            <div className="w-full max-w-4xl flex justify-center">
              <NavigationMenu viewport={false} className="!justify-center !ml-0">
                <NavigationMenuList className="!ml-0">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <a href="#">Components</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <a href="#">Blocks</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Docs
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[500px] px-2 py-1.5">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="min-w-0">
                            <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0" style={{ paddingLeft: 0 }}>
                              <li>
                                <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                  <a href="#">
                                    <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                      Design Tokens
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                      Learn about design tokens and how to use them in your projects.
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                              <li>
                                <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                  <a href="#">
                                    <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                      Theming &amp; Modes
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                      Configure themes and support for light and dark modes.
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            </ul>
                          </div>
                          <div className="min-w-0">
                            <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0" style={{ paddingLeft: 0 }}>
                              <li>
                                <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                  <a href="#">
                                    <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                      Examples
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                      Browse code examples and implementation patterns.
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                              <li>
                                <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                  <a href="#">
                                    <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                      API Reference
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                      Complete API documentation and type definitions.
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
