import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders spinner", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has spin animation", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain("animate-spin");
  });

  it("renders with medium size by default", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain("h-6");
    expect(spinner.className).toContain("w-6");
  });

  it("renders with small size", () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain("h-4");
    expect(spinner.className).toContain("w-4");
  });

  it("renders with large size", () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain("h-8");
    expect(spinner.className).toContain("w-8");
  });

  it("has accessibility attributes", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<Spinner className="custom-class" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain("custom-class");
  });
});

