"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { AppShell } from "@fragment_ui/blocks";
import { Avatar, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ThemeToggle } from "../theme-provider";
import { InteractiveLogo } from "../interactive-logo";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Bell, 
  Package,
  CheckSquare,
  Menu,
  MoreHorizontal,
  Moon,
  Sun,
  User,
  LogOut,
  Grid3x3,
  ChevronDown,
  X,
  Inbox,
  Sparkles,
  Component,
  Plug2,
  Receipt
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  /**
   * When true, use container-friendly sizing (no 100vw/h-screen)
   */
  embedded?: boolean;
  /**
   * Optional fixed height for embedded usage (e.g. homepage preview)
   */
  height?: number | string;
}

export function AdminLayout({
  children,
  embedded = false,
  height,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [layoutReady, setLayoutReady] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(
    pathname?.startsWith("/admin/settings") || false
  );
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent));
  }, []);

  React.useEffect(() => {
    setSettingsOpen(pathname?.startsWith("/admin/settings") || false);
  }, [pathname]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setSidebarOpen(false);
    };
    handler();
    mq.addEventListener("change", handler);
    setLayoutReady(true);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!layoutReady) {
    return null;
  }

  // Sidebar content
  const sidebarContent = (
    <nav className="space-y-6">
      {/* General Section */}
      <div>
        <div className="px-3 mb-2 text-xs font-medium text-[color:var(--foreground-secondary)]">
          General
        </div>
        <div className="space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/inbox"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/inbox"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Link>
          <Link
            href="/admin/tasks"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/tasks"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link
            href="/admin/customers"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/customers"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/employees"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/employees"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Employees</span>
          </Link>
        </div>
      </div>

      {/* Pages Section */}
      <div>
        <div className="px-3 mb-2 text-xs font-medium text-[color:var(--foreground-secondary)]">
          Pages
        </div>
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/products"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/projects"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/projects"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Projects</span>
          </Link>
          <Link
            href="/admin/fragment-ai"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/fragment-ai"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Copilot AI</span>
          </Link>
          <Link
            href="/admin/apps"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/apps"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            <span>Apps</span>
          </Link>
          <Link
            href="/admin/integrations"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/integrations"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Plug2 className="h-4 w-4" />
            <span>Integrations</span>
          </Link>
          <Link
            href="/admin/invoice"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/invoice"
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Invoice</span>
          </Link>
        </div>
      </div>

      {/* Other Section */}
      <div>
        <div className="px-3 mb-2 text-xs font-medium text-[color:var(--foreground-secondary)]">
          Other
        </div>
        <div className="space-y-1">
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger
              className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md text-sm ${
                pathname?.startsWith("/admin/settings")
                  ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                  : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
              }`}
              showIcon={true}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1 mt-1">
              <Link
                href="/admin/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname === "/admin/settings"
                    ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                    : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
                }`}
              >
                <span>General</span>
              </Link>
              <Link
                href="/admin/settings/security"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname === "/admin/settings/security"
                    ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                    : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
                }`}
              >
                <span>Security</span>
              </Link>
              <Link
                href="/admin/settings/billing"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname === "/admin/settings/billing"
                    ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                    : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
                }`}
              >
                <span>Billing</span>
              </Link>
              <Link
                href="/admin/settings/team"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  pathname === "/admin/settings/team"
                    ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]"
                    : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)]"
                }`}
              >
                <span>Team</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </nav>
  );

  const handleOpenDashboard = () => {
    window.location.href = "/admin";
  };

  const sidebarHeader = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] shadow-sm transition-colors hover:bg-[color:var(--color-surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Go to homepage"
        >
            <Component className="h-4 w-4" strokeWidth={1.4} />
        </Link>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold">Acme</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Admin dashboard menu">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={handleOpenDashboard}>Open dashboard</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => navigator.clipboard?.writeText(window.location.origin + "/admin")}
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (window.location.href = "/admin/settings")}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const sidebarFooter = (
    <div className="flex items-center gap-3">
      <Avatar fallback="AD" className="h-8 w-8" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">Admin User</div>
        <div className="text-xs text-[color:var(--color-fg-muted)] truncate">admin@example.com</div>
      </div>
    </div>
  );

  // Header actions embedded (desktop + mobile)
  const header = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {!isDesktop && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] shadow-sm">
          <Component className="h-4 w-4" strokeWidth={1.4} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold">Acme Inc.</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <Avatar fallback="AD" className="h-8 w-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height || undefined;

  const rootStyle: React.CSSProperties = embedded
    ? {
        width: "100%",
        // Don't set minHeight in embedded mode - let it be dynamic
      }
    : { 
        width: "100%",
        overflowX: "hidden",
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        position: "relative"
      };

  return (
    <div style={rootStyle} className={clsx(embedded ? "w-full" : "flex flex-col min-h-[calc(100vh+10px)] lg:min-h-[calc(100vh+70px)] bg-[color:var(--background-primary)]", "m-0 p-0")}>
        <AppShell
        sidebar={isDesktop ? sidebarContent : undefined}
        sidebarHeader={isDesktop ? sidebarHeader : undefined}
        sidebarFooter={isDesktop ? sidebarFooter : undefined}
        header={isDesktop ? undefined : header}
        contentClassName="p-6 min-w-0 w-full"
        className={clsx(embedded ? "rounded-2xl w-full" : "")}
      >
        {children}
      </AppShell>

      {!isDesktop && sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-72 bg-[color:var(--background-primary)] border-r border-[color:var(--color-border-base)] shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-border-base)]">
              <div className="font-semibold text-sm">Menu</div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
            {sidebarFooter && (
              <div className="border-t border-[color:var(--color-border-base)] p-4">
                {sidebarFooter}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

