"use client";

import * as React from "react";
import { AdminLayout } from "../../../src/components/admin/admin-layout";

export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
