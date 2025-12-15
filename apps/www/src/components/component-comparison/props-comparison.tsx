"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@fragment_ui/ui";
import type { ComponentInfo } from "../component-playground/props-editor";

interface PropsComparisonProps {
  component1: ComponentInfo;
  component2: ComponentInfo;
  props1: Array<{ name: string; type: string; required?: boolean; description?: string }>;
  props2: Array<{ name: string; type: string; required?: boolean; description?: string }>;
}

export function PropsComparison({
  component1,
  component2,
  props1,
  props2,
}: PropsComparisonProps) {
  // Create a map of all unique props
  const allProps = new Set<string>();
  props1.forEach((p) => allProps.add(p.name));
  props2.forEach((p) => allProps.add(p.name));

  const props1Map = new Map(props1.map((p) => [p.name, p]));
  const props2Map = new Map(props2.map((p) => [p.name, p]));

  const commonProps: string[] = [];
  const unique1: string[] = [];
  const unique2: string[] = [];

  allProps.forEach((propName) => {
    const has1 = props1Map.has(propName);
    const has2 = props2Map.has(propName);

    if (has1 && has2) {
      commonProps.push(propName);
    } else if (has1) {
      unique1.push(propName);
    } else {
      unique2.push(propName);
    }
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{component1.name}</CardTitle>
            <CardDescription>Total props</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props1.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common</CardTitle>
            <CardDescription>Shared props</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commonProps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{component2.name}</CardTitle>
            <CardDescription>Total props</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props2.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Common Props */}
      {commonProps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common Props</CardTitle>
            <CardDescription>
              Props available in both {component1.name} and {component2.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>{component1.name}</TableHead>
                  <TableHead>{component2.name}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commonProps.map((propName) => {
                  const prop1 = props1Map.get(propName)!;
                  const prop2 = props2Map.get(propName)!;
                  return (
                    <TableRow key={propName}>
                      <TableCell className="font-medium">{propName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-mono">{prop1.type}</div>
                          {prop1.required && (
                            <span className="text-xs text-[color:var(--color-brand-primary)]">
                              required
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-mono">{prop2.type}</div>
                          {prop2.required && (
                            <span className="text-xs text-[color:var(--color-brand-primary)]">
                              required
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Unique Props */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {unique1.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Only in {component1.name}</CardTitle>
              <CardDescription>Unique props</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {unique1.map((propName) => {
                  const prop = props1Map.get(propName)!;
                  return (
                    <li key={propName} className="text-sm">
                      <span className="font-medium font-mono">{propName}</span>
                      <span className="text-[color:var(--color-fg-muted)] ml-2">
                        {prop.type}
                      </span>
                      {prop.required && (
                        <span className="text-xs text-[color:var(--color-brand-primary)] ml-2">
                          required
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {unique2.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Only in {component2.name}</CardTitle>
              <CardDescription>Unique props</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {unique2.map((propName) => {
                  const prop = props2Map.get(propName)!;
                  return (
                    <li key={propName} className="text-sm">
                      <span className="font-medium font-mono">{propName}</span>
                      <span className="text-[color:var(--color-fg-muted)] ml-2">
                        {prop.type}
                      </span>
                      {prop.required && (
                        <span className="text-xs text-[color:var(--color-brand-primary)] ml-2">
                          required
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

