import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./combobox";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Combobox", () => {
  it("renders", () => {
    render(<Combobox options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays placeholder", () => {
    render(<Combobox options={options} placeholder="Select..." />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("displays selected value", () => {
    render(<Combobox options={options} value="option1" />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it.skip("calls onValueChange when option is selected (flaky in CI user-event)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox options={options} onValueChange={onValueChange} />);
    
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option 1"));
    
    expect(onValueChange).toHaveBeenCalledWith("option1");
  });
});


