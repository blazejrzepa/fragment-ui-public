import type { Meta, StoryObj } from "@storybook/react";
import { FormField, FormFieldInput, FormFieldTextarea } from "./form-field";
import { useState } from "react";
import { validateValue, validators } from "./form-validation";

const meta: Meta<typeof FormField> = {
  title: "Form/FormField",
  component: FormField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Email" helperText="Enter your email address">
      <input type="email" className="w-full rounded border px-3 py-2" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormFieldInput
      label="Email"
      error="Please enter a valid email address"
      defaultValue="invalid@"
    />
  ),
};

export const Required: Story = {
  render: () => (
    <FormFieldInput
      label="Username"
      required
      helperText="This field is required"
    />
  ),
};

export const WithValidation: Story = {
  render: () => {
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
      <FormFieldInput
        label="Email"
        value={email}
        onChange={handleChange}
        error={error}
        helperText={!error && "Enter a valid email address"}
      />
    );
  },
};

