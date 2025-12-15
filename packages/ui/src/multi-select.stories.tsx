import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect } from "./multi-select";
import { useState } from "react";

const meta: Meta<typeof MultiSelect> = {
  title: "Core/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
];

const manyOptions = Array.from({ length: 50 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i + 1}`,
}));

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["react", "vue"]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={manyOptions}
          value={value}
          onValueChange={setValue}
          searchPlaceholder="Search options..."
        />
      </div>
    );
  },
};

export const WithMaxCount: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([
      "react",
      "vue",
      "angular",
      "svelte",
      "nextjs",
    ]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
          maxCount={2}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
          disabled
        />
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const optionsWithDisabled = [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue", disabled: true },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte", disabled: true },
      { value: "nextjs", label: "Next.js" },
    ];
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={optionsWithDisabled}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const NotClearable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["react", "vue"]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
          clearable={false}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-[300px]">
        <MultiSelect
          options={options}
          value={value}
          onValueChange={setValue}
          loading
        />
      </div>
    );
  },
};

