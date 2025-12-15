import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Core/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationWithState = ({ totalPages = 10, ...props }: any) => {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <PaginationWithState />,
};

export const ManyPages: Story = {
  render: () => <PaginationWithState totalPages={20} />,
};

export const FewPages: Story = {
  render: () => <PaginationWithState totalPages={3} />,
};

export const WithoutFirstLast: Story = {
  render: () => <PaginationWithState showFirstLast={false} />,
};


