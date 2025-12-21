"use client";

/**
 * PlaygroundDialogs Component
 * 
 * Consolidates all dialogs used in the Playground page.
 * This component extracts dialogs from the monolithic page.tsx for better organization.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";

export interface PlaygroundDialogsProps {
  // File Path Dialog
  showFileDialog: boolean;
  setShowFileDialog: (value: boolean) => void;
  filePath: string;
  setFilePath: (value: string) => void;
  onApplyDiffConfirm: () => void;

  // New Folder Dialog
  showNewFolderDialog: boolean;
  setShowNewFolderDialog: (value: boolean) => void;
  newFolderName: string | null;
  setNewFolderName: (value: string) => void;
  onConfirmNewFolder: () => void;

  // New Component Confirmation Dialog
  showNewComponentDialog: boolean;
  setShowNewComponentDialog: (value: boolean) => void;
  onReplaceCurrentComponent: () => void;
  onCreateNewTab: () => void;
  onCancelNewComponent: () => void;

  // Variants Selection Dialog
  showVariantsDialog: boolean;
  setShowVariantsDialog: (value: boolean) => void;
  generatedVariants: any[]; // TODO: Replace with proper type ScoredVariant from variants-comparer
  setGeneratedVariants: (value: any[]) => void;
  onSelectVariant: (variant: any, index: number) => void;
}

/**
 * PlaygroundDialogs - All dialogs used in Playground
 */
export function PlaygroundDialogs({
  // File Path Dialog
  showFileDialog,
  setShowFileDialog,
  filePath,
  setFilePath,
  onApplyDiffConfirm,

  // New Folder Dialog
  showNewFolderDialog,
  setShowNewFolderDialog,
  newFolderName,
  setNewFolderName,
  onConfirmNewFolder,

  // New Component Confirmation Dialog
  showNewComponentDialog,
  setShowNewComponentDialog,
  onReplaceCurrentComponent,
  onCreateNewTab,
  onCancelNewComponent,

  // Variants Selection Dialog
  showVariantsDialog,
  setShowVariantsDialog,
  generatedVariants,
  setGeneratedVariants,
  onSelectVariant,
}: PlaygroundDialogsProps) {
  return (
    <>
      {/* File Path Dialog for Apply Diff */}
      {showFileDialog && (
        <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter File Path</DialogTitle>
              <DialogDescription>
                Enter the path where the component should be saved (e.g., src/components/MyComponent.tsx)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="file-path" className="text-sm font-medium">
                  File Path
                </label>
                <input
                  id="file-path"
                  type="text"
                  placeholder="src/components/MyComponent.tsx"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-[color:var(--color-surface-base)] text-[color:var(--color-fg-base)]"
                  style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onApplyDiffConfirm();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowFileDialog(false);
                setFilePath("");
              }}>
                Cancel
              </Button>
              <Button onClick={onApplyDiffConfirm} disabled={!filePath}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder to organize your components.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName || ""}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onConfirmNewFolder();
                } else if (e.key === "Escape") {
                  setShowNewFolderDialog(false);
                  setNewFolderName("");
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNewFolderDialog(false);
              setNewFolderName("");
            }}>
              Cancel
            </Button>
            <Button variant="solid" onClick={onConfirmNewFolder} disabled={!newFolderName?.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Component Confirmation Dialog */}
      <Dialog open={showNewComponentDialog} onOpenChange={setShowNewComponentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Component?</DialogTitle>
            <DialogDescription>
              You have an active component in the current tab. How would you like to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReplaceCurrentComponent();
              }}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Replace current component</span>
                <span className="text-xs text-[color:var(--color-fg-muted)]">
                  Generate the new component in the current tab, replacing the existing one
                </span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateNewTab();
              }}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Create new tab</span>
                <span className="text-xs text-[color:var(--color-fg-muted)]">
                  Generate the new component in a new tab, keeping the current one
                </span>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancelNewComponent}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Variants Selection Dialog */}
      <Dialog open={showVariantsDialog} onOpenChange={setShowVariantsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Variants</DialogTitle>
            <DialogDescription>
              Choose a variant to create a project. Variants are sorted by score (best first).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {generatedVariants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedVariants.map((variant, idx) => (
                  <Card key={idx} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Variant {idx + 1}</CardTitle>
                        {idx === 0 && (
                          <Badge variant="solid" className="bg-green-600">
                            Best
                          </Badge>
                        )}
                        <Badge variant="outline">
                          Score: {variant.score?.score || "N/A"}/100
                        </Badge>
                      </div>
                      {variant.score && (
                        <CardDescription className="text-xs mt-2">
                          <span className="inline-block mr-4">C: {variant.score?.breakdown?.clarity || "N/A"}</span>
                          <span className="inline-block mr-4">H: {variant.score?.breakdown?.hierarchy || "N/A"}</span>
                          <span className="inline-block mr-4">A: {variant.score?.breakdown?.a11y || "N/A"}</span>
                          <span className="inline-block">T: {variant.score?.breakdown?.tokenCompliance || "N/A"}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {variant.tsx && (
                        <div className="border rounded-lg overflow-hidden mb-3" style={{ height: "200px" }}>
                          <ReactLiveRenderer
                            code={variant.tsx}
                            onError={(error) => {
                              console.error(`[Variant ${idx + 1}] Error:`, error);
                            }}
                          />
                        </div>
                      )}
                      <Button
                        variant={idx === 0 ? "solid" : "outline"}
                        className="w-full"
                        onClick={() => onSelectVariant(variant, idx)}
                      >
                        {idx === 0 ? "Use Best Variant" : `Use Variant ${idx + 1}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No variants available
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowVariantsDialog(false);
              setGeneratedVariants([]);
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

