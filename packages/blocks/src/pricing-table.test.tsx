import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingTable } from "./pricing-table";

describe("PricingTable", () => {
  const mockTiers = [
    {
      name: "Starter",
      price: "$9",
      pricePeriod: "month",
      features: [
        { name: "Feature 1", included: true },
        { name: "Feature 2", included: false },
      ],
      ctaText: "Get Started",
    },
  ];

  it("renders pricing tiers", () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("$9")).toBeInTheDocument();
    expect(screen.getByText("/month")).toBeInTheDocument();
  });

  it("renders features", () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("shows popular badge when tier is popular", () => {
    const tiersWithPopular = [
      {
        ...mockTiers[0],
        popular: true,
      },
    ];
    render(<PricingTable tiers={tiersWithPopular} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("calls onClick when CTA is clicked", () => {
    const onClick = vi.fn();
    const tiersWithOnClick = [
      {
        ...mockTiers[0],
        ctaOnClick: onClick,
      },
    ];
    render(<PricingTable tiers={tiersWithOnClick} />);
    const button = screen.getByText("Get Started");
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders multiple tiers", () => {
    const multipleTiers = [
      mockTiers[0],
      {
        name: "Pro",
        price: "$29",
        pricePeriod: "month",
        features: [{ name: "Feature 3", included: true }],
        ctaText: "Upgrade",
      },
    ];
    render(<PricingTable tiers={multipleTiers} />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });
});

