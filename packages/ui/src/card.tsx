import * as React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    function Card({ className, style, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx(
            "inline-flex flex-col items-start rounded-[var(--radius-md)] p-[var(--space-6)]",
            "bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]",
            className
          )}
          style={style}
          {...props}
        />
      );
    }
  )
);

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, CardHeaderProps>(
    function CardHeader({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx("flex flex-col space-y-[var(--space-0)] w-full", className)}
          {...props}
        />
      );
    }
  )
);

const CardTitle = React.memo(
  React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    function CardTitle({ className, style, ...props }, ref) {
      return (
        <h3
          ref={ref}
          className={clsx(
            "text-[color:var(--color-fg-base)] font-medium",
            "text-[var(--typography-size-lg)] leading-tight",
            "mb-[calc(var(--space-1)+2px)]",
            className
          )}
          style={{
            marginBottom: "calc(var(--space-1) + 2px)", // 6px
            ...style,
          }}
          {...props}
        />
      );
    }
  )
);

const CardDescription = React.memo(
  React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    function CardDescription({ className, style, ...props }, ref) {
      return (
        <p
          ref={ref}
          className={clsx(
            "text-[var(--typography-size-sm)] text-[color:var(--color-fg-muted)] leading-relaxed",
            "mt-[var(--space-0)]",
            className
          )}
          style={{
            color: "var(--color-fg-muted)",
            ...style,
          }}
          {...props}
        />
      );
    }
  )
);

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, CardContentProps>(
    function CardContent({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx(
            "text-[color:var(--color-fg-base)] text-[var(--typography-size-sm)] leading-relaxed",
            // Default vertical spacing between card header and content
            "mt-[var(--space-4)]",
            // Reset margin-bottom for CardContent and p elements inside
            "mb-[var(--space-0)]",
            "[&_p]:mb-[var(--space-0)]",
            className
          )}
          {...props}
        />
      );
    }
  )
);

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, CardFooterProps>(
    function CardFooter({ className, style, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx(
            "flex items-center w-full",
            className
          )}
          style={{
            marginTop: "var(--space-0)",
            paddingTop: "var(--space-6)", // 24px - force override any global styles
            ...style,
          }}
          {...props}
        />
      );
    }
  )
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

