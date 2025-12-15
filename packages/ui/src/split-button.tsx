"use client";

import * as React from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Button, ButtonProps } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface SplitButtonOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  options?: SplitButtonOption[];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}

export const SplitButton = React.memo(
  React.forwardRef<HTMLDivElement, SplitButtonProps>(
    function SplitButton(
    {
      primaryAction,
      options,
      variant = "solid",
      size = "md",
      disabled = false,
      align = "end",
      side = "bottom",
      className,
      ...props
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);

    // Ensure primaryAction and options are defined
    const safePrimaryAction = React.useMemo(() => {
      if (!primaryAction) {
        return { label: "Action", onClick: () => {} };
      }
      return primaryAction;
    }, [primaryAction]);

    const safeOptions = React.useMemo(() => {
      if (!options || !Array.isArray(options)) {
        return [];
      }
      return options;
    }, [options]);

    if (!primaryAction) {
      return null;
    }

    return (
      <div ref={ref} className={clsx("inline-flex", className)} {...props}>
        {/* Primary Button */}
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={safePrimaryAction.onClick}
          trailingIcon={safePrimaryAction.icon}
          className={clsx(
            "rounded-r-none border-r-0",
            variant === "outline" && "border-r border-[color:var(--color-fg-muted)]"
          )}
        >
          {safePrimaryAction.label}
        </Button>

        {/* Dropdown Trigger */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              className={clsx(
                "rounded-l-none px-2",
                variant === "outline" && "border-l-0"
              )}
              aria-label="More options"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} side={side}>
            {safeOptions.map((option, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  option.onClick();
                  setOpen(false);
                }}
                disabled={option.disabled}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  )
);

SplitButton.displayName = "SplitButton";

