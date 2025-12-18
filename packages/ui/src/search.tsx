"use client";

import * as React from "react";
import { Input, Kbd } from "./index";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

export interface SearchResult {
  name: string;
  normalizedName?: string;
  type: "component" | "block";
  path: string;
}

export interface SearchProps {
  /**
   * Registry of components/blocks to search
   */
  registry?: Record<string, any>;
  /**
   * Custom search results handler (if not provided, uses Link navigation)
   */
  onResultSelect?: (result: SearchResult) => void;
  /**
   * Placeholder text
   * @default "Search documentation..."
   */
  placeholder?: string;
  /**
   * Show keyboard shortcut hint
   * @default true
   */
  showShortcut?: boolean;
  /**
   * Custom component/block lists
   */
  components?: string[];
  blocks?: string[];
  /**
   * Component exceptions (components with hyphens that are UI components)
   */
  componentExceptions?: string[];
  /**
   * Link component (for Next.js Link, React Router, etc.)
   * If not provided, uses regular <a> tag
   */
  LinkComponent?: React.ComponentType<{ href: string; children: React.ReactNode; onClick?: () => void; className?: string }>;
}

/**
 * Search - Search component for documentation sites
 * 
 * Features:
 * - Search components and blocks
 * - Keyboard navigation (Cmd/Ctrl+K)
 * - Keyboard shortcuts display
 * - Deduplication of results
 * - Registry integration
 * 
 * @example
 * ```tsx
 * <Search
 *   registry={registry}
 *   components={components}
 *   blocks={blocks}
 *   onResultSelect={(result) => router.push(result.path)}
 * />
 * ```
 */
export function Search({
  registry,
  onResultSelect,
  placeholder = "Search documentation...",
  showShortcut = true,
  components = [],
  blocks = [],
  componentExceptions = [],
  LinkComponent,
}: SearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isMac, setIsMac] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent));
  }, []);

  // Helper functions
  const normalizeName = (name: string): string => {
    return name.toLowerCase().replace(/-/g, "");
  };

  const formatDisplayName = (name: string): string => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getKebabPath = (name: string): string => {
    if (name.includes("-")) {
      return name.toLowerCase();
    }
    return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  };

  // Build search results
  const allItems = React.useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    const seen = new Set<string>();

    // Add components
    components.forEach((name) => {
      const normalized = normalizeName(name);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        items.push({
          name: formatDisplayName(name),
          normalizedName: normalized,
          type: "component",
          path: `/docs/components/${getKebabPath(name)}`,
        });
      }
    });

    // Add blocks
    blocks.forEach((name) => {
      const normalized = normalizeName(name);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        items.push({
          name: formatDisplayName(name),
          normalizedName: normalized,
          type: "block",
          path: `/docs/components/${getKebabPath(name)}`,
        });
      }
    });

    // Add from registry
    if (registry?.components) {
      Object.keys(registry.components).forEach((name) => {
        const kebab = getKebabPath(name);
        const normalized = normalizeName(kebab);
        const isComponent = !name.includes("-") || componentExceptions.includes(kebab);
        const isBlock = name.includes("-") && !componentExceptions.includes(kebab);

        if (!seen.has(normalized) && (isComponent || isBlock)) {
          seen.add(normalized);
          items.push({
            name: formatDisplayName(kebab),
            normalizedName: normalized,
            type: isComponent ? "component" : "block",
            path: `/docs/components/${kebab}`,
          });
        }
      });
    }

    return items;
  }, [components, blocks, registry, componentExceptions]);

  // Filter results
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems
      .filter((item) => {
        const searchName = item.normalizedName || item.name.toLowerCase();
        return searchName.includes(lowerQuery);
      })
      .slice(0, 8);
  }, [query, allItems]);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else if (typeof window !== "undefined") {
      window.location.href = result.path;
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <div className="relative w-full" onClick={() => setIsOpen(true)}>
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="w-full pr-20 cursor-pointer text-sm"
          size="sm"
          readOnly
        />
        {showShortcut && (
          <div className="absolute right-2 inset-y-0 pointer-events-none flex items-center gap-1">
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </div>
        )}
      </div>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {filteredResults.length > 0 && (
            <>
              <CommandGroup heading="Components">
                {filteredResults
                  .filter((r) => r.type === "component")
                  .map((result) => (
                    <CommandItem
                      key={result.path}
                      value={`${result.name} ${result.path}`}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{result.name}</span>
                        <span className="text-xs text-[color:var(--color-fg-muted)]">
                          Component
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Blocks">
                {filteredResults
                  .filter((r) => r.type === "block")
                  .map((result) => (
                    <CommandItem
                      key={result.path}
                      value={`${result.name} ${result.path}`}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{result.name}</span>
                        <span className="text-xs text-[color:var(--color-fg-muted)]">
                          Block
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

