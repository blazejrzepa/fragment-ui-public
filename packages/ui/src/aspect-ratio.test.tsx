import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio, AspectRatioPresets } from "./aspect-ratio";

describe("AspectRatio", () => {
  it("renders with default ratio", () => {
    const { container } = render(
      <AspectRatio>
        <div>Content</div>
      </AspectRatio>
    );

    // AspectRatio renders as a div with the aspect-ratio style
    const aspectRatio = container.firstChild as HTMLElement;
    expect(aspectRatio).toBeInTheDocument();
    expect(aspectRatio.tagName).toBe("DIV");
  });

  it("renders with custom ratio", () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <div>Content</div>
      </AspectRatio>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with preset ratio", () => {
    render(
      <AspectRatio ratio={AspectRatioPresets.square}>
        <div>Square Content</div>
      </AspectRatio>
    );

    expect(screen.getByText("Square Content")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <AspectRatio>
        <div data-testid="content">Test Content</div>
      </AspectRatio>
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AspectRatio className="custom-class">
        <div>Content</div>
      </AspectRatio>
    );

    // Find the root element (AspectRatioPrimitive.Root)
    const aspectRatio = container.querySelector('[class*="custom-class"]') as HTMLElement;
    expect(aspectRatio).toBeTruthy();
    if (aspectRatio) {
      expect(aspectRatio).toHaveClass("custom-class");
      expect(aspectRatio).toHaveClass("relative", "w-full", "overflow-hidden");
    }
  });
});

