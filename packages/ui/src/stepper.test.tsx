import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper } from "./stepper";

const steps = [
  { id: "1", label: "Step 1" },
  { id: "2", label: "Step 2" },
  { id: "3", label: "Step 3" },
];

describe("Stepper", () => {
  it("renders all steps", () => {
    render(<Stepper steps={steps} currentStep={1} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("shows current step", () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const step2 = screen.getByText("Step 2").closest("div");
    expect(step2).toHaveClass("text-brand");
  });

  it("shows completed steps", () => {
    render(<Stepper steps={steps} currentStep={2} />);
    const step1 = screen.getByText("Step 1").closest("div");
    expect(step1).toHaveClass("text-[color:var(--color-fg-base)]");
  });

  it("supports horizontal orientation", () => {
    const { container } = render(
      <Stepper steps={steps} currentStep={1} orientation="horizontal" />
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("supports vertical orientation", () => {
    const { container } = render(
      <Stepper steps={steps} currentStep={1} orientation="vertical" />
    );
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("calls onStepClick when step is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Stepper
        steps={steps}
        currentStep={2}
        clickable
        onStepClick={handleClick}
      />
    );
    // Click on completed step
    const step1 = screen.getByLabelText("Step 1: Step 1");
    step1.click();
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});

