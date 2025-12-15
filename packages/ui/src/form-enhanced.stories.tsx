import type { Meta, StoryObj } from "@storybook/react";
import { FormEnhanced, FormFieldEnhanced } from "./form-enhanced";
import { FormArray } from "./form-array";
import { ConditionalField, useConditionalShow } from "./form-conditional";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Button } from "./button";
import { validators } from "./form-validation";
import { useState } from "react";

const meta = {
  title: "Forms/Enhanced",
  component: FormEnhanced,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormEnhanced>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="w-[500px]">
      <FormEnhanced
        onSubmit={(data) => {
          console.log("Form submitted", data);
        }}
        validationMode="onSubmit"
      >
        <div className="space-y-4">
          <FormFieldEnhanced
            name="name"
            label="Name"
            rules={validators.compose(validators.required(), validators.minLength(3))}
          >
            <Input />
          </FormFieldEnhanced>
          <FormFieldEnhanced
            name="email"
            label="Email"
            rules={validators.compose(validators.required(), validators.email())}
          >
            <Input type="email" />
          </FormFieldEnhanced>
          <Button type="submit">Submit</Button>
        </div>
      </FormEnhanced>
    </div>
  ),
};

export const WithFieldArray: Story = {
  render: () => {
    const [items, setItems] = useState<Array<{ name: string; email: string }>>([
      { name: "", email: "" },
    ]);

    return (
      <div className="w-[600px]">
        <FormEnhanced
          onSubmit={(data) => {
            console.log("Form submitted", data);
          }}
        >
          <div className="space-y-4">
            <FormFieldEnhanced
              name="title"
              label="Form Title"
              rules={validators.required()}
            >
              <Input placeholder="Enter form title" />
            </FormFieldEnhanced>

            <div>
              <label className="text-sm font-medium mb-2 block">Team Members</label>
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
    );
  },
};

export const WithConditionalFields: Story = {
  render: () => {
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    return (
      <div className="w-[500px]">
        <FormEnhanced
          onSubmit={(data) => {
            console.log("Form submitted", data);
          }}
        >
          <div className="space-y-4">
            <FormFieldEnhanced
              name="accountType"
              label="Account Type"
              rules={validators.required()}
            >
              <Select onValueChange={(value) => setFormValues({ ...formValues, accountType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
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
              <FormFieldEnhanced
                name="companyName"
                label="Company Name"
                rules={validators.required()}
              >
                <Input placeholder="Company name" />
              </FormFieldEnhanced>
            </ConditionalField>

            <FormFieldEnhanced
              name="email"
              label="Email"
              rules={validators.compose(validators.required(), validators.email())}
            >
              <Input type="email" />
            </FormFieldEnhanced>

            <Button type="submit">Submit</Button>
          </div>
        </FormEnhanced>
      </div>
    );
  },
};

export const ValidationModes: Story = {
  render: () => (
    <div className="w-[500px] space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">On Change Validation</h3>
        <FormEnhanced validationMode="onChange">
          <div className="space-y-4">
            <FormFieldEnhanced
              name="email"
              label="Email"
              rules={validators.compose(validators.required(), validators.email())}
            >
              <Input type="email" placeholder="Type email..." />
            </FormFieldEnhanced>
            <Button type="submit">Submit</Button>
          </div>
        </FormEnhanced>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">On Blur Validation</h3>
        <FormEnhanced validationMode="onBlur">
          <div className="space-y-4">
            <FormFieldEnhanced
              name="email"
              label="Email"
              rules={validators.compose(validators.required(), validators.email())}
            >
              <Input type="email" placeholder="Click and blur..." />
            </FormFieldEnhanced>
            <Button type="submit">Submit</Button>
          </div>
        </FormEnhanced>
      </div>
    </div>
  ),
};

export const ComplexForm: Story = {
  render: () => {
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [items, setItems] = useState<Array<{ skill: string; level: string }>>([
      { skill: "", level: "" },
    ]);

    return (
      <div className="w-[600px]">
        <FormEnhanced
          onSubmit={(data) => {
            console.log("Form submitted", data);
            alert("Form submitted successfully!");
          }}
          onError={(errors) => {
            console.log("Form errors", errors);
          }}
          validationMode="onBlur"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
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
                  rules={validators.compose(validators.required(), validators.email())}
                >
                  <Input type="email" placeholder="john@example.com" />
                </FormFieldEnhanced>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <FormArray
                items={items}
                onAdd={() => setItems([...items, { skill: "", level: "" }])}
                onRemove={(index) => setItems(items.filter((_, i) => i !== index))}
                addLabel="Add Skill"
                minItems={1}
                maxItems={10}
                renderItem={(item, index, remove) => (
                  <div className="space-y-2">
                    <FormFieldEnhanced
                      name={`skills[${index}].skill`}
                      label={`Skill ${index + 1}`}
                      rules={validators.required()}
                    >
                      <Input placeholder="e.g. React, TypeScript" />
                    </FormFieldEnhanced>
                    <FormFieldEnhanced
                      name={`skills[${index}].level`}
                      label="Level"
                      rules={validators.required()}
                    >
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormFieldEnhanced>
                  </div>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </FormEnhanced>
      </div>
    );
  },
};

