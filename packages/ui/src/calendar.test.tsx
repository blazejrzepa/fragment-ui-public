import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders calendar", () => {
    render(<Calendar mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders in single mode", () => {
    const date = new Date(2024, 0, 15);
    render(<Calendar mode="single" value={date} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders in range mode", () => {
    const range = {
      from: new Date(2024, 0, 15),
      to: new Date(2024, 0, 20),
    };
    render(<Calendar mode="range" value={range} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders in multiple mode", () => {
    const dates = [new Date(2024, 0, 15), new Date(2024, 0, 20)];
    render(<Calendar mode="multiple" value={dates} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("calls onChange when date is selected in single mode", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Calendar mode="single" onChange={onChange} />);
    
    // Find and click a day button
    const dayButtons = screen.getAllByRole("gridcell");
    const firstDay = dayButtons.find((button) => {
      const buttonElement = button.querySelector("button");
      return buttonElement && !buttonElement.disabled;
    });
    
    if (firstDay) {
      const button = firstDay.querySelector("button");
      if (button) {
        await user.click(button);
        // onChange should be called (may be called multiple times due to calendar behavior)
        expect(onChange).toHaveBeenCalled();
      }
    }
  });

  it("accepts custom className", () => {
    const { container } = render(<Calendar mode="single" className="custom-class" />);
    const calendar = container.firstChild as HTMLElement;
    expect(calendar.className).toContain("custom-class");
  });
});

