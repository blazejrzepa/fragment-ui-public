"use client";

import * as React from "react";
import { FormField, FormFieldProps } from "./form-field";
import { FormArray, FormArrayProps } from "./form-array";
import { ConditionalField, useConditionalShow, ConditionalRule } from "./form-conditional";
import { validateValue, ValidationRules } from "./form-validation";
import clsx from "clsx";

export interface FormEnhancedProps {
  children: React.ReactNode;
  onSubmit?: (data: FormData) => void;
  onError?: (errors: Record<string, string>) => void;
  className?: string;
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  validateOnMount?: boolean;
}

export interface FormContextValue {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string | undefined) => void;
  setTouched: (name: string, touched: boolean) => void;
  validateField: (name: string, value: any, rules?: ValidationRules) => void;
  validationMode: "onChange" | "onBlur" | "onSubmit";
}

const FormContext = React.createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormEnhanced");
  }
  return context;
}

export function FormEnhanced({
  children,
  onSubmit,
  onError,
  className,
  validationMode = "onSubmit",
  validateOnMount = false,
}: FormEnhancedProps) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouchedState] = React.useState<Record<string, boolean>>({});
  const [fieldRules, setFieldRules] = React.useState<Record<string, ValidationRules>>({});

  const setValue = React.useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when value changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const setError = React.useCallback((name: string, error: string | undefined) => {
    setErrors((prev) => {
      if (error) {
        return { ...prev, [name]: error };
      }
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handleSetTouched = React.useCallback((name: string, isTouched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = React.useCallback(
    (name: string, value: any, rules?: ValidationRules) => {
      if (rules) {
        setFieldRules((prev) => ({ ...prev, [name]: rules }));
      }
      const rulesToUse = rules || fieldRules[name];
      const error = validateValue(value, rulesToUse);
      setError(name, error);
      return !error;
    },
    [fieldRules, setError]
  );

  const validateAll = React.useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(fieldRules).forEach(([name, rules]) => {
      const error = validateValue(values[name], rules);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, fieldRules]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const formData = new FormData(e.currentTarget);
      const formValues: Record<string, any> = {};
      
      // Collect all form values
      formData.forEach((value, key) => {
        formValues[key] = value;
      });
      
      // Merge with controlled values
      const allValues = { ...formValues, ...values };

      // Validate all fields
      const isValid = validateAll();
      if (!isValid) {
        // Get current errors after validation
        const currentErrors: Record<string, string> = {};
        Object.entries(fieldRules).forEach(([name, rules]) => {
          const error = validateValue(allValues[name], rules);
          if (error) {
            currentErrors[name] = error;
          }
        });
        setErrors(currentErrors);
        onError?.(currentErrors);
        return;
      }

      // Convert to FormData for submission
      const submitData = new FormData();
      Object.entries(allValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, String(value));
        }
      });

      onSubmit?.(submitData);
    },
    [values, errors, validateAll, onSubmit, onError]
  );

  const contextValue: FormContextValue = React.useMemo(
    () => ({
      values,
      errors,
      touched,
      setValue,
      setError,
      setTouched: handleSetTouched,
      validateField,
      validationMode,
    }),
    [values, errors, touched, setValue, setError, handleSetTouched, validateField, validationMode]
  );

  React.useEffect(() => {
    if (validateOnMount) {
      validateAll();
    }
  }, [validateOnMount, validateAll]);

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export interface FormFieldEnhancedProps extends Omit<FormFieldProps, "error"> {
  name: string;
  rules?: ValidationRules;
  conditional?: ConditionalRule[] | boolean;
}

export function FormFieldEnhanced({
  name,
  rules,
  conditional,
  children,
  ...props
}: FormFieldEnhancedProps) {
  const { values, errors, touched, setValue, setTouched: handleSetTouched, validateField, validationMode } =
    useFormContext();
  const [localValue, setLocalValue] = React.useState(values[name] || "");

  const shouldShow = useConditionalShow(conditional ?? true, values);
  const error = errors[name];
  const isTouched = touched[name];

  React.useEffect(() => {
    if (values[name] !== localValue) {
      setLocalValue(values[name] || "");
    }
  }, [values, name, localValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      setValue(name, newValue);

      if (validationMode === "onChange" && rules) {
        validateField(name, newValue, rules);
      }
    },
    [name, setValue, validateField, rules, validationMode]
  );

  const handleBlur = React.useCallback(() => {
    handleSetTouched(name, true);
    if (validationMode === "onBlur" && rules) {
      validateField(name, localValue, rules);
    }
  }, [name, handleSetTouched, validateField, localValue, rules, validationMode]);

  if (!shouldShow) return null;

  return (
    <FormField {...props} error={isTouched ? error : undefined}>
      {React.cloneElement(children as React.ReactElement, {
        name,
        value: localValue,
        onChange: handleChange,
        onBlur: handleBlur,
      })}
    </FormField>
  );
}

// FormArray, ConditionalField, and useConditionalShow are already exported from their respective modules
// Import them directly from './form-array' and './form-conditional' instead

