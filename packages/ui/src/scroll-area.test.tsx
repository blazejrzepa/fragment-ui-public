import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders scroll area", () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with content", () => {
    const { container } = render(
      <ScrollArea>
        <div>Long content here</div>
      </ScrollArea>
    );
    expect(container.textContent).toContain("Long content here");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <ScrollArea className="custom-class">
        <div>Content</div>
      </ScrollArea>
    );
    const scrollArea = container.firstChild as HTMLElement;
    expect(scrollArea.className).toContain("custom-class");
  });

  it("renders scrollbar structure", () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );
    // ScrollArea should render viewport
    const viewport = container.querySelector('[data-radix-scroll-area-viewport]');
    expect(viewport).toBeInTheDocument();
  });
});

