"use client";

import * as React from "react";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

export interface FormArrayProps<T = Record<string, any>> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number, remove: () => void) => React.ReactNode;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  className?: string;
  itemClassName?: string;
}

export function FormArray<T = Record<string, any>>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Add item",
  minItems = 0,
  maxItems,
  className,
  itemClassName,
}: FormArrayProps<T>) {
  const canAdd = maxItems === undefined || items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <div className={clsx("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={index} className={clsx("flex items-start gap-2", itemClassName)}>
          <div className="flex-1">{renderItem(item, index, () => onRemove(index))}</div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              aria-label={`Remove item ${index + 1}`}
              className="mt-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      {canAdd && (
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Button>
      )}
      {maxItems && items.length >= maxItems && (
        <p className="text-xs text-[color:var(--color-fg-muted)]">
          Maximum {maxItems} items allowed
        </p>
      )}
    </div>
  );
}

