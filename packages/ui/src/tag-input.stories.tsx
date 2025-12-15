import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "./tag-input";
import { useState } from "react";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    allowDuplicates: {
      control: "boolean",
    },
    maxTags: {
      control: { type: "number" },
    },
    maxLength: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput value={tags} onChange={setTags} />
        <p className="mt-2 text-sm text-gray-600">Tags: {tags.join(", ") || "none"}</p>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: ["react", "typescript", "storybook"],
  },
};

export const WithMaxTags: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput value={tags} onChange={setTags} maxTags={5} />
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput value={tags} onChange={setTags} maxLength={10} />
      </div>
    );
  },
};

export const AllowDuplicates: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput value={tags} onChange={setTags} allowDuplicates />
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput
          value={tags}
          onChange={setTags}
          validate={(tag) => {
            if (tag.length < 3) {
              return "Tag must be at least 3 characters";
            }
            if (!/^[a-z0-9-]+$/.test(tag)) {
              return "Tag can only contain lowercase letters, numbers, and hyphens";
            }
            return true;
          }}
        />
      </div>
    );
  },
};

export const WithCommaSeparator: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput value={tags} onChange={setTags} separator="," />
        <p className="mt-2 text-sm text-gray-600">
          Type tags separated by commas (e.g., "tag1, tag2, tag3")
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: ["react", "typescript"],
    disabled: true,
  },
};

export const WithCallbacks: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <TagInput
          value={tags}
          onChange={setTags}
          onTagAdd={(tag) => {
            console.log("Tag added:", tag);
          }}
          onTagRemove={(tag) => {
            console.log("Tag removed:", tag);
          }}
        />
        <p className="mt-2 text-sm text-gray-600">Check console for callbacks</p>
      </div>
    );
  },
};

