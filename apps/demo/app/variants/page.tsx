"use client";

/**
 * Variant Generator Page
 * 
 * Generate multiple UI-DSL variants from:
 * 1. Uploaded documents (TXT, MD)
 * 2. Existing DSL (from playground or direct input)
 */

import { useState, useRef } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import { Upload, Loader2, CheckCircle2, Code, FileText } from "lucide-react";
import { VariantsComparer, type ScoredVariant } from "@/components/variants-comparer";
import { generateCodeFromDSL } from "@/lib/dsl-codegen";
import type { UiPage } from "@fragment_ui/ui-dsl";
import registryData from "@fragment_ui/registry/registry.json";
import type { Variant } from "./types";
import { ReactLiveRenderer } from "@/components/react-live-renderer";

export default function VariantsPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "dsl">("upload");
  
  // Upload mode state
  const [file, setFile] = useState<File | null>(null);
  const [variantCount, setVariantCount] = useState(3);
  const [variants, setVariants] = useState<Variant[]>([]);
  
  // DSL mode state
  const [dslInput, setDslInput] = useState<string>("");
  const [dslVariants, setDslVariants] = useState<ScoredVariant[]>([]);
  const [dslEmphasis, setDslEmphasis] = useState<"layout" | "copy" | "datasource" | undefined>(undefined);
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setVariants([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("variantCount", variantCount.toString());

      const response = await fetch("/api/variants", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate variants");
      }

      const data = await response.json();
      setVariants(data.variants || []);
    } catch (err: any) {
      setError(err.message || "Failed to generate variants");
    } finally {
      setLoading(false);
    }
  };

  // Handle DSL-based variant generation
  const handleGenerateFromDSL = async () => {
    if (!dslInput.trim()) {
      setError("Please provide a DSL JSON");
      return;
    }

    setLoading(true);
    setError(null);
    setDslVariants([]);

    try {
      let dsl: UiPage;
      try {
        dsl = JSON.parse(dslInput);
      } catch (e) {
        throw new Error("Invalid JSON format");
      }

      if (dsl.type !== "page") {
        throw new Error("DSL must be a page type");
      }

      // Call new variants/create API
      const response = await fetch("/api/variants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dsl,
          count: variantCount,
          emphasis: dslEmphasis,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate variants");
      }

      const data = await response.json();
      
      // Generate TSX for each variant
      const scoredVariants: ScoredVariant[] = await Promise.all(
        data.variants.map(async (variant: { dsl: UiPage; score: any }) => {
          try {
            const tsx = generateCodeFromDSL(variant.dsl, registryData);
            return {
              dsl: variant.dsl,
              tsx,
              score: variant.score,
            };
          } catch (e) {
            console.error("Error generating TSX:", e);
            return {
              dsl: variant.dsl,
              score: variant.score,
            };
          }
        })
      );

      setDslVariants(scoredVariants);
    } catch (err: any) {
      setError(err.message || "Failed to generate variants");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareVariants = async () => {
    if (dslVariants.length < 2) {
      setError("At least 2 variants required for comparison");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/variants/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variants: dslVariants.map((v) => v.dsl),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compare variants");
      }

      const data = await response.json();
      
      // Update variants with comparison results
      const updatedVariants = dslVariants.map((variant, idx) => {
        const score = data.scores.find((s: any) => s.idx === idx);
        return {
          ...variant,
          score: score ? {
            score: score.score,
            breakdown: score.breakdown,
            notes: score.notes,
          } : variant.score,
        };
      });

      setDslVariants(updatedVariants);
    } catch (err: any) {
      setError(err.message || "Failed to compare variants");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (variant: Variant | ScoredVariant, index: number) => {
    try {
      const dsl = variant.dsl;
      const tsx = variant.tsx || "";
      
      // Create submission
      const submissionResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "screen",
          dsl,
          tsx,
          author: "variant-generator",
        }),
      });

      if (!submissionResponse.ok) {
        throw new Error("Failed to create submission");
      }

      const submission = await submissionResponse.json();

      // Auto-verify
      const verifyResponse = await fetch(`/api/submissions/${submission.id}/verify`, {
        method: "POST",
      });

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify submission");
      }

      alert(`Variant ${index + 1} promoted! Submission ID: ${submission.id}`);
    } catch (err: any) {
      alert(`Failed to promote variant: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Variant Generator</h1>
        <p className="text-muted-foreground">
          Generate multiple UI-DSL variants from documents or existing DSL
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "dsl")}>
        <TabsList>
          <TabsTrigger value="upload">
            <FileText className="h-4 w-4 mr-2" />
            From Document
          </TabsTrigger>
          <TabsTrigger value="dsl">
            <Code className="h-4 w-4 mr-2" />
            From DSL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-8">

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload a text file (TXT, MD) describing the screen requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.text"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {file ? file.name : "Select File"}
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm">Variants:</label>
              <select
                value={variantCount}
                onChange={(e) => setVariantCount(parseInt(e.target.value, 10))}
                className="px-2 py-1 border rounded text-sm"
                disabled={loading}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Variants"
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

          {/* Variants Gallery */}
          {variants.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Generated Variants</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {variants.map((variant, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Variant {index + 1}</CardTitle>
                          <CardDescription className="mt-2">
                            {variant.description}
                          </CardDescription>
                          {variant.sourceSections.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">
                                Based on: {variant.sourceSections.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromote(variant, index)}
                        >
                          Promote to Submission
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden" style={{ height: "400px" }}>
                        <ReactLiveRenderer
                          code={variant.tsx}
                          onError={(error) => {
                            console.error(`[Variant ${index + 1}] Error:`, error);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="dsl" className="space-y-8">
          {/* DSL Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Variants from DSL</CardTitle>
              <CardDescription>
                Paste a UI-DSL v2 JSON to generate variants with different emphasis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">DSL JSON</label>
                <textarea
                  value={dslInput}
                  onChange={(e) => setDslInput(e.target.value)}
                  placeholder='{"type": "page", "id": "...", "children": [...]}'
                  className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Variants:</label>
                  <select
                    value={variantCount}
                    onChange={(e) => setVariantCount(parseInt(e.target.value, 10))}
                    className="px-2 py-1 border rounded text-sm"
                    disabled={loading}
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Emphasis:</label>
                  <select
                    value={dslEmphasis || ""}
                    onChange={(e) => setDslEmphasis(e.target.value as any || undefined)}
                    className="px-2 py-1 border rounded text-sm"
                    disabled={loading}
                  >
                    <option value="">Auto (all types)</option>
                    <option value="layout">Layout</option>
                    <option value="copy">Copy</option>
                    <option value="datasource">Datasource</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerateFromDSL}
                  disabled={!dslInput.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Variants"
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants Comparison */}
          {dslVariants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Generated Variants</h2>
                <Button
                  variant="outline"
                  onClick={handleCompareVariants}
                  disabled={loading || dslVariants.length < 2}
                >
                  Compare Scores
                </Button>
              </div>
              <VariantsComparer
                variants={dslVariants}
                bestIdx={dslVariants.length > 0 ? 0 : undefined}
                onSelect={(idx) => {
                  console.log("Selected variant:", idx);
                }}
                onCompare={handleCompareVariants}
                showPreview={true}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

