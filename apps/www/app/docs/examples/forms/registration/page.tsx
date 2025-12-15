"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  FormEnhanced,
  FormFieldEnhanced,
  Button,
  Input,
  validators,
} from "@fragment_ui/ui";
import { useState } from "react";

export default function RegistrationFormExample() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Registration</h1>
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
        Registration example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6 max-w-md">
        <RegistrationForm />
      </div>

      <h2>Code</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`import {
  FormEnhanced,
  FormFieldEnhanced,
  validators,
  Button,
  Input,
} from "@fragment_ui/ui";

function RegistrationForm() {
  return (
    <FormEnhanced
      onSubmit={(data) => {
        console.log("Form submitted", data);
      }}
      validationMode="onBlur"
    >
      <div className="space-y-4">
        <FormFieldEnhanced
          name="name"
          label="Full Name"
          rules={validators.compose(
            validators.required(),
            validators.minLength(2)
          )}
        >
          <Input placeholder="John Doe" />
        </FormFieldEnhanced>

        <FormFieldEnhanced
          name="email"
          label="Email"
          rules={validators.compose(
            validators.required(),
            validators.email()
          )}
        >
          <Input type="email" placeholder="john@example.com" />
        </FormFieldEnhanced>

        <FormFieldEnhanced
          name="password"
          label="Password"
          rules={validators.compose(
            validators.required(),
            validators.minLength(8)
          )}
        >
          <Input type="password" />
        </FormFieldEnhanced>

        <Button type="submit">Register</Button>
      </div>
    </FormEnhanced>
  );
}`}</code></pre>

      <h2>Features</h2>
      <ul>
        <li>Form validation with error messages</li>
        <li>Email format validation</li>
        <li>Password strength requirements</li>
        <li>Accessible form fields with ARIA labels</li>
        <li>Visual error feedback</li>
      </ul>
    </DocLayout>
  );
}

function RegistrationForm() {
  return (
    <FormEnhanced
      onSubmit={(data) => {
        alert("Registration successful!");
      }}
      validationMode="onBlur"
    >
      <div className="space-y-4">
        <FormFieldEnhanced
          name="name"
          label="Full Name"
          rules={validators.compose(
            validators.required("Name is required"),
            validators.minLength(2, "Name must be at least 2 characters")
          )}
        >
          <Input placeholder="John Doe" />
        </FormFieldEnhanced>

        <FormFieldEnhanced
          name="email"
          label="Email"
          rules={validators.compose(
            validators.required("Email is required"),
            validators.email("Please enter a valid email")
          )}
        >
          <Input type="email" placeholder="john@example.com" />
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

        <Button type="submit">Register</Button>
      </div>
    </FormEnhanced>
  );
}

