import { redirect } from 'next/navigation';

/**
 * Redirect page for backward compatibility
 * Redirects /playground to /studio
 */
export default function PlaygroundRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Server-side redirect
  redirect('/studio');
}
