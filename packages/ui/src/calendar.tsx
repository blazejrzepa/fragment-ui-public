"use client";

import * as React from "react";
import { DayPicker, DayPickerSingleProps, DayPickerRangeProps, DayPickerMultipleProps } from "react-day-picker";
import clsx from "clsx";

// CSS is loaded globally via <link> tag, not as ESM import
// See: https://react-day-picker.js.org/guides/styling

export interface CalendarProps extends Omit<DayPickerSingleProps, "mode" | "selected" | "onSelect"> {
  mode?: "single";
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export interface CalendarRangeProps extends Omit<DayPickerRangeProps, "mode" | "selected" | "onSelect"> {
  mode: "range";
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void;
  className?: string;
}

export interface CalendarMultipleProps extends Omit<DayPickerMultipleProps, "mode" | "selected" | "onSelect"> {
  mode: "multiple";
  value?: Date[];
  onChange?: (dates: Date[] | undefined) => void;
  className?: string;
}

type CalendarComponentProps = CalendarProps | CalendarRangeProps | CalendarMultipleProps;

export const Calendar = React.forwardRef<HTMLDivElement, CalendarComponentProps>(
  function Calendar(
    {
      mode = "single",
      value,
      onChange,
      className,
      ...restProps
    },
    ref
  ) {
    const handleSelect = React.useCallback(
      (selected: any) => {
        if (!onChange) return;

        if (mode === "single") {
          (onChange as (date: Date | undefined) => void)(selected);
        } else if (mode === "range") {
          (onChange as (range: { from?: Date; to?: Date } | undefined) => void)(selected);
        } else if (mode === "multiple") {
          (onChange as (dates: Date[] | undefined) => void)(selected);
        }
      },
      [mode, onChange]
    );

    const selected = React.useMemo(() => {
      if (mode === "single") {
        return (value as Date | undefined) || undefined;
      } else if (mode === "range") {
        const range = value as { from?: Date; to?: Date } | undefined;
        return range || undefined;
      } else if (mode === "multiple") {
        return (value as Date[] | undefined) || undefined;
      }
      return undefined;
    }, [mode, value]);

    const sharedClassNames = {
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex flex-col pt-1 relative items-center mb-4",
      caption_label: "text-sm font-medium mb-2",
      nav: "space-x-1 flex items-center justify-between w-full mb-2 order-first",
      nav_button: clsx(
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        "inline-flex items-center justify-center rounded-[var(--radius-sm)]",
        "border border-[color:var(--color-border-base)]",
        "text-[color:var(--color-fg-base)]",
        "hover:bg-[color:var(--color-surface-2)]",
        "focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)] focus:ring-offset-2"
      ),
      nav_button_previous: "relative",
      nav_button_next: "relative",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-[color:var(--color-fg-muted)] rounded-[var(--radius-md)] w-9 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)] [&:has([aria-selected].day-outside)]:bg-[color:var(--color-surface-2)]/50 [&:has([aria-selected])]:bg-[color:var(--color-surface-2)] first:[&:has([aria-selected])]:rounded-l-[var(--radius-md)] last:[&:has([aria-selected])]:rounded-r-[var(--radius-md)] focus-within:relative focus-within:z-20",
      day: clsx(
        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        "rounded-[var(--radius-md)]",
        "text-[color:var(--color-fg-base)]",
        "hover:bg-[color:var(--color-surface-2)]",
        "focus:bg-[color:var(--color-surface-2)]",
        "focus:outline-none",
        "transition-colors"
      ),
      day_range_end: "day-range-end",
      day_selected: clsx(
        "bg-[color:var(--color-brand-primary)]",
        "text-white",
        "hover:bg-[color:var(--color-brand-primary)]",
        "hover:text-white",
        "focus:bg-[color:var(--color-brand-primary)]",
        "focus:text-white"
      ),
      day_today: clsx(
        "bg-[color:var(--color-surface-2)]",
        "text-[color:var(--color-fg-base)]",
        "font-semibold"
      ),
      day_outside: "day-outside text-[color:var(--color-fg-muted)] opacity-50 aria-selected:bg-[color:var(--color-surface-2)]/50 aria-selected:text-[color:var(--color-fg-muted)] aria-selected:opacity-30",
      day_disabled: "text-[color:var(--color-fg-muted)] opacity-50 cursor-not-allowed",
      day_range_middle: clsx(
        "aria-selected:bg-[color:var(--color-surface-2)]",
        "aria-selected:text-[color:var(--color-fg-base)]"
      ),
      day_hidden: "invisible",
    };

    if (mode === "single") {
      return (
        <div ref={ref} className={clsx("p-3 rounded-lg border border-[color:var(--color-border-base)]", className)}>
          <DayPicker
            mode="single"
            selected={selected as Date | undefined}
            onSelect={handleSelect}
            className="rdp"
            classNames={sharedClassNames}
            {...(restProps as Omit<DayPickerSingleProps, "mode" | "selected" | "onSelect">)}
          />
        </div>
      );
    }

    if (mode === "range") {
      const rangeValue = selected as { from?: Date; to?: Date } | undefined;
      const rangeSelected = rangeValue?.from && rangeValue?.to 
        ? { from: rangeValue.from, to: rangeValue.to }
        : rangeValue?.from
        ? { from: rangeValue.from, to: undefined }
        : undefined;
      
      return (
        <div ref={ref} className={clsx("p-3 rounded-lg border border-[color:var(--color-border-base)]", className)}>
          <DayPicker
            mode="range"
            selected={rangeSelected}
            onSelect={handleSelect}
            className="rdp"
            classNames={sharedClassNames}
            {...(restProps as Omit<DayPickerRangeProps, "mode" | "selected" | "onSelect">)}
          />
        </div>
      );
    }

    // mode === "multiple"
    return (
      <div ref={ref} className={clsx("p-3 rounded-lg border border-[color:var(--color-border-base)]", className)}>
        <DayPicker
          mode="multiple"
          selected={selected as Date[] | undefined}
          onSelect={handleSelect}
          className="rdp"
          classNames={sharedClassNames}
          {...(restProps as Omit<DayPickerMultipleProps, "mode" | "selected" | "onSelect">)}
        />
      </div>
    );
  }
);

