import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders separator", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders horizontal by default", () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain("h-[1px]");
    expect(separator.className).toContain("w-full");
  });

  it("renders vertical separator", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain("h-full");
    expect(separator.className).toContain("w-[1px]");
  });

  it("accepts custom className", () => {
    const { container } = render(<Separator className="custom-class" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain("custom-class");
  });
});

