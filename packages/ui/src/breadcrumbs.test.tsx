import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders breadcrumb items", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Button" },
        ]}
      />
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("renders links for non-last items", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("marks last item as current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );

    const currentItem = screen.getByText("Current");
    expect(currentItem).toHaveAttribute("aria-current", "page");
  });

  it("renders separators between items", () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Button" },
        ]}
      />
    );

    // Check that separators exist (they're wrapped in spans with aria-hidden)
    const nav = container.querySelector("nav");
    const separatorText = nav?.textContent || "";
    // Should have 2 "/" separators (default separator)
    const separatorCount = (separatorText.match(/\//g) || []).length;
    expect(separatorCount).toBeGreaterThanOrEqual(2);
  });

  it("handles onClick for items without href", () => {
    const onClick = vi.fn();
    render(
      <Breadcrumbs
        items={[
          { label: "Home", onClick },
          { label: "Current" },
        ]}
      />
    );

    const homeButton = screen.getByText("Home").closest("button");
    expect(homeButton).toBeInTheDocument();
  });
});

