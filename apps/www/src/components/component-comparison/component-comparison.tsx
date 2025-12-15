"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import type { ComponentInfo } from "../component-playground/props-editor";
import { getComponentProps } from "../../lib/component-props";
import { PropsComparison } from "./props-comparison";
import { UsageComparison } from "./usage-comparison";
import { WhenToUse } from "./when-to-use";
import { VisualComparison } from "./visual-comparison";

interface ComponentComparisonProps {
  component1: ComponentInfo;
  component2: ComponentInfo;
}

export function ComponentComparison({
  component1,
  component2,
}: ComponentComparisonProps) {
  const props1 = React.useMemo(
    () => getComponentProps(component1.name),
    [component1.name]
  );
  const props2 = React.useMemo(
    () => getComponentProps(component2.name),
    [component2.name]
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WhenToUse component1={component1} component2={component2} />
        </TabsContent>

        <TabsContent value="props" className="space-y-6">
          <PropsComparison
            component1={component1}
            component2={component2}
            props1={props1}
            props2={props2}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageComparison
            component1={component1}
            component2={component2}
          />
        </TabsContent>

        <TabsContent value="visual" className="space-y-6">
          <VisualComparison
            component1={component1}
            component2={component2}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

