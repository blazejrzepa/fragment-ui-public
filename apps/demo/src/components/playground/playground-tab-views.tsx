"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@fragment_ui/ui";
import { QualityDashboard, type QualityDashboardRef } from "@/components/quality/QualityDashboard";
import { ComponentsGallery } from "@/components/playground/components-gallery";
import type { Registry } from "@/types/registry";
import type { ComponentRenderer } from "@/lib/component-renderer";
import type { ComponentCodeGenerator } from "@/lib/component-code-generator";

interface PlaygroundTabViewsProps {
  currentTab: string | null;
  
  // Governance tab props
  qualityDashboardRef?: React.RefObject<QualityDashboardRef>;
  runningTests?: boolean;
  
  // Library/Components/Blocks tab props
  registry?: Registry | null;
  librarySubTab?: string | null;
  setActiveLeftSidebarSection?: (section: "chat" | "components" | "ds-components") => void;
  setSelectedDsComponent?: (component: string | null) => void;
  componentRenderer?: ComponentRenderer | null;
  componentGenerator?: ComponentCodeGenerator | null;
  dsComponentTabs?: Map<string, { name: string; code: string }>;
  setActiveDsComponentTab?: (tabId: string | null) => void;
  setDsComponentTabs?: React.Dispatch<React.SetStateAction<Map<string, { name: string; code: string }>>>;
}

export function PlaygroundTabViews({
  currentTab,
  qualityDashboardRef,
  runningTests = false,
  registry,
  librarySubTab,
  setActiveLeftSidebarSection,
  setSelectedDsComponent,
  componentRenderer,
  componentGenerator,
  dsComponentTabs,
  setActiveDsComponentTab,
  setDsComponentTabs,
}: PlaygroundTabViewsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Guard against null searchParams
  if (!searchParams) {
    return null;
  }

  // Governance tab
  if (currentTab === "governance") {
    return (
      <div className="flex-1 overflow-auto" style={{ height: "100%" }}>
        <QualityDashboard 
          ref={qualityDashboardRef}
          runningTests={runningTests}
          onRunAllTests={() => {
            // This will be handled by the button in top bar
          }}
        />
      </div>
    );
  }

  // Drafts/Submissions tab
  if (currentTab === "drafts" || currentTab === "submissions") {
    return (
      <div className="flex-1 overflow-hidden" style={{ height: "100%" }}>
        <iframe
          src="http://localhost:3002/submissions"
          className="w-full h-full border-0"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Drafts"
        />
      </div>
    );
  }

  // Releases tab
  if (currentTab === "releases") {
    return (
      <div className="flex-1 overflow-auto" style={{ height: "100%" }}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Releases</h2>
          <p className="text-sm text-muted-foreground">
            Released components and blocks will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Experiments tab
  if (currentTab === "experiments") {
    return (
      <div className="flex-1 overflow-auto" style={{ height: "100%" }}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Experiments</h2>
          <p className="text-sm text-muted-foreground">
            A/B testing experiments will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Library/Components/Blocks tab
  if (currentTab === "library" || currentTab === "components" || currentTab === "blocks") {
    if (!registry || !setActiveLeftSidebarSection || !setSelectedDsComponent || !dsComponentTabs || !setActiveDsComponentTab || !setDsComponentTabs) {
      return null;
    }

    return (
      <div className="flex-1 overflow-auto" style={{ height: "100%" }}>
        <ComponentsGallery
          registry={registry}
          filterType={currentTab === "blocks" ? "blocks" : currentTab === "components" ? "components" : "all"}
          librarySubTab={currentTab === "library" ? (librarySubTab as "components" | "blocks") : undefined}
          onLibrarySubTabChange={(tab) => {
            if (!searchParams) return;
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.set("tab", "library");
            newSearchParams.set("libraryTab", tab);
            router.push(`/studio?${newSearchParams.toString()}`);
          }}
          onComponentClick={(componentName) => {
            // Switch to studio and open the component in DS Components browser
            router.push("/studio");
            setTimeout(() => {
              // Open DS Components section and select the component
              setActiveLeftSidebarSection("ds-components");
              setSelectedDsComponent(componentName);
              // Open component in DS Components tab
              if (componentRenderer && registry && componentGenerator) {
                componentRenderer.render(componentName, {
                  code: '',
                  metadata: componentGenerator.resolveComponent(componentName),
                  onError: (error) => {
                    console.error(`[Components Gallery] Render error for "${componentName}":`, error);
                    toast.error(`Failed to render component: ${error.message}`);
                  },
                  onSuccess: () => {
                    console.log(`[Components Gallery] Successfully generated code for "${componentName}"`);
                  }
                }).then((componentCode) => {
                  // Check if a tab for this component already exists
                  let existingTabId: string | null = null;
                  for (const [tabId, tab] of dsComponentTabs.entries()) {
                    if (tab.name === componentName) {
                      existingTabId = tabId;
                      break;
                    }
                  }
                  
                  if (existingTabId) {
                    // Switch to existing tab
                    setActiveDsComponentTab(existingTabId);
                  } else {
                    // Create new tab
                    const newTabId = `ds-${Date.now()}`;
                    setDsComponentTabs(prev => new Map(prev).set(newTabId, {
                      name: componentName,
                      code: componentCode,
                    }));
                    setActiveDsComponentTab(newTabId);
                  }
                });
              }
            }, 100);
          }}
        />
      </div>
    );
  }

  return null;
}

