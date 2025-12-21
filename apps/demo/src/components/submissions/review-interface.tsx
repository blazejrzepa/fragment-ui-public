/**
 * Review Interface Component
 * 
 * Phase 2: D3 - Review Interface
 * 
 * Provides inline commenting, diff visualization, and approval workflow
 * for reviewing submissions.
 */

/* eslint-disable axl-no-uncontracted/no-uncontracted-actions */
"use client";

import { useState, useCallback, useMemo } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@fragment_ui/ui";
import { toast } from "@fragment_ui/ui";
import { CheckCircle2, XCircle, MessageSquare, Eye, EyeOff } from "lucide-react";
import type { Submission, ReviewComment } from "../../../app/submissions/types";
import { normalizeSubmissionStatus } from "../../../app/submissions/types";
import { DiffVisualization } from "./diff-visualization";

export interface ReviewInterfaceProps {
  submission: Submission;
  onApprove?: (comment?: string) => Promise<void>;
  onRequestChanges?: (comment: string, comments?: ReviewComment[]) => Promise<void>;
  onAddComment?: (comment: ReviewComment) => Promise<void>;
  onResolveComment?: (commentId: string) => Promise<void>;
  readonly?: boolean;
  parentRevisionCode?: string; // Optional: parent revision code for diff visualization
}

