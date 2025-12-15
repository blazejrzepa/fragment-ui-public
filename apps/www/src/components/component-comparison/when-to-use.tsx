"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import type { ComponentInfo } from "../component-playground/props-editor";

interface WhenToUseProps {
  component1: ComponentInfo;
  component2: ComponentInfo;
}

// Predefined recommendations for common component pairs
const recommendations: Record<string, {
  use1: string[];
  use2: string[];
  differences: string[];
}> = {
  "button-toggle": {
    use1: [
      "Triggering actions (submit, cancel, save)",
      "Navigation to other pages",
      "Primary user actions",
      "One-time interactions",
    ],
    use2: [
      "Toggling a state on/off",
      "Settings and preferences",
      "Persistent state changes",
      "Binary choices (yes/no, enable/disable)",
    ],
    differences: [
      "Button triggers actions, Toggle changes state",
      "Button is momentary, Toggle is persistent",
      "Button can navigate, Toggle stays in place",
    ],
  },
  "dialog-sheet": {
    use1: [
      "Critical confirmations",
      "Focused user attention needed",
      "Small to medium content",
      "Centered modal dialogs",
    ],
    use2: [
      "Side panels and drawers",
      "Large content areas",
      "Mobile-friendly navigation",
      "Non-blocking overlays",
    ],
    differences: [
      "Dialog is centered, Sheet slides from side",
      "Dialog blocks all interaction, Sheet can be dismissible",
      "Dialog is for focused tasks, Sheet for extended content",
    ],
  },
  "select-combobox": {
    use1: [
      "Simple dropdown selection",
      "Known, limited options",
      "Quick selection from list",
      "Form inputs with predefined choices",
    ],
    use2: [
      "Searchable options",
      "Large option lists",
      "User can type to filter",
      "Dynamic option loading",
    ],
    differences: [
      "Select shows all options, Combobox allows filtering",
      "Select is simpler, Combobox is more powerful",
      "Select for small lists, Combobox for large lists",
    ],
  },
  "input-textarea": {
    use1: [
      "Single-line text input",
      "Short text (names, emails, etc.)",
      "Form fields",
      "Search inputs",
    ],
    use2: [
      "Multi-line text input",
      "Long text (descriptions, comments)",
      "Text editing",
      "Rich content input",
    ],
    differences: [
      "Input is single-line, Textarea is multi-line",
      "Input for short text, Textarea for long text",
      "Input is compact, Textarea is expandable",
    ],
  },
  "card-sheet": {
    use1: [
      "Content containers",
      "Displaying information",
      "Grouping related content",
      "Static content blocks",
    ],
    use2: [
      "Overlay panels",
      "Sliding side panels",
      "Mobile navigation",
      "Temporary content display",
    ],
    differences: [
      "Card is static, Sheet is an overlay",
      "Card is inline, Sheet slides over content",
      "Card for content, Sheet for navigation/actions",
    ],
  },
  "tabs-accordion": {
    use1: [
      "Horizontal navigation",
      "Multiple sections visible",
      "Quick switching between views",
      "Desktop layouts",
    ],
    use2: [
      "Vertical navigation",
      "One section at a time",
      "Expandable/collapsible sections",
      "Mobile-friendly layouts",
    ],
    differences: [
      "Tabs are horizontal, Accordion is vertical",
      "Tabs show multiple, Accordion shows one",
      "Tabs for navigation, Accordion for content organization",
    ],
  },
};

export function WhenToUse({ component1, component2 }: WhenToUseProps) {
  const key1 = component1.name.toLowerCase();
  const key2 = component2.name.toLowerCase();
  const key = `${key1}-${key2}`;
  const reverseKey = `${key2}-${key1}`;
  
  const recommendation = recommendations[key] || recommendations[reverseKey];
  const isReversed = !!recommendations[reverseKey];

  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>When to Use Each Component</CardTitle>
          <CardDescription>
            General guidelines for {component1.name} and {component2.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Use {component1.name} when:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You need {component1.name} functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>It fits your use case</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Use {component2.name} when:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You need {component2.name} functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>It fits your use case</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const use1 = isReversed ? recommendation.use2 : recommendation.use1;
  const use2 = isReversed ? recommendation.use1 : recommendation.use2;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>When to Use Each Component</CardTitle>
          <CardDescription>
            Guidelines for choosing between {component1.name} and {component2.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-[color:var(--color-brand-primary)]">
                Use {component1.name} when:
              </h3>
              <ul className="space-y-2 text-sm">
                {use1.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-[color:var(--color-brand-primary)]">
                Use {component2.name} when:
              </h3>
              <ul className="space-y-2 text-sm">
                {use2.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Differences</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendation.differences.map((diff, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-2">•</span>
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

