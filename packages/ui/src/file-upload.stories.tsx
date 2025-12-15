import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./file-upload";
import { useState } from "react";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    showPreview: {
      control: "boolean",
    },
    showProgress: {
      control: "boolean",
    },
    maxSize: {
      control: { type: "number" },
    },
    maxFiles: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

export const ImageOnly: Story = {
  args: {
    accept: "image/*",
    multiple: true,
    showPreview: true,
    onUpload: (files) => {
      console.log("Uploaded images:", files);
    },
  },
};

export const WithMaxSize: Story = {
  args: {
    maxSize: 5 * 1024 * 1024, // 5MB
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

export const WithMaxFiles: Story = {
  args: {
    multiple: true,
    maxFiles: 3,
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

export const WithProgress: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        multiple
        showProgress
        onUpload={async (uploadedFiles) => {
          setFiles(uploadedFiles);
          // Simulate async upload
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

export const PDFOnly: Story = {
  args: {
    accept: ".pdf",
    onUpload: (files) => {
      console.log("Uploaded PDF:", files);
    },
  },
};

export const CustomAccept: Story = {
  args: {
    accept: ["image/*", ".pdf", ".doc", ".docx"],
    multiple: true,
    onUpload: (files) => {
      console.log("Uploaded files:", files);
    },
  },
};

