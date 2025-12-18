"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@fragment_ui/ui";
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

  if (!pathname) return null;

  const currentIndex = items.findIndex((i) => i.href === pathname);
  if (currentIndex === -1) return null;

  const prev = items[currentIndex - 1];
  const next = items[currentIndex + 1];

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

  const buttonBase =
    "inline-flex items-center justify-center select-none rounded-[var(--radius-sm,8px)] font-medium transition-all duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-1)] h-8 text-sm leading-[1.5] border border-[color:var(--color-border-base)] bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-base)] active:bg-[color:var(--color-surface-2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent whitespace-nowrap";
  const buttonPadding = isIconOnly ? "w-8 p-0 gap-0" : "px-[var(--space-3,12px)] gap-[var(--space-2,8px)]";

  return (
    <div className={`flex items-center flex-nowrap gap-2 ${alignment} ${spacing}`}>
      {prev && (
        <Link href={prev.href} className="inline-flex">
          <Button variant="outline" size="sm" className={`${buttonBase} ${buttonPadding}`}>
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {!isIconOnly && <span className="text-sm">{prev.title}</span>}
            </span>
          </Button>
        </Link>
      )}
      {next && (
        <Link href={next.href} className="inline-flex">
          <Button variant="outline" size="sm" className={`${buttonBase} ${buttonPadding}`}>
            <span className="flex items-center gap-2">
              {!isIconOnly && <span className="text-sm">{next.title}</span>}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </Link>
      )}
    </div>
  );
}


