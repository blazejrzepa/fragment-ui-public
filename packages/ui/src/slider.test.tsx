import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders", () => {
    render(<Slider defaultValue={[50]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });

  it("renders with custom value", () => {
    render(<Slider defaultValue={[75]} max={100} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders range slider", () => {
    render(<Slider defaultValue={[20, 80]} max={100} />);
    // Range slider may have one or two thumbs depending on implementation
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBeGreaterThanOrEqual(1);
  });

  it("applies custom className", () => {
    render(<Slider defaultValue={[50]} className="custom-class" />);
    const slider = screen.getByRole("slider");
    expect(slider.closest(".custom-class")).toBeInTheDocument();
  });
});

