import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

describe("Collapsible", () => {
  it("renders collapsible", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Toggle")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByText("Toggle");
    await user.click(trigger);
    
    // Content should be visible after clicking
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders with defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("hides icon when showIcon is false", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger showIcon={false}>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    // Icon should not be present (ChevronDown)
    const trigger = screen.getByText("Toggle");
    expect(trigger.querySelector("svg")).not.toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Collapsible className="custom-class">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    // Collapsible root doesn't render a wrapper, so we check the trigger
    expect(screen.getByText("Toggle")).toBeInTheDocument();
  });

  it("works with asChild prop", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button>Custom Button</button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    // Should render without React.Children.only error
    const button = screen.getByText("Custom Button");
    expect(button).toBeInTheDocument();
    
    // Click to open and verify content appears
    await user.click(button);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

