/**
 * Landing page scaffold
 * 
 * Generates a landing page with hero, features, pricing, testimonials, FAQ, and CTA sections
 */

import type { UiPage, UiSection } from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create landing page scaffold
 */
export function createLandingScaffold(params?: {
  title?: string;
  includeHero?: boolean;
  includeFeatures?: boolean;
  includePricing?: boolean;
  includeTestimonials?: boolean;
  includeFAQ?: boolean;
  includeCTA?: boolean;
}): UiPage {
  const {
    title = "Welcome",
    includeHero = true,
    includeFeatures = true,
    includePricing = true,
    includeTestimonials = true,
    includeFAQ = true,
    includeCTA = true,
  } = params || {};

  const pageId = randomUUID();
  const sections: UiSection[] = [];

  // Hero section
  if (includeHero) {
    const heroSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "hero",
      variant: "hero",
      sectionData: {
        kind: "hero",
        title: "Welcome to Our Platform",
        description: "Build amazing experiences with our powerful tools",
        cta: {
          primary: {
            label: "Get Started",
            action: "/signup",
          },
          secondary: {
            label: "Learn More",
            action: "/about",
          },
        },
        background: "gradient",
      },
      children: [],
    };
    sections.push(heroSection);
  }

  // Features section
  if (includeFeatures) {
    const featuresSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "featureGrid",
      title: "Features",
      variant: "card",
      sectionData: {
        kind: "featureGrid",
        title: "Why Choose Us",
        features: [
          {
            title: "Fast & Reliable",
            description: "Lightning-fast performance with 99.9% uptime",
          },
          {
            title: "Secure",
            description: "Enterprise-grade security for your data",
          },
          {
            title: "Scalable",
            description: "Grows with your business needs",
          },
        ],
        columns: 3,
      },
      children: [],
    };
    sections.push(featuresSection);
  }

  // Pricing section
  if (includePricing) {
    const pricingSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "pricing",
      title: "Pricing",
      variant: "card",
      sectionData: {
        kind: "pricing",
        title: "Simple, Transparent Pricing",
        description: "Choose the plan that's right for you",
        tiers: [
          {
            name: "Starter",
            price: "$9",
            period: "month",
            features: ["Feature 1", "Feature 2", "Feature 3"],
            cta: {
              label: "Get Started",
              action: "/signup?plan=starter",
            },
          },
          {
            name: "Professional",
            price: "$29",
            period: "month",
            features: ["All Starter features", "Feature 4", "Feature 5", "Priority Support"],
            cta: {
              label: "Get Started",
              action: "/signup?plan=professional",
            },
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            features: ["All Professional features", "Custom integrations", "Dedicated support"],
            cta: {
              label: "Contact Sales",
              action: "/contact",
            },
          },
        ],
        layout: "grid",
      },
      children: [],
    };
    sections.push(pricingSection);
  }

  // Testimonials section
  if (includeTestimonials) {
    const testimonialsSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "testimonials",
      title: "Testimonials",
      variant: "card",
      sectionData: {
        kind: "testimonials",
        title: "What Our Customers Say",
        items: [
          {
            quote: "This platform has transformed our workflow",
            author: "John Doe",
            role: "CEO, Company Inc.",
          },
          {
            quote: "Best investment we've made this year",
            author: "Jane Smith",
            role: "CTO, Tech Corp",
          },
        ],
        layout: "grid",
      },
      children: [],
    };
    sections.push(testimonialsSection);
  }

  // FAQ section
  if (includeFAQ) {
    const faqSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "faq",
      title: "Frequently Asked Questions",
      variant: "card",
      sectionData: {
        kind: "faq",
        title: "Frequently Asked Questions",
        items: [
          {
            question: "How does it work?",
            answer: "Our platform provides a simple, intuitive interface for managing your workflow.",
          },
          {
            question: "What are the pricing options?",
            answer: "We offer flexible pricing plans to suit businesses of all sizes.",
          },
          {
            question: "Is there a free trial?",
            answer: "Yes, we offer a 14-day free trial with full access to all features.",
          },
        ],
      },
      children: [],
    };
    sections.push(faqSection);
  }

  // CTA section
  if (includeCTA) {
    const ctaSection: UiSection = {
      type: "section",
      id: randomUUID(),
      kind: "cta",
      variant: "banner",
      sectionData: {
        kind: "cta",
        title: "Ready to Get Started?",
        description: "Join thousands of satisfied customers today",
        cta: {
          label: "Start Free Trial",
          action: "/signup",
        },
        variant: "primary",
      },
      children: [],
    };
    sections.push(ctaSection);
  }

  return {
    type: "page",
    id: pageId,
    title,
    children: sections,
    layout: {
      maxWidth: "xl",
      gap: 8,
    },
    metadata: {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      source: "landing-scaffold",
    },
  };
}

