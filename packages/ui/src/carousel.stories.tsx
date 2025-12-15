import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./carousel";
import { Card, CardContent } from "./card";

const meta: Meta<typeof Carousel> = {
  title: "Core/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const Slide = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div
    className={`h-64 flex items-center justify-center text-white text-2xl font-bold rounded-lg`}
    style={{ backgroundColor: color }}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Carousel>
      <Slide color="#3b82f6">Slide 1</Slide>
      <Slide color="#10b981">Slide 2</Slide>
      <Slide color="#f59e0b">Slide 3</Slide>
    </Carousel>
  ),
};

export const WithoutArrows: Story = {
  render: () => (
    <Carousel showArrows={false}>
      <Slide color="#3b82f6">Slide 1</Slide>
      <Slide color="#10b981">Slide 2</Slide>
      <Slide color="#f59e0b">Slide 3</Slide>
    </Carousel>
  ),
};

export const WithoutDots: Story = {
  render: () => (
    <Carousel showDots={false}>
      <Slide color="#3b82f6">Slide 1</Slide>
      <Slide color="#10b981">Slide 2</Slide>
      <Slide color="#f59e0b">Slide 3</Slide>
    </Carousel>
  ),
};

export const AutoPlay: Story = {
  render: () => (
    <Carousel autoPlay autoPlayInterval={2000}>
      <Slide color="#3b82f6">Slide 1</Slide>
      <Slide color="#10b981">Slide 2</Slide>
      <Slide color="#f59e0b">Slide 3</Slide>
      <Slide color="#ef4444">Slide 4</Slide>
    </Carousel>
  ),
};

export const WithCards: Story = {
  render: () => (
    <Carousel>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">Card 1</h3>
          <p>Content for card 1</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">Card 2</h3>
          <p>Content for card 2</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">Card 3</h3>
          <p>Content for card 3</p>
        </CardContent>
      </Card>
    </Carousel>
  ),
};

export const SingleSlide: Story = {
  render: () => (
    <Carousel>
      <Slide color="#3b82f6">Only One Slide</Slide>
    </Carousel>
  ),
};

