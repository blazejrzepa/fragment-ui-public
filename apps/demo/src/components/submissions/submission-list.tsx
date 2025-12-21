"use client";

import { SubmissionCard } from "./submission-card";
import type { Submission } from "../../../app/submissions/types";

interface SubmissionListProps {
  submissions: Submission[];
  onVerify?: (id: string) => void;
  onPromote?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SubmissionList({ submissions, onVerify, onPromote, onDelete }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[color:var(--foreground-secondary)] mb-4">No submissions found</p>
        <p className="text-sm text-[color:var(--foreground-tertiary)]">
          Create a submission from the Playground or Variant Generator
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onVerify={onVerify}
          onPromote={onPromote}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

