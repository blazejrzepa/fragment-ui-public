import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Carousel } from "./carousel";

describe("Carousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders carousel with slides", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );

    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
  });

  it("renders navigation arrows", () => {
    render(
      <Carousel showArrows>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });

  it("renders dots pagination", () => {
    render(
      <Carousel showDots>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );

    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(3);
  });

  it("does not render arrows when showArrows is false", () => {
    render(
      <Carousel showArrows={false}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
  });

  it("does not render dots when showDots is false", () => {
    render(
      <Carousel showDots={false}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    const dots = screen.queryAllByRole("tab");
    expect(dots).toHaveLength(0);
  });

  it("does not render navigation for single slide", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
      </Carousel>
    );

    expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
    const dots = screen.queryAllByRole("tab");
    expect(dots).toHaveLength(0);
  });

  it("renders empty carousel as null", () => {
    const { container } = render(<Carousel>{[]}</Carousel>);
    expect(container.firstChild).toBeNull();
  });
});

