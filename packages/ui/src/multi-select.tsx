"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import clsx from "clsx";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { X } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options?: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxCount?: number; // Max number of selected items to show before "+X more"
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  loading?: boolean; // Loading state
  asyncOptions?: boolean; // If true, options can be loaded asynchronously
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  function MultiSelect(
    {
      options,
      value = [],
      onValueChange,
      placeholder = "Select options...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      maxCount = 3,
      className,
      disabled,
      clearable = true,
      loading = false,
      asyncOptions = false,
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Ensure options is always an array
    const safeOptions = React.useMemo(() => {
      if (!options || !Array.isArray(options)) {
        return [];
      }
      return options;
    }, [options]);

    const selectedOptions = React.useMemo(
      () => safeOptions.filter((opt) => value.includes(opt.value)),
      [safeOptions, value]
    );

    const filteredOptions = React.useMemo(() => {
      if (!search) return safeOptions;
      return safeOptions.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [safeOptions, search]);

    const handleSelect = React.useCallback((optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange?.(newValue);
      // Keep popover open for multi-select
      // Don't call setOpen(false) here
    }, [value, onValueChange]);

    const handleRemove = React.useCallback((optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = value.filter((v) => v !== optionValue);
      onValueChange?.(newValue);
    }, [value, onValueChange]);

    const handleClear = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.([]);
    }, [onValueChange]);

    const displayValue = React.useMemo(() => {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length <= maxCount) {
        return selectedOptions.map((opt) => opt.label).join(", ");
      }
      return `${selectedOptions.slice(0, maxCount).map((opt) => opt.label).join(", ")} +${selectedOptions.length - maxCount} more`;
    }, [selectedOptions, maxCount, placeholder]);


    return (
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={selectedOptions.length > 0 
              ? `Selected ${selectedOptions.length} option${selectedOptions.length > 1 ? 's' : ''}: ${selectedOptions.map(opt => opt.label).join(', ')}`
              : placeholder || "Select options"}
            aria-haspopup="listbox"
            className={clsx(
              "w-full justify-between min-h-10 h-auto",
              selectedOptions.length > 0 && "px-2 py-1.5",
              className
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-[var(--space-1)] flex-1 text-left">
              {selectedOptions.length === 0 ? (
                <span className="text-[color:var(--color-fg-muted)]">
                  {placeholder}
                </span>
              ) : (
                <>
                  {selectedOptions.slice(0, maxCount).map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-sm)] bg-[color:var(--color-surface-2)] text-sm"
                    >
                      {option.label}
                      {clearable && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleRemove(option.value, e)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRemove(option.value, e as any);
                            }
                          }}
                          className="ml-[var(--space-1)] hover:bg-[color:var(--color-surface-3)] rounded p-[var(--space-1)] cursor-pointer"
                          aria-label={`Remove ${option.label}`}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                  ))}
                  {selectedOptions.length > maxCount && (
                    <span className="text-sm text-[color:var(--color-fg-muted)]">
                      +{selectedOptions.length - maxCount} more
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-[var(--space-1)] ml-[var(--space-2)]">
              {clearable && selectedOptions.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClear(e as any);
                    }
                  }}
                  className="hover:bg-[color:var(--color-surface-2)] rounded p-[var(--space-1)] cursor-pointer"
                  aria-label="Clear all"
                >
                  <X className="h-4 w-4" />
                </span>
              )}
              <span className="ml-[var(--space-1)]">▼</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          onEscapeKeyDown={() => {
            setOpen(false);
          }}
        >
          <CommandPrimitive 
            shouldFilter={false}
            loop
          >
            <div className="flex items-center border-b px-[var(--space-3)]">
              <CommandPrimitive.Input
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="flex h-11 w-full rounded-[var(--radius-md)] bg-transparent py-[var(--space-3)] text-sm outline-none placeholder:text-[color:var(--color-fg-muted)] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {loading ? (
              <div className="py-[var(--space-6)] text-center text-sm flex items-center justify-center gap-[var(--space-2)]">
                <Spinner className="h-4 w-4" />
                <span>Loading...</span>
              </div>
            ) : (
              <CommandPrimitive.Empty className="py-[var(--space-6)] text-center text-sm">
                {emptyText}
              </CommandPrimitive.Empty>
            )}
            <CommandPrimitive.Group>
              <CommandPrimitive.List role="listbox" aria-label="Options">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!option.disabled) {
                          handleSelect(option.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (!option.disabled) {
                            handleSelect(option.value);
                          }
                        }
                      }}
                      tabIndex={option.disabled ? -1 : 0}
                      className={clsx(
                        "relative flex cursor-pointer select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-sm outline-none hover:bg-[color:var(--color-surface-2)]",
                        isSelected && "bg-[color:var(--color-surface-2)]",
                        option.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <div className="flex items-center gap-[var(--space-2)] flex-1 w-full">
                        <div
                          className={clsx(
                            "h-4 w-4 rounded border flex items-center justify-center flex-shrink-0",
                            isSelected
                              ? "bg-brand border-brand"
                              : "border-[color:var(--color-fg-muted)]"
                          )}
                        >
                          {isSelected && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className="flex-1">{option.label}</span>
                      </div>
                    </div>
                  );
                })}
              </CommandPrimitive.List>
            </CommandPrimitive.Group>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    );
  }
);

