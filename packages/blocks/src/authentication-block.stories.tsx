import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AuthenticationBlock } from "./authentication-block";

const meta: Meta<typeof AuthenticationBlock> = {
  title: "Blocks/AuthenticationBlock",
  component: AuthenticationBlock,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthenticationBlock>;

export const Login: Story = {
  render: () => (
    <AuthenticationBlock
      mode="login"
      onSubmit={async (data) => {
        console.log("Login:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const Signup: Story = {
  render: () => (
    <AuthenticationBlock
      mode="signup"
      onSubmit={async (data) => {
        console.log("Signup:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const PasswordReset: Story = {
  render: () => (
    <AuthenticationBlock
      mode="reset"
      onSubmit={async (data) => {
        console.log("Reset:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const WithModeSwitching: Story = {
  render: () => {
    const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
    return (
      <AuthenticationBlock
        mode={mode}
        onModeChange={setMode}
        onSubmit={async (data) => {
          console.log("Submit:", mode, data);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    );
  },
};

export const WithSocialLogin: Story = {
  render: () => (
    <AuthenticationBlock
      mode="login"
      socialProviders={[
        { name: "Google", icon: "🔍", onClick: () => console.log("Google") },
        { name: "GitHub", icon: "💻", onClick: () => console.log("GitHub") },
        { name: "Twitter", icon: "🐦", onClick: () => console.log("Twitter") },
      ]}
      onSubmit={async (data) => {
        console.log("Login:", data);
      }}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <AuthenticationBlock
      mode="login"
      error="Invalid email or password. Please try again."
      onSubmit={async (data) => {
        console.log("Login:", data);
      }}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <AuthenticationBlock
      mode="login"
      loading={true}
      onSubmit={async (data) => {
        console.log("Login:", data);
      }}
    />
  ),
};

