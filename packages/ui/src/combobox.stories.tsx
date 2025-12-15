import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./combobox";
import { useState } from "react";

const meta: Meta<typeof Combobox> = {
  title: "Core/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
];

const ComboboxWithState = (props: any) => {
  const [value, setValue] = useState<string>();
  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={setValue}
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <ComboboxWithState />,
};

export const WithValue: Story = {
  render: () => <ComboboxWithState value="react" />,
};

export const WithDisabled: Story = {
  render: () => (
    <ComboboxWithState
      options={[
        ...options,
        { value: "disabled", label: "Disabled Option", disabled: true },
      ]}
    />
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <ComboboxWithState
      options={Array.from({ length: 50 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i + 1}`,
      }))}
    />
  ),
};


