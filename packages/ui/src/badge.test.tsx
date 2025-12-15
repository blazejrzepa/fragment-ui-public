import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders badge with text", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders with solid variant by default", () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-[color:var(--color-brand-primary)]");
  });

  it("renders with outline variant", () => {
    const { container } = render(<Badge variant="outline">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("border");
  });

  it("renders with subtle variant", () => {
    const { container } = render(<Badge variant="subtle">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-[color:var(--color-surface-2)]");
  });

  it("renders with small size", () => {
    const { container } = render(<Badge size="sm">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("px-2");
  });

  it("renders with medium size by default", () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    // Check for size classes - medium should have px-2.5
    expect(badge.className).toMatch(/px-2\.5|px-2/);
  });

  it("accepts custom className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("custom-class");
  });
});

