import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Rating } from "./rating";

describe("Rating", () => {
  it("renders with default value", () => {
    render(<Rating defaultValue={3} />);
    const stars = screen.getAllByRole("button");
    expect(stars.length).toBe(5); // Default max is 5
  });

  it("renders with custom max", () => {
    render(<Rating defaultValue={3} max={10} />);
    const stars = screen.getAllByRole("button");
    expect(stars.length).toBe(10);
  });

  it("handles click to change value", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={0} onChange={handleChange} />);
    
    const thirdStar = screen.getAllByRole("button")[2];
    fireEvent.click(thirdStar);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("handles half-star clicks when half prop is enabled", () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={0} onChange={handleChange} half />);
    
    // Click on the left half of the first star (0.5 rating)
    const firstStarContainer = screen.getAllByRole("button")[0].parentElement;
    const leftHalf = firstStarContainer?.querySelector("button");
    if (leftHalf) {
      fireEvent.click(leftHalf);
      expect(handleChange).toHaveBeenCalledWith(0.5);
    }
  });

  it("handles allowClear", () => {
    const handleChange = vi.fn();
    render(
      <Rating
        defaultValue={3}
        onChange={handleChange}
        allowClear
      />
    );
    
    const thirdStar = screen.getAllByRole("button")[2];
    fireEvent.click(thirdStar); // Click same value to clear
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it("does not call onChange when readOnly", () => {
    const handleChange = vi.fn();
    render(
      <Rating
        value={3}
        onChange={handleChange}
        readOnly
      />
    );
    
    const stars = screen.queryAllByRole("button");
    expect(stars.length).toBe(0); // No buttons in readOnly mode
  });

  it("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    render(
      <Rating
        defaultValue={3}
        onChange={handleChange}
        disabled
      />
    );
    
    const firstStar = screen.getAllByRole("button")[0];
    fireEvent.click(firstStar);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("shows value when showValue is true", () => {
    render(<Rating defaultValue={4} showValue />);
    expect(screen.getByText("4/5")).toBeInTheDocument();
  });

  it("shows decimal value for half stars", () => {
    render(<Rating defaultValue={3.5} half showValue />);
    expect(screen.getByText("3.5/5")).toBeInTheDocument();
  });

  it("applies correct size classes", () => {
    const { container, rerender } = render(
      <Rating defaultValue={3} size="sm" />
    );
    const star = container.querySelector("svg");
    expect(star).toHaveClass("h-4", "w-4");

    rerender(<Rating defaultValue={3} size="md" />);
    expect(star).toHaveClass("h-5", "w-5");

    rerender(<Rating defaultValue={3} size="lg" />);
    expect(star).toHaveClass("h-6", "w-6");
  });

  it("handles controlled value", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <Rating value={2} onChange={handleChange} />
    );
    
    const thirdStar = screen.getAllByRole("button")[2];
    fireEvent.click(thirdStar);
    expect(handleChange).toHaveBeenCalledWith(3);
    
    // Update controlled value
    rerender(<Rating value={3} onChange={handleChange} />);
    // Component should reflect new value
    expect(screen.getByLabelText(/Rating: 3 out of 5 stars/)).toBeInTheDocument();
  });
});