export function ReviewInterface({
  submission,
  onApprove,
  onRequestChanges,
  onAddComment,
  onResolveComment,
  readonly = false,
  parentRevisionCode,
}: ReviewInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"code" | "dsl" | "diff">("code");
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRequestChangesDialog, setShowRequestChangesDialog] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [requestChangesComment, setRequestChangesComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComments, setShowComments] = useState(true);

  // Extract comments for current tab
  const currentComments = useMemo(() => {
    return (submission.reviewComments || []).filter(
      (comment) => !comment.location || comment.location.type === activeTab
    );
  }, [submission.reviewComments, activeTab]);

  // Get unresolved comments count
  const unresolvedCount = useMemo(() => {
    return currentComments.filter((c) => !c.resolved).length;
  }, [currentComments]);

  // Handle text selection for inline comments
  const handleTextSelection = useCallback(() => {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString().trim();
        
        // Only proceed if we have a valid selection
        if (text.length === 0) {
          setSelectedText(null);
          setSelectedRange(null);
          return;
        }
        
        try {
          const range = selection.getRangeAt(0);
          
          // Calculate approximate character offsets (simplified)
          const container = activeTab === "code" 
            ? document.querySelector('[data-code-content]')
            : document.querySelector('[data-dsl-content]');
          
          if (container) {
            const pre = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement?.closest('pre')
              : (range.commonAncestorContainer as Element).closest('pre');
            
            if (pre) {
              const textContent = pre.textContent || "";
              // Try to find the selected text in the content
              // Use a more robust method: find by searching from the start
              const start = textContent.indexOf(text);
              const end = start >= 0 ? start + text.length : -1;
              
              if (start >= 0 && end >= 0) {
                setSelectedText(text);
                setSelectedRange({ start, end });
                console.log("[ReviewInterface] Text selected:", { text: text.substring(0, 50), start, end });
              } else {
                // Fallback: use approximate offsets
                const containerText = container.textContent || "";
                const fallbackStart = containerText.indexOf(text);
                if (fallbackStart >= 0) {
                  setSelectedText(text);
                  setSelectedRange({ start: fallbackStart, end: fallbackStart + text.length });
                  console.log("[ReviewInterface] Text selected (fallback):", { text: text.substring(0, 50), start: fallbackStart });
                }
              }
            }
          }
        } catch (error) {
          console.warn("[ReviewInterface] Error handling text selection:", error);
          // Still set the text even if we can't calculate offsets
          setSelectedText(text);
          setSelectedRange({ start: 0, end: text.length });
        }
      } else {
        setSelectedText(null);
        setSelectedRange(null);
      }
    }, 10);
  }, [activeTab]);

  // Handle approve
  const handleApprove = useCallback(async () => {
    if (!onApprove) return;
    
    setIsProcessing(true);
    try {
      await onApprove(approveComment || undefined);
      setShowApproveDialog(false);
      setApproveComment("");
      toast.success("Submission approved");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve submission");
    } finally {
      setIsProcessing(false);
    }
  }, [onApprove, approveComment]);

  // Handle request changes
  const handleRequestChanges = useCallback(async () => {
    if (!onRequestChanges || !requestChangesComment.trim()) return;
    
    setIsProcessing(true);
    try {
      const inlineComments: ReviewComment[] = [];
      if (selectedText && selectedRange && onAddComment) {
        // Create inline comment from selection
        const comment: ReviewComment = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          createdBy: "current-user", // TODO: Get from auth context
          content: requestChangesComment,
          location: {
            type: activeTab === "diff" ? "code" : activeTab, // Map "diff" to "code" for location type
            startOffset: selectedRange.start,
            endOffset: selectedRange.end,
            selectedText,
          },
        };
        inlineComments.push(comment);
        await onAddComment(comment);
      }
      
      await onRequestChanges(requestChangesComment, inlineComments.length > 0 ? inlineComments : undefined);
      setShowRequestChangesDialog(false);
      setRequestChangesComment("");
      setSelectedText(null);
      setSelectedRange(null);
      toast.success("Changes requested");
    } catch (error: any) {
      toast.error(error.message || "Failed to request changes");
    } finally {
      setIsProcessing(false);
    }
  }, [onRequestChanges, requestChangesComment, selectedText, selectedRange, activeTab, onAddComment]);

  // Handle adding inline comment
  const handleAddInlineComment = useCallback(async (content: string) => {
    if (!onAddComment || !selectedText || !selectedRange || !content.trim()) return;
    
    try {
      const comment: ReviewComment = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        createdBy: "current-user", // TODO: Get from auth context
        content: content.trim(),
        location: {
          type: activeTab === "diff" ? "code" : activeTab, // Map "diff" to "code" for location type
          startOffset: selectedRange.start,
          endOffset: selectedRange.end,
          selectedText,
        },
      };
      await onAddComment(comment);
      setSelectedText(null);
      setSelectedRange(null);
      toast.success("Comment added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    }
  }, [onAddComment, selectedText, selectedRange, activeTab]);

  // Check if submission can be reviewed
  // Normalize status to handle both new and legacy formats
  const normalizedStatus = normalizeSubmissionStatus(submission.status);
  
  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("[ReviewInterface] Status check:", {
      originalStatus: submission.status,
      normalizedStatus,
      readonly,
    });
  }
  
  // Allow review for all statuses - even rejected can be reviewed again (to change decision)
  // Only hide buttons if explicitly readonly or already approved (approved is final)
  const isApproved = normalizedStatus === "approved";
  const isRejected = normalizedStatus === "rejected";
  
  // Can review if not readonly AND not already approved (approved is final, but rejected can be reviewed again)
  // This allows review even for statuses like "CHECKING", "verifying", "DRAFT", "rejected", etc.
  const canReview = !readonly && !isApproved;

  return (
    <div className="space-y-4">
      {/* Review Actions Bar */}
      {canReview && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={unresolvedCount > 0 ? "subtle" : "outline"}>
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {unresolvedCount} {unresolvedCount === 1 ? "comment" : "comments"}
                </Badge>
                {submission.checks && (
                  <>
                    <Badge variant={submission.checks.lint.passed ? "outline" : "subtle"}>
                      Lint: {submission.checks.lint.errors} errors
                    </Badge>
                    <Badge variant={submission.checks.a11y.passed ? "outline" : "subtle"}>
                      A11y: {submission.checks.a11y.violations} violations
                    </Badge>
                    {submission.checks.bundle && (
                      <Badge variant={submission.checks.bundle.passed ? "outline" : "subtle"}>
                        Bundle: {submission.checks.bundle.violations} violations
                      </Badge>
                    )}
                    {submission.checks.tests && (
                      <Badge variant={submission.checks.tests.passed ? "outline" : "subtle"}>
                        Tests: {submission.checks.tests.violations} missing
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Comments
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Comments
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRequestChangesDialog(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Request Changes
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowApproveDialog(true)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Badges */}
      {(isApproved || isRejected) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {isApproved && (
                <Badge variant="solid" className="bg-green-600">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approved {submission.approvedAt && `on ${new Date(submission.approvedAt).toLocaleDateString()}`}
                  {submission.approvedBy && ` by ${submission.approvedBy}`}
                </Badge>
              )}
              {isRejected && (
                <Badge variant="subtle" className="bg-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejected {submission.rejectedAt && `on ${new Date(submission.rejectedAt).toLocaleDateString()}`}
                  {submission.rejectedBy && ` by ${submission.rejectedBy}`}
                </Badge>
              )}
              {submission.rejectionReason && (
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  {submission.rejectionReason}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code/DSL Tabs with Comments */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "code" | "dsl" | "diff")} className="w-full">
        <TabsList>
          <TabsTrigger value="code">
            TSX Code
            {currentComments.filter((c) => !c.resolved && c.location?.type === "code").length > 0 && (
              <Badge variant="subtle" className="ml-2">
                {currentComments.filter((c) => !c.resolved && c.location?.type === "code").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="dsl">
            UI-DSL
            {currentComments.filter((c) => !c.resolved && c.location?.type === "dsl").length > 0 && (
              <Badge variant="subtle" className="ml-2">
                {currentComments.filter((c) => !c.resolved && c.location?.type === "dsl").length}
              </Badge>
            )}
          </TabsTrigger>
          {parentRevisionCode && (
            <TabsTrigger value="diff">
              Diff
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TSX Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                data-code-content
                onMouseUp={canReview ? handleTextSelection : undefined}
                className="relative"
              >
                <pre className="p-4 bg-[color:var(--color-surface-1)] rounded-lg overflow-auto text-sm font-mono">
                  <code>{submission.tsx}</code>
                </pre>
                {/* Inline Comment Indicators */}
                {showComments && currentComments
                  .filter((c) => c.location?.type === "code" && !c.resolved)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="absolute bg-yellow-500/20 border-l-2 border-yellow-500"
                      style={{
                        top: `${(comment.location?.startOffset || 0) / 50}px`,
                        height: `${((comment.location?.endOffset || 0) - (comment.location?.startOffset || 0)) / 50}px`,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <div className="absolute -right-2 top-0 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
                        <MessageSquare className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))}
              </div>
              {/* Selected Text Comment Input */}
              {canReview && selectedText && (
                <div className="mt-4 p-4 border rounded-lg bg-[color:var(--color-surface-1)]">
                  <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
                    Selected: <code className="bg-[color:var(--color-surface-2)] px-1 rounded">{selectedText.substring(0, 50)}{selectedText.length > 50 ? "..." : ""}</code>
                  </p>
                  <InlineCommentInput
                    onSubmit={handleAddInlineComment}
                    onCancel={() => {
                      setSelectedText(null);
                      setSelectedRange(null);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dsl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UI-DSL</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                data-dsl-content
                onMouseUp={canReview ? handleTextSelection : undefined}
                className="relative"
              >
                <pre className="p-4 bg-[color:var(--color-surface-1)] rounded-lg overflow-auto text-sm font-mono">
                  <code>{JSON.stringify(submission.dsl, null, 2)}</code>
                </pre>
                {/* Inline Comment Indicators */}
                {showComments && currentComments
                  .filter((c) => c.location?.type === "dsl" && !c.resolved)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="absolute bg-yellow-500/20 border-l-2 border-yellow-500"
                      style={{
                        top: `${(comment.location?.startOffset || 0) / 50}px`,
                        height: `${((comment.location?.endOffset || 0) - (comment.location?.startOffset || 0)) / 50}px`,
                        left: 0,
                        right: 0,
                      }}
                    />
                  ))}
              </div>
              {/* Selected Text Comment Input */}
              {canReview && selectedText && (
                <div className="mt-4 p-4 border rounded-lg bg-[color:var(--color-surface-1)]">
                  <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
                    Selected: <code className="bg-[color:var(--color-surface-2)] px-1 rounded">{selectedText.substring(0, 50)}{selectedText.length > 50 ? "..." : ""}</code>
                  </p>
                  <InlineCommentInput
                    onSubmit={handleAddInlineComment}
                    onCancel={() => {
                      setSelectedText(null);
                      setSelectedRange(null);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diff Visualization Tab */}
        {parentRevisionCode && (
          <TabsContent value="diff" className="space-y-4">
            <DiffVisualization
              oldCode={parentRevisionCode}
              newCode={submission.tsx}
              oldLabel="Parent Revision"
              newLabel="Current Submission"
              language="tsx"
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Comments List */}
      {showComments && currentComments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onResolve={readonly ? undefined : onResolveComment}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this submission? This will mark it as ready for release.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Optional approval comment..."
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={showRequestChangesDialog} onOpenChange={setShowRequestChangesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Please explain what changes are needed. This will reject the submission and allow the author to resubmit.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Explain what changes are needed..."
            value={requestChangesComment}
            onChange={(e) => setRequestChangesComment(e.target.value)}
            rows={5}
            required
          />
          {selectedText && (
            <div className="p-3 bg-[color:var(--color-surface-1)] rounded-lg">
              <p className="text-xs text-[color:var(--color-fg-muted)] mb-1">Selected code:</p>
              <code className="text-xs">{selectedText.substring(0, 100)}{selectedText.length > 100 ? "..." : ""}</code>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestChangesDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleRequestChanges}
              disabled={isProcessing || !requestChangesComment.trim()}
            >
              {isProcessing ? "Requesting..." : "Request Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Inline Comment Input Component
 */
function InlineCommentInput({
  onSubmit,
  onCancel,
}: {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
          Add Comment
        </Button>
      </div>
    </div>
  );
}

/**
 * Comment Item Component
 */
function CommentItem({
  comment,
  onResolve,
}: {
  comment: ReviewComment;
  onResolve?: (commentId: string) => void;
}) {
  const handleResolve = () => {
    if (onResolve && !comment.resolved) {
      onResolve(comment.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        comment.resolved
          ? "bg-[color:var(--color-surface-1)] opacity-60"
          : "bg-[color:var(--color-surface-1)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[color:var(--color-fg-base)]">
              {comment.createdBy}
            </span>
            <span className="text-xs text-[color:var(--color-fg-muted)]">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
            {comment.location && (
              <Badge variant="outline" size="sm">
                {comment.location.type === "code" ? "Code" : "DSL"}
              </Badge>
            )}
            {comment.resolved && (
              <Badge variant="outline" size="sm">
                Resolved
              </Badge>
            )}
          </div>
          {comment.location?.selectedText && (
            <div className="mb-2 p-2 bg-[color:var(--color-surface-2)] rounded text-xs font-mono">
              {comment.location.selectedText.substring(0, 100)}
              {comment.location.selectedText.length > 100 ? "..." : ""}
            </div>
          )}
          <p className="text-sm text-[color:var(--color-fg-base)] whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
        {!comment.resolved && onResolve && (
          <Button variant="outline" size="sm" onClick={handleResolve}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Resolve
          </Button>
        )}
      </div>
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-6 space-y-2 border-l-2 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <span className="font-semibold text-[color:var(--color-fg-base)]">
                {reply.createdBy}
              </span>
              <span className="text-xs text-[color:var(--color-fg-muted)] ml-2">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
              <p className="mt-1 text-[color:var(--color-fg-base)]">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

