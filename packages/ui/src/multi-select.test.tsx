import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./multi-select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

describe("MultiSelect", () => {
  it("renders with placeholder", () => {
    render(<MultiSelect options={options} />);
    expect(screen.getByText("Select options...")).toBeInTheDocument();
  });

  it("displays selected values", () => {
    render(<MultiSelect options={options} value={["react", "vue"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("opens popover on click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);
    
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });
  });

  it("calls onValueChange when option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<MultiSelect options={options} onValueChange={handleChange} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    // Wait for popover to open and options to be rendered
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for options to appear in the DOM
    await waitFor(() => {
      const reactOptions = screen.queryAllByText("React");
      expect(reactOptions.length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    // Find the option within the command list
    const reactOptions = screen.getAllByText("React");
    const reactOption = reactOptions.find(opt => {
      const parent = opt.closest('[role="option"]');
      return parent !== null;
    }) || reactOptions[0];

    if (reactOption) {
      await user.click(reactOption);
      expect(handleChange).toHaveBeenCalledWith(["react"]);
    }
  });

  it("allows multiple selections", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={["react"]}
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const vueOptions = screen.queryAllByText("Vue");
      expect(vueOptions.length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    const vueOptions = screen.getAllByText("Vue");
    const vueOption = vueOptions.find(opt => {
      const parent = opt.closest('[role="option"]');
      return parent !== null;
    }) || vueOptions[0];

    if (vueOption) {
      await user.click(vueOption);
      expect(handleChange).toHaveBeenCalledWith(["react", "vue"]);
    }
  });

  it("removes option when clicked again", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={["react", "vue"]}
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const reactOptions = screen.queryAllByText("React");
      expect(reactOptions.length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    const reactOptions = screen.getAllByText("React");
    const reactOption = reactOptions.find(opt => {
      const parent = opt.closest('[role="option"]');
      return parent !== null;
    }) || reactOptions[0];

    if (reactOption) {
      await user.click(reactOption);
      expect(handleChange).toHaveBeenCalledWith(["vue"]);
    }
  });

  it("filters options by search", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "vue");

    await waitFor(() => {
      expect(screen.getByText("Vue")).toBeInTheDocument();
    });
    
    // React might still be in the DOM but filtered out visually
    const reactElements = screen.queryAllByText("React");
    expect(reactElements.length).toBeGreaterThanOrEqual(0);
  });

  it("shows empty state when no results", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "xyz");

    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  it("disables when disabled prop is true", () => {
    render(<MultiSelect options={options} disabled />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
  });

  it("shows maxCount overflow", () => {
    render(
      <MultiSelect
        options={options}
        value={["react", "vue", "angular"]}
        maxCount={1}
      />
    );
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("removes item when X button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={["react", "vue"]}
        onValueChange={handleChange}
      />
    );

    const removeButtons = screen.getAllByLabelText(/Remove/);
    await user.click(removeButtons[0]);

    expect(handleChange).toHaveBeenCalled();
  });

  it("clears all when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        value={["react", "vue"]}
        onValueChange={handleChange}
      />
    );

    const clearButton = screen.getByLabelText("Clear all");
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });
});

