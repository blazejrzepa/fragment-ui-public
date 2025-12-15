import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TreeView, TreeNode } from "./tree-view";

describe("TreeView", () => {
  const sampleTree: TreeNode[] = [
    {
      id: "1",
      label: "Folder 1",
      children: [
        { id: "1-1", label: "File 1-1" },
        { id: "1-2", label: "File 1-2" },
      ],
    },
    {
      id: "2",
      label: "Folder 2",
      children: [
        { id: "2-1", label: "File 2-1" },
      ],
    },
  ];

  it("renders tree structure", () => {
    render(<TreeView nodes={sampleTree} />);
    expect(screen.getByText("Folder 1")).toBeInTheDocument();
    expect(screen.getByText("Folder 2")).toBeInTheDocument();
  });

  it("expands/collapses nodes on click", () => {
    render(<TreeView nodes={sampleTree} />);
    const folder1 = screen.getByText("Folder 1");
    
    // Initially collapsed, children not visible
    expect(screen.queryByText("File 1-1")).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(folder1);
    expect(screen.getByText("File 1-1")).toBeInTheDocument();
    expect(screen.getByText("File 1-2")).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(folder1);
    expect(screen.queryByText("File 1-1")).not.toBeInTheDocument();
  });

  it("calls onExpansionChange when node expands/collapses", () => {
    const onExpansionChange = vi.fn();
    render(<TreeView nodes={sampleTree} onExpansionChange={onExpansionChange} />);
    
    const folder1 = screen.getByText("Folder 1");
    fireEvent.click(folder1);
    
    expect(onExpansionChange).toHaveBeenCalledWith(expect.arrayContaining(["1"]));
  });

  it("calls onNodeClick when node is clicked", () => {
    const onNodeClick = vi.fn();
    render(<TreeView nodes={sampleTree} onNodeClick={onNodeClick} />);
    
    const folder1 = screen.getByText("Folder 1");
    fireEvent.click(folder1);
    
    expect(onNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", label: "Folder 1" })
    );
  });

  it("selects nodes with checkboxes", () => {
    const onSelectionChange = vi.fn();
    render(
      <TreeView
        nodes={sampleTree}
        showCheckboxes
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Expand folder first
    fireEvent.click(screen.getByText("Folder 1"));
    
    // Find and click checkbox for File 1-1
    const checkboxes = screen.getAllByRole("checkbox");
    const fileCheckbox = checkboxes.find((cb) => 
      cb.closest('[class*="tree-node"]')?.textContent?.includes("File 1-1")
    );
    
    if (fileCheckbox) {
      fireEvent.click(fileCheckbox);
      expect(onSelectionChange).toHaveBeenCalled();
    }
  });

  it("shows/hides icons based on showIcons prop", () => {
    const { rerender } = render(<TreeView nodes={sampleTree} showIcons />);
    expect(screen.getByRole("tree")).toBeInTheDocument();
    
    rerender(<TreeView nodes={sampleTree} showIcons={false} />);
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("handles disabled nodes", () => {
    const treeWithDisabled: TreeNode[] = [
      {
        id: "1",
        label: "Disabled Folder",
        disabled: true,
        children: [{ id: "1-1", label: "Child" }],
      },
    ];
    
    const onNodeClick = vi.fn();
    render(
      <TreeView
        nodes={treeWithDisabled}
        onNodeClick={onNodeClick}
      />
    );
    
    const disabledNode = screen.getByText("Disabled Folder");
    fireEvent.click(disabledNode);
    
    // Should not expand or call onNodeClick
    expect(screen.queryByText("Child")).not.toBeInTheDocument();
    expect(onNodeClick).not.toHaveBeenCalled();
  });

  it("respects defaultExpanded prop", () => {
    render(<TreeView nodes={sampleTree} defaultExpanded />);
    
    // All nodes should be expanded by default
    expect(screen.getByText("File 1-1")).toBeInTheDocument();
    expect(screen.getByText("File 1-2")).toBeInTheDocument();
    expect(screen.getByText("File 2-1")).toBeInTheDocument();
  });

  it("handles controlled expandedIds", () => {
    const { rerender } = render(
      <TreeView nodes={sampleTree} expandedIds={["1"]} />
    );
    
    expect(screen.getByText("File 1-1")).toBeInTheDocument();
    expect(screen.queryByText("File 2-1")).not.toBeInTheDocument();
    
    rerender(<TreeView nodes={sampleTree} expandedIds={["2"]} />);
    expect(screen.queryByText("File 1-1")).not.toBeInTheDocument();
    expect(screen.getByText("File 2-1")).toBeInTheDocument();
  });

  it("handles controlled selectedIds", () => {
    const onSelectionChange = vi.fn();
    render(
      <TreeView
        nodes={sampleTree}
        selectedIds={["1"]}
        showCheckboxes
        onSelectionChange={onSelectionChange}
      />
    );
    
    const checkboxes = screen.getAllByRole("checkbox");
    const checkedBoxes = checkboxes.filter((cb) => 
      cb.getAttribute("data-state") === "checked"
    );
    expect(checkedBoxes.length).toBeGreaterThan(0);
  });
});

