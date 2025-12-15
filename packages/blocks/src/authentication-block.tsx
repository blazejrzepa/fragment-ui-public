"use client";

import * as React from "react";
import {
  Button,
  Input,
  FormFieldInput,
  Separator,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fragment_ui/ui";
import clsx from "clsx";

export type AuthMode = "login" | "signup" | "reset";

export interface SocialLoginProvider {
  name: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface AuthenticationBlockProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSubmit?: (data: {
    email: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
  }) => void | Promise<void>;
  onSocialLogin?: (provider: string) => void | Promise<void>;
  socialProviders?: SocialLoginProvider[];
  showSocialLogin?: boolean;
  title?: string;
  description?: string;
  className?: string;
  error?: string;
  loading?: boolean;
}

export function AuthenticationBlock({
  mode = "login",
  onModeChange,
  onSubmit,
  onSocialLogin,
  socialProviders = [
    { name: "Google", onClick: () => console.log("Google login") },
    { name: "GitHub", onClick: () => console.log("GitHub login") },
  ],
  showSocialLogin = true,
  title,
  description,
  className,
  error,
  loading = false,
}: AuthenticationBlockProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    // Validation
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (mode === "login" || mode === "signup") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (mode === "signup" && formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    if (mode === "signup") {
      if (!formData.name) {
        errors.name = "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          email: formData.email,
          password: mode !== "reset" ? formData.password : undefined,
          name: mode === "signup" ? formData.name : undefined,
          confirmPassword: mode === "signup" ? formData.confirmPassword : undefined,
        });
      }
    } catch (err) {
      // Error handling is done by parent component via error prop
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    if (onSocialLogin) {
      await onSocialLogin(provider.name);
    } else {
      provider.onClick();
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (mode) {
      case "login":
        return "Sign in to your account";
      case "signup":
        return "Create an account";
      case "reset":
        return "Reset your password";
    }
  };

  const getDescription = () => {
    if (description) return description;
    switch (mode) {
      case "login":
        return "Enter your email and password to sign in";
      case "signup":
        return "Enter your information to create an account";
      case "reset":
        return "Enter your email address and we'll send you a reset link";
    }
  };

  const displayTitle = getTitle();
  const displayDescription = getDescription();

  return (
    <div className={clsx("w-full max-w-md mx-auto", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
          {displayDescription && <CardDescription>{displayDescription}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-[color:var(--color-accent-red)]/10 border border-[color:var(--color-accent-red)]/20 text-sm text-[color:var(--color-accent-red)]">
                {error}
              </div>
            )}

            {mode === "signup" && (
              <FormFieldInput
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={formErrors.name}
                required
                placeholder="John Doe"
                disabled={isSubmitting || loading}
              />
            )}

            <FormFieldInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={formErrors.email}
              required
              placeholder="your@email.com"
              disabled={isSubmitting || loading}
            />

            {mode !== "reset" && (
              <FormFieldInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={formErrors.password}
                required
                placeholder="••••••••"
                disabled={isSubmitting || loading}
              />
            )}

            {mode === "signup" && (
              <FormFieldInput
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={formErrors.confirmPassword}
                required
                placeholder="••••••••"
                disabled={isSubmitting || loading}
              />
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <div></div>
                <button
                  type="button"
                  onClick={() => onModeChange?.("reset")}
                  className="text-sm text-[color:var(--color-brand-primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="solid"
              size="lg"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading
                ? "Loading..."
                : mode === "login"
                ? "Sign in"
                : mode === "signup"
                ? "Create account"
                : "Send reset link"}
            </Button>
          </form>

          {showSocialLogin && mode !== "reset" && (
            <>
              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-[color:var(--color-fg-muted)]">
                  OR
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-2">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSocialLogin(provider)}
                    disabled={isSubmitting || loading}
                  >
                    {provider.icon && <span className="mr-2">{provider.icon}</span>}
                    Continue with {provider.name}
                  </Button>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 text-center text-sm text-[color:var(--color-fg-muted)]">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange?.("signup")}
                  className="text-[color:var(--color-brand-primary)] hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange?.("login")}
                  className="text-[color:var(--color-brand-primary)] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange?.("login")}
                  className="text-[color:var(--color-brand-primary)] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

