import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders page numbers", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
  });

  it.skip("calls onPageChange when page is clicked (flaky in CI user-event)", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );
    await user.click(screen.getByLabelText("Page 2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous button on first page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });
});


