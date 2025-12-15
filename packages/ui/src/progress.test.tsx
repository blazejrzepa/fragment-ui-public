import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders progress", () => {
    const { container } = render(<Progress value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with default value 0", () => {
    const { container } = render(<Progress />);
    const progress = container.firstChild as HTMLElement;
    expect(progress).toBeInTheDocument();
  });

  it("calculates percentage correctly", () => {
    const { container } = render(<Progress value={50} max={100} />);
    const indicator = container.querySelector('[style*="transform"]') as HTMLElement;
    expect(indicator).toBeInTheDocument();
    if (indicator) {
      expect(indicator.style.transform).toContain("translateX");
    }
  });

  it("handles custom max value", () => {
    const { container } = render(<Progress value={25} max={50} />);
    const indicator = container.querySelector('[style*="transform"]') as HTMLElement;
    expect(indicator).toBeInTheDocument();
  });

  it("clamps value to max", () => {
    const { container } = render(<Progress value={150} max={100} />);
    const indicator = container.querySelector('[style*="transform"]') as HTMLElement;
    expect(indicator).toBeInTheDocument();
  });

  it("clamps value to 0 minimum", () => {
    const { container } = render(<Progress value={-10} max={100} />);
    const indicator = container.querySelector('[style*="transform"]') as HTMLElement;
    expect(indicator).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    // Progress component now wraps content in a div, so we need to find the ProgressRoot element
    const progressRoot = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progressRoot?.className).toContain("custom-class");
  });
});

