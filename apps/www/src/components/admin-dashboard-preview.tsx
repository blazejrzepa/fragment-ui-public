"use client";

import dynamic from "next/dynamic";
import { AdminLayout } from "./admin/admin-layout";
import { Skeleton } from "@fragment_ui/ui";

// Dashboard skeleton loading component
function DashboardSkeleton() {
  return (
    <div className="space-y-[var(--space-6)] p-[var(--space-6)]" data-admin-root>
      {/* Page Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-[var(--space-2)]">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="flex gap-[var(--space-2)]">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid gap-[var(--space-4)] md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-[var(--radius-lg)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] p-[var(--space-6)] space-y-[var(--space-3)]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-[var(--space-2)]">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] p-[var(--space-6)] space-y-[var(--space-4)]">
        <div className="flex items-center justify-between">
          <div className="space-y-[var(--space-2)]">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-[var(--space-2)]">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded" />
      </div>
    </div>
  );
}

// Load only the admin page content; layout (with sidebar/header/footer) is provided here.
const AdminPage = dynamic(() => import("../../app/(admin)/admin/page"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export function AdminDashboardPreview() {
  return (
    <div className="w-full">
      <AdminLayout embedded>
        <AdminPage />
      </AdminLayout>
    </div>
  );
}
