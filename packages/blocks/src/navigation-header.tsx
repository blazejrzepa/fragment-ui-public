"use client";

import { useState } from "react";
import { Button, CommandPalette } from "@fragment_ui/ui";
import type { CommandPaletteAction } from "@fragment_ui/ui";

interface NavigationHeaderProps {
  logo?: React.ReactNode;
  logoText?: string;
  logoHref?: string;
  links?: Array<{ href: string; label: string; active?: boolean }>;
  actions?: React.ReactNode;
  mobileMenu?: boolean;
  showSearch?: boolean;
  searchActions?: CommandPaletteAction[];
  onSearchOpenChange?: (open: boolean) => void;
}

export function NavigationHeader({
  logo,
  logoText = "Fragment UI",
  logoHref = "/",
  links = [
    { href: "/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/docs/foundations/tokens", label: "Docs" },
  ],
  actions,
  mobileMenu = true,
  showSearch = false,
  searchActions = [],
  onSearchOpenChange,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)] sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logoHref ? (
              <a
                href={logoHref}
                className="flex items-center space-x-2 text-xl font-semibold"
              >
                {logo}
                {logoText && <span>{logoText}</span>}
              </a>
            ) : (
              <div className="flex items-center space-x-2 text-xl font-semibold">
                {logo}
                {logoText && <span>{logoText}</span>}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href={link.href}
                className={`
                  text-sm transition-colors
                  ${link.active 
                    ? "text-[color:var(--color-brand-primary)] border-b-2 border-[color:var(--color-brand-primary)] pb-1" 
                    : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg-base)]"
                  }
                `}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {showSearch && searchActions.length > 0 && (
              <CommandPalette
                actions={searchActions}
                trigger={
                  <Button variant="outline" size="sm" className="w-[200px] justify-between">
                    <span className="text-[color:var(--color-fg-muted)]">Search...</span>
                    <span className="text-xs text-[color:var(--color-fg-muted)]">⌘K</span>
                  </Button>
                }
                placeholder="Search..."
              />
            )}
            {actions || (
              <>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button variant="solid" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {mobileMenu && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenu && mobileMenuOpen && (
          <div className="md:hidden border-t border-[color:var(--color-fg-muted)] py-4">
            <div className="flex flex-col space-y-4">
              {links.map((link, index) => (
                <a
                  key={`mobile-${link.label}-${index}`}
                  href={link.href}
                  className="text-sm hover:text-[color:var(--color-brand-primary)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {actions && <div className="pt-4">{actions}</div>}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

