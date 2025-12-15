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
      <h1 className="text-3xl font-medium mb-4">Validation</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Validation example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6 max-w-md">
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

