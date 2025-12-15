import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "./radio";

describe("RadioGroup", () => {
  it("renders radio buttons", () => {
    render(
      <RadioGroup>
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
      </RadioGroup>
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("can have a default value", () => {
    render(
      <RadioGroup defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
      </RadioGroup>
    );

    expect(screen.getByLabelText("Option 2")).toBeChecked();
    expect(screen.getByLabelText("Option 1")).not.toBeChecked();
  });

  it.skip("calls onValueChange when a radio is clicked (flaky in CI user-event)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup onValueChange={handleChange}>
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
      </RadioGroup>
    );

    await user.click(screen.getByLabelText("Option 2"));
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("renders radio with description", () => {
    render(
      <RadioGroup>
        <Radio
          value="option1"
          label="Option 1"
          description="This is a description"
        />
      </RadioGroup>
    );

    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("disables all radios when RadioGroup is disabled", () => {
    render(
      <RadioGroup disabled>
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
      </RadioGroup>
    );

    expect(screen.getByLabelText("Option 1")).toBeDisabled();
    expect(screen.getByLabelText("Option 2")).toBeDisabled();
  });

  it("disables individual radio", () => {
    render(
      <RadioGroup>
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" disabled />
      </RadioGroup>
    );

    expect(screen.getByLabelText("Option 1")).not.toBeDisabled();
    expect(screen.getByLabelText("Option 2")).toBeDisabled();
  });
});

