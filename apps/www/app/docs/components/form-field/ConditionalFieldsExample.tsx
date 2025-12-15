"use client";

import {
  FormEnhanced,
  FormFieldEnhanced,
  ConditionalField,
  useConditionalShow,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fragment_ui/ui";
import { useState } from "react";
import { validators } from "@fragment_ui/ui";

export function ConditionalFieldsExample() {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  return (
    <FormEnhanced onSubmit={(data) => console.log(data)}>
      <div className="space-y-4">
        <FormFieldEnhanced name="accountType" label="Account Type" rules={validators.required()}>
          <Select
            onValueChange={(value) => setFormValues({ ...formValues, accountType: value })}
          >
            <SelectTrigger>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldEnhanced>

        <ConditionalField
          show={useConditionalShow(
            [{ field: "accountType", operator: "equals", value: "business" }],
            formValues
          )}
        >
          <FormFieldEnhanced name="companyName" label="Company Name" rules={validators.required()}>
            <Input placeholder="Your company name" />
          </FormFieldEnhanced>
        </ConditionalField>

        <FormFieldEnhanced
          name="email"
          label="Email"
          rules={validators.compose(validators.required(), validators.email())}
        >
          <Input type="email" placeholder="you@example.com" />
        </FormFieldEnhanced>
      </div>
    </FormEnhanced>
  );
}

