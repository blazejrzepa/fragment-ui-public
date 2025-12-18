"use client";

import * as React from "react";
import Link from "next/link";
import clsx from "clsx";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSectionProps {
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: Array<{
    name: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    onSubmit?: (email: string) => void;
  };
  className?: string;
}

export function FooterSection({
  columns = [],
  copyright = "© 2025 Fragment UI. All rights reserved.",
  socialLinks = [],
  newsletter,
  className,
}: FooterSectionProps) {
  return (
    <footer
      className={clsx(
        "border-t border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {newsletter && (
          <div className="mb-12 pb-12 border-b border-[color:var(--color-border-base)]">
            <div className="max-w-md">
              {newsletter.title && (
                <h3 className="text-lg font-semibold text-[color:var(--color-fg-base)] mb-2">
                  {newsletter.title}
                </h3>
              )}
              {newsletter.description && (
                <p className="text-sm text-[color:var(--color-fg-muted)] mb-4">
                  {newsletter.description}
                </p>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get("email") as string;
                  if (email && newsletter.onSubmit) {
                    newsletter.onSubmit(email);
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="email"
                  placeholder={newsletter.placeholder || "Enter your email"}
                  className="flex-1 px-4 py-2 rounded-lg border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] placeholder:text-[color:var(--color-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[color:var(--color-brand-primary)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {newsletter.buttonText || "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-[color:var(--color-fg-base)] mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-brand-primary)] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-brand-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[color:var(--color-border-base)]">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            {copyright}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-brand-primary)] transition-colors"
                  aria-label={social.name}
                >
                  {social.icon || social.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

