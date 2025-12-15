"use client";

import * as React from "react";
import { DayPicker, DayPickerSingleProps, DayPickerRangeProps } from "react-day-picker";
import { format } from "date-fns";
import clsx from "clsx";
import { Button } from "./button";
import { Input } from "./input";
import * as PopoverPrimitive from "@radix-ui/react-popover";

// CSS is loaded globally via <link> tag, not as ESM import
// See: https://react-day-picker.js.org/guides/styling

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

export interface DatePickerProps extends Omit<DayPickerSingleProps, "mode" | "selected" | "onSelect"> {
  mode?: "single";
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface DateRangePickerProps extends Omit<DayPickerRangeProps, "mode" | "selected" | "onSelect"> {
  mode: "range";
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

type DatePickerComponent = React.ForwardRefExoticComponent<
  DatePickerProps | DateRangePickerProps
>;

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps | DateRangePickerProps>(
  function DatePicker(
    {
      mode = "single",
      value,
      onChange,
      placeholder = "Pick a date",
      className,
      disabled,
      ...props
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      mode === "single" ? (value as Date | undefined) : undefined
    );
    const [selectedRange, setSelectedRange] = React.useState<
      { from?: Date; to?: Date } | undefined
    >(mode === "range" ? (value as { from?: Date; to?: Date } | undefined) : undefined);

    const handleDateSelect = React.useCallback(
      (date: any) => {
        if (mode === "single") {
          const singleDate = date as Date | undefined;
          setSelectedDate(singleDate);
          (onChange as ((date: Date | undefined) => void) | undefined)?.(singleDate);
          if (singleDate) {
            setOpen(false);
          }
        } else {
          const range = date as { from?: Date; to?: Date } | undefined;
          setSelectedRange(range || undefined);
          (onChange as ((range: { from?: Date; to?: Date } | undefined) => void) | undefined)?.(range || undefined);
        }
      },
      [mode, onChange]
    );

    const displayValue = React.useMemo(() => {
      if (mode === "single") {
        return selectedDate ? format(selectedDate, "PPP") : "";
      } else {
        if (!selectedRange?.from) return "";
        if (!selectedRange?.to) {
          return `${format(selectedRange.from, "PPP")} - ...`;
        }
        return `${format(selectedRange.from, "PPP")} - ${format(selectedRange.to, "PPP")}`;
      }
    }, [mode, selectedDate, selectedRange]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <div>
            <Input
              ref={ref}
              readOnly
              value={displayValue}
              placeholder={placeholder}
              className={clsx("cursor-pointer", className)}
              onClick={disabled ? undefined : () => setOpen(true)}
              disabled={disabled}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={clsx(
            "z-50 w-auto rounded-[var(--radius-lg)] border border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)] p-3 shadow-lg",
            className
          )}
          align="start"
        >
          <DayPicker
            {...(mode === "single"
              ? {
                  mode: "single" as const,
                  selected: selectedDate,
                }
              : {
                  mode: "range" as const,
                  selected: selectedRange,
                })}
            onSelect={handleDateSelect as any}
            className="rdp"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              button_previous: "absolute left-1",
              button_next: "absolute right-1",
              month_grid: "w-full border-collapse space-y-1",
              weekdays: "flex",
              weekday: "text-[color:var(--color-fg-muted)] text-sm font-normal w-9",
              week: "flex w-full mt-2",
              day: "h-9 w-9 text-sm rounded-md hover:bg-[color:var(--color-surface-2)]",
              day_selected: "bg-brand text-white hover:bg-brand hover:text-white",
              day_range_start: "bg-brand text-white",
              day_range_end: "bg-brand text-white",
              day_outside: "text-[color:var(--color-fg-muted)] opacity-50",
              day_disabled: "opacity-50 cursor-not-allowed",
            }}
            {...(props as any)}
          />
        </PopoverContent>
      </Popover>
    );
  }
) as DatePickerComponent;

