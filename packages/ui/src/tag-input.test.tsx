import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TagInput } from "./tag-input";

describe("TagInput", () => {
  it("renders tag input component", () => {
    render(<TagInput />);
    expect(screen.getByPlaceholderText("Add tags...")).toBeInTheDocument();
  });

  it("adds tag on Enter key", async () => {
    const handleChange = vi.fn();
    render(<TagInput onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react"]);
    });
  });

  it("adds tag on comma key", async () => {
    const handleChange = vi.fn();
    render(<TagInput onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "," });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react"]);
    });
  });

  it("adds tag on blur", async () => {
    const handleChange = vi.fn();
    render(<TagInput onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react"]);
    });
  });

  it("removes tag when X button is clicked", async () => {
    const handleChange = vi.fn();
    render(<TagInput defaultValue={["react"]} onChange={handleChange} />);

    const removeButton = screen.getByLabelText("Remove react");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });

  it("removes last tag on Backspace when input is empty", async () => {
    const handleChange = vi.fn();
    render(<TagInput defaultValue={["react", "typescript"]} onChange={handleChange} />);

    const input = screen.getByPlaceholderText("");
    fireEvent.keyDown(input, { key: "Backspace" });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react"]);
    });
  });

  it("prevents duplicate tags by default", async () => {
    const handleChange = vi.fn();
    render(<TagInput defaultValue={["react"]} onChange={handleChange} />);

    const input = screen.getByPlaceholderText("");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/tag already exists/i)).toBeInTheDocument();
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("allows duplicate tags when allowDuplicates is true", async () => {
    const handleChange = vi.fn();
    render(<TagInput defaultValue={["react"]} onChange={handleChange} allowDuplicates />);

    const input = screen.getByPlaceholderText("");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react", "react"]);
    });
  });

  it("enforces max tags limit", async () => {
    const handleChange = vi.fn();
    render(<TagInput defaultValue={["tag1", "tag2"]} onChange={handleChange} maxTags={2} />);

    const input = screen.getByPlaceholderText("");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/maximum 2 tags/i)).toBeInTheDocument();
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("enforces max length per tag", async () => {
    const handleChange = vi.fn();
    render(<TagInput onChange={handleChange} maxLength={5} />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "verylongtag" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/must be 5 characters or less/i)).toBeInTheDocument();
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("validates tags with custom validator", async () => {
    const handleChange = vi.fn();
    render(
      <TagInput
        onChange={handleChange}
        validate={(tag) => {
          if (tag.length < 3) {
            return "Tag must be at least 3 characters";
          }
          return true;
        }}
      />
    );

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("splits tags on separator", async () => {
    const handleChange = vi.fn();
    render(<TagInput onChange={handleChange} separator="," />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "react,typescript,storybook" } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(["react", "typescript", "storybook"]);
    });
  });

  it("calls onTagAdd callback", async () => {
    const handleTagAdd = vi.fn();
    render(<TagInput onTagAdd={handleTagAdd} />);

    const input = screen.getByPlaceholderText("Add tags...");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(handleTagAdd).toHaveBeenCalledWith("react");
    });
  });

  it("calls onTagRemove callback", async () => {
    const handleTagRemove = vi.fn();
    render(<TagInput defaultValue={["react"]} onTagRemove={handleTagRemove} />);

    const removeButton = screen.getByLabelText("Remove react");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(handleTagRemove).toHaveBeenCalledWith("react");
    });
  });

  it("disables interaction when disabled", () => {
    render(<TagInput defaultValue={["react"]} disabled />);

    const input = screen.getByPlaceholderText("");
    expect(input).toBeDisabled();

    const removeButton = screen.queryByLabelText("Remove react");
    expect(removeButton).not.toBeInTheDocument();
  });
});

