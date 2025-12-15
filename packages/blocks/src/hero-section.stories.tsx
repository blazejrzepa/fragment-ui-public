import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "./hero-section";

const meta: Meta<typeof HeroSection> = {
  title: "Blocks/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    title: "Welcome to Our Platform",
    description: "Build amazing experiences with our powerful tools",
    primaryCTA: {
      label: "Get Started",
      href: "/signup",
    },
    secondaryCTA: {
      label: "Learn More",
      href: "/about",
    },
  },
};

export const WithGradient: Story = {
  args: {
    title: "Transform Your Workflow",
    description: "The all-in-one solution for modern teams",
    background: "gradient",
    primaryCTA: {
      label: "Start Free Trial",
      onClick: () => console.log("Trial started"),
    },
    secondaryCTA: {
      label: "Watch Demo",
      onClick: () => console.log("Demo watched"),
    },
  },
};

export const Minimal: Story = {
  args: {
    title: "Simple Hero",
    description: "Just the essentials",
    primaryCTA: {
      label: "Get Started",
    },
  },
};

export const WithImage: Story = {
  args: {
    title: "Hero with Background Image",
    description: "Beautiful hero section with image background",
    background: "image",
    image: {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920",
      alt: "Hero background",
    },
    primaryCTA: {
      label: "Explore",
    },
  },
};

