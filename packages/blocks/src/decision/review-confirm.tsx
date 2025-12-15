/**
 * Decision Pattern: Review & Confirm
 * 
 * Displays a summary of selections/decisions with a hard action (requires confirmation).
 * Used for checkout, final confirmation, destructive actions, etc.
 * 
 * ACL Attributes:
 * - data-section-role="decision-review-confirm"
 * - data-action-id for the confirm action (must be hard action)
 * - data-action-requires-confirmation="true"
 */

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export interface ReviewItem {
  label: string;
  value: string;
  key?: string; // For ACL - unique key
}

export interface ReviewConfirmProps {
  title?: string;
  description?: string;
  items: ReviewItem[];
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  actionContractId: string; // Required - must be hard action
  className?: string;
}

export function ReviewConfirm({
  title = "Review & Confirm",
  description,
  items,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  actionContractId,
  className,
}: ReviewConfirmProps) {
  return (
    <div 
      className={clsx("space-y-6", className)}
      data-section-role="decision-review-confirm"
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.key || index}
                className="flex items-center justify-between border-b border-[color:var(--color-border-primary)] pb-3 last:border-0"
                data-review-key={item.key}
              >
                <span className="text-sm font-medium text-[color:var(--color-fg-secondary)]">
                  {item.label}
                </span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {cancelText}
            </Button>
          )}
          <Button
            variant="solid"
            onClick={onConfirm}
            className="flex-1"
            data-action-id={actionContractId}
            data-action-kind="hard"
            data-action-requires-confirmation="true"
          >
            {confirmText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

