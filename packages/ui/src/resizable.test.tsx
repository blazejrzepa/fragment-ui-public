import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Resizable, ResizableHandle, ResizablePanel } from "./resizable";

describe("Resizable", () => {
  it("renders resizable", () => {
    render(
      <Resizable direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </Resizable>
    );
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });

  it("renders with horizontal direction", () => {
    const { container } = render(
      <Resizable direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </Resizable>
    );
    const resizable = container.firstChild as HTMLElement;
    expect(resizable.className).toContain("flex-row");
  });

  it("renders with vertical direction", () => {
    const { container } = render(
      <Resizable direction="vertical">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </Resizable>
    );
    const resizable = container.firstChild as HTMLElement;
    expect(resizable.className).toContain("flex-col");
  });

  it("renders resizable handle", () => {
    const { container } = render(
      <Resizable direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </Resizable>
    );
    // Handle should be rendered
    const handle = container.querySelector('[class*="cursor-col-resize"]');
    expect(handle).toBeInTheDocument();
  });

  it("renders multiple panels", () => {
    render(
      <Resizable direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 3</ResizablePanel>
      </Resizable>
    );
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
    expect(screen.getByText("Panel 3")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Resizable direction="horizontal" className="custom-class">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </Resizable>
    );
    const resizable = container.firstChild as HTMLElement;
    expect(resizable.className).toContain("custom-class");
  });
});

