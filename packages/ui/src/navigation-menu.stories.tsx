import type { Meta, StoryObj } from "@storybook/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Core/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)]">
                <div className="text-sm font-medium leading-none">Button</div>
                <p className="line-clamp-2 text-sm leading-snug text-[color:var(--color-fg-muted)]">
                  A button component with multiple variants and sizes.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)]">
                <div className="text-sm font-medium leading-none">Input</div>
                <p className="line-clamp-2 text-sm leading-snug text-[color:var(--color-fg-muted)]">
                  An input component for text entry.
                </p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)] focus:bg-[color:var(--color-surface-2)] focus:text-[color:var(--color-fg-base)] focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};


