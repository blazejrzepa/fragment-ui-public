import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Tradeoffs } from "./tradeoffs";

describe("Tradeoffs", () => {
  it("renders with title and description", () => {
    const { getByText } = render(
      <Tradeoffs
        title="Compare Tradeoffs"
        description="Evaluate options"
        options={[]}
      />
    );
    expect(getByText("Compare Tradeoffs")).toBeInTheDocument();
    expect(getByText("Evaluate options")).toBeInTheDocument();
  });

  it("renders options with dimensions", () => {
    const options = [
      {
        id: "option-1",
        name: "Option 1",
        dimensions: [
          { name: "Cost", value: 50 },
          { name: "Risk", value: 30 },
        ],
        ctaText: "Choose",
      },
    ];
    const { getByText } = render(<Tradeoffs options={options} />);
    expect(getByText("Option 1")).toBeInTheDocument();
    expect(getByText("Cost")).toBeInTheDocument();
    expect(getByText("Risk")).toBeInTheDocument();
  });

  it("has ACL attributes", () => {
    const options = [
      {
        id: "option-1",
        name: "Option 1",
        dimensions: [
          { name: "Cost", value: 50 },
        ],
        ctaText: "Choose",
      },
    ];
    const { container } = render(<Tradeoffs options={options} />);
    
    const section = container.querySelector('[data-section-role="decision-tradeoffs"]');
    expect(section).toBeInTheDocument();
    
    const option = container.querySelector('[data-option-id="option-1"]');
    expect(option).toBeInTheDocument();
    
    const dimension = container.querySelector('[data-dimension="cost"]');
    expect(dimension).toBeInTheDocument();
  });
});

