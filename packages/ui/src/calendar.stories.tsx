import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";
import { useState } from "react";

const meta = {
  title: "Core/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range", "multiple"],
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
      />
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return (
      <Calendar
        mode="range"
        value={range}
        onChange={setRange}
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(),
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ]);
    return (
      <Calendar
        mode="multiple"
        value={dates}
        onChange={setDates}
      />
    );
  },
};

export const TwoMonths: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        value={date}
        onChange={setDate}
        numberOfMonths={2}
      />
    );
  },
};

