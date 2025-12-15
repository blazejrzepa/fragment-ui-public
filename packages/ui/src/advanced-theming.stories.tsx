import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  AdvancedThemingProvider,
  useAdvancedTheming,
} from "./advanced-theming";
import { Button } from "./button";

const meta: Meta<typeof AdvancedThemingProvider> = {
  title: "Enterprise/Advanced Theming",
  component: AdvancedThemingProvider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdvancedThemingProvider>;

function ThemeControls() {
  const { currentTheme, themes, setTheme, composeTheme, exportTheme } =
    useAdvancedTheming();

  const handleCompose = () => {
    const composed = composeTheme({
      base: {
        primary: "#0066cc",
        spacing: { md: "16px" },
      },
      variants: {
        dark: {
          primary: "#4d9fff",
          background: "#0a0a0a",
        },
      },
      overrides: {
        primary: "#ff6600",
      },
    });
    setTheme(composed.id);
  };

  const handleExport = () => {
    if (!currentTheme) return;
    const css = exportTheme(currentTheme.id, "css");
    console.log("Exported CSS:", css);
    alert("Theme exported! Check console.");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Theme Controls</h3>
      {currentTheme && (
        <div>
          <p>Current: {currentTheme.name}</p>
          <p>Variant: {currentTheme.variant}</p>
          <p>Tokens: {currentTheme.tokens.length}</p>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {Array.from(themes.values()).map((theme) => (
          <Button
            key={theme.id}
            variant={currentTheme?.id === theme.id ? "solid" : "outline"}
            onClick={() => setTheme(theme.id)}
          >
            {theme.name}
          </Button>
        ))}
        <Button onClick={handleCompose}>Compose Theme</Button>
        <Button onClick={handleExport} disabled={!currentTheme}>
          Export CSS
        </Button>
      </div>
    </div>
  );
}

function DemoContent() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Advanced Theming Demo</h1>
      <p>This content uses the current theme tokens.</p>
      <Button>Primary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <ThemeControls />
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const themes = [
      {
        id: "custom-theme",
        name: "Custom Theme",
        variant: "light",
        tokens: [
          { name: "primary", value: "#0066cc", type: "color" },
          { name: "spacing-md", value: "16px", type: "spacing" },
        ],
      },
      {
        id: "ocean-theme",
        name: "Ocean Theme",
        variant: "light",
        tokens: [
          { name: "primary", value: "#0066cc", type: "color" },
          { name: "secondary", value: "#00a8cc", type: "color" },
        ],
      },
    ];

    return (
      <AdvancedThemingProvider defaultTheme="custom-theme" themes={themes}>
        <DemoContent />
      </AdvancedThemingProvider>
    );
  },
};

