"use client";

/**
 * Submissions Dashboard
 * 
 * Main page for managing and reviewing component submissions
 */

import { useState, useEffect } from "react";
import { SubmissionList } from "@/components/submissions/submission-list";
import { SubmissionFilters } from "@/components/submissions/submission-filters";
import { Card, CardHeader, CardTitle, CardDescription } from "@fragment_ui/ui";
import { toast } from "@fragment_ui/ui";
import type { Submission } from "./types";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all" as "all" | Submission["status"],
    type: "all" as "all" | Submission["type"],
    originType: "all" as "all" | Submission["originType"],
    sortBy: "date" as "date" | "score" | "author",
  });

  // Fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const response = await fetch("/api/submissions");
      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error: any) {
      console.error("[Submissions] Error fetching:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...submissions];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((s) => s.type === filters.type);
    }

    // Filter by originType
    if (filters.originType !== "all") {
      filtered = filtered.filter((s) => s.originType === filters.originType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "score":
          const scoreA = a.result?.score ?? 0;
          const scoreB = b.result?.score ?? 0;
          return scoreB - scoreA;
        case "author":
          return a.author.localeCompare(b.author);
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredSubmissions(filtered);
  }

  async function handleVerify(id: string) {
    try {
      const response = await fetch(`/api/submissions/${id}/verify`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to verify submission");
      }
      const updated = await response.json();
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Submission verified");
    } catch (error: any) {
      console.error("[Submissions] Error verifying:", error);
      toast.error("Failed to verify submission");
    }
  }

  async function handlePromote(id: string) {
    try {
      const response = await fetch(`/api/submissions/${id}/promote`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to promote submission");
      }
      const updated = await response.json();
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Submission promoted! PR created.");
    } catch (error: any) {
      console.error("[Submissions] Error promoting:", error);
      toast.error(error.message || "Failed to promote submission");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Submission deleted");
    } catch (error: any) {
      console.error("[Submissions] Error deleting:", error);
      toast.error("Failed to delete submission");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-[color:var(--foreground-secondary)]">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6" style={{ backgroundColor: "var(--background-primary)" }}>
      <header>
        <h1 className="text-2xl font-medium mb-2">Submissions Dashboard</h1>
        <p className="text-[color:var(--foreground-secondary)]">
          Manage and review component submissions
        </p>
      </header>

      <SubmissionFilters filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-[color:var(--foreground-secondary)]">
          {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <SubmissionList
        submissions={filteredSubmissions}
        onVerify={handleVerify}
        onPromote={handlePromote}
        onDelete={handleDelete}
      />
    </div>
  );
}

