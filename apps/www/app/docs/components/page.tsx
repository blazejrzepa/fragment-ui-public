import { redirect } from "next/navigation";

/**
 * Redirect /docs/components to /components (component catalog)
 * This page exists to prevent 404 errors when Next.js tries to prefetch /docs/components
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DocsComponentsPage() {
  redirect("/components");
}

