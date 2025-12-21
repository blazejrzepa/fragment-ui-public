/**
 * Scaffold registry
 * 
 * Central registry for all available scaffolds
 */

import type { UiPage } from "../../../app/studio/dsl/types";
import { createDashboardScaffold } from "./dashboard";
import { createLandingScaffold } from "./landing";
import { createSettingsScaffold } from "./settings";
import { createLoginScaffold, createSignupScaffold } from "./auth";

export type ScaffoldType = "dashboard" | "landing" | "settings" | "login" | "signup";

export interface ScaffoldConfig {
  type: ScaffoldType;
  name: string;
  description: string;
  create: (params?: any) => UiPage | any; // Allow both UiPage types
}

/**
 * Scaffold registry
 */
export const SCAFFOLD_REGISTRY: Record<ScaffoldType, ScaffoldConfig> = {
  dashboard: {
    type: "dashboard",
    name: "Dashboard",
    description: "Dashboard layout with sidebar, header, metrics, and data table",
    create: createDashboardScaffold,
  },
  landing: {
    type: "landing",
    name: "Landing Page",
    description: "Landing page with hero, features, pricing, testimonials, FAQ, and CTA",
    create: createLandingScaffold,
  },
  settings: {
    type: "settings",
    name: "Settings Page",
    description: "Settings page with profile, preferences, security, and notifications sections",
    create: createSettingsScaffold,
  },
  login: {
    type: "login",
    name: "Login Page",
    description: "Login page with email/password and optional social login",
    create: createLoginScaffold,
  },
  signup: {
    type: "signup",
    name: "Sign Up Page",
    description: "Sign up page with registration form and optional social signup",
    create: createSignupScaffold,
  },
};

/**
 * Get scaffold by type
 */
export function getScaffold(type: ScaffoldType): ScaffoldConfig | undefined {
  return SCAFFOLD_REGISTRY[type];
}

/**
 * List all available scaffolds
 */
export function listScaffolds(): ScaffoldConfig[] {
  return Object.values(SCAFFOLD_REGISTRY);
}

/**
 * Create scaffold by type
 */
export function createScaffold(type: ScaffoldType, params?: any): UiPage {
  const scaffold = getScaffold(type);
  if (!scaffold) {
    throw new Error(`Unknown scaffold type: ${type}`);
  }
  return scaffold.create(params);
}

