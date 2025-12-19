import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders with default options", () => {
    render(<SegmentedControl options={defaultOptions} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("handles single selection", () => {
    const handleChange = vi.fn();
    render(
      <SegmentedControl
        options={defaultOptions}
        onChange={handleChange}
        defaultValue="option1"
      />
    );

    const option2 = screen.getByText("Option 2");
    fireEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("handles multiple selection", () => {
    const handleChange = vi.fn();
    render(
      <SegmentedControl
        options={defaultOptions}
        onChange={handleChange}
        multiple
        defaultValue={["option1"]}
      />
    );

    const option2 = screen.getByText("Option 2");
    fireEvent.click(option2);
    // Radix UI ToggleGroup returns the new array, not merged with previous
    expect(handleChange).toHaveBeenCalled();
    const callArgs = handleChange.mock.calls[0][0];
    expect(Array.isArray(callArgs)).toBe(true);
    expect(callArgs).toContain("option2");
  });

  it("renders with icons", () => {
    const optionsWithIcons = [
      { value: "option1", label: "Option 1", icon: <span>🔍</span> },
      { value: "option2", label: "Option 2", icon: <span>⭐</span> },
    ];

    render(<SegmentedControl options={optionsWithIcons} />);
    expect(screen.getByText("🔍")).toBeInTheDocument();
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });

  it("handles disabled option", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
    ];

    render(<SegmentedControl options={options} defaultValue="option1" />);
    const option2 = screen.getByText("Option 2");
    expect(option2.closest("button")).toHaveAttribute("disabled");
  });

  it("handles disabled control", () => {
    const handleChange = vi.fn();
    render(
      <SegmentedControl
        options={defaultOptions}
        onChange={handleChange}
        disabled
        defaultValue="option1"
      />
    );

    const option2 = screen.getByText("Option 2");
    fireEvent.click(option2);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies correct variant classes", () => {
    const { container, rerender } = render(
      <SegmentedControl options={defaultOptions} variant="default" />
    );
    expect(container.firstChild).toHaveClass("bg-[color:var(--color-surface-2)]");

    rerender(<SegmentedControl options={defaultOptions} variant="outline" />);
    expect(container.firstChild).toHaveClass("ring-1", "ring-inset", "ring-[color:var(--color-border-base)]");

    rerender(<SegmentedControl options={defaultOptions} variant="filled" />);
    expect(container.firstChild).toHaveClass("bg-[color:var(--color-surface-1)]");
  });

  it("applies correct size classes", () => {
    const { container, rerender } = render(
      <SegmentedControl options={defaultOptions} size="sm" />
    );
    const item = container.querySelector("button");
    expect(item).toHaveClass("h-[var(--space-8)]");
    expect(item).toHaveStyle({ fontSize: "12px" });

    rerender(<SegmentedControl options={defaultOptions} size="md" />);
    expect(item).toHaveClass("h-[calc(var(--space-8)+var(--space-2))]");
    expect(item).toHaveStyle({ fontSize: "var(--typography-size-sm)" });

    rerender(<SegmentedControl options={defaultOptions} size="lg" />);
    expect(item).toHaveClass("h-[calc(var(--space-8)+var(--space-4))]");
    expect(item).toHaveStyle({ fontSize: "var(--typography-size-md)" });
  });
});

