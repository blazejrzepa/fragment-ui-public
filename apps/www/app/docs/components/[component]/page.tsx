import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton, DocumentContent } from "@fragment_ui/ui";

interface ComponentDocPageProps {
  params: Promise<{ component: string }>;
}

/**
 * Lazy-loaded component documentation page
 * Uses dynamic import to load component documentation on demand
 */
export default async function ComponentDocPage({ params }: ComponentDocPageProps) {
  const { component } = await params;

  // List of available component documentation pages
  const availableComponents = [
    "accordion",
    "alert",
    "aspect-ratio",
    "avatar",
    "badge",
    "breadcrumbs",
    "button",
    "card",
    "carousel",
    "checkbox",
    "collapsible",
    "combobox",
    "command-palette",
    "context-menu",
    "data-table",
    "date-picker",
    "dialog",
    "dropdown-menu",
    "form-container",
    "form-field",
    "file-upload",
    "hover-card",
    "split-button",
    "tag-input",
    "input",
    "multi-select",
    "navigation-menu",
    "pagination",
    "popover",
    "progress",
    "radio",
    "rating",
    "resizable",
    "scroll-area",
    "select",
    "separator",
    "sheet",
    "skeleton",
    "slider",
    "spinner",
    "stepper",
    "switch",
    "table",
    "tabs",
    "timeline",
    "textarea",
    "toast",
    "toggle",
    "toggle-group",
    "segmented-control",
    "tooltip",
    "tree-view",
    "color-picker",
    "authentication-block",
    "pricing-table",
    "dashboard-layout",
    "card-grid",
    "navigation-header",
    "settings-screen",
  ];

  if (!availableComponents.includes(component)) {
    notFound();
  }

  // Dynamically import the component documentation page
  const ComponentPage = dynamic(
    () => import(`../${component}/page`).catch(() => {
      // Return a not found component if import fails
      return {
        default: () => (
          <DocumentContent as="article">
            <div className="p-4 rounded-lg bg-[color:var(--color-accent-red)]/10 border border-[color:var(--color-accent-red)]/20">
              <p className="text-sm text-[color:var(--color-accent-red)]">
                Documentation for "{component}" not found
              </p>
            </div>


          </DocumentContent>
        ),
      };
    }),
    {
      loading: () => (
        <DocumentContent as="article">
          <div className="space-y-6">
            <div className="space-y-4 mt-8">
            </div>
          </div>
        </DocumentContent>
      ),
      ssr: true, // Enable SSR for better SEO, but still code-split
    }
  );

}
