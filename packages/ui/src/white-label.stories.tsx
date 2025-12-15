import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { WhiteLabelProvider, useWhiteLabel, BrandLogo } from "./white-label";
import { Button } from "./button";

const meta: Meta<typeof WhiteLabelProvider> = {
  title: "Enterprise/White-Label",
  component: WhiteLabelProvider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WhiteLabelProvider>;

function BrandControls() {
  const { brand, updateBrand, resetBrand } = useWhiteLabel();

  const handleUpdate = () => {
    updateBrand({
      colors: {
        primary: "#ff6600",
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Brand Controls</h3>
      {brand && (
        <div>
          <p>Brand: {brand.metadata?.name || "Unnamed"}</p>
          {brand.colors?.primary && (
            <p>Primary Color: {brand.colors.primary}</p>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={handleUpdate}>Update Brand</Button>
        <Button onClick={resetBrand} variant="outline">
          Reset Brand
        </Button>
      </div>
    </div>
  );
}

function DemoContent() {
  return (
    <div className="p-8 space-y-4">
      <header className="flex items-center gap-4 border-b pb-4">
        <BrandLogo className="h-8" variant="auto" />
        <h1 className="text-2xl font-bold">
          {typeof window !== "undefined" &&
            document.documentElement.getAttribute("data-brand-name")}
        </h1>
      </header>
      <p>This content uses white-label branding.</p>
      <Button>Primary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <BrandControls />
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const brand = {
      logo: {
        light: "https://via.placeholder.com/200x60/0066cc/ffffff?text=My+Brand",
        dark: "https://via.placeholder.com/200x60/4d9fff/000000?text=My+Brand",
        favicon: "https://via.placeholder.com/32/0066cc/ffffff?text=M",
        alt: "My Brand Logo",
      },
      colors: {
        primary: "#0066cc",
        secondary: "#22c55e",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingFont: "Poppins, sans-serif",
      },
      metadata: {
        name: "My Brand",
        tagline: "Building amazing products",
        website: "https://example.com",
      },
    };

    return (
      <WhiteLabelProvider defaultBrand={brand}>
        <DemoContent />
      </WhiteLabelProvider>
    );
  },
};

