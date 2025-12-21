"use client";

/**
 * Submission Detail Page
 * 
 * Shows detailed information about a single submission
 */

import { useState, useEffect } from "react";
import { use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import { ReviewInterface } from "@/components/submissions/review-interface";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "@fragment_ui/ui";
import type { Submission, ReviewComment } from "../types";

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  async function fetchSubmission() {
    try {
      setLoading(true);
      const response = await fetch(`/api/submissions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch submission");
      }
      const data = await response.json();
      setSubmission(data);
    } catch (error: any) {
      console.error("[Submission Detail] Error:", error);
      toast.error("Failed to load submission");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/submissions/${id}/verify`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to verify submission");
      }
      const updated = await response.json();
      setSubmission(updated);
      toast.success("Submission verified");
    } catch (error: any) {
      console.error("[Submission Detail] Error verifying:", error);
      toast.error("Failed to verify submission");
    }
  }

  async function handlePromote() {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/submissions/${id}/promote`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to promote submission");
      }
      const updated = await response.json();
      setSubmission(updated);
      toast.success("Submission promoted! PR created.");
    } catch (error: any) {
      console.error("[Submission Detail] Error promoting:", error);
      toast.error(error.message || "Failed to promote submission");
    }
  }

  // Phase 2: D3 - Review Interface handlers
  async function handleApprove(comment?: string) {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve submission");
      }
      const updated = await response.json();
      setSubmission(updated);
    } catch (error: any) {
      console.error("[Submission Detail] Error approving:", error);
      throw error;
    }
  }

  async function handleRequestChanges(comment: string, comments?: ReviewComment[]) {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/submissions/${id}/request-changes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, comments }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request changes");
      }
      const updated = await response.json();
      setSubmission(updated);
    } catch (error: any) {
      console.error("[Submission Detail] Error requesting changes:", error);
      throw error;
    }
  }

  async function handleAddComment(comment: ReviewComment) {
    if (!submission) return;
    
    try {
      // Update submission locally first (optimistic update)
      const updated = {
        ...submission,
        reviewComments: [...(submission.reviewComments || []), comment],
      };
      setSubmission(updated);
      
      // Then persist to server
      const response = await fetch(`/api/submissions/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const saved = await response.json();
      setSubmission(saved);
    } catch (error: any) {
      console.error("[Submission Detail] Error adding comment:", error);
      // Revert optimistic update
      setSubmission(submission);
      throw error;
    }
  }

  async function handleResolveComment(commentId: string) {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/submissions/${id}/comments/${commentId}/resolve`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to resolve comment");
      }
      const updated = await response.json();
      setSubmission(updated);
    } catch (error: any) {
      console.error("[Submission Detail] Error resolving comment:", error);
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-[color:var(--foreground-secondary)]">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-[color:var(--foreground-secondary)] mb-4">Submission not found</p>
          <Link href="/submissions">
            <Button variant="outline">Back to Submissions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusIcon = submission.status === "verified" || submission.status === "promoted" 
    ? <CheckCircle2 className="h-4 w-4" />
    : submission.status === "REJECTED"
    ? <XCircle className="h-4 w-4" />
    : submission.status === "verifying"
    ? <Clock className="h-4 w-4" />
    : <FileText className="h-4 w-4" />;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/submissions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Submission {submission.id.substring(0, 8)}</h1>
            <p className="text-sm text-[color:var(--foreground-secondary)]">
              {submission.type}
              {submission.originType && ` • ${submission.originType === "r&d" ? "R&D" : submission.originType.charAt(0).toUpperCase() + submission.originType.slice(1)}`}
              {` • by ${submission.author} • ${formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={submission.status === "verified" || submission.status === "promoted" ? "solid" : submission.status === "REJECTED" ? "subtle" : "outline"}>
            {statusIcon}
            {submission.status}
          </Badge>
          {submission.status === "DRAFT" && (
            <Button onClick={handleVerify}>Verify</Button>
          )}
          {(submission.status === "APPROVED" || submission.status === "verifying") && (
            <Button onClick={handlePromote}>Promote to PR</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="dsl">DSL</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                <ReactLiveRenderer
                  code={submission.tsx}
                  onError={(error) => {
                    console.error("[Submission Detail] Preview error:", error);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TSX Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-[color:var(--color-surface-1)] rounded-lg overflow-auto text-sm">
                <code>{submission.tsx}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dsl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UI-DSL</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-[color:var(--color-surface-1)] rounded-lg overflow-auto text-sm">
                <code>{JSON.stringify(submission.dsl, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          {submission.result ? (
            <Card>
              <CardHeader>
                <CardTitle>Verification Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Score: {submission.result.score}/100</h3>
                  <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        submission.result.score >= 80 ? "bg-green-600" :
                        submission.result.score >= 60 ? "bg-yellow-600" :
                        "bg-red-600"
                      }`}
                      style={{ width: `${submission.result.score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-[color:var(--foreground-secondary)] mb-1">Lint Errors</p>
                    <p className="text-2xl font-bold">{submission.result.lint.errors}</p>
                    {submission.result.lint.warnings > 0 && (
                      <p className="text-xs text-[color:var(--foreground-tertiary)]">
                        {submission.result.lint.warnings} warnings
                      </p>
                    )}
                    {submission.result.lint.issues.length > 0 && (
                      <ul className="mt-2 text-xs text-[color:var(--foreground-secondary)] list-disc list-inside max-h-32 overflow-y-auto">
                        {submission.result.lint.issues.slice(0, 5).map((issue, i) => (
                          <li key={i}>
                            Line {issue.line}: {issue.message} ({issue.rule})
                          </li>
                        ))}
                        {submission.result.lint.issues.length > 5 && (
                          <li className="text-[color:var(--foreground-tertiary)]">
                            ... and {submission.result.lint.issues.length - 5} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--foreground-secondary)] mb-1">A11y Violations</p>
                    <p className="text-2xl font-bold">{submission.result.a11y.violations}</p>
                    {submission.result.a11y.issues.length > 0 && (
                      <ul className="mt-2 text-xs text-[color:var(--foreground-secondary)] list-disc list-inside max-h-32 overflow-y-auto">
                        {submission.result.a11y.issues.slice(0, 3).map((issue, i) => (
                          <li key={i} className="capitalize">
                            {issue.impact}: {issue.description}
                          </li>
                        ))}
                        {submission.result.a11y.issues.length > 3 && (
                          <li className="text-[color:var(--foreground-tertiary)]">
                            ... and {submission.result.a11y.issues.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--foreground-secondary)] mb-1">Token Violations</p>
                    <p className="text-2xl font-bold">{submission.result.tokens.violations}</p>
                    {submission.result.tokens.issues.length > 0 && (
                      <ul className="mt-2 text-xs text-[color:var(--foreground-secondary)] list-disc list-inside max-h-32 overflow-y-auto">
                        {submission.result.tokens.issues.slice(0, 3).map((issue, i) => (
                          <li key={i}>
                            Line {issue.line}: {issue.suggestion}
                          </li>
                        ))}
                        {submission.result.tokens.issues.length > 3 && (
                          <li className="text-[color:var(--foreground-tertiary)]">
                            ... and {submission.result.tokens.issues.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--foreground-secondary)] mb-1">Figma Parity</p>
                    <p className="text-2xl font-bold">{submission.result.figma.coverage.toFixed(1)}%</p>
                    {submission.result.figma.coverage < 90 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Target: &gt;90%
                      </p>
                    )}
                    {submission.result.figma.missing.length > 0 && (
                      <ul className="mt-2 text-xs text-[color:var(--foreground-secondary)] list-disc list-inside max-h-32 overflow-y-auto">
                        {submission.result.figma.missing.slice(0, 3).map((missing, i) => (
                          <li key={i}>
                            Missing: {missing.variant} ({missing.prop})
                          </li>
                        ))}
                        {submission.result.figma.missing.length > 3 && (
                          <li className="text-[color:var(--foreground-tertiary)]">
                            ... and {submission.result.figma.missing.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                {submission.result.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Actionable Suggestions</h4>
                    <ul className="list-disc list-inside text-sm text-[color:var(--foreground-secondary)] space-y-1 max-h-64 overflow-y-auto">
                      {submission.result.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-[color:var(--foreground-secondary)]">
                  This submission has not been verified yet.
                </p>
                {submission.status === "DRAFT" && (
                  <Button onClick={handleVerify} className="mt-4">
                    Verify Now
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <ReviewInterface
            submission={submission}
            onApprove={handleApprove}
            onRequestChanges={handleRequestChanges}
            onAddComment={handleAddComment}
            onResolveComment={handleResolveComment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

