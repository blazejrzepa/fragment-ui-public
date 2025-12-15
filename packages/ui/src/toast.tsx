import * as React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast, type ExternalToast } from "sonner";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToasterProps {
  position?: ToastPosition;
  richColors?: boolean;
  closeButton?: boolean;
  expand?: boolean;
  duration?: number;
  visibleToasts?: number;
  toastOptions?: ExternalToast;
  theme?: "light" | "dark" | "system";
  className?: string;
}

export const Toaster: React.FC<ToasterProps> = ({
  position = "top-right",
  richColors = true,
  closeButton = true,
  expand = true,
  duration = 4000,
  visibleToasts = 3,
  toastOptions,
  theme = "dark",
  className,
}) => (
  <SonnerToaster
    position={position}
    richColors={richColors}
    closeButton={closeButton}
    expand={expand}
    duration={duration}
    visibleToasts={visibleToasts}
    toastOptions={toastOptions}
    theme={theme}
    className={className}
  />
);

export interface ToastAction {
  label: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  actionButtonStyle?: React.CSSProperties;
}

export interface ToastProps extends ExternalToast {
  title?: string;
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
}

const createToast = (
  type: "success" | "error" | "info" | "warning" | "default",
  message: string | React.ReactNode,
  options?: ToastProps
) => {
  const { title, description, action, cancel, ...restOptions } = options || {};

  const toastConfig: ExternalToast = {
    ...restOptions,
    ...(action && {
      action: {
        label: action.label,
        onClick: action.onClick,
        actionButtonStyle: action.actionButtonStyle,
      },
    }),
    ...(cancel && {
      cancel: {
        label: cancel.label,
        onClick: cancel.onClick,
        actionButtonStyle: cancel.actionButtonStyle,
      },
    }),
  };

  if (title || description) {
    const content = (
      <div>
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    );
    if (type === "default") {
      return sonnerToast(content, toastConfig);
    }
    return sonnerToast[type](content, toastConfig);
  }

  if (type === "default") {
    return sonnerToast(message, toastConfig);
  }
  return sonnerToast[type](message, toastConfig);
};

export const toast = {
  success: (message: string | React.ReactNode, options?: ToastProps) =>
    createToast("success", message, options),
  error: (message: string | React.ReactNode, options?: ToastProps) =>
    createToast("error", message, options),
  info: (message: string | React.ReactNode, options?: ToastProps) =>
    createToast("info", message, options),
  warning: (message: string | React.ReactNode, options?: ToastProps) =>
    createToast("warning", message, options),
  message: (message: string | React.ReactNode, options?: ToastProps) =>
    createToast("default", message, options),
  custom: (content: (id: string | number) => React.ReactElement, options?: ExternalToast) =>
    sonnerToast.custom(content, options),
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      ...restOptions
    }: {
      loading?: string | React.ReactNode;
      success?: string | React.ReactNode | ((data: T) => string | React.ReactNode);
      error?: string | React.ReactNode | ((error: any) => string | React.ReactNode);
    } & ExternalToast
  ) => sonnerToast.promise(promise, { loading, success, error, ...restOptions }),
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
};

