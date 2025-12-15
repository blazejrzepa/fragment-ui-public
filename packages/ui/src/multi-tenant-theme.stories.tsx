import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  MultiTenantThemeProvider,
  useMultiTenantTheme,
  useCurrentTenantTheme,
} from "./multi-tenant-theme";
import { Button } from "./button";

const meta: Meta<typeof MultiTenantThemeProvider> = {
  title: "Enterprise/Multi-Tenant Theme",
  component: MultiTenantThemeProvider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MultiTenantThemeProvider>;

function TenantSwitcher() {
  const { currentTenant, setTenant, tenants } = useMultiTenantTheme();
  const currentTheme = useCurrentTenantTheme();

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Current Tenant: {currentTenant}</h3>
      {currentTheme && (
        <div>
          <p>Theme: {currentTheme.themeId}</p>
          {currentTheme.brand?.name && <p>Brand: {currentTheme.brand.name}</p>}
        </div>
      )}
      <div className="flex gap-2">
        {Array.from(tenants.keys()).map((tenantId) => (
          <Button
            key={tenantId}
            variant={currentTenant === tenantId ? "solid" : "outline"}
            onClick={() => setTenant(tenantId)}
          >
            {tenants.get(tenantId)?.brand?.name || tenantId}
          </Button>
        ))}
      </div>
    </div>
  );
}

function DemoContent() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Multi-Tenant Demo</h1>
      <p>This content changes based on the selected tenant.</p>
      <Button>Primary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <TenantSwitcher />
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const tenants = [
      {
        tenantId: "client-a",
        themeId: "brand-a",
        theme: {
          brand: { primary: "#0066cc" },
          "color-surface-1": "#f0f8ff",
        },
        brand: {
          name: "Client A",
          logo: "https://via.placeholder.com/100x30/0066cc/ffffff?text=Client+A",
        },
      },
      {
        tenantId: "client-b",
        themeId: "brand-b",
        theme: {
          brand: { primary: "#22c55e" },
          "color-surface-1": "#f0fdf4",
        },
        brand: {
          name: "Client B",
          logo: "https://via.placeholder.com/100x30/22c55e/ffffff?text=Client+B",
        },
      },
    ];

    return (
      <MultiTenantThemeProvider defaultTenant="client-a" tenants={tenants}>
        <DemoContent />
      </MultiTenantThemeProvider>
    );
  },
};

