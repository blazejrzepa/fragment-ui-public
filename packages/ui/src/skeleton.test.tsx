import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders skeleton", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has pulse animation", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain("animate-pulse");
  });

  it("accepts custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain("h-10");
    expect(skeleton.className).toContain("w-10");
  });
});

