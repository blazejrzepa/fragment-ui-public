"use client";

import * as React from "react";
import * as Vaul from "vaul";
import clsx from "clsx";

// Sidebar Provider & Context
const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export interface SidebarProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "left" | "right" | "top" | "bottom";
}

const Sidebar = React.forwardRef<
  React.ElementRef<typeof Vaul.Drawer.Root>,
  SidebarProps
>(function Sidebar({ children, open: controlledOpen, onOpenChange: controlledOnOpenChange, direction = "left", ...props }, ref) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <Vaul.Drawer.Root
        ref={ref as any}
        open={open}
        onOpenChange={setOpen}
        direction={direction}
        {...(props as any)}
      >
        {children}
      </Vaul.Drawer.Root>
    </SidebarContext.Provider>
  );
});
Sidebar.displayName = "Sidebar";

export interface SidebarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Vaul.Drawer.Trigger> {}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Vaul.Drawer.Trigger>,
  SidebarTriggerProps
>(function SidebarTrigger({ className, ...props }, ref) {
  return (
    <Vaul.Drawer.Trigger
      ref={ref}
      className={clsx("", className)}
      {...props}
    />
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export interface SidebarContentProps
  extends React.ComponentPropsWithoutRef<typeof Vaul.Drawer.Content> {
  children: React.ReactNode;
}

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof Vaul.Drawer.Content>,
  SidebarContentProps
>(function SidebarContent({ className, children, ...props }, ref) {
  return (
    <Vaul.Drawer.Content
      ref={ref}
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[color:var(--background-primary)] border-r border-[color:var(--color-border-base)] flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </Vaul.Drawer.Content>
  );
});
SidebarContent.displayName = "SidebarContent";

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  function SidebarHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-2 p-4", className)}
        {...props}
      />
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-2 p-4 border-t border-[color:var(--color-border-base)]", className)}
        {...props}
      />
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-1 px-2 py-2", className)}
        {...props}
      />
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  function SidebarGroupLabel({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx(
          "px-2 py-1 text-xs font-semibold text-[color:var(--color-fg-muted)] uppercase tracking-wider",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarGroupContent = React.forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  function SidebarGroupContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-1", className)}
        {...props}
      />
    );
  }
);
SidebarGroupContent.displayName = "SidebarGroupContent";

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  function SidebarMenu({ className, ...props }, ref) {
    return (
      <ul
        ref={ref}
        className={clsx("flex flex-col gap-1", className)}
        {...props}
      />
    );
  }
);
SidebarMenu.displayName = "SidebarMenu";

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  function SidebarMenuItem({ className, ...props }, ref) {
    return (
      <li
        ref={ref}
        className={clsx("", className)}
        {...props}
      />
    );
  }
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ className, isActive, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={clsx(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-brand-primary)]"
            : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)]",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};

