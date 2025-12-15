import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Button } from "./button";

describe("Sheet", () => {
  it("renders", () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders with title and description", () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Test Title</SheetTitle>
          <SheetDescription>Test Description</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});


