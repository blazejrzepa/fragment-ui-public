"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import {
  FormEnhanced,
  FormFieldEnhanced,
  FormArray,
  Button,
  Input,
  validators,
} from "@fragment_ui/ui";
import { useState } from "react";

export default function FieldArraysExample() {
  const [items, setItems] = useState<Array<{ name: string; email: string }>>([
    { name: "", email: "" },
  ]);

  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Field Arrays</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Field Arrays example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] max-w-2xl">
        <FormEnhanced
          onSubmit={(data) => {
            alert("Form submitted!");
          }}
        >
          <div className="space-y-6">
            <FormFieldEnhanced
              name="teamName"
              label="Team Name"
              rules={validators.required()}
            >
              <Input placeholder="Enter team name" />
            </FormFieldEnhanced>

            <div>
              <label className="text-sm font-medium mb-2 block">Team Members</label>
              <FormArray
                items={items}
                onAdd={() => setItems([...items, { name: "", email: "" }])}
                onRemove={(index) => setItems(items.filter((_, i) => i !== index))}
                addLabel="Add Member"
                minItems={1}
                maxItems={10}
                renderItem={(item, index, remove) => (
                  <div className="space-y-2">
                    <FormFieldEnhanced
                      name={`members[${index}].name`}
                      label={`Member ${index + 1} Name`}
                      rules={validators.required()}
                    >
                      <Input placeholder="Name" />
                    </FormFieldEnhanced>
                    <FormFieldEnhanced
                      name={`members[${index}].email`}
                      label={`Member ${index + 1} Email`}
                      rules={validators.compose(validators.required(), validators.email())}
                    >
                      <Input type="email" placeholder="Email" />
                    </FormFieldEnhanced>
                  </div>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </div>
        </FormEnhanced>
      </div>
    </DocLayout>
  );
}

