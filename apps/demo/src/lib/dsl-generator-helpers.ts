/**
 * DSL Generator Helpers
 * 
 * Helper functions for mapping sections to blocks and creating block references
 */

import type { UiSection, UiBlockRef, SectionKind, SectionData } from "@fragment_ui/ui-dsl";
import { getBlockForSectionKind } from "./import-planner";
import type { Id } from "@fragment_ui/ui-dsl";

/**
 * Block ref mapping from section kind to block path
 */
const SECTION_KIND_TO_BLOCK_REF: Record<string, string> = {
  hero: "@fragment_ui/blocks/hero-section",
  pricing: "@fragment_ui/blocks/pricing-table",
  featureGrid: "@fragment_ui/blocks/feature-grid-section",
  stats: "@fragment_ui/blocks/stats-section",
  testimonials: "@fragment_ui/blocks/testimonials-section",
  faq: "@fragment_ui/blocks/faq-section",
  cta: "@fragment_ui/blocks/cta-section",
  dataTable: "@fragment_ui/blocks/data-table",
};

/**
 * Convert section data to block inputs
 */
function sectionDataToBlockInputs(
  kind: SectionKind,
  sectionData: SectionData
): Record<string, any> {
  switch (kind) {
    case "hero": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        description: data.description || "",
        primaryCTA: data.cta?.primary ? {
          label: data.cta.primary.label,
          href: data.cta.primary.action,
        } : undefined,
        secondaryCTA: data.cta?.secondary ? {
          label: data.cta.secondary.label,
          href: data.cta.secondary.action,
        } : undefined,
        image: data.image,
        background: data.background || "solid",
      };
    }
    
    case "pricing": {
      const data = sectionData as any;
      return {
        tiers: (data.tiers || []).map((tier: any) => ({
          name: tier.name,
          price: tier.price,
          pricePeriod: tier.period,
          features: tier.features || [],
          ctaText: tier.cta?.label || "Get Started",
          ctaHref: tier.cta?.action,
        })),
      };
    }
    
    case "featureGrid": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        features: data.features || [],
        columns: data.columns || 3,
      };
    }
    
    case "stats": {
      const data = sectionData as any;
      return {
        items: data.items || [],
        layout: data.layout || "grid",
      };
    }
    
    case "testimonials": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        items: data.items || [],
        layout: data.layout || "grid",
      };
    }
    
    case "faq": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        description: data.description,
        items: data.items || [],
      };
    }
    
    case "cta": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        description: data.description || "",
        primaryCTA: data.cta ? {
          label: data.cta.label,
          href: data.cta.action,
        } : undefined,
        variant: data.variant || "primary",
      };
    }
    
    case "dataTable": {
      const data = sectionData as any;
      return {
        title: data.title || "",
        columns: data.columns || [],
        pagination: data.pagination || false,
      };
    }
    
    default:
      return {};
  }
}

/**
 * Create a section node, preferring block reference if available
 * 
 * This function checks if a block exists for the section kind and creates
 * either a UiBlockRef (preferred) or UiSection with kind (fallback)
 */
export function createSectionNode(
  id: Id,
  kind: SectionKind,
  sectionData: SectionData,
  title?: string,
  preferBlocks: boolean = true
): UiSection | UiBlockRef {
  // Check if block exists for this section kind
  const blockName = getBlockForSectionKind(kind);
  const blockRef = SECTION_KIND_TO_BLOCK_REF[kind];
  
  // If block exists and we prefer blocks, create UiBlockRef
  if (preferBlocks && blockName && blockRef) {
    const inputs = sectionDataToBlockInputs(kind, sectionData);
    
    // Add title to inputs if provided
    if (title && !inputs.title) {
      inputs.title = title;
    }
    
    return {
      type: "block",
      id,
      ref: blockRef,
      inputs,
      dataUiId: id, // Mirror id for patch operations
    } as UiBlockRef;
  }
  
  // Fallback: create UiSection with kind and sectionData
  return {
    type: "section",
    id,
    title,
    kind,
    sectionData,
    children: [],
    dataUiId: id, // Mirror id for patch operations
  } as UiSection;
}

/**
 * Check if a block exists for a section kind
 */
export function hasBlockForSectionKind(kind: SectionKind): boolean {
  return !!getBlockForSectionKind(kind) && !!SECTION_KIND_TO_BLOCK_REF[kind];
}

