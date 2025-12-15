import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

describe("Tabs", () => {
  it("renders tabs with content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("renders tabs with variant pills", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList variant="pills">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    const trigger = container.querySelector('[data-state="active"]');
    expect(trigger).toBeInTheDocument();
  });

  it("renders tabs with variant underline", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList variant="underline">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    const list = container.querySelector('[role="tablist"]');
    expect(list).toBeInTheDocument();
  });

  it("renders tabs with variant boxed", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList variant="boxed">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    const trigger = container.querySelector('[role="tab"]');
    expect(trigger).toBeInTheDocument();
  });

  it("renders tabs with icons", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" icon="📊">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("📊")).toBeInTheDocument();
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
  });

  it("renders tabs with badges", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" badge={<span>3</span>}>Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
  });

  it("renders vertical tabs", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList orientation="vertical">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );

    const list = container.querySelector('[role="tablist"]');
    expect(list).toBeInTheDocument();
  });
});

