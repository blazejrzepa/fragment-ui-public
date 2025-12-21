/**
 * Quick Actions Data Source
 * 
 * Generates quick action buttons for dashboard
 */

export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  variant?: "default" | "primary" | "secondary" | "outline";
  onClick: string; // Function name or handler
}

export interface QuickActionsData {
  actions: QuickAction[];
}

/**
 * Generate quick actions data
 */
export function generateQuickActionsData(): QuickActionsData {
  const actions: QuickAction[] = [
    {
      id: "new-project",
      label: "New Project",
      icon: "Plus",
      variant: "primary",
      onClick: "handleNewProject",
    },
    {
      id: "import-data",
      label: "Import Data",
      icon: "Upload",
      variant: "default",
      onClick: "handleImportData",
    },
    {
      id: "export-report",
      label: "Export Report",
      icon: "Download",
      variant: "default",
      onClick: "handleExportReport",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "Settings",
      variant: "outline",
      onClick: "handleSettings",
    },
  ];
  
  return { actions };
}

/**
 * Mock API function for quick actions
 * In production, this could be configurable per user/role
 */
export async function fetchQuickActionsData(): Promise<QuickActionsData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return generateQuickActionsData();
}

