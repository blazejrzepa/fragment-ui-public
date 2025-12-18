"use client";

import { FormField, FormFieldInput, FormFieldTextarea, FormEnhanced, FormFieldEnhanced, FormArray, ConditionalField, useConditionalShow, validateValue, validators, DocumentContent } from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { useState } from "react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { FormArrayExample } from "./FormArrayExample";
import { ConditionalFieldsExample } from "./ConditionalFieldsExample";

export default function FormFieldPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const validationError = validateValue(
      value,
      validators.compose(validators.required(), validators.email())
    );
    setError(validationError);
  };

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">FormField</h1>
      </div>
      <p className="mb-6 intro-text">
        FormField component for creating accessible form inputs with labels, error messages, and helper text.
        Includes validation utilities, field arrays, conditional fields, and enhanced form management.
      </p>
      
      <div className="space-y-4 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic FormField</h3>
          <FormField label="Email" helperText="Enter your email address">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">With Error</h3>
          <FormFieldInput
            label="Email"
            error="Please enter a valid email address"
            defaultValue="invalid@"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">With Validation</h3>
          <FormFieldInput
            label="Email"
            value={email}
            onChange={handleChange}
            error={error}
            helperText={!error ? "Enter a valid email address" : undefined}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Required Field</h3>
          <FormFieldInput
            label="Username"
            required
            helperText="This field is required"
          />
        </div>
      </div>

      <h2 id="enhanced-features">Enhanced Features</h2>
      <p>
        The enhanced form components provide advanced features like field arrays, conditional fields,
        and integrated validation.
      </p>

      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">FormEnhanced with Validation</h3>
          <FormEnhanced
            onSubmit={(data) => {
              console.log("Form submitted", data);
            }}
            validationMode="onBlur"
          >
            <div className="space-y-4">
              <FormFieldEnhanced
                name="name"
                label="Name"
                rules={validators.compose(validators.required(), validators.minLength(3))}
              >
              <Input placeholder="Your name" />
              </FormFieldEnhanced>
              <FormFieldEnhanced
                name="email"
                label="Email"
                rules={validators.compose(validators.required(), validators.email())}
              >
              <Input type="email" placeholder="you@example.com" />
              </FormFieldEnhanced>
              <Button type="submit">Submit</Button>
            </div>
          </FormEnhanced>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Field Arrays</h3>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Conditional Fields</h3>
        </div>
      </div>
      
      <h2 id="code">Code</h2>
      <pre>
        <code>{`import { FormField, FormFieldInput, validateValue, validators } from "@fragment_ui/ui";

// Basic usage
<FormField label="Email" helperText="Enter email">
</FormField>

// With validation
const [error, setError] = useState<string | undefined>();
const handleChange = (e) => {
  const nextError = validateValue(
    e.target.value,
    validators.compose(validators.required(), validators.email())
  );
  setError(nextError);
};

<FormFieldInput
  label="Email"
  error={error}
  helperText="Enter email"
/>`}</code>
      </pre>
      
      <h2 id="features">Features</h2>
      <ul>
        <li><strong>Basic FormField</strong>: Automatic label association, error and helper text display</li>
        <li><strong>FormEnhanced</strong>: Complete form management with validation, state management</li>
        <li><strong>Field Arrays</strong>: Dynamic adding/removing of form fields</li>
        <li><strong>Conditional Fields</strong>: Show/hide fields based on other field values</li>
        <li><strong>Validation Modes</strong>: onChange, onBlur, or onSubmit validation</li>
        <li><strong>Built-in Validators</strong>: Required, email, minLength, maxLength, pattern, custom</li>
        <li><strong>Accessibility</strong>: Full ARIA support and keyboard navigation</li>
      </ul>
      
      <h2 id="validation">Validation</h2>
      <p>The package includes validation utilities:</p>
      <ul>
        <li><code>validateValue</code> - Validate a value against rules</li>
        <li><code>validators.required()</code> - Required field validation</li>
        <li><code>validators.email()</code> - Email format validation</li>
        <li><code>validators.minLength(n)</code> - Minimum length validation</li>
        <li><code>validators.maxLength(n)</code> - Maximum length validation</li>
        <li><code>validators.pattern(regex)</code> - Pattern validation</li>
        <li><code>validators.compose(...rules)</code> - Combine multiple validators</li>
      </ul>

      <h3>Enhanced Form Code Examples</h3>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`import {
  FormEnhanced,
  FormFieldEnhanced,
  FormArray,
  ConditionalField,
  validators,
} from "@fragment_ui/ui";

// Enhanced form with validation
<FormEnhanced
  onSubmit={(data) => console.log(data)}
  validationMode="onBlur"
>
  <FormFieldEnhanced
    name="email"
    label="Email"
    rules={validators.compose(validators.required(), validators.email())}
  >
  </FormFieldEnhanced>
</FormEnhanced>

// Field arrays
<FormArray
  items={items}
  onAdd={() => setItems([...items, { name: "" }])}
  onRemove={(index) => setItems(items.filter((_, i) => i !== index))}
  renderItem={(item, index, remove) => (
    <FormFieldEnhanced name={\`items[\${index}].name\`}>
    </FormFieldEnhanced>
  )}

// Conditional fields
<ConditionalField
  show={useConditionalShow(
    [{ field: "accountType", operator: "equals", value: "business" }],
    formValues
  )}
>
  <FormFieldEnhanced name="companyName" label="Company Name">
  </FormFieldEnhanced>
</ConditionalField>`}</code></pre>
      
      
      
      <h2 id="install">Install</h2>
      <pre><code>npx shadcn@latest add /r/form-field.json</code></pre>
      <h2 id="accessibility">Accessibility</h2>
      <p>FormField automatically associates labels with inputs and provides proper ARIA attributes for error states.</p>
      
      


    </DocumentContent>
  );
}

