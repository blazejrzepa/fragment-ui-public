"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@fragment_ui/ui";
import type { Submission } from "../../../app/submissions/types";

interface SubmissionFiltersProps {
  filters: {
    status: "all" | Submission["status"];
    type: "all" | Submission["type"];
    originType: "all" | Submission["originType"];
    sortBy: "date" | "score" | "author";
  };
  onFiltersChange: (filters: {
    status: "all" | Submission["status"];
    type: "all" | Submission["type"];
    originType: "all" | Submission["originType"];
    sortBy: "date" | "score" | "author";
  }) => void;
}

const statusLabels: Record<string, string> = {
  all: "All",
  draft: "Draft",
  verifying: "Verifying",
  verified: "Verified",
  rejected: "Rejected",
  promoted: "Promoted",
  submitted: "Submitted",
  approved: "Approved",
  DRAFT: "Draft",
  CHECKING: "Checking",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  NEEDS_CHANGES: "Needs Changes",
};

const typeLabels: Record<string, string> = {
  all: "All",
  component: "Component",
  block: "Block",
  screen: "Screen",
};

const sortByLabels: Record<string, string> = {
  date: "Date",
  score: "Score",
  author: "Author",
};

const originTypeLabels: Record<string, string> = {
  all: "All Origins",
  product: "Product",
  design: "Design",
  copilot: "Copilot",
  audit: "Audit",
  "r&d": "R&D",
};

export function SubmissionFilters({ filters, onFiltersChange }: SubmissionFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value as typeof filters.status })}
      >
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue>
            {statusLabels[filters.status] || filters.status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="verifying">Verifying</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="promoted">Promoted</SelectItem>
          <SelectItem value="submitted">Submitted</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onFiltersChange({ ...filters, type: value as typeof filters.type })}
      >
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue>
            {typeLabels[filters.type] || filters.type}
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="component">Component</SelectItem>
          <SelectItem value="block">Block</SelectItem>
          <SelectItem value="screen">Screen</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.originType || "all"}
        onValueChange={(value) => onFiltersChange({ ...filters, originType: value as typeof filters.originType })}
      >
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue>
            {originTypeLabels[filters.originType || "all"] || filters.originType || "All Origins"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
        >
          <SelectItem value="all">All Origins</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="copilot">Copilot</SelectItem>
          <SelectItem value="audit">Audit</SelectItem>
          <SelectItem value="r&d">R&D</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as typeof filters.sortBy })}
      >
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue>
            {sortByLabels[filters.sortBy] || filters.sortBy}
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
        >
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="score">Score</SelectItem>
          <SelectItem value="author">Author</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

