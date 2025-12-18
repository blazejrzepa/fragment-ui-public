"use client";

import * as React from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { Input } from "./input";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  maxLength?: number; // max length per tag
  separator?: string | RegExp; // separator to split tags (e.g., ",", " ", /[,\s]/)
  allowDuplicates?: boolean;
  validate?: (tag: string) => boolean | string; // return true if valid, or error message string
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
}

export const TagInput = React.memo(
  React.forwardRef<HTMLDivElement, TagInputProps>(
    function TagInput(
    {
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "Add tags...",
      disabled = false,
      maxTags,
      maxLength,
      separator = /[,\s]+/,
      allowDuplicates = false,
      validate,
      className,
      inputClassName,
      tagClassName,
      onTagAdd,
      onTagRemove,
      ...props
    },
    ref
  ) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
      defaultValue ?? []
    );
    const [inputValue, setInputValue] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isControlled = controlledValue !== undefined;
    const tags = isControlled ? controlledValue : uncontrolledValue;

    const updateTags = React.useCallback(
      (newTags: string[]) => {
        if (!isControlled) {
          setUncontrolledValue(newTags);
        }
        onChange?.(newTags);
      },
      [isControlled, onChange]
    );

    const addTag = React.useCallback(
      (tag: string) => {
        const trimmedTag = tag.trim();

        if (!trimmedTag) return;

        // Check max length
        if (maxLength && trimmedTag.length > maxLength) {
          setError(`Tag must be ${maxLength} characters or less`);
          return;
        }

        // Check duplicates
        if (!allowDuplicates && tags.includes(trimmedTag)) {
          setError("Tag already exists");
          return;
        }

        // Validate tag
        if (validate) {
          const validationResult = validate(trimmedTag);
          if (validationResult !== true) {
            setError(typeof validationResult === "string" ? validationResult : "Invalid tag");
            return;
          }
        }

        // Check max tags
        if (maxTags && tags.length >= maxTags) {
          setError(`Maximum ${maxTags} tags allowed`);
          return;
        }

        const newTags = [...tags, trimmedTag];
        updateTags(newTags);
        setInputValue("");
        setError(null);
        onTagAdd?.(trimmedTag);
      },
      [tags, maxLength, allowDuplicates, validate, maxTags, updateTags, onTagAdd]
    );

    const removeTag = React.useCallback(
      (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        updateTags(newTags);
        onTagRemove?.(tagToRemove);
      },
      [tags, updateTags, onTagRemove]
    );

    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setError(null);

        // Auto-split on separator
        if (separator && typeof separator === "string") {
          if (newValue.includes(separator)) {
            const parts = newValue.split(separator);
            const validParts = parts.filter((part) => part.trim());
            if (validParts.length > 0) {
              // Add all tags at once
              validParts.forEach((part) => {
                const trimmedTag = part.trim();
                if (trimmedTag) {
                  // Check max length
                  if (maxLength && trimmedTag.length > maxLength) {
                    setError(`Tag must be ${maxLength} characters or less`);
                    return;
                  }

                  // Check duplicates
                  if (!allowDuplicates && tags.includes(trimmedTag)) {
                    setError("Tag already exists");
                    return;
                  }

                  // Validate tag
                  if (validate) {
                    const validationResult = validate(trimmedTag);
                    if (validationResult !== true) {
                      setError(typeof validationResult === "string" ? validationResult : "Invalid tag");
                      return;
                    }
                  }
                }
              });

              // If no errors, add all tags
              if (!error) {
                const newTags = [...tags];
                validParts.forEach((part) => {
                  const trimmedTag = part.trim();
                  if (trimmedTag && (!maxLength || trimmedTag.length <= maxLength) && (allowDuplicates || !tags.includes(trimmedTag))) {
                    if (!validate || validate(trimmedTag) === true) {
                      if (!maxTags || newTags.length < maxTags) {
                        newTags.push(trimmedTag);
                        onTagAdd?.(trimmedTag);
                      }
                    }
                  }
                });
                if (newTags.length > tags.length) {
                  updateTags(newTags);
                }
              }
              setInputValue("");
            }
          }
        } else if (separator instanceof RegExp) {
          const parts = newValue.split(separator);
          if (parts.length > 1) {
            const validParts = parts.filter((part) => part.trim());
            if (validParts.length > 0) {
              // Add all tags at once
              const newTags = [...tags];
              validParts.forEach((part) => {
                const trimmedTag = part.trim();
                if (trimmedTag && (!maxLength || trimmedTag.length <= maxLength) && (allowDuplicates || !tags.includes(trimmedTag))) {
                  if (!validate || validate(trimmedTag) === true) {
                    if (!maxTags || newTags.length < maxTags) {
                      newTags.push(trimmedTag);
                      onTagAdd?.(trimmedTag);
                    }
                  }
                }
              });
              if (newTags.length > tags.length) {
                updateTags(newTags);
              }
              setInputValue("");
            }
          }
        }
      },
      [separator, tags, maxLength, allowDuplicates, validate, maxTags, error, updateTags, onTagAdd]
    );

    const handleInputKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        // Add tag on Enter or comma
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          if (inputValue.trim()) {
            addTag(inputValue);
          }
        }

        // Remove last tag on Backspace when input is empty
        if (e.key === "Backspace" && !inputValue && tags.length > 0) {
          removeTag(tags[tags.length - 1]);
        }

        // Escape to clear input
        if (e.key === "Escape") {
          setInputValue("");
          setError(null);
        }
      },
      [disabled, inputValue, tags, addTag, removeTag]
    );

    const handleInputBlur = React.useCallback(() => {
      // Add tag on blur if input has value
      if (inputValue.trim()) {
        addTag(inputValue);
      }
      setError(null);
    }, [inputValue, addTag]);

    return (
      <div ref={ref} className={clsx("w-full", className)} {...props}>
        <div
          className={clsx(
            "flex flex-wrap items-center gap-[var(--space-2)] min-h-[2.5rem] w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] px-[var(--space-3)] py-[var(--space-2)]",
            disabled && "opacity-60 cursor-not-allowed",
            error && "border-[color:var(--color-status-error-border)]"
          )}
          onClick={() => {
            if (!disabled && inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          {/* Tags */}
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="outline"
              className={clsx(
                "flex items-center gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-0-5)]",
                tagClassName
              )}
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="ml-[var(--space-1)] rounded-full hover:bg-[color:var(--color-surface-2)] p-[var(--space-0-5)] transition-colors duration-[var(--motion-duration-base)]"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            disabled={disabled}
            placeholder={tags.length === 0 ? placeholder : ""}
            className={clsx(
              "flex-1 min-w-[120px] bg-transparent outline-none text-sm",
              "placeholder:text-[color:var(--color-fg-muted)]",
              inputClassName
            )}
            aria-label="Add tag"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-[var(--space-1)] text-xs text-[color:var(--color-status-error-fg)]">{error}</p>
        )}

        {/* Helper Text */}
        {maxTags && (
          <p className="mt-[var(--space-1)] text-xs text-[color:var(--color-fg-muted)]">
            {tags.length} / {maxTags} tags
          </p>
        )}
      </div>
    );
  }
  )
);

TagInput.displayName = "TagInput";

