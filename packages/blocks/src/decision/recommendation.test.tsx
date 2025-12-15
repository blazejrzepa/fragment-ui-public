import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Recommendation } from "./recommendation";

describe("Recommendation", () => {
  it("renders with title and description", () => {
    const { getByText } = render(
      <Recommendation
        title="Recommended for You"
        description="Based on your needs"
        options={[]}
      />
    );
    expect(getByText("Recommended for You")).toBeInTheDocument();
    expect(getByText("Based on your needs")).toBeInTheDocument();
  });

  it("renders options sorted by rank", () => {
    const options = [
      {
        id: "option-2",
        name: "Second",
        rank: 2,
        ctaText: "Choose",
      },
      {
        id: "option-1",
        name: "First",
        rank: 1,
        ctaText: "Choose",
      },
    ];
    const { container } = render(<Recommendation options={options} />);
    const optionElements = container.querySelectorAll('[data-option-id]');
    expect(optionElements[0]).toHaveAttribute("data-option-id", "option-1");
    expect(optionElements[1]).toHaveAttribute("data-option-id", "option-2");
  });

  it("has ACL attributes", () => {
    const options = [
      {
        id: "option-1",
        name: "Best Option",
        rank: 1,
        ctaText: "Choose",
      },
    ];
    const { container } = render(<Recommendation options={options} />);
    
    const section = container.querySelector('[data-section-role="decision-recommendation"]');
    expect(section).toBeInTheDocument();
    
    const option = container.querySelector('[data-option-id="option-1"]');
    expect(option).toBeInTheDocument();
    expect(option).toHaveAttribute("data-rank", "1");
  });
});

