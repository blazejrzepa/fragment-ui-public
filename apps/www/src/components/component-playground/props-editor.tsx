"use client";

import * as React from "react";
import { Input } from "@fragment_ui/ui";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fragment_ui/ui";
import { Checkbox } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export type PropValue = string | number | boolean | null | undefined;

export interface ComponentInfo {
  name: string;
  package: string;
  displayName?: string;
}

export interface PropDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "text";
  defaultValue?: PropValue;
  options?: string[];
  description?: string;
}

export interface PropsEditorProps {
  props: PropDefinition[];
  values: Record<string, PropValue>;
  onChange: (values: Record<string, PropValue>) => void;
}

export function PropsEditor({ props, values, onChange }: PropsEditorProps) {
  const handleChange = (propName: string, value: PropValue) => {
    onChange({
      ...values,
      [propName]: value,
    });
  };

  const handleReset = () => {
    const defaults: Record<string, PropValue> = {};
    props.forEach((prop) => {
      defaults[prop.name] = prop.defaultValue ?? null;
    });
    onChange(defaults);
  };

  if (props.length === 0) {
    return (
      <div className="p-4 text-center text-[color:var(--color-fg-muted)]">
        No editable props available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Props</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="space-y-3">
        {props.map((prop) => {
          const currentValue = values[prop.name] ?? prop.defaultValue;

          if (prop.type === "boolean") {
            return (
              <div key={prop.name} className="space-y-1">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={currentValue === true}
                    onCheckedChange={(checked) =>
                      handleChange(prop.name, checked === true)
                    }
                  />
                  <span className="text-sm font-medium">{prop.name}</span>
                </label>
                {prop.description && (
                  <p className="text-xs text-[color:var(--color-fg-muted)] ml-6">
                    {prop.description}
                  </p>
                )}
              </div>
            );
          }

          if (prop.type === "select" && prop.options) {
            return (
              <div key={prop.name} className="space-y-1">
                <label className="text-sm font-medium">{prop.name}</label>
                <Select
                  value={String(currentValue ?? "")}
                  onValueChange={(value) => handleChange(prop.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {prop.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {prop.description && (
                  <p className="text-xs text-[color:var(--color-fg-muted)]">
                    {prop.description}
                  </p>
                )}
              </div>
            );
          }

          if (prop.type === "text") {
            return (
              <div key={prop.name} className="space-y-1">
                <label className="text-sm font-medium">{prop.name}</label>
                <textarea
                  className={clsx(
                    "w-full min-h-[100px] rounded-[var(--radius-md)] border border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)] px-3 py-2 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-brand"
                  )}
                  value={String(currentValue ?? "")}
                  onChange={(e) => handleChange(prop.name, e.target.value)}
                  placeholder={prop.description}
                />
                {prop.description && (
                  <p className="text-xs text-[color:var(--color-fg-muted)]">
                    {prop.description}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={prop.name} className="space-y-1">
              <label className="text-sm font-medium">{prop.name}</label>
              <Input
                type={prop.type === "number" ? "number" : "text"}
                value={String(currentValue ?? "")}
                onChange={(e) => {
                  const value =
                    prop.type === "number"
                      ? e.target.value === ""
                        ? null
                        : Number(e.target.value)
                      : e.target.value;
                  handleChange(prop.name, value);
                }}
                placeholder={prop.description || prop.name}
              />
              {prop.description && (
                <p className="text-xs text-[color:var(--color-fg-muted)]">
                  {prop.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

