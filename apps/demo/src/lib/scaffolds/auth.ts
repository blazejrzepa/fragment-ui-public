/**
 * Authentication flow scaffold
 * 
 * Generates authentication pages (login, signup, reset password)
 */

import type { UiPage, UiSection, UiComponent } from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create login page scaffold
 */
export function createLoginScaffold(params?: {
  title?: string;
  includeSocialLogin?: boolean;
  includeRememberMe?: boolean;
}): UiPage {
  const {
    title = "Sign In",
    includeSocialLogin = true,
    includeRememberMe = true,
  } = params || {};

  const pageId = randomUUID();

  const loginSection: UiSection = {
    type: "section",
    id: randomUUID(),
    variant: "card",
    title,
    children: [
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Email", type: "email", placeholder: "Enter your email" },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Password", type: "password", placeholder: "Enter your password" },
      } as UiComponent,
      ...(includeRememberMe
        ? [
            {
              type: "component",
              id: randomUUID(),
              component: "Checkbox",
              props: { label: "Remember me" },
            } as UiComponent,
          ]
        : []),
      {
        type: "component",
        id: randomUUID(),
        component: "Button",
        variant: "default",
        copy: "Sign In",
      } as UiComponent,
      ...(includeSocialLogin
        ? [
            {
              type: "component",
              id: randomUUID(),
              component: "Button",
              variant: "outline",
              copy: "Sign in with Google",
            } as UiComponent,
            {
              type: "component",
              id: randomUUID(),
              component: "Button",
              variant: "outline",
              copy: "Sign in with GitHub",
            } as UiComponent,
          ]
        : []),
    ],
  };

  return {
    type: "page",
    id: pageId,
    title,
    children: [loginSection],
    layout: {
      maxWidth: "sm",
      gap: 4,
    },
    metadata: {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      source: "auth-login-scaffold",
    },
  };
}

/**
 * Create signup page scaffold
 */
export function createSignupScaffold(params?: {
  title?: string;
  includeSocialSignup?: boolean;
  includeTerms?: boolean;
}): UiPage {
  const {
    title = "Sign Up",
    includeSocialSignup = true,
    includeTerms = true,
  } = params || {};

  const pageId = randomUUID();

  const signupSection: UiSection = {
    type: "section",
    id: randomUUID(),
    variant: "card",
    title,
    children: [
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Name", placeholder: "Enter your name" },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Email", type: "email", placeholder: "Enter your email" },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Password", type: "password", placeholder: "Create a password" },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "Input",
        props: { label: "Confirm Password", type: "password", placeholder: "Confirm your password" },
      } as UiComponent,
      ...(includeTerms
        ? [
            {
              type: "component",
              id: randomUUID(),
              component: "Checkbox",
              props: { label: "I agree to the Terms and Conditions" },
            } as UiComponent,
          ]
        : []),
      {
        type: "component",
        id: randomUUID(),
        component: "Button",
        variant: "default",
        copy: "Create Account",
      } as UiComponent,
      ...(includeSocialSignup
        ? [
            {
              type: "component",
              id: randomUUID(),
              component: "Button",
              variant: "outline",
              copy: "Sign up with Google",
            } as UiComponent,
            {
              type: "component",
              id: randomUUID(),
              component: "Button",
              variant: "outline",
              copy: "Sign up with GitHub",
            } as UiComponent,
          ]
        : []),
    ],
  };

  return {
    type: "page",
    id: pageId,
    title,
    children: [signupSection],
    layout: {
      maxWidth: "sm",
      gap: 4,
    },
    metadata: {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      source: "auth-signup-scaffold",
    },
  };
}

