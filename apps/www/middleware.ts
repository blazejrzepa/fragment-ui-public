import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process versioned docs routes
  if (!pathname.startsWith('/docs/v')) {
    return NextResponse.next();
  }

  // Handle versioned docs routes with dots in version
  // Match: /docs/v0.9.0, /docs/v0.9.0/changelog, /docs/v0.9.0/foundations/tokens, etc.
  // Next.js doesn't handle dots in dynamic route segments, so we rewrite them
  const versionedDocsMatch = pathname.match(/^\/docs\/v(\d+\.\d+\.\d+)(?:\/(.*))?$/);
  
  if (versionedDocsMatch) {
    const version = versionedDocsMatch[1]; // e.g., "0.9.0"
    const slug = versionedDocsMatch[2]; // e.g., "changelog" or "foundations/tokens" or undefined
    
    // Rewrite to internal route that Next.js can handle
    // Use a format that doesn't have dots: v/0-9-0/changelog
    const versionWithoutDots = version.replace(/\./g, '-');
    const newPath = slug 
      ? `/docs/v/${versionWithoutDots}/${slug}`
      : `/docs/v/${versionWithoutDots}`;
    
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Default export for Next.js 15 compatibility
export default middleware;

// Match all paths - we'll check inside the function if it's a versioned docs route
// This is necessary because Next.js matcher doesn't handle dots in path segments
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

