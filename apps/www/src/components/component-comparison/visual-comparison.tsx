"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { ComponentPreview } from "../component-playground/component-preview";
import type { ComponentInfo } from "../component-playground/props-editor";

interface VisualComparisonProps {
  component1: ComponentInfo;
  component2: ComponentInfo;
}

export function VisualComparison({
  component1,
  component2,
}: VisualComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{component1.name}</CardTitle>
          <CardDescription>Live preview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] flex items-center justify-center border border-[color:var(--color-border-base)] rounded-lg p-4">
            <ComponentPreview
              component={component1}
              props={{}}
              propDefinitions={[]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{component2.name}</CardTitle>
          <CardDescription>Live preview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] flex items-center justify-center border border-[color:var(--color-border-base)] rounded-lg p-4">
            <ComponentPreview
              component={component2}
              props={{}}
              propDefinitions={[]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

