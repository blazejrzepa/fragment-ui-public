import * as React from "react";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { RadioGroup, Radio } from "./radio";

export interface FormFieldProps {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  showErrorIcon?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ label, error, helperText, required, children, className, showErrorIcon = true }, ref) {
    const id = React.useId();
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div ref={ref} className={clsx("space-y-2", className)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[color:var(--color-fg-base)]"
          >
            {label}
            {required && <span className="ml-1 text-[color:var(--color-status-error-base)]">*</span>}
          </label>
        )}
        <div>
          {React.isValidElement(children) ? (
            React.cloneElement(children as React.ReactElement, {
              id,
              error: hasError,
              "aria-invalid": hasError ? "true" : undefined,
              "aria-describedby": (hasError || helperText) ? `${id}-description` : undefined,
            })
          ) : (
            children
          )}
        </div>
        {(hasError || helperText) && (
          <div
            id={`${id}-description`}
            className={clsx(
              "flex items-start gap-1.5 text-xs",
              hasError
                ? "text-[color:var(--color-status-error-fg)]"
                : "text-[color:var(--color-fg-muted)]"
            )}
            role={hasError ? "alert" : undefined}
          >
            {hasError && showErrorIcon && (
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
            )}
            <span>{errorMessage || helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

export interface FormFieldInputProps extends Omit<React.ComponentProps<typeof Input>, "error"> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
}

export const FormFieldInput = React.forwardRef<HTMLInputElement, FormFieldInputProps>(
  function FormFieldInput({ label, error, helperText, required, className, ...props }, ref) {
    return (
      <FormField label={label} error={error} helperText={helperText} required={required}>
        <Input
          ref={ref}
          error={Boolean(error)}
          className={className}
          {...props}
        />
      </FormField>
    );
  }
);

export interface FormFieldTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "error"> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
}

export const FormFieldTextarea = React.forwardRef<HTMLTextAreaElement, FormFieldTextareaProps>(
  function FormFieldTextarea({ label, error, helperText, required, className, ...props }, ref) {
    return (
      <FormField label={label} error={error} helperText={helperText} required={required}>
        <Textarea
          ref={ref}
          error={Boolean(error)}
          className={className}
          {...props}
        />
      </FormField>
    );
  }
);

