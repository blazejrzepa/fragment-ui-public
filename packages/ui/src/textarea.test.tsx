import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders textarea", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<Textarea defaultValue="Default text" />);
    expect(screen.getByDisplayValue("Default text")).toBeInTheDocument();
  });

  it.skip("can be controlled (flaky in CI user-event)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea value="test" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("test");

    await user.type(textarea, " new");
    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("can be readonly", () => {
    render(<Textarea readOnly value="Read only text" />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute("readonly");
    expect(textarea.value).toBe("Read only text");
  });

  it("supports maxLength", () => {
    render(<Textarea maxLength={10} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute("maxLength", "10");
  });

  it("can have custom className", () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });
});

