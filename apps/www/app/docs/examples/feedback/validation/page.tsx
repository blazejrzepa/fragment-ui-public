"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  FormEnhanced,
  FormFieldEnhanced,
  Input,
  Button,
  validators,
} from "@fragment_ui/ui";

export default function FormValidationExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Validation</h1>
      <p className="mb-[var(--space-6)] intro-text text-[color:var(--foreground-secondary)] font-normal">
        Validation example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] max-w-md">
        <FormEnhanced
          onSubmit={(data) => {
            alert("Form is valid!");
          }}
          validationMode="onBlur"
        >
          <div className="space-y-4">
            <FormFieldEnhanced
              name="email"
              label="Email"
              rules={validators.compose(
                validators.required("Email is required"),
                validators.email("Please enter a valid email")
              )}
            >
              <Input type="email" placeholder="email@example.com" />
            </FormFieldEnhanced>

            <FormFieldEnhanced
              name="password"
              label="Password"
              rules={validators.compose(
                validators.required("Password is required"),
                validators.minLength(8, "Password must be at least 8 characters")
              )}
            >
              <Input type="password" />
            </FormFieldEnhanced>

            <Button type="submit">Submit</Button>
          </div>
        </FormEnhanced>
      </div>
    </DocLayout>
  );
}

