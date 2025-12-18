"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import clsx from "clsx";

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={clsx(
      "flex h-10 items-center space-x-[var(--space-1)] rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] p-[var(--space-1)]",
      className
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarMenu = MenubarPrimitive.Menu as typeof MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group as typeof MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal as typeof MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub as typeof MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup as typeof MenubarPrimitive.RadioGroup;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={clsx(
      "flex cursor-default select-none items-center rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-1-5)] text-sm font-medium outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] data-[state=open]:bg-[color:var(--color-surface-2)] data-[state=open]:text-[color:var(--color-fg-base)]",
      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={clsx(
      "flex cursor-default select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-sm outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] data-[state=open]:bg-[color:var(--color-surface-2)] data-[state=open]:text-[color:var(--color-fg-base)]",
      inset && "pl-[var(--space-8)]",
      className
    )}
    {...props}
  >
    {children}
    <span className="ml-auto">▶</span>
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={clsx(
      "z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] p-[var(--space-1)] text-[color:var(--color-fg-base)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={clsx(
        "z-50 min-w-[12rem] overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] p-[var(--space-1)] text-[color:var(--color-fg-base)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
    shortcut?: string;
  }
>(({ className, inset, shortcut, children, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={clsx(
      "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-sm outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-[var(--space-8)]",
      className
    )}
    {...props}
  >
    {children}
    {shortcut && (
      <span className="ml-auto text-xs tracking-widest text-[color:var(--color-fg-muted)]">
        {shortcut}
      </span>
    )}
  </MenubarPrimitive.Item>
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={clsx(
      "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] py-[var(--space-1-5)] pl-[var(--space-8)] pr-[var(--space-2)] text-sm outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-[var(--space-2)] flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <span className="h-4 w-4">✓</span>
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={clsx(
      "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] py-[var(--space-1-5)] pl-[var(--space-8)] pr-[var(--space-2)] text-sm outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-[var(--space-2)] flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <span className="h-2 w-2 rounded-full bg-[color:var(--color-brand-primary)]" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={clsx("px-[var(--space-2)] py-[var(--space-1-5)] text-sm font-semibold", inset && "pl-[var(--space-8)]", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={clsx("-mx-[var(--space-1)] my-[var(--space-1)] h-px bg-[color:var(--color-border-base)]", className)}
    {...props}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarGroup,
  MenubarPortal,
  MenubarRadioGroup,
};

