"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  FormEnhanced,
  FormFieldEnhanced,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  validators,
} from "@fragment_ui/ui";

export default function ProfileSettingsExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Profile</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Profile example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] max-w-md">
        <FormEnhanced
          onSubmit={(data) => {
            alert("Profile updated!");
          }}
          validationMode="onBlur"
        >
          <div className="space-y-4">
            <FormFieldEnhanced
              name="name"
              label="Full Name"
              rules={validators.compose(validators.required(), validators.minLength(2))}
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

            <FormFieldEnhanced
              name="bio"
              label="Bio"
              rules={validators.maxLength(500)}
            >
              <Textarea placeholder="Tell us about yourself..." rows={4} />
            </FormFieldEnhanced>

            <FormFieldEnhanced
              name="country"
              label="Country"
              rules={validators.required()}
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="pl">Poland</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldEnhanced>

            <Button type="submit">Save Changes</Button>
          </div>
        </FormEnhanced>
      </div>
    </DocLayout>
  );
}

