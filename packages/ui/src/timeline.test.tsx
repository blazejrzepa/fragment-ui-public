import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline } from "./timeline";

const events = [
  {
    id: "1",
    title: "Event 1",
    timestamp: "2024-01-15",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Event 2",
    timestamp: "2024-01-16",
    status: "current" as const,
  },
  {
    id: "3",
    title: "Event 3",
    timestamp: "2024-01-17",
    status: "upcoming" as const,
  },
];

describe("Timeline", () => {
  it("renders all events", () => {
    render(<Timeline events={events} />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getByText("Event 3")).toBeInTheDocument();
  });

  it("shows timestamps when enabled", () => {
    render(<Timeline events={events} showTimestamps />);
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("hides timestamps when disabled", () => {
    render(<Timeline events={events} showTimestamps={false} />);
    expect(screen.queryByText("2024-01-15")).not.toBeInTheDocument();
  });

  it("supports vertical orientation", () => {
    const { container } = render(
      <Timeline events={events} orientation="vertical" />
    );
    expect(container.firstChild).toHaveClass("flex-col");
  });

  it("supports horizontal orientation", () => {
    const { container } = render(
      <Timeline events={events} orientation="horizontal" />
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("shows descriptions when provided", () => {
    const eventsWithDesc = [
      {
        id: "1",
        title: "Event 1",
        description: "Description 1",
        status: "completed" as const,
      },
    ];
    render(<Timeline events={eventsWithDesc} />);
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });
});

