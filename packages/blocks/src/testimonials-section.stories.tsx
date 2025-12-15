import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialsSection } from "./testimonials-section";

const meta: Meta<typeof TestimonialsSection> = {
  title: "Blocks/TestimonialsSection",
  component: TestimonialsSection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialsSection>;

const defaultTestimonials = [
  {
    quote: "This platform has transformed our workflow. We've seen a 40% increase in productivity.",
    author: "John Doe",
    role: "CEO",
    company: "Company Inc.",
  },
  {
    quote: "Best investment we've made this year. The ROI has been incredible.",
    author: "Jane Smith",
    role: "CTO",
    company: "Tech Corp",
  },
  {
    quote: "Outstanding support and features. Highly recommend to any team looking to scale.",
    author: "Mike Johnson",
    role: "Product Manager",
    company: "StartupXYZ",
  },
];

export const Default: Story = {
  args: {
    title: "What Our Customers Say",
    description: "Don't just take our word for it",
    items: defaultTestimonials,
    layout: "grid",
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    title: "Testimonials",
    items: defaultTestimonials.slice(0, 2),
    layout: "grid",
    columns: 2,
  },
};

export const WithAvatars: Story = {
  args: {
    title: "Customer Reviews",
    items: [
      {
        ...defaultTestimonials[0],
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        ...defaultTestimonials[1],
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        ...defaultTestimonials[2],
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    ],
    layout: "grid",
    columns: 3,
  },
};

