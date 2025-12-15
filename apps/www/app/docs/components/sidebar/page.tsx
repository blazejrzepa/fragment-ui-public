"use client";

import dynamic from "next/dynamic";
import { DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

// Sidebar uses Vaul.Drawer which requires document, so disable SSR
const SidebarExample = dynamic(
  () =>
    import("@fragment_ui/ui").then((mod) => {
      const {
        Sidebar,
        SidebarContent,
        SidebarFooter,
        SidebarGroup,
        SidebarGroupContent,
        SidebarGroupLabel,
        SidebarHeader,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuButton,
      } = mod;
      return function SidebarExampleComponent() {
        return (
          <Sidebar>
            <SidebarHeader>
              <div className="px-2 py-2">
                <h2 className="text-lg font-semibold">Sidebar Header</h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <mod.SidebarMenuButton>Home</mod.SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <mod.SidebarMenuButton>Settings</mod.SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-2 py-2">
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Footer content
                </p>
              </div>
            </SidebarFooter>
          </Sidebar>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="border border-[color:var(--color-border-base)] rounded-lg p-4 min-h-[200px] flex items-center justify-center">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Loading sidebar...</p>
      </div>
    ),
  }
);


export default function SidebarPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="sidebar">Sidebar</h1>
      </div>
      <p className="mb-6 intro-text">
        Sidebar component for creating collapsible side navigation panels. Built
        with Radix UI and Vaul for smooth animations and accessibility.
      </p>
      
      <div className="space-y-4 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Sidebar</h3>
          <div className="border border-[color:var(--color-border-base)] rounded-lg p-4">
          </div>
        </div>
      </div>

      
      
      <h2 id="install">Install</h2>
      <pre>
        <code>npx shadcn@latest add /r/sidebar.json</code>
      </pre>
      <h2 id="code-examples">Code Examples</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, DocumentContent } from "@fragment_ui/ui";

<Sidebar>
  <SidebarHeader>
    <h2>Header</h2>
  </SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Home</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>
    <p>Footer</p>
  </SidebarFooter>
</Sidebar>

// Note: Sidebar uses Vaul.Drawer which requires browser APIs.
// For Next.js SSR, wrap Sidebar in dynamic import with ssr: false:
import dynamic from "next/dynamic";
const ClientSidebar = dynamic(() => import("@fragment_ui/ui").then(mod => mod.Sidebar), { ssr: false });`}</code>
      </pre>

      <h2 id="components">Components</h2>
      <ul>
        <li>
          <strong>Sidebar</strong> - Root component that wraps all sidebar
          content
        </li>
        <li>
          <strong>SidebarTrigger</strong> - Button to toggle sidebar visibility
        </li>
        <li>
          <strong>SidebarHeader</strong> - Header section of the sidebar
        </li>
        <li>
          <strong>SidebarContent</strong> - Main content area of the sidebar
        </li>
        <li>
          <strong>SidebarFooter</strong> - Footer section of the sidebar
        </li>
        <li>
          <strong>SidebarGroup</strong> - Container for grouping sidebar items
        </li>
        <li>
          <strong>SidebarGroupLabel</strong> - Label for a sidebar group
        </li>
        <li>
          <strong>SidebarGroupContent</strong> - Content container for a sidebar
          group
        </li>
        <li>
          <strong>SidebarMenu</strong> - Menu container for sidebar items
        </li>
        <li>
          <strong>SidebarMenuItem</strong> - Individual menu item container
        </li>
        <li>
          <strong>SidebarMenuButton</strong> - Button component for menu items
        </li>
      </ul>

      <h2 id="accessibility">Accessibility</h2>
      <p>
        Sidebar is built with Radix UI primitives and Vaul for drawer
        functionality, ensuring full keyboard navigation and screen reader
        support. The component includes proper ARIA attributes and follows WCAG
        2.1 guidelines.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-sidebar--docs">View in Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

