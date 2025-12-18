import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import clsx from "clsx";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "linear" | "circular";
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "error" | "info";
}

export const Progress = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
  >(function Progress(
  {
    className,
    value = 0,
    max = 100,
    label,
    showValue = false,
    variant = "linear",
    size = "md",
    color = "default",
    ...props
  },
  ref
) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  const colorClasses = {
    default: "bg-[color:var(--color-brand-primary)]",
    success: "bg-[color:var(--color-status-success-base)]",
    warning: "bg-[color:var(--color-status-warning-base)]",
    error: "bg-[color:var(--color-status-error-base)]",
    info: "bg-[color:var(--color-status-info-base)]",
  };

  if (variant === "circular") {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const sizePx = size === "sm" ? 48 : size === "md" ? 64 : 80;
    const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8;

    return (
      <div className="inline-flex flex-col items-center gap-[var(--space-2)]">
        <div className="relative" style={{ width: sizePx, height: sizePx }}>
          <svg
            className="transform -rotate-90"
            width={sizePx}
            height={sizePx}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-[color:var(--color-surface-2)]"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={clsx("transition-all duration-[var(--motion-duration-slow)]", colorClasses[color])}
            />
          </svg>
          {(showValue || label) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {showValue && (
                  <div className="text-sm font-semibold">{Math.round(percentage)}%</div>
                )}
                {label && !showValue && (
                  <div className="text-xs text-[color:var(--color-fg-muted)]">{label}</div>
                )}
              </div>
            </div>
          )}
        </div>
        {label && showValue && (
          <div className="text-xs text-[color:var(--color-fg-muted)]">{label}</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-[var(--space-2)]">
          {label && <span className="text-sm text-[color:var(--color-fg-base)]">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-[color:var(--color-fg-base)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={clsx(
          "relative w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={clsx(
            "h-full w-full flex-1 transition-all duration-[var(--motion-duration-slow)]",
            colorClasses[color]
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
})
);

export interface StepProgressProps {
  steps: Array<{
    label: string;
    completed?: boolean;
    current?: boolean;
  }>;
  orientation?: "horizontal" | "vertical";
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  orientation = "horizontal",
}) => {
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col gap-[var(--space-4)]">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-[var(--space-3)]">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                  step.completed
                    ? "bg-[color:var(--color-status-success-base)] border-[color:var(--color-status-success-base)] text-white"
                    : step.current
                      ? "bg-[color:var(--color-brand-primary)] border-[color:var(--color-brand-primary)] text-white"
                      : "bg-[color:var(--color-surface-2)] border-[color:var(--color-border-base)] text-[color:var(--color-fg-muted)]"
                )}
              >
                {step.completed ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "w-0.5 h-full min-h-[2rem] mt-2",
                    step.completed
                      ? "bg-[color:var(--color-status-success-base)]"
                      : "bg-[color:var(--color-border-base)]"
                  )}
                />
              )}
            </div>
            <div className="flex-1 pt-1">
              <div
                className={clsx(
                  "text-sm font-medium",
                  step.completed || step.current
                    ? "text-[color:var(--color-fg-base)]"
                    : "text-[color:var(--color-fg-muted)]"
                )}
              >
                {step.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between mb-[var(--space-4)]">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors mb-[var(--space-2)] bg-[color:var(--color-surface-1)]",
                  step.completed
                    ? "bg-[color:var(--color-status-success-base)] border-[color:var(--color-status-success-base)] text-white"
                    : step.current
                      ? "bg-[color:var(--color-brand-primary)] border-[color:var(--color-brand-primary)] text-white"
                      : "bg-[color:var(--color-surface-2)] border-[color:var(--color-border-base)] text-[color:var(--color-fg-muted)]"
                )}
              >
                {step.completed ? "✓" : index + 1}
              </div>
              <div
                className={clsx(
                  "text-xs text-center",
                  step.completed || step.current
                    ? "text-[color:var(--color-fg-base)] font-medium"
                    : "text-[color:var(--color-fg-muted)]"
                )}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "absolute top-5 h-0.5 z-0",
                  step.completed
                    ? "bg-[color:var(--color-status-success-base)]"
                    : "bg-[color:var(--color-border-base)]"
                )}
                style={{
                  left: `${((index + 1) / steps.length) * 100}%`,
                  width: `${100 / steps.length}%`,
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

