"use client";

import * as React from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  clickable?: boolean;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  showLabels?: boolean;
  showDescriptions?: boolean;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(
    {
      steps,
      currentStep,
      orientation = "horizontal",
      clickable = false,
      onStepClick,
      className,
      showLabels = true,
      showDescriptions = false,
    },
    ref
  ) {
    const isHorizontal = orientation === "horizontal";

    const getStepStatus = (index: number): "completed" | "current" | "upcoming" => {
      if (index < currentStep) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    };

    const handleStepClick = (index: number) => {
      if (clickable && onStepClick && index <= currentStep) {
        onStepClick(index);
      }
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "flex",
          isHorizontal ? "flex-row items-start" : "flex-col",
          className
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = clickable && index <= currentStep;

          return (
            <div
              key={step.id}
              className={clsx(
                "flex",
                isHorizontal ? "flex-row items-start" : "flex-col items-start",
                index < steps.length - 1 && (
                  isHorizontal
                    ? "flex-1 mr-4"
                    : "mb-4 pb-4 relative"
                )
              )}
            >
              {/* Step Content */}
              <div className="flex items-start">
                {/* Step Circle/Icon */}
                <div
                  className={clsx(
                    "flex items-center justify-center rounded-full border-2 transition-colors",
                    status === "completed" &&
                      "bg-brand border-brand text-white",
                    status === "current" &&
                      "bg-[color:var(--color-surface-1)] border-brand text-brand",
                    status === "upcoming" &&
                      "bg-[color:var(--color-surface-1)] border-[color:var(--color-fg-muted)] text-[color:var(--color-fg-muted)]",
                    isClickable && "cursor-pointer hover:border-brand",
                    step.icon ? "w-10 h-10" : "w-8 h-8"
                  )}
                  onClick={() => handleStepClick(index)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {status === "completed" ? (
                    <Check className="w-4 h-4" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label & Description */}
                {showLabels && (
                  <div className={clsx("ml-3", isHorizontal && "flex-1")}>
                    <div
                      className={clsx(
                        "font-medium",
                        status === "completed" && "text-[color:var(--color-fg-base)]",
                        status === "current" && "text-brand",
                        status === "upcoming" && "text-[color:var(--color-fg-muted)]"
                      )}
                    >
                      {step.label}
                    </div>
                    {showDescriptions && step.description && (
                      <div className="text-sm text-[color:var(--color-fg-muted)] mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "absolute transition-colors",
                    isHorizontal
                      ? "left-8 top-4 right-0 h-0.5 -translate-x-1/2"
                      : "left-4 top-10 bottom-0 w-0.5 -translate-y-1/2",
                    status === "completed"
                      ? "bg-brand"
                      : "bg-[color:var(--color-fg-muted)]"
                  )}
                  style={
                    isHorizontal
                      ? { width: "calc(100% - 2rem)", marginLeft: "2rem" }
                      : { height: "calc(100% - 2rem)", marginTop: "2rem" }
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

