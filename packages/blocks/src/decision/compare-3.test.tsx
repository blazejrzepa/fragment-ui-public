import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Compare3 } from "./compare-3";

describe("Compare3", () => {
  it("renders with title and description", () => {
    const { getByText } = render(
      <Compare3
        title="Choose Your Plan"
        description="Compare plans"
        options={[]}
      />
    );
    expect(getByText("Choose Your Plan")).toBeInTheDocument();
    expect(getByText("Compare plans")).toBeInTheDocument();
  });

  it("renders options as cards", () => {
    const options = [
      {
        id: "option-1",
        name: "Starter",
        features: [],
        ctaText: "Get Started",
      },
    ];
    const { getByText } = render(<Compare3 options={options} />);
    expect(getByText("Starter")).toBeInTheDocument();
    expect(getByText("Get Started")).toBeInTheDocument();
  });

  it("has ACL attributes", () => {
    const options = [
      {
        id: "option-1",
        name: "Starter",
        features: [
          { key: "storage", label: "Storage", value: "10GB" },
        ],
        ctaText: "Get Started",
      },
    ];
    const { container } = render(<Compare3 options={options} />);
    
    // Check section role
    const section = container.querySelector('[data-section-role="decision-compare-3"]');
    expect(section).toBeInTheDocument();
    
    // Check option ID
    const option = container.querySelector('[data-option-id="option-1"]');
    expect(option).toBeInTheDocument();
    
    // Check compare key
    const feature = container.querySelector('[data-compare-key="storage"]');
    expect(feature).toBeInTheDocument();
  });
});

