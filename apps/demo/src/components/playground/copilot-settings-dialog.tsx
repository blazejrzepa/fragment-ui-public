"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

interface CopilotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (settings: CopilotSettings) => void;
}

const DEFAULT_SETTINGS: CopilotSettings = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4000,
};

export function CopilotSettingsDialog({
  open,
  onOpenChange,
  onSave,
}: CopilotSettingsDialogProps) {
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AI Copilot Settings</DialogTitle>
          <DialogDescription>
            Configure AI model settings for component generation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>AI Model</label>
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
              Temperature: {settings.temperature?.toFixed(1) || DEFAULT_SETTINGS.temperature?.toFixed(1)}
            </label>
            <Input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature || DEFAULT_SETTINGS.temperature}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
              Controls randomness. Lower values make output more deterministic.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="maxTokens" className="text-sm font-medium" style={{ color: "var(--foreground-primary)" }}>Max Tokens</label>
            <Input
              id="maxTokens"
              type="number"
              min="500"
              max="8000"
              step="500"
              value={settings.maxTokens || DEFAULT_SETTINGS.maxTokens}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxTokens: parseInt(e.target.value, 10),
                })
              }
            />
            <p className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
              Maximum number of tokens in the generated response.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

