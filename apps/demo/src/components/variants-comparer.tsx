"use client";

/**
 * Variants Comparer Component
 * 
 * Displays multiple variants side-by-side with scoring metrics
 * Allows selection of the best variant based on scores
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import {
  Trophy,
  Eye,
  Layers,
  Accessibility,
  Palette,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import type { UiPage } from "@fragment_ui/ui-dsl";

/**
 * Variant with score
 */
export interface ScoredVariant {
  dsl: UiPage;
  tsx?: string;
  score: {
    score: number;
    breakdown: {
      clarity: number;
      hierarchy: number;
      a11y: number;
      tokenCompliance: number;
    };
    notes: string[];
  };
}

interface VariantsComparerProps {
  variants: ScoredVariant[];
  bestIdx?: number;
  onSelect?: (idx: number) => void;
  onCompare?: () => void;
  showPreview?: boolean;
}

/**
 * Get score color based on value
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * Get score badge variant
 */
function getScoreBadgeVariant(score: number): "solid" | "outline" | "subtle" {
  if (score >= 80) return "solid";
  if (score >= 60) return "outline";
  return "subtle";
}

export function VariantsComparer({
  variants,
  bestIdx,
  onSelect,
  onCompare,
  showPreview = true,
}: VariantsComparerProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(bestIdx ?? null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    onSelect?.(idx);
  };

  if (variants.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No variants to compare
        </CardContent>
      </Card>
    );
  }

  const bestVariantIdx = bestIdx ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Variants Comparison</CardTitle>
              <CardDescription>
                Compare {variants.length} variant{variants.length > 1 ? "s" : ""} and select the best one
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                data-action-id="variants-view-toggle"
                data-action-kind="toggle"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
              {onCompare && (
                <Button 
                  size="sm" 
                  onClick={onCompare}
                  data-action-id="variants-compare"
                  data-action-kind="action"
                >
                  Compare Scores
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Best Variant Highlight */}
          {bestVariantIdx !== null && variants[bestVariantIdx] && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Best Variant: #{bestVariantIdx + 1}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Score: {variants[bestVariantIdx].score.score}/100
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {variants.map((variant, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedIdx === idx
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                } ${idx === bestVariantIdx ? "border-green-500" : ""}`}
                onClick={() => handleSelect(idx)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Variant #{idx + 1}</CardTitle>
                    {idx === bestVariantIdx && (
                      <Trophy className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Overall</span>
                      <Badge variant={getScoreBadgeVariant(variant.score.score)}>
                        {variant.score.score}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clarity</span>
                        <span className={getScoreColor(variant.score.breakdown.clarity)}>
                          {variant.score.breakdown.clarity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hierarchy</span>
                        <span className={getScoreColor(variant.score.breakdown.hierarchy)}>
                          {variant.score.breakdown.hierarchy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">A11y</span>
                        <span className={getScoreColor(variant.score.breakdown.a11y)}>
                          {variant.score.breakdown.a11y}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tokens</span>
                        <span className={getScoreColor(variant.score.breakdown.tokenCompliance)}>
                          {variant.score.breakdown.tokenCompliance}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {variants.map((variant, idx) => (
            <Card
              key={idx}
              className={`${
                selectedIdx === idx ? "ring-2 ring-primary" : ""
              } ${idx === bestVariantIdx ? "border-green-500" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>Variant #{idx + 1}</CardTitle>
                      {idx === bestVariantIdx && (
                        <Badge variant="solid" className="bg-green-600">
                          <Trophy className="h-3 w-3 mr-1" />
                          Best
                        </Badge>
                      )}
                      {selectedIdx === idx && (
                        <Badge variant="outline">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      Overall Score: {variant.score.score}/100
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedIdx === idx ? "solid" : "outline"}
                    onClick={() => handleSelect(idx)}
                    data-action-id={`variant-select-${idx}`}
                    data-action-kind="select"
                  >
                    {selectedIdx === idx ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Breakdown */}
                <Tabs defaultValue="metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metrics" className="space-y-4">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">Clarity</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getScoreColor(variant.score.breakdown.clarity)}>
                              {variant.score.breakdown.clarity}
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  variant.score.breakdown.clarity >= 80
                                    ? "bg-green-500"
                                    : variant.score.breakdown.clarity >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${variant.score.breakdown.clarity}%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">Hierarchy</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getScoreColor(variant.score.breakdown.hierarchy)}>
                              {variant.score.breakdown.hierarchy}
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  variant.score.breakdown.hierarchy >= 80
                                    ? "bg-green-500"
                                    : variant.score.breakdown.hierarchy >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${variant.score.breakdown.hierarchy}%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Accessibility className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">A11y</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getScoreColor(variant.score.breakdown.a11y)}>
                              {variant.score.breakdown.a11y}
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  variant.score.breakdown.a11y >= 80
                                    ? "bg-green-500"
                                    : variant.score.breakdown.a11y >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${variant.score.breakdown.a11y}%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">Tokens</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={getScoreColor(variant.score.breakdown.tokenCompliance)}>
                              {variant.score.breakdown.tokenCompliance}
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  variant.score.breakdown.tokenCompliance >= 80
                                    ? "bg-green-500"
                                    : variant.score.breakdown.tokenCompliance >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${variant.score.breakdown.tokenCompliance}%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Notes */}
                    {variant.score.notes.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1 text-sm">
                            {variant.score.notes.map((note, noteIdx) => (
                              <li key={noteIdx} className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="preview">
                    {showPreview && variant.tsx ? (
                      <div className="border rounded-lg overflow-hidden" style={{ height: "400px" }}>
                        <ReactLiveRenderer
                          code={variant.tsx}
                          onError={(error) => {
                            console.error(`[Variant ${idx + 1}] Error:`, error);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Preview not available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List view (simplified)
        <div className="space-y-4">
          {variants.map((variant, idx) => (
            <Card
              key={idx}
              className={`${
                selectedIdx === idx ? "ring-2 ring-primary" : ""
              } ${idx === bestVariantIdx ? "border-green-500" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">Variant #{idx + 1}</h3>
                      <p className="text-sm text-muted-foreground">
                        Score: {variant.score.score}/100
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>C: {variant.score.breakdown.clarity}</span>
                      <span>H: {variant.score.breakdown.hierarchy}</span>
                      <span>A: {variant.score.breakdown.a11y}</span>
                      <span>T: {variant.score.breakdown.tokenCompliance}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedIdx === idx ? "solid" : "outline"}
                    onClick={() => handleSelect(idx)}
                    data-action-id={`variant-select-list-${idx}`}
                    data-action-kind="select"
                  >
                    {selectedIdx === idx ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

