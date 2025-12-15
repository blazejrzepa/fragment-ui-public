import { redirect } from "next/navigation";

/**
 * Redirect /docs to /docs/get-started/introduction (main docs entry point)
 * This page exists to prevent 404 errors when Next.js tries to prefetch /docs
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DocsPage() {
  redirect("/docs/get-started/introduction");
}

