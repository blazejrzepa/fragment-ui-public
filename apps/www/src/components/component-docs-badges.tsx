"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Badge } from "@fragment_ui/ui";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Component that displays GitHub badge below intro-text
 */
export function ComponentDocsBadges() {
  const pathname = usePathname();
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Use useEffect to ensure we only run on client side after hydration
  React.useEffect(() => {
    setMounted(true);
    
    if (typeof window === 'undefined') return;
    
    // Find intro-text element and create container after it
    const findAndInsert = () => {
      const introText = document.querySelector('.document-content p.intro-text') as HTMLElement;
      if (introText) {
        // Check if container already exists
        let existingContainer = introText.nextElementSibling as HTMLElement;
        if (existingContainer && existingContainer.classList.contains('document-content-badges-container')) {
          setContainer(existingContainer);
          return;
        }
        
        // Create container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.className = 'document-content-badges-container';
        introText.parentNode?.insertBefore(newContainer, introText.nextSibling);
        setContainer(newContainer);
      }
    };

    // Try after a short delay to ensure DOM is ready
    const timeout = setTimeout(findAndInsert, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  // Map pathname to GitHub file path
  const getGitHubFilePath = (path: string): string => {
    if (!path || path === '/') {
      return 'apps/www/app/page.tsx';
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `apps/www/app/${cleanPath}/page.tsx`;
  };

  if (!pathname) return null;

  const githubUrl = `https://github.com/blazejrzepa/fragment-ui/blob/main/${getGitHubFilePath(pathname)}`;

  // Only show on component pages
  if (!pathname.match(/\/docs\/components\//)) return null;

  const badgesContent = (
    <div className="document-content-badges flex items-center gap-2 mb-8">
      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex no-underline group"
      >
        <Badge variant="subtle" size="md" className="gap-1.5 cursor-pointer group-hover:scale-105 !transition-all !duration-[var(--motion-duration-base)]">
          GitHub
          <ArrowUpRight className="h-3 w-3" />
        </Badge>
      </Link>
    </div>
  );

  // Don't render on server to avoid hydration mismatch
  if (!mounted || typeof window === 'undefined' || !container) {
    return null;
  }

  // Use portal to render badges after intro-text
  return createPortal(badgesContent, container);
}

