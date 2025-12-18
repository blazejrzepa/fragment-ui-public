"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Share2, Copy, Check } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@fragment_ui/ui";
import { getDocumentationSections } from "./documentation-sidebar-wrapper";

type PagerPlacement = "top" | "bottom";
type PagerAlign = "start" | "center" | "end" | "spread";

type FlatItem = { title: string; href: string };

function buildFlatList(): FlatItem[] {
  const sections = getDocumentationSections();
  const flat: FlatItem[] = [];

  const walk = (items: { title: string; href: string; items?: any[] }[]) => {
    items.forEach((item) => {
      flat.push({ title: item.title, href: item.href });
      if (item.items?.length) {
        walk(item.items as any[]);
      }
    });
  };

  sections.forEach((section) => walk(section.items));
  return flat;
}

export function DocPager({
  placement = "bottom",
  align = "start",
  variant = "text",
  dense = false,
}: {
  placement?: PagerPlacement;
  align?: PagerAlign;
  variant?: "text" | "icon";
  dense?: boolean;
}) {
  const pathname = usePathname();
  const [items] = React.useState<FlatItem[]>(() => buildFlatList());
  const [copied, setCopied] = React.useState(false);

  if (!pathname) return null;

  const currentIndex = items.findIndex((i) => i.href === pathname);
  if (currentIndex === -1) return null;

  const prev = items[currentIndex - 1];
  const next = items[currentIndex + 1];

  // Map pathname to GitHub file path
  const getGitHubFilePath = (path: string): string => {
    if (!path || path === '/') {
      return 'apps/www/app/page.tsx';
    }
    // Remove leading slash and map to app directory structure
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `apps/www/app/${cleanPath}/page.tsx`;
  };

  if (!prev && !next) return null;

  const spacing = dense
    ? "m-0"
    : placement === "top"
    ? "mb-4 mt-2"
    : "mt-16";

  const alignment =
    align === "spread"
      ? prev && next
      ? "justify-between w-full"
        : next
          ? "justify-end w-full"
          : "justify-start w-full"
      : align === "center"
      ? "justify-center"
      : align === "end"
      ? "justify-end"
      : "justify-start";

  const isIconOnly = variant === "icon";
  const buttonPadding = isIconOnly ? "p-0 gap-0" : "";

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && pathname) {
      const url = `${window.location.origin}${pathname}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined' && pathname) {
      const url = `${window.location.origin}${pathname}`;
      const text = encodeURIComponent(`Check out this page: ${document.title}`);
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined' && pathname) {
      const url = `${window.location.origin}${pathname}`;
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`flex items-center flex-nowrap gap-1.5 ${alignment} ${spacing}`}>
      {placement === "top" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className={buttonPadding}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareTwitter}>
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareLinkedIn}>
              Share on LinkedIn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {prev && (
          <Button 
          asChild
            variant="secondary" 
            size="sm"
            leadingIcon={!isIconOnly ? <ArrowLeft className="h-4 w-4" /> : undefined}
          >
          <Link href={prev.href} className="inline-flex">
            {!isIconOnly ? prev.title : <ArrowLeft className="h-4 w-4" />}
          </Link>
          </Button>
      )}
      {next && (
          <Button 
          asChild
            variant="secondary" 
            size="sm"
            trailingIcon={!isIconOnly ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
          <Link href={next.href} className="inline-flex">
            {!isIconOnly ? next.title : <ArrowRight className="h-4 w-4" />}
          </Link>
          </Button>
      )}
    </div>
  );
}


