"use client";

import { Card, CardHeader, CardContent, Badge, Button } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { Submission } from "../../../app/submissions/types";
import { CheckCircle2, XCircle, Clock, FileText, ExternalLink } from "lucide-react";

interface SubmissionCardProps {
  submission: Submission;
  onVerify?: (id: string) => void;
  onPromote?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function getStatusVariant(status: Submission["status"]): "solid" | "subtle" | "outline" {
  switch (status) {
    case "verified":
      return "solid";
    case "promoted":
      return "solid";
    case "REJECTED":
      return "subtle";
    case "verifying":
      return "subtle";
    default:
      return "outline";
  }
}

function getStatusIcon(status: Submission["status"]) {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-4 w-4" />;
    case "promoted":
      return <CheckCircle2 className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    case "verifying":
      return <Clock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export function SubmissionCard({ submission, onVerify, onPromote, onDelete }: SubmissionCardProps) {
  const statusVariant = getStatusVariant(submission.status);
  const statusIcon = getStatusIcon(submission.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={statusVariant} className="flex items-center gap-1">
                {statusIcon}
                {submission.status}
              </Badge>
              <Badge variant="outline">{submission.type}</Badge>
              {submission.originType && (
                <Badge variant="outline" className="text-xs">
                  {submission.originType === "r&d" ? "R&D" : submission.originType.charAt(0).toUpperCase() + submission.originType.slice(1)}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold text-[color:var(--foreground-primary)] mb-1">
              {submission.id.substring(0, 8)}
            </h3>
            <p className="text-xs text-[color:var(--foreground-secondary)]">
              by {submission.author} • {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Link href={`/submissions/${submission.id}`}>
            <Button 
              variant="ghost" 
              size="sm"
              data-action-id={`submission-view-${submission.id}`}
              data-action-kind="navigate"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mini Preview */}
        <div className="h-32 border rounded-lg overflow-hidden mb-4 bg-[color:var(--color-surface-1)]">
          <ReactLiveRenderer
            code={submission.tsx}
            onError={() => {
              // Silently handle preview errors
            }}
          />
        </div>

        {/* Verification Results */}
        {submission.result && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--foreground-secondary)]">Score:</span>
              <span className={`font-semibold ${
                submission.result.score >= 80 ? "text-green-600" :
                submission.result.score >= 60 ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {submission.result.score}/100
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--foreground-secondary)]">Lint Errors:</span>
              <span className={submission.result.lint.errors > 0 ? "text-red-600" : "text-green-600"}>
                {submission.result.lint.errors}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--foreground-secondary)]">A11y Violations:</span>
              <span className={submission.result.a11y.violations > 0 ? "text-red-600" : "text-green-600"}>
                {submission.result.a11y.violations}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--foreground-secondary)]">Token Violations:</span>
              <span className={submission.result.tokens.violations > 0 ? "text-yellow-600" : "text-green-600"}>
                {submission.result.tokens.violations}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--foreground-secondary)]">Figma Parity:</span>
              <span className={submission.result.figma.coverage >= 90 ? "text-green-600" : "text-yellow-600"}>
                {submission.result.figma.coverage.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {submission.status === "DRAFT" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onVerify?.(submission.id)}
              className="flex-1"
              data-action-id={`submission-verify-${submission.id}`}
              data-action-kind="action"
            >
              Verify
            </Button>
          )}
          {submission.status === "verified" && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => onPromote?.(submission.id)}
              className="flex-1"
              data-action-id={`submission-promote-${submission.id}`}
              data-action-kind="action"
            >
              Promote to PR
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(submission.id)}
              data-action-id={`submission-delete-${submission.id}`}
              data-action-kind="action"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

