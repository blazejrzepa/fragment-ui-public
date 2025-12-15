import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SplitButton } from "./split-button";

describe("SplitButton", () => {
  it("renders split button with primary action", () => {
    const handlePrimaryClick = vi.fn();
    render(
      <SplitButton
        primaryAction={{
          label: "Save",
          onClick: handlePrimaryClick,
        }}
        options={[]}
      />
    );

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls primary action on click", () => {
    const handlePrimaryClick = vi.fn();
    render(
      <SplitButton
        primaryAction={{
          label: "Save",
          onClick: handlePrimaryClick,
        }}
        options={[]}
      />
    );

    const primaryButton = screen.getByText("Save");
    fireEvent.click(primaryButton);
    expect(handlePrimaryClick).toHaveBeenCalledTimes(1);
  });

  it("renders dropdown trigger button", () => {
    render(
      <SplitButton
        primaryAction={{
          label: "Save",
          onClick: () => {},
        }}
        options={[
          {
            label: "Save As",
            onClick: () => {},
          },
        ]}
      />
    );

    const trigger = screen.getByLabelText("More options");
    expect(trigger).toBeInTheDocument();
  });

  it("disables primary button when disabled prop is true", () => {
    render(
      <SplitButton
        disabled
        primaryAction={{
          label: "Save",
          onClick: () => {},
        }}
        options={[]}
      />
    );

    const primaryButton = screen.getByText("Save").closest("button");
    expect(primaryButton).toBeDisabled();
  });

  it("disables dropdown trigger when disabled prop is true", () => {
    render(
      <SplitButton
        disabled
        primaryAction={{
          label: "Save",
          onClick: () => {},
        }}
        options={[
          {
            label: "Save As",
            onClick: () => {},
          },
        ]}
      />
    );

    const trigger = screen.getByLabelText("More options");
    expect(trigger).toBeDisabled();
  });

  it("renders with icon in primary action", () => {
    render(
      <SplitButton
        primaryAction={{
          label: "Save",
          onClick: () => {},
          icon: <span data-testid="icon">📁</span>,
        }}
        options={[]}
      />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders with multiple options", () => {
    render(
      <SplitButton
        primaryAction={{
          label: "Save",
          onClick: () => {},
        }}
        options={[
          {
            label: "Save As",
            onClick: () => {},
          },
          {
            label: "Save All",
            onClick: () => {},
          },
        ]}
      />
    );

    // Both buttons should be rendered
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText("More options")).toBeInTheDocument();
  });
});

