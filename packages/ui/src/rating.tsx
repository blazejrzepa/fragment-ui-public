"use client";

import * as React from "react";
import clsx from "clsx";
import { Star } from "lucide-react";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number; // default: 5
  half?: boolean; // half-star support
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  showValue?: boolean; // show numeric value
  allowClear?: boolean; // allow clearing rating by clicking current value
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const sizeTextClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const Rating = React.memo(
  React.forwardRef<HTMLDivElement, RatingProps>(
    function Rating(
    {
      value: controlledValue,
      defaultValue,
      onChange,
      max = 5,
      half = false,
      readOnly = false,
      size = "md",
      disabled = false,
      className,
      showValue = false,
      allowClear = false,
      ...props
    },
    ref
  ) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? 0
    );
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const displayValue = hoverValue ?? currentValue;

    const handleClick = React.useCallback(
      (newValue: number) => {
        if (disabled || readOnly) return;

        // If allowClear and clicking the same value, clear it
        if (allowClear && newValue === currentValue) {
          const clearedValue = 0;
          if (!isControlled) {
            setUncontrolledValue(clearedValue);
          }
          onChange?.(clearedValue);
          return;
        }

        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onChange?.(newValue);
      },
      [disabled, readOnly, allowClear, currentValue, isControlled, onChange]
    );

    const handleMouseEnter = React.useCallback(
      (starValue: number) => {
        if (disabled || readOnly) return;
        setHoverValue(starValue);
      },
      [disabled, readOnly]
    );

    const handleMouseLeave = React.useCallback(() => {
      if (disabled || readOnly) return;
      setHoverValue(null);
    }, [disabled, readOnly]);

    const getStarFill = React.useCallback(
      (starIndex: number) => {
        const starValue = starIndex + 1;
        const halfStarValue = starValue - 0.5;

        if (displayValue >= starValue) {
          return 1; // Full star
        } else if (half && displayValue >= halfStarValue) {
          return 0.5; // Half star
        }
        return 0; // Empty star
      },
      [displayValue, half]
    );

    const handleHalfStarClick = React.useCallback(
      (starIndex: number) => {
        if (disabled || readOnly || !half) return;
        const halfStarValue = starIndex + 0.5;
        handleClick(halfStarValue);
      },
      [disabled, readOnly, half, handleClick]
    );

    const handleFullStarClick = React.useCallback(
      (starIndex: number) => {
        if (disabled || readOnly) return;
        const fullStarValue = starIndex + 1;
        handleClick(fullStarValue);
      },
      [disabled, readOnly, handleClick]
    );

    return (
      <div
        ref={ref}
        className={clsx(
          "inline-flex items-center gap-[var(--space-2)]",
          disabled && "opacity-60 cursor-not-allowed",
          readOnly && "cursor-default",
          !disabled && !readOnly && "cursor-pointer",
          className
        )}
        onMouseLeave={handleMouseLeave}
        role={readOnly ? "img" : "radiogroup"}
        aria-label={`Rating: ${currentValue} out of ${max} stars`}
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: max }, (_, index) => {
            const fill = getStarFill(index);
            const isFilled = fill > 0;
            const isHalfFilled = fill === 0.5;

            if (readOnly) {
              // In readOnly mode, render stars without buttons
              return (
                <div key={index} className="relative inline-flex">
                  {half ? (
                    <>
                      {/* Half star (left) */}
                      <div
                        className={clsx(
                          "absolute left-0 top-0 overflow-hidden",
                          sizeClasses[size]
                        )}
                        style={{ width: "50%" }}
                        aria-hidden="true"
                      >
                        <Star
                          className={clsx(
                            sizeClasses[size],
                            isHalfFilled || isFilled
                              ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                              : "fill-transparent text-[color:var(--color-fg-muted)]"
                          )}
                        />
                      </div>
                      {/* Half star (right) */}
                      <div
                        className={clsx(
                          "absolute right-0 top-0 overflow-hidden",
                          sizeClasses[size]
                        )}
                        style={{ width: "50%" }}
                        aria-hidden="true"
                      >
                        <Star
                          className={clsx(
                            sizeClasses[size],
                            isFilled
                              ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                              : "fill-transparent text-[color:var(--color-fg-muted)]"
                          )}
                        />
                      </div>
                      {/* Background star */}
                      <Star
                        className={clsx(
                          sizeClasses[size],
                          "fill-transparent text-[color:var(--color-fg-muted)] pointer-events-none"
                        )}
                      />
                    </>
                  ) : (
                    <Star
                      className={clsx(
                        sizeClasses[size],
                        isFilled
                          ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                          : "fill-transparent text-[color:var(--color-fg-muted)]"
                      )}
                    />
                  )}
                </div>
              );
            }

            return (
              <div
                key={index}
                className="relative inline-flex"
                onMouseEnter={() => handleMouseEnter(index + 1)}
              >
                {half ? (
                  <>
                    {/* Half star (left) */}
                    <button
                      type="button"
                      onClick={() => handleHalfStarClick(index)}
                      disabled={disabled}
                      className={clsx(
                        "absolute left-0 top-0 overflow-hidden",
                        sizeClasses[size],
                        "transition-colors",
                        !disabled && "hover:opacity-80"
                      )}
                      style={{ width: "50%" }}
                      aria-label={`Rate ${index + 0.5} stars`}
                    >
                      <Star
                        className={clsx(
                          sizeClasses[size],
                          isHalfFilled || isFilled
                            ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                            : "fill-transparent text-[color:var(--color-fg-muted)]"
                        )}
                      />
                    </button>
                    {/* Half star (right) */}
                    <button
                      type="button"
                      onClick={() => handleFullStarClick(index)}
                      disabled={disabled}
                      className={clsx(
                        "absolute right-0 top-0 overflow-hidden",
                        sizeClasses[size],
                        "transition-colors",
                        !disabled && "hover:opacity-80"
                      )}
                      style={{ width: "50%" }}
                      aria-label={`Rate ${index + 1} stars`}
                    >
                      <Star
                        className={clsx(
                          sizeClasses[size],
                          isFilled
                            ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                            : "fill-transparent text-[color:var(--color-fg-muted)]"
                        )}
                      />
                    </button>
                    {/* Background star */}
                    <Star
                      className={clsx(
                        sizeClasses[size],
                        "fill-transparent text-[color:var(--color-fg-muted)] pointer-events-none"
                      )}
                    />
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFullStarClick(index)}
                    disabled={disabled}
                    className={clsx(
                      "transition-colors",
                      !disabled && "hover:opacity-80"
                    )}
                    aria-label={`Rate ${index + 1} stars`}
                  >
                    <Star
                      className={clsx(
                        sizeClasses[size],
                        isFilled
                          ? "fill-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary)]"
                          : "fill-transparent text-[color:var(--color-fg-muted)]"
                      )}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {showValue && (
          <span
            className={clsx(
              "font-medium text-[color:var(--color-fg-base)]",
              sizeTextClasses[size]
            )}
          >
            {currentValue.toFixed(half ? 1 : 0)}/{max}
          </span>
        )}
      </div>
    );
  }
  )
);

Rating.displayName = "Rating";

