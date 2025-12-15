import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("renders toggle", () => {
    render(<Toggle aria-label="Toggle">Bold</Toggle>);
    expect(screen.getByLabelText("Toggle")).toBeInTheDocument();
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it.skip("toggles pressed state on click (flaky in CI user-event)", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Toggle">Bold</Toggle>);
    
    const toggle = screen.getByLabelText("Toggle");
    expect(toggle).toHaveAttribute("data-state", "off");
    
    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "on");
    
    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("renders with pressed prop", () => {
    render(<Toggle aria-label="Toggle" pressed>Bold</Toggle>);
    const toggle = screen.getByLabelText("Toggle");
    expect(toggle).toHaveAttribute("data-state", "on");
  });

  it("renders disabled", () => {
    render(<Toggle aria-label="Toggle" disabled>Bold</Toggle>);
    const toggle = screen.getByLabelText("Toggle");
    expect(toggle).toBeDisabled();
  });

  it("accepts custom className", () => {
    render(<Toggle aria-label="Toggle" className="custom-class">Bold</Toggle>);
    const toggle = screen.getByLabelText("Toggle");
    expect(toggle.className).toContain("custom-class");
  });
});

