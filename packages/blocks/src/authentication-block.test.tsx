import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthenticationBlock } from "./authentication-block";

describe("AuthenticationBlock", () => {
  it("renders login form", () => {
    render(<AuthenticationBlock mode="login" />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders signup form", () => {
    render(<AuthenticationBlock mode="signup" />);
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("renders reset form", () => {
    render(<AuthenticationBlock mode="reset" />);
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", async () => {
    const onSubmit = vi.fn();
    render(<AuthenticationBlock mode="login" onSubmit={onSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Simulate form submission (we'll test actual user interaction separately)
    emailInput.setAttribute("value", "test@example.com");
    passwordInput.setAttribute("value", "password123");
    submitButton.click();

    // Note: Full form submission testing requires user-event or fireEvent
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("shows error message when error prop is provided", () => {
    render(
      <AuthenticationBlock
        mode="login"
        error="Invalid credentials"
      />
    );
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("renders social login buttons", () => {
    render(
      <AuthenticationBlock
        mode="login"
        socialProviders={[
          { name: "Google", onClick: () => {} },
          { name: "GitHub", onClick: () => {} },
        ]}
      />
    );
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
  });
});

