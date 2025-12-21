"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fragment_ui/ui";

interface CopilotSettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface CopilotSettingsViewProps {
  onSave?: (settings: CopilotSettings) => void;
}

const DEFAULT_SETTINGS: CopilotSettings = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4000,
};

export function CopilotSettingsView({
  onSave,
}: CopilotSettingsViewProps) {
  const [settings, setSettings] = useState<CopilotSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("copilot-settings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch (e) {
          console.error("Failed to parse copilot settings:", e);
        }
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("copilot-settings", JSON.stringify(settings));
    }
    onSave?.(settings);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-auto p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground-primary)" }}>
            AI Copilot Settings
          </h2>
          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
            Configure AI model settings for component generation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>
              AI Model
            </label>
            <Select
              value={settings.model || DEFAULT_SETTINGS.model}
              onValueChange={(value) =>
                setSettings({ ...settings, model: value })
              }
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="temperature" className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>
              Temperature
            </label>
            <Input
              id="temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature || DEFAULT_SETTINGS.temperature}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  temperature: parseFloat(e.target.value) || 0.7,
                })
              }
            />
            <p className="text-xs" style={{ color: "var(--foreground-tertiary)" }}>
              Controls randomness. Lower values make output more deterministic.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="maxTokens" className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>
              Max Tokens
            </label>
            <Input
              id="maxTokens"
              type="number"
              min="100"
              max="8000"
              step="100"
              value={settings.maxTokens || DEFAULT_SETTINGS.maxTokens}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxTokens: parseInt(e.target.value) || 4000,
                })
              }
            />
            <p className="text-xs" style={{ color: "var(--foreground-tertiary)" }}>
              Maximum number of tokens in the generated response.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

