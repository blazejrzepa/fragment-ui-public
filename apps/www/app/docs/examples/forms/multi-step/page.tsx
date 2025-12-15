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

export default function MultiStepFormExample() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Multi Step</h1>
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
        Multi Step example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6 max-w-md">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[color:var(--color-fg-muted)]">Step {step} of {totalSteps}</span>
            <span className="text-sm text-[color:var(--color-fg-muted)]">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
            <div
              className="bg-[color:var(--color-brand-primary)] h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <FormEnhanced
          onSubmit={(data) => {
            alert("Form completed!");
            setStep(1);
          }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <FormFieldEnhanced
                name="name"
                label="Name"
                rules={validators.required()}
              >
                <Input placeholder="John Doe" />
              </FormFieldEnhanced>
              <FormFieldEnhanced
                name="email"
                label="Email"
                rules={validators.compose(validators.required(), validators.email())}
              >
                <Input type="email" placeholder="john@example.com" />
              </FormFieldEnhanced>
              <Button type="button" onClick={() => setStep(2)}>Next</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <FormFieldEnhanced
                name="username"
                label="Username"
                rules={validators.required()}
              >
                <Input placeholder="johndoe" />
              </FormFieldEnhanced>
              <FormFieldEnhanced
                name="password"
                label="Password"
                rules={validators.compose(validators.required(), validators.minLength(8))}
              >
                <Input type="password" />
              </FormFieldEnhanced>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review</h3>
              <p className="text-sm text-[color:var(--color-fg-muted)]">Review your information and submit.</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          )}
        </FormEnhanced>
      </div>
    </DocLayout>
  );
}

