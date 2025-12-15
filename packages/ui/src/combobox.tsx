"use client";

import * as React from "react";
import clsx from "clsx";
import { ChevronsUpDown, Check, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value,
      onValueChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      className,
      disabled,
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = React.useMemo(() => {
      if (!search) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [options, search]);

    // Check if className contains a width class
    const hasWidthClass = className && /w-\[?[\d]+|w-(full|auto|screen|min|max|fit)/.test(className);
    const widthClass = hasWidthClass ? "" : "w-full";
    
    // Extract width from className to match PopoverContent width
    const widthMatch = className?.match(/w-\[(\d+)px\]|w-(\d+)/);
    const popoverWidth = widthMatch ? (widthMatch[1] ? `w-[${widthMatch[1]}px]` : `w-${widthMatch[2]}`) : "w-full";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx("justify-between", widthClass, open && "focus-visible:ring-0", className)}
            disabled={disabled}
          >
            <>
              <span className="flex-1 text-left truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={clsx(popoverWidth, "p-0")} align="start">
          <Command shouldFilter={false}>
            <div className="flex h-9 items-center gap-2 border-b border-[color:var(--color-border-base)] px-3">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder={searchPlaceholder}
                className="flex w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-[color:var(--color-fg-muted)] disabled:cursor-not-allowed disabled:opacity-50 h-9 focus-visible:ring-0 focus-visible:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={(currentValue) => {
                      onValueChange?.(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {option.label}
                    <Check
                      className={clsx(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);


