import type { Meta, StoryObj } from "@storybook/react";
import { ReviewConfirm } from "./review-confirm";

const meta: Meta<typeof ReviewConfirm> = {
  title: "Blocks/Decision/ReviewConfirm",
  component: ReviewConfirm,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReviewConfirm>;

const defaultItems = [
  { key: "plan", label: "Plan", value: "Pro Plan" },
  { key: "price", label: "Price", value: "$29/month" },
  { key: "billing", label: "Billing", value: "Monthly" },
  { key: "payment", label: "Payment Method", value: "Credit Card ending in 1234" },
];

export const Default: Story = {
  args: {
    title: "Review Your Order",
    description: "Please review your selections before confirming",
    items: defaultItems,
    confirmText: "Confirm Order",
    cancelText: "Cancel",
    onConfirm: () => console.log("Order confirmed"),
    onCancel: () => console.log("Order cancelled"),
    actionContractId: "action-confirm-order",
  },
};

export const DeleteAccount: Story = {
  args: {
    title: "Confirm Account Deletion",
    description: "This action cannot be undone. All your data will be permanently deleted.",
    items: [
      { key: "account", label: "Account", value: "user@example.com" },
      { key: "data", label: "Data to be deleted", value: "All projects, files, and settings" },
    ],
    confirmText: "Delete Account",
    cancelText: "Cancel",
    onConfirm: () => console.log("Account deleted"),
    onCancel: () => console.log("Deletion cancelled"),
    actionContractId: "action-delete-account",
  },
};

