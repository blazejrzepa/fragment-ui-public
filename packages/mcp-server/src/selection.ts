/**
 * MCP Selection Tools
 * 
 * Tools for managing selection state in UI-DSL editing.
 * Used by AI agents (Cursor/Copilot) to track selected elements.
 */

// Type definitions (simplified for MCP server)
export type NodeRef =
  | { type: "byId"; id: string }
  | { type: "byPath"; path: string }
  | { type: "byTestId"; testId: string };

export interface SelectionState {
  current: NodeRef | null;
  history: NodeRef[];
}

/**
 * Create a new selection state
 */
export function createSelection(): SelectionState {
  return {
    current: null,
    history: [],
  };
}

/**
 * Set selection
 */
export function setSelection(
  selection: SelectionState,
  ref: NodeRef
): SelectionState {
  const newSelection = { ...selection };
  
  // Add current to history if it exists
  if (newSelection.current) {
    newSelection.history = [...newSelection.history, newSelection.current];
    // Keep only last 10 selections
    if (newSelection.history.length > 10) {
      newSelection.history = newSelection.history.slice(-10);
    }
  }
  
  newSelection.current = ref;
  return newSelection;
}

/**
 * Clear selection
 */
export function clearSelection(selection: SelectionState): SelectionState {
  return {
    ...selection,
    current: null,
  };
}

/**
 * Get current selection
 */
export function getCurrentSelection(selection: SelectionState): NodeRef | null {
  return selection.current;
}

/**
 * Get selection history
 */
export function getSelectionHistory(selection: SelectionState): NodeRef[] {
  return [...selection.history];
}

/**
 * Go back in selection history
 */
export function previousSelection(selection: SelectionState): SelectionState {
  if (selection.history.length === 0) {
    return selection;
  }
  
  const newSelection = { ...selection };
  const previous = newSelection.history[newSelection.history.length - 1];
  newSelection.history = newSelection.history.slice(0, -1);
  newSelection.current = previous;
  
  return newSelection;
}

