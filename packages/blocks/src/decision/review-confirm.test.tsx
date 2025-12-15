import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ReviewConfirm } from "./review-confirm";

describe("ReviewConfirm", () => {
  it("renders with title and description", () => {
    const { getByText } = render(
      <ReviewConfirm
        title="Review Order"
        description="Please review"
        items={[]}
        confirmText="Confirm"
        actionContractId="action-1"
      />
    );
    expect(getByText("Review Order")).toBeInTheDocument();
    expect(getByText("Please review")).toBeInTheDocument();
  });

  it("renders review items", () => {
    const items = [
      { key: "plan", label: "Plan", value: "Pro" },
      { key: "price", label: "Price", value: "$29" },
    ];
    const { getByText } = render(
      <ReviewConfirm
        items={items}
        confirmText="Confirm"
        actionContractId="action-1"
      />
    );
    expect(getByText("Plan")).toBeInTheDocument();
    expect(getByText("Pro")).toBeInTheDocument();
    expect(getByText("Price")).toBeInTheDocument();
    expect(getByText("$29")).toBeInTheDocument();
  });

  it("has ACL attributes for hard action", () => {
    const items = [
      { key: "plan", label: "Plan", value: "Pro" },
    ];
    const { container } = render(
      <ReviewConfirm
        items={items}
        confirmText="Confirm"
        actionContractId="action-confirm"
      />
    );
    
    const section = container.querySelector('[data-section-role="decision-review-confirm"]');
    expect(section).toBeInTheDocument();
    
    const button = container.querySelector('[data-action-id="action-confirm"]');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-action-kind", "hard");
    expect(button).toHaveAttribute("data-action-requires-confirmation", "true");
  });
});

