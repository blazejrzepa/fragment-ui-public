import { BreadcrumbItem } from "@fragment_ui/ui";

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbsFromPath(
  pathname: string,
  version?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: "Docs", href: "/docs/introduction" },
  ];

  // Check if this is a versioned route
  const versionMatch = pathname.match(/^\/docs\/v(\d+\.\d+\.\d+)(?:\/(.*))?$/);
  const isVersioned = !!versionMatch;
  const matchedVersion = versionMatch?.[1];
  const versionedPath = versionMatch?.[2];

  if (isVersioned && matchedVersion) {
    items.push({
      label: `v${matchedVersion}`,
      href: `/docs/v${matchedVersion}`,
    });
  }

  // Parse remaining path segments
  const pathToParse = versionedPath || pathname.replace(/^\/docs\/?/, "");
  if (!pathToParse) {
    return items;
  }

  const segments = pathToParse.split("/").filter(Boolean);
  let currentPath = isVersioned ? `/docs/v${matchedVersion}` : "/docs";

  segments.forEach((segment, index) => {
    // Skip "get-started" segment but include it in the path
    if (segment === "get-started") {
      currentPath += `/${segment}`;
      return;
    }
    
    const isLast = index === segments.length - 1;
    currentPath += `/${segment}`;
    
    // Format label (capitalize, replace hyphens)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    items.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return items;
}

