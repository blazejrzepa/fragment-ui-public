"use client";

import { FormEnhanced, FormArray, FormFieldEnhanced, Input } from "@fragment_ui/ui";
import { useState } from "react";
import { validators } from "@fragment_ui/ui";

export function FormArrayExample() {
  const [items, setItems] = useState<Array<{ name: string; email: string }>>([
    { name: "", email: "" },
  ]);

  return (
    <FormEnhanced onSubmit={(data) => console.log("Form submitted", data)}>
      <FormArray
        items={items}
        onAdd={() => setItems([...items, { name: "", email: "" }])}
        onRemove={(index) => setItems(items.filter((_, i) => i !== index))}
        addLabel="Add Member"
        minItems={1}
        maxItems={5}
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
              <Input type="email" placeholder="email@example.com" />
            </FormFieldEnhanced>
            <button
              type="button"
              className="text-sm text-[color:var(--foreground-secondary)] underline"
              onClick={() => remove()}
            >
              Remove
            </button>
          </div>
        )}
      />
      <div className="mt-4">
        <button
          type="submit"
          className="rounded bg-[color:var(--accent-primary)] px-4 py-2 text-white"
        >
          Submit
        </button>
      </div>
    </FormEnhanced>
  );
}

