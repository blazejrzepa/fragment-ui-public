import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { useState } from "react";

const meta = {
  title: "Core/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
    );
  },
};

export const WithDefaultDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();
    return (
      <DatePicker
        mode="range"
        value={range}
        onChange={setRange}
        placeholder="Pick a date range"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
        disabled
      />
    );
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 30);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    
    return (
      <div className="space-y-2">
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          placeholder="Pick a date (30 days range)"
          fromDate={minDate}
          toDate={maxDate}
        />
        <p className="text-xs text-gray-500">
          Only dates within the next 30 days are selectable
        </p>
      </div>
    );
  },
};

export const PastDatesOnly: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() - 1);
    
    return (
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a past date"
        toDate={maxDate}
      />
    );
  },
};

export const FutureDatesOnly: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    
    return (
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a future date"
        fromDate={minDate}
      />
    );
  },
};

export const Required: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select Date <span className="text-red-500">*</span>
        </label>
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          placeholder="Pick a date"
          required
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="w-full max-w-md space-y-2">
        <label className="text-sm font-medium">Birth Date</label>
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          placeholder="Select your birth date"
        />
        <p className="text-xs text-gray-500">
          We use this to verify your age
        </p>
      </div>
    );
  },
};

export const MultiMonth: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();
    return (
      <DatePicker
        mode="range"
        value={range}
        onChange={setRange}
        placeholder="Pick a date range"
        numberOfMonths={2}
      />
    );
  },
};

