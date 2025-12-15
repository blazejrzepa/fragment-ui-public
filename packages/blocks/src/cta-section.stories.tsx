import type { Meta, StoryObj } from "@storybook/react";
import { CTASection } from "./cta-section";

const meta: Meta<typeof CTASection> = {
  title: "Blocks/CTASection",
  component: CTASection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {
  args: {
    title: "Ready to get started?",
    description: "Join thousands of teams already using our platform",
    primaryCTA: {
      label: "Get Started",
      href: "/signup",
    },
    secondaryCTA: {
      label: "Contact Sales",
      href: "/contact",
    },
  },
};

export const Centered: Story = {
  args: {
    title: "Start Your Free Trial",
    description: "No credit card required. Cancel anytime.",
    variant: "centered",
    primaryCTA: {
      label: "Start Free Trial",
      onClick: () => console.log("Trial started"),
    },
  },
};

export const Split: Story = {
  args: {
    title: "Ready to transform your workflow?",
    description: "See how our platform can help your team succeed",
    variant: "split",
    primaryCTA: {
      label: "Get Started",
      onClick: () => console.log("Get started clicked"),
    },
    secondaryCTA: {
      label: "Learn More",
      onClick: () => console.log("Learn more clicked"),
    },
  },
};

export const WithGradient: Story = {
  args: {
    title: "Join Us Today",
    description: "Be part of the future of collaboration",
    background: "gradient",
    primaryCTA: {
      label: "Sign Up Now",
      onClick: () => console.log("Sign up clicked"),
    },
  },
};

export const MutedBackground: Story = {
  args: {
    title: "Have Questions?",
    description: "Our team is here to help",
    background: "muted",
    primaryCTA: {
      label: "Contact Support",
      href: "/support",
    },
    secondaryCTA: {
      label: "View Docs",
      href: "/docs",
    },
  },
};

