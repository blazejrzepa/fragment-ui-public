import type { Meta, StoryObj } from "@storybook/react";
import { FAQSection } from "./faq-section";

const meta: Meta<typeof FAQSection> = {
  title: "Blocks/FAQSection",
  component: FAQSection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAQSection>;

const defaultFAQ = [
  {
    question: "How does it work?",
    answer: "Our platform provides a simple, intuitive interface for managing your projects. Just sign up, create your first project, and start collaborating with your team.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no cancellation fees, and you'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, we have a web app that works great on mobile browsers. Native mobile apps are coming soon.",
  },
];

export const Default: Story = {
  args: {
    title: "Frequently Asked Questions",
    description: "Everything you need to know",
    items: defaultFAQ,
  },
};

export const Minimal: Story = {
  args: {
    items: defaultFAQ.slice(0, 3),
  },
};

export const LongList: Story = {
  args: {
    title: "FAQ",
    items: [
      ...defaultFAQ,
      {
        question: "How secure is my data?",
        answer: "We use industry-standard encryption and security practices. Your data is encrypted both in transit and at rest, and we regularly undergo security audits.",
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can export all your data at any time in JSON or CSV format from your account settings.",
      },
    ],
  },
};

