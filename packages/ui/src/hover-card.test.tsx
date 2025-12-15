import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./hover-card";

describe("HoverCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders", () => {
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <button>Hover me</button>
        </HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders content", () => {
    render(
      <HoverCard open openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <button>Trigger</button>
        </HoverCardTrigger>
        <HoverCardContent>Test Content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});


