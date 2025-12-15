import type { Metadata } from "next";
import "./globals.css";
import { DocumentationLayout, DocumentationHeader, DocumentationSidebar, type NavigationLink, type NavigationSection } from "@fragment_ui/blocks";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation Site Example - Fragment UI",
  description: "Example documentation site built with Fragment UI Documentation blocks",
};

// Simple logo component
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
      <div className="w-6 h-6 bg-[color:var(--color-brand-primary)] rounded" />
      <span>Docs</span>
    </Link>
  );
}

// Simple search component
function Search() {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search docs..."
        className="w-full px-4 py-2 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-sm"
      />
    </div>
  );
}

// Simple theme toggle
function ThemeToggle() {
  return (
    <button
      onClick={() => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
      }}
      className="p-2 rounded-md hover:bg-[color:var(--color-surface-2)] transition-colors"
      aria-label="Toggle theme"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    </button>
  );
}

// Navigation links for header
const headerLinks: NavigationLink[] = [
  { label: "Docs", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Examples", href: "/examples" },
  { label: "GitHub", href: "https://github.com", external: true },
];

// Navigation sections for sidebar
const sidebarSections: NavigationSection[] = [
  {
    title: "Get Started",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Installation", href: "/installation" },
      { title: "Quick Start", href: "/quick-start" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/components/button" },
      { title: "Card", href: "/components/card" },
      { title: "Input", href: "/components/input" },
      { title: "Badge", href: "/components/badge" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { title: "DocumentationHeader", href: "/blocks/documentation-header" },
      { title: "DocumentationSidebar", href: "/blocks/documentation-sidebar" },
      { title: "DocumentationLayout", href: "/blocks/documentation-layout" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Getting Started", href: "/guides/getting-started" },
      { title: "Best Practices", href: "/guides/best-practices" },
      { title: "Migration", href: "/guides/migration" },
    ],
  },
];

// Next.js Link component wrapper
function NextLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <DocumentationLayout
          header={
            <DocumentationHeader
              logo={<Logo />}
              links={headerLinks}
              search={<Search />}
              actions={<ThemeToggle />}
              blur={true}
              height="60px"
            />
          }
          sidebar={
            <DocumentationSidebar
              sections={sidebarSections}
              scrollDetection={true}
              wheelHandling={true}
              LinkComponent={NextLink}
            />
          }
          showTableOfContents={true}
          contentTopPadding="58px"
        >
          {children}
        </DocumentationLayout>
      </body>
    </html>
  );
}

